<?php

/**
 * Executes a query and returns a single numeric result, or 0 if no result is found.
 * This prevents the "Undefined array key" error when a query returns no rows.
 *
 * @param string $query The SQL query string.
 * @param PDO $db_connect The PDO database connection object.
 * @return int The numeric result from the query, or 0 if no result is found.
 */
function resultNumber (string $query, $db_connect) {
    $result = $db_connect->query($query);
    $result_arr = $result->FetchAll(PDO::FETCH_NUM);
    
    // Check if the result array is not empty before trying to access it.
    if (!empty($result_arr)) {
        return $result_arr[0][0];
    } else {
        return 0;
    }
}


$deleteid = $_POST['deleteid'];

require_once '../../vendor/db_connect.php';


// Safely retrieve associated IDs, handling cases where they might not exist.
$individual="
SELECT \"ID_individual\" FROM \"Individual\"
JOIN \"Administrator\" USING (\"ID_individual\") WHERE \"ID_administrator\"=$deleteid";
$individual = resultNumber($individual, $db_connect);

$account="
SELECT \"ID_account\" FROM \"Account\"
JOIN \"Administrator\" USING (\"ID_account\") WHERE \"ID_administrator\"=$deleteid";
$account = resultNumber($account, $db_connect);

$address="
SELECT \"ID_address\" FROM \"Address\" JOIN \"Individual\" USING (\"ID_address\")
JOIN \"Administrator\" USING (\"ID_individual\") WHERE \"ID_administrator\"=$deleteid";
$address = resultNumber($address, $db_connect);


// --- Deletion Cascade (start with the top-level record, then its dependencies) ---
$query="
DELETE FROM \"Administrator\" WHERE \"ID_administrator\"=$deleteid";
$db_connect->query($query);

// Conditionally delete records based on the IDs retrieved earlier
if ($account != 0) {
    $query="
    DELETE FROM \"Account\" WHERE \"ID_account\"=$account";
    $db_connect->query($query);
}

if ($individual != 0) {
    $query="
    DELETE FROM \"Individual\" WHERE \"ID_individual\"=$individual";
    $db_connect->query($query);
}

if ($address != 0) {
    $query="
    DELETE FROM \"Address\" WHERE \"ID_address\"=$address";
    $db_connect->query($query);
}


echo "Запись с кодом администратора $deleteid успешно удалена";
