<?php
    session_start();
    require_once '../../vendor/db_connect.php';

    function test_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    $login = test_input($_POST['login']);
    $password = test_input($_POST['password']);
    
    if (empty($login)) {
        $_SESSION['message'] = 'Поле "Логин" не должно быть пустым';
        header('Location: ../index.php');
    } else if (empty($password)) {
        $_SESSION['message'] = 'Поле "Пароль" не должно быть пустым';
        header('Location: ../index.php');
    } else {
        $query = 'SELECT * FROM administrator_login_inform
        WHERE "Login"=' ."'$login'". ' AND "Password"=' ."'$password'". 
        ' ';

        $check_admin = $db_connect->query($query);

        if ($check_admin->rowCount() === 1) {
            $admin = $check_admin->FETCH(PDO::FETCH_ASSOC);
            $_SESSION['admin'] = [
                "ID_administrator" => $admin['ID_administrator'],
                "Name" => $admin['Name'],
                "Surname" => $admin['Surname']
            ];
            header('Location: ../../admin/dashboard.php');
        } else {
            $query = 'SELECT * FROM customer_all
            WHERE "Login"=' ."'$login'". ' AND "Password"=' ."'$password'". 
            ' ';
    
            $check_customer = $db_connect->query($query);
    
            if ($check_customer->rowCount() === 1) {
                $customer = $check_customer->FETCH(PDO::FETCH_ASSOC);
                $_SESSION['customer'] = [
                    "ID_customer" => $customer['ID_customer'],
                    "Name" => $customer['Name'],
                    "Surname" => $customer['Surname']
                ];
                header('Location: ../../customer/index.php');
            } else {
                $query = "
                SELECT * FROM employee_all
                WHERE \"Login\"='$login' AND \"Password\"='$password' AND \"Employee_type\"='Отдел валютного управления'";
            
                $check_employee = $db_connect->query($query);
            
                if ($check_employee->rowCount() === 1) {
                    $employee = $check_employee->FETCH(PDO::FETCH_ASSOC);
                    $_SESSION['employee'] = [
                        "ID_employee" => $employee['ID_employee'],
                        "Name" => $employee['Name'],
                        "Surname" => $employee['Surname']
                    ];
                    header('Location: ../../employee/dashboard.php');
                } else {
                    $_SESSION['message'] = 'Неверный логин или пароль';
                    header('Location: ../../login/index.php');
                }
            }
        }
    }
