<?php
    session_start();
    unset($_SESSION['admin']);
    unset($_SESSION['all_customer_accounts']);

    unset($_SESSION['count_customers']);
    unset($_SESSION['count_employees']);
    unset($_SESSION['count_administrators']);
    unset($_SESSION['count_offices']);

    header('Location: ../../login/index.php');