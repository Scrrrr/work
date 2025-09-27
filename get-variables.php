<?php
// コマンドライン引数からユーザー名を取得
$user = isset($argv[1]) ? $argv[1] : 'u1';

// サーバー名の定義
$serverNames = ["tr201", "client1"];

// ユーザー番号の取得
$userNumber = ($user == "root") ? "0" : substr($user, 1);

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
    
    // nslookupでIPアドレスを取得（エラーハンドリング付き）
    $nslookupResult = exec("nslookup {$serverHostnames[$serverName]} 2>/dev/null | grep 'Address:' | tail -n 1 | awk '{print \$2}'");
    // フォールバック値（nslookupが失敗した場合）
    if (empty($nslookupResult) || strpos($nslookupResult, '#') !== false) {
        $serverIPs[$serverName] = "10.10.{$userNumber}.100";
    } else {
        $serverIPs[$serverName] = $nslookupResult;
    }
}

// よく使用される変数を個別に設定
$clientIP = $serverIPs["client1"];
$serverHostname = $serverHostnames["tr201"];
$serverIP = $serverIPs["tr201"];
$gatewayIP = "10.10.{$userNumber}.254";

// JSONで出力
echo json_encode([
    'serverHostname' => $serverHostname,
    'serverIP' => $serverIP,
    'gatewayIP' => $gatewayIP,
    'clientIP' => $clientIP
]);
?>
