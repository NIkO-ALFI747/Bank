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
    <link rel="stylesheet" href="css/form.css">

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
            <a class="navbar-brand" href="#">International Bank<span class="dot">.</span></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#home">Банк</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Карты</a>
                        <ul>
                            <li><a href="debit_card_page.php">Дебетовые карты</a></li>
                            <li><a href="credit_cards_list.php">Кредитные карты</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="convert_cr.php">Конвертирование валют</a>
                    </li>
                </ul>
                <a href="../login/index.php" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-brand ms-lg-3">Вход</a>
            </div>
        </div>
    </nav>

    

    <!-- ABOUT -->

        
    <section id="about">
    <div class="container">
        <div class="hero_container">
            <div class="hero_content">

                <h2 class="hero_heading">Оформите <br> банковскую <br> карту</h2>
                <p class="section_paragraph">
                Обменивайте валюты на карте, получайте кэшбек <br> за покупки любимых товаров
                </p>
                <a href="debit_card_page.php" class="btn-primary_2"> <img src="img/bankcard.png" alt=""><span>Посмотреть дебетовые карты</span></a>
            </div>
            <div class="hero_image">
                <img src="img/card2.jpg" alt="">
            </div>
        </div>
    </div>
    </section>


    <!-- MILESTONE -->
    <section id="milestone">
        <div class="container">
            <div class="row text-center justify-content-center gy-4">
                <div class="col-lg-2 col-sm-6">
                    <h1 class="display-4">9K+</h1>
                    <p class="mb-0">Довольных клиентов</p>
                </div>
                <div class="col-lg-2 col-sm-6">
                    <h1 class="display-4">100%</h1>
                    <p class="mb-0">Достоверной информации</p>
                </div>
                <div class="col-lg-2 col-sm-6">
                    <h1 class="display-4">24/7</h1>
                    <p class="mb-0">Исправность работы сайта</p>
                </div>
               
            </div>
        </div>
    </section>

    <section id="services" class="text-center">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="intro">
                        <h1>Сервисы и услуги банка "International bank"</h1>
                    </div>
                </div>
            </div>
            <div class="row g-4">
                <div class="col-lg-4 col-md-6">
                    <div class="service">
                        <img src="img/icon1.png" alt="">
                        <h5>Курсы валют</h5>
                        <p>Конвертирование валют между своими счетами онлайн либо наличными в офисе банка</p><div style="margin-top: 43px;"></div>
                        <a href="convert_cr.php" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-brand ms-lg-3">Смотреть</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6">
                    <div class="service">
                        <img src="img/icon2.png" alt="">
                        <h5>Дебетовая карта</h5>
                        <p>Оформите дебетовую карту, обменивайте валюты на карте, получайте кэшбек за покупки любимых товаров</p>
                        <a href="debit_card_page.php" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-brand ms-lg-3">Подробнее</a>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6">
                    <div class="service">
                        <img src="img/icon3.png" alt="">
                        <h5>Кредитная карта</h5>
                        <p>Оформите кредитную карту, пользуйтесь кредитными средствами бесплатно за беспроцентный период</p>
                        <a href="credit_cards_list.php" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-brand ms-lg-3">Подробнее</a>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </section>

    <section class="bg-light" id="portfolio">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="intro">
                        <h1>Конвертирование валют</h1>
                        <main>
			                <div id="main_content"></div>
		                </main>
                    </div>
                </div>
            </div>
        </div>
       
    </section>

    

  

    <section id="blog">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="intro">
                        <h1>Актуальные новости банка International Bank</h1>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <article class="blog-post">
                        <img src="img/project5.jpg" alt="">
                        <a href="#" class="tag">Сегодня</a>
                        <div class="content">
                            <h5>Минимальная ставка</h5>
                            <p>Минимальная ставка по "Дальневосточной ипотеке" снижается до 0,1% годовых при субсидировании застройщиком</p>
                        </div>
                    </article>
                </div>
                <div class="col-md-4">
                    <article class="blog-post">
                        <img src="img/project4.jpg" alt="">
                        <a href="#" class="tag">Сегодня</a>
                        <div class="content">
                            <h5>Масштабное обновление</h5>
                            <p>Масштабное обновление International Bank Онлайн для пользователей на платформе Android: более удобный интерфейс</p>
                        </div>
                    </article>
                </div>
                <div class="col-md-4">
                    <article class="blog-post">
                        <img src="img/project2.jpg" alt="">
                        <a href="#" class="tag">Вчера</a>
                        <div class="content">
                            <h5>Трек "Кибербезопасность"</h5>
                            <p>International bank запустил трек "Кибербезопасность" на Летней цифровой школе</p>
                        </div>
                    </article>
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

    <script src="convert.js"></script>

</body>

</html>