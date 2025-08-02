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
    $max_retries = 7;
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
$ID_credit_card = test_input($_POST['ID_credit_card']);
$Purpose_of_opening = test_input($_POST['Purpose_of_opening']);
$Credit_limit_rub = test_input($_POST['Credit_limit_rub']);
$Credit_limit_usd = test_input($_POST['Credit_limit_usd']);
$Credit_limit_eur = test_input($_POST['Credit_limit_eur']);

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

// Customer Credit Card Insertion
$Customer_credit_card_query = "INSERT INTO public.\"Customer_credit_card\" VALUES (DEFAULT, '$Number', NOW()::date, '$Purpose_of_opening', '$CVV', '$PIN', $ID_customer, $ID_credit_card) RETURNING \"ID_customer_credit_card\"";
$Customer_credit_card = insertWithRetry($Customer_credit_card_query, $db_connect, 'Customer_credit_card', 'ID_customer_credit_card');

if ($Customer_credit_card !== false) {
    // Customer Account RUB Insertion
    $Customer_account_rub_query = "INSERT INTO public.\"Customer_account\" VALUES (DEFAULT, '$Account_number_rub', $Credit_limit_rub, $ID_customer, $ID_currency_rub) RETURNING \"ID_customer_account\"";
    $Customer_account_rub = insertWithRetry($Customer_account_rub_query, $db_connect, 'Customer_account', 'ID_customer_account');

    if ($Customer_account_rub !== false) {
        // Customer Account USD Insertion
        $Customer_account_usd_query = "INSERT INTO public.\"Customer_account\" VALUES (DEFAULT, '$Account_number_usd', $Credit_limit_usd, $ID_customer, $ID_currency_usd) RETURNING \"ID_customer_account\"";
        $Customer_account_usd = insertWithRetry($Customer_account_usd_query, $db_connect, 'Customer_account', 'ID_customer_account');

        if ($Customer_account_usd !== false) {
            // Customer Account EUR Insertion
            $Customer_account_eur_query = "INSERT INTO public.\"Customer_account\" VALUES (DEFAULT, '$Account_number_eur', $Credit_limit_eur, $ID_customer, $ID_currency_eur) RETURNING \"ID_customer_account\"";
            $Customer_account_eur = insertWithRetry($Customer_account_eur_query, $db_connect, 'Customer_account', 'ID_customer_account');

            if ($Customer_account_eur !== false) {
                // Credit Card Account RUB Insertion
                $Credit_card_account_rub_query = "INSERT INTO public.\"Credit_card_account\" VALUES (DEFAULT, $Customer_account_rub, $Customer_credit_card, $Credit_limit_rub) RETURNING \"ID_credit_card_account\"";
                $Credit_card_account_rub = insertWithRetry($Credit_card_account_rub_query, $db_connect, 'Credit_card_account', 'ID_credit_card_account');

                // Credit Card Account USD Insertion
                $Credit_card_account_usd_query = "INSERT INTO public.\"Credit_card_account\" VALUES (DEFAULT, $Customer_account_usd, $Customer_credit_card, $Credit_limit_usd) RETURNING \"ID_credit_card_account\"";
                $Credit_card_account_usd = insertWithRetry($Credit_card_account_usd_query, $db_connect, 'Credit_card_account', 'ID_credit_card_account');

                // Credit Card Account EUR Insertion
                $Credit_card_account_eur_query = "INSERT INTO public.\"Credit_card_account\" VALUES (DEFAULT, $Customer_account_eur, $Customer_credit_card, $Credit_limit_eur) RETURNING \"ID_credit_card_account\"";
                $Credit_card_account_eur = insertWithRetry($Credit_card_account_eur_query, $db_connect, 'Credit_card_account', 'ID_credit_card_account');

                if ($Credit_card_account_rub !== false && $Credit_card_account_usd !== false && $Credit_card_account_eur !== false) {
                    echo 'Кредитная карта успешно оформлена';
                } else {
                    echo 'A critical database error occurred, could not link credit card to account after several attempts.';
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
    echo 'A critical database error occurred, could not create the credit card after several attempts.';
}
