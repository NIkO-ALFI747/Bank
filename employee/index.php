<?php
  session_start();
  if (!@$_SESSION['employee']) {
    header('Location: ../login/index.php');
  }
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href='https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css' rel='stylesheet'>
	<link rel="stylesheet" href="style.css">
	<link rel="stylesheet" href="form.css">
	<link rel="stylesheet" href="table.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
	<title>Exchange Employee</title>
</head>
<body>
	
	<!-- SIDEBAR -->
	<section id="sidebar">
		<a href="dashboard.php" class="brand"><i class='bx bx-desktop icon'></i> Exchange employee</a>
		<ul class="side-menu">
			<li><a href="dashboard.php"><i class='bx bxs-dashboard icon' ></i> Панель виджетов</a></li>
			<li class="divider" data-text="Валюты">Валюты</li>
			<li><a id="m11" href="#"><i class='bx bxs-buildings icon' ></i> Обмен валют</a></li>
			<li><a id="m12" href="#"><i class='bx bxs-buildings icon' ></i> Курсы валют</a></li>
		</ul>
	</section>
	<!-- SIDEBAR -->

	<!-- CONTENT -->
	<section id="content">
		<!-- NAVBAR -->
		<nav>
			<i class='bx bx-menu toggle-sidebar' ></i>
			<div class="indent"></div>
			<div class="profile">
				<img src="bx-user.svg" alt="">
				<ul class="profile-link">
					<li><a href="#"><i class='bx bxs-user-circle icon' ></i> Профиль</a></li>
					<li><a href="vendor/logout.php"><i class='bx bxs-log-out-circle' ></i> Выход</a></li>
				</ul>
			</div>
		</nav>
		<!-- NAVBAR -->

		<!-- MAIN -->
		<main>
			<div id="main_content">
				<h1 class="title">Панель виджетов</h1>
				<div class="info-data">
					<div class="card">
						<div class="head">
							<div>
								<div id="count_customers"></div>
								<p>Количество клиентов</p>
							</div>
							<i class='bx bxs-wallet icon'></i>
						</div>
					</div>
					<div class="card">
						<div class="head">
							<div>
								<div id="count_employees"></div>
								<p>Количество сотрудников</p>
							</div>
							<i class='bx bxs-hard-hat icon'></i>
						</div>
					</div>
					<div class="card">
						<div class="head">
							<div>
								<div id="count_administrators"></div>
								<p>Количество администраторов</p>
							</div>
							<i class='bx bx-briefcase-alt-2 icon' ></i>
						</div>
					</div>
					<div class="card">
						<div class="head">
							<div>
								<div id="count_offices"></div>
								<p>Количество офисов</p>
							</div>
							<i class='bx bxs-buildings icon' ></i>
						</div>
					</div>
				</div>
				<div class="table-data">
					<div class="order">
						<div class="head">
							<h3>Счета клиентов</h3>
						</div>
						<div id="all_customer_accounts"></div>
					</div>
				</div>
			</div>
		</main>
		<!-- MAIN -->
	</section>
	<!-- CONTENT -->

	<?PHP require_once 'dashboard_js.php' ?>
	<?PHP require_once 'dashboard_link.php' ?>
	<script src="m11.js"></script>
	<script src="m12.js"></script>

	<script src="employee_info.js"></script>
	<script src="employee_reg.js"></script>
	<script src="customer_info.js"></script>
	<script src="customer_reg.js"></script>
	<script src="admin_reg.js"></script>
	<script src="admin_info.js"></script>
	<script src="script.js"></script>
</body>
</html>
