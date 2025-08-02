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

$flag = test_input($_POST['flag']);
$selected_currency_price = test_input($_POST['selected_currency_price']);
$selected_currency_type = test_input($_POST['selected_currency_type']);
$calc_currency_price = test_input($_POST['calc_currency_price']);
$calc_currency_type = test_input($_POST['calc_currency_type']);

require_once '../../vendor/db_connect.php';
if($flag==1){
    $query = "
    SELECT * FROM \"currency_converter\"($selected_currency_price,'$selected_currency_type','$calc_currency_type')";
} else {
    $query = "
    SELECT * FROM \"currency_converter\"($calc_currency_price,'$calc_currency_type','$selected_currency_type')";
}

echo resultNumber($query, $db_connect);
