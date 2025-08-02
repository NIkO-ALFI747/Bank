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

session_start();
if (!@$_SESSION['admin']) {
    header('Location: ../login/index.php');
    exit;
}

require_once '../../vendor/db_connect.php';

$employee_type = test_input($_POST['employee_type']);
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
$ID_office = test_input($_POST['ID_office']);
$login = test_input($_POST['login']);
$password_ch = test_input($_POST['password']);

if (empty($login) || empty($password_ch)) {
    echo 'Поле "Логин" и "Пароль" не должны быть пустыми';
} else {
    $query = "SELECT COUNT(\"ID_individual\") FROM \"Individual\" WHERE '$date_of_birth' < '$date_of_issue'";
    $result = resultNumber($query, $db_connect);
    if (!$result) {
        echo 'Дата рождения должна быть меньше даты выдачи паспорта';
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
                    // Employee Insertion
                    $employee_query = "INSERT INTO public.\"Employee\" VALUES (DEFAULT, '$employee_type', $account, $individual, $ID_office) RETURNING \"ID_employee\"";
                    $employee = insertWithRetry($employee_query, $db_connect, 'Employee', 'ID_employee');

                    if ($employee !== false) {
                        echo 'Добавление прошло успешно';
                    } else {
                        echo 'A critical database error occurred, failed to register the employee after several attempts.';
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
