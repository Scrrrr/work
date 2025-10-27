<?php
require_once 'common/auth.php';
require_once 'common/server_config.php';

$user = getAuthenticatedUser();
$servers = ["tr201", "client1"];
$config = getServerConfig($user, $servers);

// 変数を展開
extract($config);
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ubuntuのインストール</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs/themes/prism.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs/plugins/command-line/prism-command-line.css">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
<!--================================ PHP ================================-->
   <?php
   // 変数は既に extract($config) で展開済み
   ?>
<!--================================ end ================================-->
	<?php 
	// HTMLファイルを読み込んで変数を置換
	$htmlContent = file_get_contents('assets/source/installUbuntu.html');
	
	// PHPコードを実行して変数を置換（evalを使用）
	ob_start();
	eval('?>' . $htmlContent);
	$processedContent = ob_get_clean();
	
	// 処理されたHTMLを出力
	echo $processedContent;
	?>

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
