<?php

function resultTable (string $query, $db_connect) {
    $result = $db_connect->query($query);
    $num_results = $result->rowCount();

    $result_arr2 = $result->FetchAll(PDO::FETCH_NUM);

    $g=0;
    for ($i=0; $i <$num_results; $i++) {
        for ($j=0; $j <$result->columnCount(); $j++) {
            $result_arr[$g][$j] = $result_arr2[$i][$j];
        }
        $g++;
    }

    return json_encode($result_arr);
}

require_once '../../vendor/db_connect.php';

$query = 'SELECT * FROM select_currencies';
echo resultTable($query, $db_connect);