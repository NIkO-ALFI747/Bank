<?php

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

$selected_currency_price = test_input($_POST['selected_currency_price']);
$selected_currency_type = test_input($_POST['selected_currency_type']);
$calc_currency_type = test_input($_POST['calc_currency_type']);

$Number = test_input($_POST['Number']);
$Closing_date = test_input($_POST['Closing_date']);
$Name = test_input($_POST['Name']);
$CVV = test_input($_POST['CVV']);

require_once '../../vendor/db_connect.php';

$query = "
SELECT * FROM \"f-currency_exchange_by_card\"
($selected_currency_price,'$selected_currency_type','$calc_currency_type', '$Number', '$Closing_date', '$CVV', '$Name')";
$result = $db_connect->query($query);

echo 'Обмен завершен успешно';