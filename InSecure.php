<?php

// First a SQL Injection attack V7
$var = $_POST['var'];
mysql_query("SELECT * FROM sometable WHERE id = $var");

//
/// XSS example
//
$var = $_POST['var'];
echo "<div>$var</div>\n";

//
/// Forget to terminate user input after a redirect
//
if ($_SESSION['user_logged_in'] !== true) {
  header('Location: /login.php');
}

//omg_important_private_functionality_here();
