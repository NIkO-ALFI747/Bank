<?php

function resultTable (string $query, $db_connect) {
    $result = $db_connect->query($query);
    $num_results = $result->rowCount();

    for ($i = 0; $i < $result->columnCount(); $i++) {
        $col = $result->getColumnMeta($i);
        $columns[] = $col['name'];
        $result_arr[0][$i] = $columns[$i];
    }

    $result_arr2 = $result->FetchAll(PDO::FETCH_NUM);

    $g=1;
    for ($i=0; $i <$num_results; $i++) {
        for ($j=0; $j <$result->columnCount(); $j++) {
            $result_arr[$g][$j] = $result_arr2[$i][$j];
        }
        $g++;
    }

    return json_encode($result_arr);
}

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
function str_to_num($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    if(empty($data)){
        $data=0;
    }
    return $data;
}
$cashback_percentage_from = str_to_num($_POST['cashback_percentage_from']);
$cashback_percentage_to = str_to_num($_POST['cashback_percentage_to']);
$maintenance_cost_from = str_to_num($_POST['maintenance_cost_from']);
$maintenance_cost_to = str_to_num($_POST['maintenance_cost_to']);
$category_var = test_input($_POST['category_var']);
$sort_column = test_input($_POST['sort_column']);
$sort_type = test_input($_POST['sort_type']);

if(empty($category_var)){
    $category_var='ALL';
}
if(empty($sort_column)){
    $sort_column='Maintenance_cost';
}
if(empty($sort_type)){
    $sort_type='ASC';
}

require_once '../../vendor/db_connect.php';

$query = "
SELECT * FROM filtering_credit_card_all($cashback_percentage_from,$cashback_percentage_to,$maintenance_cost_from,$maintenance_cost_to,'$category_var','$sort_column','$sort_type')";

echo resultTable($query, $db_connect);