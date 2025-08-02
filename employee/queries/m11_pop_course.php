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

require_once '../../vendor/db_connect.php';

$query = 'SELECT * FROM popular_currencies';
echo resultTable($query, $db_connect);