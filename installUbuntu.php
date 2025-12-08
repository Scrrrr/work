<?php
require_once 'common/auth.php';
require_once 'common/server_config.php';
require_once 'common/lang.php';
require_once 'common/spoiler.php';

$user = getAuthenticatedUser();              //common/auth.phpで定義
$lang = getLanguage();
$servers = ["tr201", "client1"];
$config = getServerConfig($user, $servers);  //common/server_config.phpで定義

// 変数を展開
extract($config);
$isEnglish = ($lang === 'en');
$htmlFile = $isEnglish ? 'assets/source/installUbuntuEN.html' : 'assets/source/installUbuntu.html';
$pageTitle = $isEnglish ? 'Ubuntu Installation' : 'Ubuntuのインストール';
?>

<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs/themes/prism.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs/plugins/command-line/prism-command-line.css">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <?php echo render_with_spoiler($htmlFile, $config); ?>

    <!-- PAGE TOP ボタン -->
    <button id="pageTop" class="page-top" title="ページトップ">↑</button>

    <script src="https://cdn.jsdelivr.net/npm/prismjs/prism.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs/components/prism-bash.min.js"></script>
    <script src="assets/js/script.js"></script>
   <footer>
      <br><br>
      <p align="center">© All rights reserved by SCTS.</p>
   </footer>
   </body>
</html>
