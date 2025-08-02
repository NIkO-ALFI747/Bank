<?php
  session_start();

  if (@$_SESSION['admin']) {
    header('Location: ../admin/dashboard.php');
  }

?>

<!DOCTYPE html>
<html>
<head>
	<title>Login</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" type="text/css" href="style.css">
  <link href="https://fonts.googleapis.com/css?family=Nunito:400,600,700,800&display=swap" rel="stylesheet">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
</head>
<body>
  <div class="cont">
    <div class="form sign-in">
      <form action="vendor/signin.php" method="post">
        <h2>Вход</h2>
        <label>
          <span>Логин</span>
          <input type="text" name="login">
        </label>
        <label>
          <span>Пароль</span>
          <input type="password" name="password">
        </label>
        <button class="submit" type="submit">Войти</button>
        <?php
          if(@$_SESSION['message']) {
            echo '<div style="color:#ec0c00; text-align:center;">' . $_SESSION['message'] . ' </div>';
            unset($_SESSION['message']);
          }
        ?>
        <br/>
        <br/>
        <br/>
        <a href="../guest/debit_card_page.php" style=" text-decoration:none; color:#e1c809; margin-left:230px; text-align:center;">Оформить карту</a>
      </form>
    </div>

    <div class="sub-cont">
      <div class="img">
        <div class="img-text m-up">
          <h2>Нет аккаунта?</h2>
          <p>Чтобы зарегистрироваться, оформите дебетовую карту</p>
        </div>
      </div>
    </div>
  </div>

</body>
</html>