<?php
// ユーザー名の取得と検証
// issetでusernameパラメータが存在しない場合はrootに設定する
$user = isset($_GET['username']) ? $_GET['username'] : 'root';

// whoamiコマンドの実行結果を取得
$actualUser = trim(exec('whoami'));

// whoamiの結果とusernameパラメータが一致しない場合はwhoamiの結果に書き換え
if ($actualUser !== $user) {
    $user = $actualUser;
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
	// HTMLファイルを読み込んでPHPコードを実行
	$htmlContent = file_get_contents('assets/source/installUbuntu.html');
	
	// PHPコードを実行して変数を置換
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
