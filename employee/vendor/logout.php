<?php
    session_start();
    unset($_SESSION['employee']);

    header('Location: ../../login/index.php');