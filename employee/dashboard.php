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

  function resultNumber (string $query, $db_connect) {
    $result = $db_connect->query($query);
    $result_arr = $result->FetchAll(PDO::FETCH_NUM);
    return $result_arr[0][0];
  }


  session_start();
  if (!@$_SESSION['emloyee']) {
    header('Location: ../login/index.php');
  }

  require_once '../vendor/db_connect.php';


  $query = 'SELECT * FROM all_customer_accounts';
  $_SESSION['all_customer_accounts'] = resultTable($query, $db_connect);

  $query = 'SELECT COUNT("ID_customer") FROM "Customer"';
  $_SESSION['count_customers'] = resultNumber($query, $db_connect);

  $query = 'SELECT COUNT("ID_employee") FROM "Employee"';
  $_SESSION['count_employees'] = resultNumber($query, $db_connect);

  $query = 'SELECT COUNT("ID_administrator") FROM "Administrator"';
  $_SESSION['count_administrators'] = resultNumber($query, $db_connect);

  $query = 'SELECT COUNT("ID_office") FROM "Office"';
  $_SESSION['count_offices'] = resultNumber($query, $db_connect);
  
  
  header('Location: index.php');
?>