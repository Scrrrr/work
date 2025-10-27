<?php
// usernameパラメータからユーザー名を取得（必須）
if (!isset($_GET['username'])) {
    // usernameパラメータがない場合はエラー
    http_response_code(400);
    die('username parameter is required');
}

$user = $_GET['username'];

// 許可されたユーザー名かチェック（セキュリティ）
$allowedUsers = ['root', 'user1', 'user2', 'user3', 'user4', 'user5'];
if (!in_array($user, $allowedUsers)) {
    http_response_code(403);
    die('Invalid username');
}

// ユーザー別の状態管理ファイル
$userStateFile = 'user_states/' . $user . '_state.json';

// ユーザー状態を読み込み
function loadUserState($userStateFile) {
    if (file_exists($userStateFile)) {
        $content = file_get_contents($userStateFile);
        return json_decode($content, true) ?: array();
    }
    return array();
}

// ユーザー状態を保存
function saveUserState($userStateFile, $state) {
    $dir = dirname($userStateFile);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents($userStateFile, json_encode($state));
}

// AJAXリクエストの処理
if (isset($_POST['action']) && $_POST['action'] === 'check_answer') {
    // 問題データを動的に取得
    $questions = array();
    
    // installUbuntu.htmlファイルから問題データを読み込み
    $htmlContent = file_get_contents('assets/source/installUbuntu.html');
    
    // PHPの配列定義を抽出
    if (preg_match('/\$questions\s*=\s*array\s*\((.*?)\);/s', $htmlContent, $matches)) {
        $arrayContent = $matches[1];
        
        // 配列の内容を解析
        $lines = explode("\n", $arrayContent);
        foreach ($lines as $line) {
            $line = trim($line);
            if (preg_match("/'([^']+)'\s*=>\s*'([^']+)'/", $line, $questionMatches)) {
                $questions[$questionMatches[1]] = $questionMatches[2];
            }
        }
    }
    
    // 出力バッファをクリア（余分な出力を防ぐ）
    if (ob_get_level()) {
        ob_clean();
    }
    
    $questionId = isset($_POST['question_id']) ? $_POST['question_id'] : '';
    $userAnswer = isset($_POST['answer']) ? $_POST['answer'] : '';
    
    if (isset($questions[$questionId])) {
        $correctAnswer = $questions[$questionId];
        $isCorrect = (strtolower($userAnswer) === strtolower($correctAnswer));
        
        // 正解の場合はユーザー状態を更新
        if ($isCorrect) {
            $userState = loadUserState($userStateFile);
            if (!in_array($questionId, $userState)) {
                $userState[] = $questionId;
                saveUserState($userStateFile, $userState);
            }
        }
        
        // JSONレスポンスを返す
        header('Content-Type: application/json');
        echo json_encode([
            'isCorrect' => $isCorrect,
            'correctAnswer' => $correctAnswer
        ]);
        exit;
    } else {
        // 問題が見つからない場合のエラーレスポンス
        header('Content-Type: application/json');
        echo json_encode([
            'isCorrect' => false,
            'correctAnswer' => '',
            'error' => 'Question not found'
        ]);
        exit;
    }
}

// ユーザー状態取得のAPIエンドポイント
if (isset($_POST['action']) && $_POST['action'] === 'get_user_state') {
    // 出力バッファをクリア（余分な出力を防ぐ）
    if (ob_get_level()) {
        ob_clean();
    }
    
    $userState = loadUserState($userStateFile);
    header('Content-Type: application/json');
    echo json_encode(['answeredQuestions' => $userState]);
    exit;
}
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
   $clientHostname = $serverHostnames["client1"];
   $serverHostname = $serverHostnames["tr201"];
   $serverIP = $serverIPs["tr201"];
   $gatewayIP = "10.10.{$userNumber}.254";
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
