<?php
// 出力バッファを開始（余分な出力を防ぐ）
ob_start();

require_once __DIR__ . '/../common/auth.php';
require_once __DIR__ . '/../common/config.php';

$user = getAuthenticatedUser();
$userStateFile = getUserStateFile($user);

// AJAXリクエストの処理
if (isset($_POST['action']) && $_POST['action'] === 'check_answer') {
    // 問題データを動的に取得
    $questions = array();
    
    // HTMLファイル名を環境に応じて決定
    $htmlFile = isset($_GET['app']) ? "assets/source/install{$_GET['app']}.html" : 'assets/source/installUbuntu.html';
    
    // ファイルパスを絶対パスに変換
    $htmlFile = __DIR__ . '/../' . $htmlFile;
    
    // HTMLファイルから問題データを読み込み
    $htmlContent = file_get_contents($htmlFile);
    
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
        
        // 末尾の「/」を削除して正規化（ファイルパスの末尾スラッシュを無視）
        $normalizeAnswer = function($str) {
            return rtrim(strtolower($str), '/');
        };
        
        $isCorrect = ($normalizeAnswer($userAnswer) === $normalizeAnswer($correctAnswer));
        
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
