<?php
$user = $_GET['username'];
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ubuntuのインストール</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs/themes/prism.min.css">
    <link rel="stylesheet" href="assets/css/styles.css">
   </head>
<body>
<!--================================ PHP ================================-->
   <?php
   // サーバー名の定義
   $serverNames = ["tr201", "client1"];
   
   // ユーザー番号の取得
   $userNumber = ($user == "root") ? "0" : substr($user, 4);
   
   // サーバー情報の配列を初期化
   $serverHostnames = [];
   $serverIPs = [];
   
   // 各サーバーのホスト名とIPアドレスを取得
   foreach ($serverNames as $serverName) {
       if ($user == "root") {
           $serverHostnames[$serverName] = $serverName;
       } else {
           $serverHostnames[$serverName] = "u{$userNumber}-{$serverName}";
       }
       
       // nslookupでIPアドレスを取得
       $serverIPs[$serverName] = exec("nslookup {$serverHostnames[$serverName]} | grep Address: | tail -n 1 | awk '{print $2}'");
   }
   
   // よく使用される変数を個別に設定
   $clientIP = $serverIPs["client1"];
   $serverHostname = $serverHostnames["tr201"];
   $serverIP = $serverIPs["tr201"];
   $gatewayIP = "10.10.{$userNumber}.254";
   ?>
<!--================================ end ================================-->
	<?php require 'assets/source/installUbuntu.html'?>

    <!-- PAGE TOP ボタン -->
    <button id="pageTop" class="page-top" title="ページトップへ">↑</button>

    <script src="https://cdn.jsdelivr.net/npm/prismjs/prism.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs/components/prism-bash.min.js"></script>
    <script src="assets/js/script.js"></script>
   <footer>
      <br><br>
      <p align="center">© All rights reserved by SSCTS.</p>
   </footer>
   </body>
</html> 
