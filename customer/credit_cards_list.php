<?php
  session_start();
  if (!@$_SESSION['customer']) {
    header('Location: ../login/index.php');
  }
?>

<!doctype html>
<html lang="en">

<head>
    <!--Konverter-->
    <meta charset="utf-8">
    <title>International bank</title>
    <!-- FontAweome CDN Link for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/about.css">
    <link rel="stylesheet" href="css/form_cr.css">
    <link rel="stylesheet" href="css/table_crc.css">
    <title>International Bank</title>
</head>

<body data-bs-spy="scroll" data-bs-target=".navbar" data-bs-offset="70">

    <!-- TOP NAV -->
    <div class="top-nav" id="home">
        <div class="container">
            <div class="row justify-content-between">
                <div class="col-auto">
                    <p> <i class='bx bxs-envelope'></i> international_bank@mail.ru</p>
                    <p> <i class='bx bxs-phone-call'></i> 8-(800)-555-35-35</p>
                </div>
            </div>
        </div>
    </div>

    <!-- BOTTOM NAV -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
        <div class="container">
            <a class="navbar-brand" href="index.php">International Bank<span class="dot">.</span></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="index.php">Банк</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Карты</a>
                        <ul>
                            <li><a href="debit_card_page.php">Дебетовые карты</a></li>
                            <li><a href="#">Кредитные карты</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="convert_cr.php">Конвертирование валют</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="lk.php">Личный кабинет</a>
                    </li>
                </ul>
                <a href="vendor/logout.php" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-brand ms-lg-3">Выход</a>
            </div>
        </div>
    </nav>

    <!-- MILESTONE -->

    <section id="services" class="text-center">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div>
                        <h1>Кредитные карты</h1>
                    </div>
                    <div class="col-12">
                    <section id="content">
                        <main>
                            <div id="main_content"></div>
                        </main>
                    </section>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="footer-top text-center">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-6 text-center">
                        <h4 class="navbar-brand">International Bank<span class="dot">.</span></h4>
                        <p> Нам выгодно доверять</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-bottom text-center">
            <p class="mb-0">Россия, г.Белгород, ул.Шумилова, д.2</p>
        </div>
    </footer>
    <script src="credit_cards_list.js"></script>
</body>

</html>