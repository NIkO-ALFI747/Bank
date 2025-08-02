<?php

// A helper function to safely get a single numeric result from a query.
function resultNumber (string $query, $db_connect) {
    $result = $db_connect->query($query);
    $result_arr = $result->FetchAll(PDO::FETCH_NUM);
    if (!empty($result_arr)) {
        return $result_arr[0][0];
    } else {
        return 0;
    }
}

// A helper function for sanitizing input data.
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// A generic function to handle insertions with self-healing sequence reset
function insertWithRetry($query, $db_connect, $table_name, $pk_column) {
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

$name = test_input($_POST['name']);
$surname = test_input($_POST['surname']);
$patronymic = test_input($_POST['patronymic']);
$gender = test_input($_POST['gender']);
$date_of_birth = test_input($_POST['date_of_birth']);
$passport_series = test_input($_POST['passport_series']);
$passport_number = test_input($_POST['passport_number']);
$date_of_issue = test_input($_POST['date_of_issue']);
$phone_number = test_input($_POST['phone_number']);
$email = test_input($_POST['email']);
$country = test_input($_POST['country']);
$city = test_input($_POST['city']);
$street = test_input($_POST['street']);
$house = test_input($_POST['house']);
$flat = test_input($_POST['flat']);
$work_experience = test_input($_POST['work_experience']);
$income = test_input($_POST['income']);
$abbreviation_currency = test_input($_POST['abbreviation_currency']);
$login = test_input($_POST['login']);
$password_ch = test_input($_POST['password']);

require_once '../../vendor/db_connect.php';

if (empty($login) || empty($password_ch)) {
    echo 'Login and Password fields must not be empty.';
} else {
    $query = "SELECT 1 FROM \"Individual\" WHERE '$date_of_birth' < '$date_of_issue' LIMIT 1";
    $result = resultNumber($query, $db_connect);
    if (!$result) {
        echo 'Date of birth must be before date of issue.';
    } else {
        $currency_query = "SELECT \"ID_currency\" FROM \"Currency\" WHERE \"Abbreviation\"='$abbreviation_currency'";
        $currency = resultNumber($currency_query, $db_connect);
        if ($currency === 0) {
            echo 'Invalid currency abbreviation.';
        } else {
            // Address Insertion
            $address_query = "INSERT INTO public.\"Address\" VALUES (DEFAULT, '$country', '$city', '$street', '$house', '$flat') RETURNING \"ID_address\"";
            $address = insertWithRetry($address_query, $db_connect, 'Address', 'ID_address');

            if ($address !== false) {
                // Individual Insertion
                $individual_query = "INSERT INTO public.\"Individual\" VALUES (DEFAULT, $address, '$name', '$surname', '$patronymic', '$date_of_birth', '$gender', '$phone_number', '$email', '$passport_series', '$passport_number', '$date_of_issue') RETURNING \"ID_individual\"";
                $individual = insertWithRetry($individual_query, $db_connect, 'Individual', 'ID_individual');

                if ($individual !== false) {
                    // Account Insertion
                    $account_query = "INSERT INTO public.\"Account\" VALUES (DEFAULT, '$login', '$password_ch') RETURNING \"ID_account\"";
                    $account = insertWithRetry($account_query, $db_connect, 'Account', 'ID_account');

                    if ($account !== false) {
                        // Career Insertion
                        $career_query = "INSERT INTO public.\"Career\" VALUES (DEFAULT, $income, $work_experience, $currency) RETURNING \"ID_career\"";
                        $career = insertWithRetry($career_query, $db_connect, 'Career', 'ID_career');

                        if ($career !== false) {
                            // Customer Insertion
                            $customer_query = "INSERT INTO public.\"Customer\" VALUES (DEFAULT, $account, $individual, $career) RETURNING \"ID_customer\"";
                            $customer = insertWithRetry($customer_query, $db_connect, 'Customer', 'ID_customer');

                            if ($customer !== false) {
                                echo 'Client successfully registered with ID: ' . $customer;
                            } else {
                                echo 'A critical database error occurred, failed to register the customer after several attempts.';
                            }
                        } else {
                            echo 'A critical database error occurred, failed to register the career after several attempts.';
                        }
                    } else {
                        echo 'A critical database error occurred, failed to register the account after several attempts.';
                    }
                } else {
                    echo 'A critical database error occurred, failed to register the individual after several attempts.';
                }
            } else {
                echo 'A critical database error occurred, failed to register the address after several attempts.';
            }
        }
    }
}
