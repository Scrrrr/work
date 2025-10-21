<?php
$user = $_GET['username'];
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RockyLinuxのインストール</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs/themes/prism.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs/plugins/command-line/prism-command-line.css">
    <link rel="stylesheet" href="assets/css/styles.css">
   </head>
<body>
<!--================================ PHP ================================-->
   <?php
   $servers = ["tr200", "client1"];

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
         $ser[$server] = "u{$no}-$server";
         $ip[$server] = exec("nslookup u{$no}-$server | grep Address: | tail -n 1 | awk '{print $2}'");
      }
   }

   // よく使用される変数を個別に設定（installUbuntu.phpと同じ変数名）
   $clientIP = $ip["client1"];
   $clientHostname = $ser["client1"];
   $serverHostname = $ser["tr200"];
   $serverIP = $ip["tr200"];
   $gatewayIP = "10.10.$no.254";
   ?>
<!--================================ end ================================-->
	<?php require 'assets/source/installRocky.html'?>

    <!-- PAGE TOP ボタン -->
    <button id="pageTop" class="page-top" title="ページトップ">↑</button>

    <script src="https://cdn.jsdelivr.net/npm/prismjs/prism.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs/components/prism-bash.min.js"></script>
    <script src="assets/js/script.js"></script>
   <footer>
      <br><br>
      <p align="center">© All rights reserved by SSCTS.</p>
   </footer>
   </body>
</html>
