<?php
require_once 'common/auth.php';
require_once 'common/server_config.php';
require_once 'common/lang.php';

$user = getAuthenticatedUser();
$lang = getLanguage();
$servers = ["tr200", "client1"];
$config = getServerConfig($user, $servers);

// 変数を展開
extract($config);

// 言語に応じた設定
$isEnglish = ($lang === 'en');
$htmlFile = $isEnglish ? 'assets/source/installRockyEN.html' : 'assets/source/installRocky.html';
$pageTitle = $isEnglish ? 'Rocky Linux Installation' : 'RockyLinuxのインストール';
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
	<?php require $htmlFile; ?>

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
