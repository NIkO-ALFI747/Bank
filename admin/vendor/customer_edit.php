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

$editid = $_POST['editid'];
$name = test_input($_POST['name']);
$surname = test_input($_POST['surname']);
$patronymic = test_input($_POST['patronymic']);
$gender = test_input($_POST['gender']);
$date_of_birth = test_input($_POST['date_of_birth']);
$passport_series = test_input($_POST['passport_series']);
$passport_number = test_input($_POST['passport_number']);
$date_of_issue = test_input($_POST['date_of_issue']);
$phone_number = test_input($_POST['phone_number']);
$email = test_input($_POST['email']);
$country = test_input($_POST['country']);
$city = test_input($_POST['city']);
$street = test_input($_POST['street']);
$house = test_input($_POST['house']);
$flat = test_input($_POST['flat']);
$work_experience = test_input($_POST['work_experience']);
$income = test_input($_POST['income']);
$abbreviation_currency = test_input($_POST['abbreviation_currency']);
$login = test_input($_POST['login']);
$password_ch = test_input($_POST['password']);

require_once '../../vendor/db_connect.php';

$result=1;
if (!empty($date_of_birth) && !empty($date_of_issue)){
    $query='SELECT COUNT("ID_individual") FROM "Individual" WHERE' ."'$date_of_birth'". '<' ."'$date_of_issue'";
    $result = resultNumber($query, $db_connect);
}
if(!$result){
    echo 0;
} else {
    $individual="
    SELECT \"ID_individual\" FROM \"Individual\"
    JOIN \"Customer\" USING (\"ID_individual\") WHERE \"ID_customer\"=$editid";
    $individual = resultNumber($individual, $db_connect);
    
    $account="
    SELECT \"ID_account\" FROM \"Account\"
    JOIN \"Customer\" USING (\"ID_account\") WHERE \"ID_customer\"=$editid";
    $account = resultNumber($account, $db_connect);
    
    $address="
    SELECT \"ID_address\" FROM \"Address\" JOIN \"Individual\" USING (\"ID_address\")
    JOIN \"Customer\" USING (\"ID_individual\") WHERE \"ID_customer\"=$editid";
    $address = resultNumber($address, $db_connect);

    $career="
    SELECT \"ID_career\" FROM \"Career\" 
    JOIN \"Customer\" USING (\"ID_career\") WHERE \"ID_customer\"=$editid";
    $career = resultNumber($career, $db_connect);

    $query="
    UPDATE \"Address\" SET \"Country\"='$country' WHERE (\"ID_address\"=$address) AND ('$country'<>'')"; 
    $db_connect->query($query);
    $query="
    UPDATE \"Address\" SET \"City\"='$city' WHERE (\"ID_address\"=$address) AND ('$city'<>'')"; 
    $db_connect->query($query);
    $query="
    UPDATE \"Address\" SET \"Street\"='$street' WHERE (\"ID_address\"=$address) AND ('$street'<>'')"; 
    $db_connect->query($query);
    $query="
    UPDATE \"Address\" SET \"House\"='$house' WHERE (\"ID_address\"=$address) AND ('$house'<>'')"; 
    $db_connect->query($query);
    $query="
    UPDATE \"Address\" SET \"Flat\"='$flat' WHERE (\"ID_address\"=$address) AND ('$flat'<>'')"; 
    $db_connect->query($query);


    $query="
    UPDATE \"Individual\" SET \"Name\"='$name' WHERE (\"ID_individual\"=$individual) AND ('$name'<>'')"; 
    $db_connect->query($query);
    $query="
    UPDATE \"Individual\" SET \"Surname\"='$surname' WHERE (\"ID_individual\"=$individual) AND ('$surname'<>'')"; 
    $db_connect->query($query);
    $query="
    UPDATE \"Individual\" SET \"Patronymic\"='$patronymic' WHERE (\"ID_individual\"=$individual) AND ('$patronymic'<>'')"; 
    $db_connect->query($query);
    if(!empty($date_of_birth)){
        $query="
        UPDATE \"Individual\" SET \"Date_of_birth\"='$date_of_birth' WHERE (\"ID_individual\"=$individual)";
        $db_connect->query($query);
    }
    $query="
    UPDATE \"Individual\" SET \"Gender\"='$gender' WHERE (\"ID_individual\"=$individual) AND ('$gender'<>'')"; 
    $db_connect->query($query);
    $query="
    UPDATE \"Individual\" SET \"Phone_number\"='$phone_number' WHERE (\"ID_individual\"=$individual) AND ('$phone_number'<>'')"; 
    $db_connect->query($query);
    $query="
    UPDATE \"Individual\" SET \"Email\"='$email' WHERE (\"ID_individual\"=$individual) AND ('$email'<>'')"; 
    $db_connect->query($query);
    $query="
    UPDATE \"Individual\" SET \"Passport_number\"='$passport_number' WHERE (\"ID_individual\"=$individual) AND ('$passport_number'<>'')"; 
    $db_connect->query($query);
    $query="
    UPDATE \"Individual\" SET \"Passport_series\"='$passport_series' WHERE (\"ID_individual\"=$individual) AND ('$passport_series'<>'')"; 
    $db_connect->query($query);
    if(!empty($date_of_issue)){
        $query="
            UPDATE \"Individual\" SET \"Date_of_issuing_passport\"='$date_of_issue' WHERE (\"ID_individual\"=$individual)"; 
        $db_connect->query($query);
    }

    $query="
    UPDATE \"Account\" SET \"Login\"='$login' WHERE (\"ID_account\"=$account) AND ('$login'<>'')"; 
    $db_connect->query($query);
    $query="
    UPDATE \"Account\" SET \"Password\"='$password_ch' WHERE (\"ID_account\"=$account) AND ('$password_ch'<>'')"; 
    $db_connect->query($query);
    

    if(!empty($income)){
        $query="
        UPDATE \"Career\" SET \"Income\"=$income WHERE (\"ID_career\"=$career)"; 
        $db_connect->query($query);
    }
    if(!empty($work_experience)){
        $query="
        UPDATE \"Career\" SET \"Work_experience\"=$work_experience WHERE (\"ID_career\"=$career)"; 
        $db_connect->query($query);
    }
    if(!empty($abbreviation_currency)){
        $currency="
        SELECT \"ID_currency\" FROM \"Currency\"
        WHERE \"Abbreviation\"='$abbreviation_currency'";
        $currency = resultNumber($currency, $db_connect);

        $query="
        UPDATE \"Career\" SET \"ID_currency\"=$currency WHERE (\"ID_career\"=$career)"; 
        $db_connect->query($query);
    }
    echo $editid;
}