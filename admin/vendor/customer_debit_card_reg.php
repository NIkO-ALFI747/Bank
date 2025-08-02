<?php

// A helper function to safely get a single numeric result from a query.
function resultNumber(string $query, $db_connect)
{
    $result = $db_connect->query($query);
    $result_arr = $result->FetchAll(PDO::FETCH_NUM);
    if (!empty($result_arr)) {
        return $result_arr[0][0];
    } else {
        return 0;
    }
}

// A helper function for sanitizing input data.
function test_input($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// A generic function to handle insertions with self-healing sequence reset
function insertWithRetry($query, $db_connect, $table_name, $pk_column)
{
    $max_retries = 8;
    $retries = 0;
    while ($retries < $max_retries) {
        try {
            $db_connect->beginTransaction();
            $result = resultNumber($query, $db_connect);
            $db_connect->commit();
            return $result;
        } catch (PDOException $e) {
            $db_connect->rollBack();
            if ($e->getCode() == '23505') {
                $reset_query = "SELECT setval(pg_get_serial_sequence('\"$table_name\"', '$pk_column'), (SELECT MAX(\"$pk_column\") FROM \"$table_name\"));";
                $db_connect->query($reset_query);
                $retries++;
            } else {
                throw $e;
            }
        }
    }
    return false;
}

$Number = test_input($_POST['Number']);
$CVV = test_input($_POST['CVV']);
$PIN = test_input($_POST['PIN']);
$Account_number_rub = test_input($_POST['Account_number_rub']);
$Account_number_usd = test_input($_POST['Account_number_usd']);
$Account_number_eur = test_input($_POST['Account_number_eur']);
$raw_ID_customer = test_input($_POST['ID_customer']);
$ID_debit_card = test_input($_POST['ID_debit_card']);

require_once '../../vendor/db_connect.php';

// Corrected logic: Extract the numeric ID from the input string.
// This handles cases where the full success message is passed instead of just the number.
if (preg_match('/(\d+)/', $raw_ID_customer, $matches)) {
    $ID_customer = (int) $matches[1];
} else {
    // If no number is found, assume the input is already a number
    $ID_customer = (int) $raw_ID_customer;
}

// Fetch currency IDs first as they are needed for multiple insertions.
$ID_currency_rub = resultNumber("SELECT \"ID_currency\" FROM \"Currency\" WHERE \"Abbreviation\"='RUB'", $db_connect);
$ID_currency_usd = resultNumber("SELECT \"ID_currency\" FROM \"Currency\" WHERE \"Abbreviation\"='USD'", $db_connect);
$ID_currency_eur = resultNumber("SELECT \"ID_currency\" FROM \"Currency\" WHERE \"Abbreviation\"='EUR'", $db_connect);

// Customer Debit Card Insertion
$Customer_debit_card_query = "INSERT INTO public.\"Customer_debit_card\" VALUES (DEFAULT, '$Number', NOW()::date, '$CVV', '$PIN', $ID_customer, $ID_debit_card) RETURNING \"ID_customer_debit_card\"";
$Customer_debit_card = insertWithRetry($Customer_debit_card_query, $db_connect, 'Customer_debit_card', 'ID_customer_debit_card');

if ($Customer_debit_card !== false) {
    // Customer Account RUB Insertion
    $Customer_account_rub_query = "INSERT INTO public.\"Customer_account\" VALUES (DEFAULT, '$Account_number_rub', 0, $ID_customer, $ID_currency_rub) RETURNING \"ID_customer_account\"";
    $Customer_account_rub = insertWithRetry($Customer_account_rub_query, $db_connect, 'Customer_account', 'ID_customer_account');

    if ($Customer_account_rub !== false) {
        // Customer Account USD Insertion
        $Customer_account_usd_query = "INSERT INTO public.\"Customer_account\" VALUES (DEFAULT, '$Account_number_usd', 0, $ID_customer, $ID_currency_usd) RETURNING \"ID_customer_account\"";
        $Customer_account_usd = insertWithRetry($Customer_account_usd_query, $db_connect, 'Customer_account', 'ID_customer_account');

        if ($Customer_account_usd !== false) {
            // Customer Account EUR Insertion
            $Customer_account_eur_query = "INSERT INTO public.\"Customer_account\" VALUES (DEFAULT, '$Account_number_eur', 0, $ID_customer, $ID_currency_eur) RETURNING \"ID_customer_account\"";
            $Customer_account_eur = insertWithRetry($Customer_account_eur_query, $db_connect, 'Customer_account', 'ID_customer_account');

            if ($Customer_account_eur !== false) {
                // Debit Card Account RUB Insertion
                $Debit_card_account_rub_query = "INSERT INTO public.\"Debit_card_account\" VALUES (DEFAULT, $Customer_account_rub, $Customer_debit_card) RETURNING \"ID_debit_card_account\"";
                $Debit_card_account_rub = insertWithRetry($Debit_card_account_rub_query, $db_connect, 'Debit_card_account', 'ID_debit_card_account');

                // Debit Card Account USD Insertion
                $Debit_card_account_usd_query = "INSERT INTO public.\"Debit_card_account\" VALUES (DEFAULT, $Customer_account_usd, $Customer_debit_card) RETURNING \"ID_debit_card_account\"";
                $Debit_card_account_usd = insertWithRetry($Debit_card_account_usd_query, $db_connect, 'Debit_card_account', 'ID_debit_card_account');

                // Debit Card Account EUR Insertion
                $Debit_card_account_eur_query = "INSERT INTO public.\"Debit_card_account\" VALUES (DEFAULT, $Customer_account_eur, $Customer_debit_card) RETURNING \"ID_debit_card_account\"";
                $Debit_card_account_eur = insertWithRetry($Debit_card_account_eur_query, $db_connect, 'Debit_card_account', 'ID_debit_card_account');

                if ($Debit_card_account_rub !== false && $Debit_card_account_usd !== false && $Debit_card_account_eur !== false) {
                    echo 'Дебетовая карта успешно оформлена. Клиент успешно зарегистрирован';
                } else {
                    echo 'A critical database error occurred, could not link debit card to account after several attempts.';
                }
            } else {
                echo 'A critical database error occurred, could not create EUR account after several attempts.';
            }
        } else {
            echo 'A critical database error occurred, could not create USD account after several attempts.';
        }
    } else {
        echo 'A critical database error occurred, could not create RUB account after several attempts.';
    }
} else {
    echo 'A critical database error occurred, could not create the debit card after several attempts.';
}
