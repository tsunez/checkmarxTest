<?php

// Updated to trigger CxFlow 356


// Updated to trigger CxFlow 385
// First a SQL Injection attack V9
//$var = $_POST['var'];
//mysql_query("SELECT * FROM sometable WHERE id = $var");

//
/// XSS example
//
$var = $_POST['var'];
echo "<div>$var</div>\n";

// Important private logic that shouldn't happen because we've already redirected the user!
