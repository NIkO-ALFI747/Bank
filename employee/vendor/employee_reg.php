<?php

function resultNumber (string $query, $db_connect) {
    $result = $db_connect->query($query);
    $result_arr = $result->FetchAll(PDO::FETCH_NUM);
    return $result_arr[0][0];
}

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

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

require_once '../../vendor/db_connect.php';

if (empty($login)) {
    echo 'Поле "Логин" не должно быть пустым';
} else if (empty($password)) {
    echo 'Поле "Пароль" не должно быть пустым';
} else {
    $query='SELECT COUNT("ID_individual") FROM "Individual" WHERE' ."'$date_of_birth'". '<' ."'$date_of_issue'";
    $result = resultNumber($query, $db_connect);
    if(!$result){
        echo 'Дата рождения должна быть меньше даты выдачи паспорта';
    } else {

        $address = "INSERT INTO public.\"Address\" VALUES (DEFAULT, "  ."'$country'". ", "  ."'$city'". ", "  ."'$street'". ", "  ."'$house'". ", "  ."'$flat'".  ") RETURNING \"ID_address\"";
        $address = resultNumber($address, $db_connect);
        
        $individual = "INSERT INTO public.\"Individual\" VALUES (DEFAULT, "  .$address. ", "  ."'$name'". ", "  ."'$surname'". ", "  ."'$patronymic'". ", "  ."'$date_of_birth'". ", "  ."'$gender'". ", "  ."'$phone_number'". ", "  ."'$email'". ", "  ."'$passport_series'". ", "  ."'$passport_number'". ", "  ."'$date_of_issue'".  ") RETURNING \"ID_individual\"";
        $individual = resultNumber($individual, $db_connect);
        
        $account = 'INSERT INTO public."Account" VALUES (DEFAULT, '  ."'$login'". ', '  ."'$password_ch'". ') RETURNING "ID_account"';
        $account = resultNumber($account, $db_connect);

        $employee = 'INSERT INTO public."Employee" VALUES (DEFAULT, ' ."'$employee_type'". ', ' .$account. ', '  .$individual. ', ' .$ID_office. ') RETURNING "ID_employee"';
        $employee = resultNumber($employee, $db_connect);
        
        echo 'Добавление прошло успешно';
    }
}
