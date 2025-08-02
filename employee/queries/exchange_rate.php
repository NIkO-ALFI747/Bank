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

$name = test_input($_POST['name']);

require_once '../../vendor/db_connect.php';

    $query = "
    SELECT \"Exchange_rate\" FROM \"Currency\" WHERE \"Abbreviation\"='$name'";

echo resultNumber($query, $db_connect);