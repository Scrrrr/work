<?php
$user = $_GET['username'];
?>

<!DOCTYPE html>
<html lang="ja">
   <head>
   <title>OSインストール練習</title>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <link rel="stylesheet" href="../CSS/reset.css" type="text/css">
   <link rel="stylesheet" href="../CSS/style.css" type="text/css">
   <link rel="stylesheet" href="../CSS/all.css">
   <script src="../JS/jquery-3.5.1.min.js"></script>
   <script type="text/javascript" src="../JS/jquery.js"></script>
   </head>
   <header>
   <div id="page_top"><a href="#"></a></div>
   <div class="topnav" id="myTopnav">
</header>
   <body>
<!--================================ PHP ================================-->
   <?php
   $servers = ["tr253", "client1"];

   $ip = [];
   $ser = [];

   if($user == "root"){
      foreach ($servers as $server) {
         $ser[$server] = $server;
         $ip[$server] = exec("nslookup $server | grep Address: | tail -n 1 | awk '{print $2}'");
         $no = "0";
      }
   } else {
      $no = exec("echo $user | cut -c 5-");
      foreach ($servers as $server) {
         $ser[$server] = "u${no}-$server";
         $ip[$server] = exec("nslookup u${no}-$server | grep Address: | tail -n 1 | awk '{print $2}'");
      }
   }

   $ipcl = $ip["client1"];
   $serv = $ser["tr253"];
   $ipad = $ip["tr253"];
   $gate = "10.10.$no.254";
   ?>
<!--================================ end ================================-->
	<?php require 'assets/installRocky.html'?>
   <footer>
      <br><br>
      <p align="center">© All rights reserved by SSCTS.</p>
   </footer>
   </body>
</html>
