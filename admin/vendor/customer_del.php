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
JOIN \"Customer\" USING (\"ID_individual\") WHERE \"ID_customer\"=$deleteid";
$individual = resultNumber($individual, $db_connect);

$account="
SELECT \"ID_account\" FROM \"Account\"
JOIN \"Customer\" USING (\"ID_account\") WHERE \"ID_customer\"=$deleteid";
$account = resultNumber($account, $db_connect);

$address="
SELECT \"ID_address\" FROM \"Address\" JOIN \"Individual\" USING (\"ID_address\")
JOIN \"Customer\" USING (\"ID_individual\") WHERE \"ID_customer\"=$deleteid";
$address = resultNumber($address, $db_connect);

$career="
SELECT \"ID_career\" FROM \"Career\" 
JOIN \"Customer\" USING (\"ID_career\") WHERE \"ID_customer\"=$deleteid";
$career = resultNumber($career, $db_connect);


// --- Deletion Cascade (start with the most nested tables) ---

$query="
DELETE FROM \"Currency_exchange_by_card\"
USING \"Debit_card_account\", \"Customer_account\"
WHERE \"ID_customer\"=$deleteid
AND \"Debit_card_account\".\"ID_debit_card_account\"=\"Currency_exchange_by_card\".\"ID_debit_card_account\"
AND \"Customer_account\".\"ID_customer_account\" = \"Debit_card_account\".\"ID_customer_account\"
";
$db_connect->query($query);

$query="
DELETE FROM \"Currency_exchange\" 
USING \"Debit_card_account\", \"Customer_account\", \"Currency_exchange_by_card\"
WHERE \"ID_customer\"=$deleteid
AND \"Currency_exchange_by_card\".\"ID_currency_exchange\"=\"Currency_exchange\".\"ID_currency_exchange\"
AND \"Debit_card_account\".\"ID_debit_card_account\"=\"Currency_exchange_by_card\".\"ID_debit_card_account\"
AND \"Customer_account\".\"ID_customer_account\" = \"Debit_card_account\".\"ID_customer_account\"
";
$db_connect->query($query);

$query="
DELETE FROM \"Debit_card_account\"
USING \"Customer_account\"
WHERE \"ID_customer\"=$deleteid
AND \"Customer_account\".\"ID_customer_account\" = \"Debit_card_account\".\"ID_customer_account\"
";
$db_connect->query($query);

$query="
DELETE FROM \"Credit_card_account\"
USING \"Customer_account\"
WHERE \"ID_customer\"=$deleteid
AND \"Customer_account\".\"ID_customer_account\" = \"Credit_card_account\".\"ID_customer_account\"
";
$db_connect->query($query);

$query="
DELETE FROM \"Customer_debit_card\" WHERE \"ID_customer\"=$deleteid";
$db_connect->query($query);

$query="
DELETE FROM \"Customer_credit_card\" WHERE \"ID_customer\"=$deleteid";
$db_connect->query($query);

$query="
DELETE FROM \"Customer_account\" WHERE \"ID_customer\"=$deleteid";
$db_connect->query($query);

// --- Deletion of Customer and associated core data (now that all foreign key dependencies are removed) ---

$query="
DELETE FROM \"Customer\" WHERE \"ID_customer\"=$deleteid";
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

if ($career != 0){
    $query="
    DELETE FROM \"Career\" WHERE \"ID_career\"=$career";
    $db_connect->query($query);
}

echo "Запись с кодом клиента $deleteid успешно удалена";
