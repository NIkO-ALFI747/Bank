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

// A generic function to handle updates that might trigger a failing INSERT
function safeUpdateWithRetry($db_connect, $update_query, $params, $sequence_table, $sequence_pk)
{
    $max_retries = 3;
    $retries = 0;
    while ($retries < $max_retries) {
        try {
            $db_connect->beginTransaction();
            $stmt = $db_connect->prepare($update_query);
            $stmt->execute($params);
            $db_connect->commit();
            return true;
        } catch (PDOException $e) {
            $db_connect->rollBack();
            // Check for the unique violation error code from the trigger
            if ($e->getCode() == '23505') {
                // Fix the sequence and retry the operation
                $reset_query = "SELECT setval(pg_get_serial_sequence('\"$sequence_table\"', '$sequence_pk'), (SELECT MAX(\"$sequence_pk\") FROM \"$sequence_table\"));";
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

if (!@$_SESSION['admin'] && !@$_SESSION['employee']) {
    header('Location: ../login/index.php');
    exit;
}

require_once '../../vendor/db_connect.php';

$name = test_input($_POST['name']);
$Exchange_rate_new = test_input($_POST['Exchange_rate_new']);

$update_query = "UPDATE \"Currency\" SET \"Exchange_rate\" = :Exchange_rate_new WHERE \"Abbreviation\" = :name";
$params = [
    ':Exchange_rate_new' => $Exchange_rate_new,
    ':name' => $name
];

if (safeUpdateWithRetry($db_connect, $update_query, $params, 'dynamics_of_the_dollar', 'ID')) {
    // If the update succeeded, fetch and display the new rate
    $select_query = "SELECT \"Exchange_rate\" FROM \"Currency\" WHERE \"Abbreviation\" = :name";
    $stmt = $db_connect->prepare($select_query);
    $stmt->execute([':name' => $name]);
    $new_rate = $stmt->fetchColumn();

    if ($new_rate !== false) {
        echo $new_rate;
    } else {
        echo 'The exchange rate was updated, but we could not fetch the new value.';
    }
} else {
    // If the update failed after all retries
    echo 'A critical database error occurred, and the exchange rate could not be updated after several attempts.';
}
