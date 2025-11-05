<?php

// ユーザー状態管理ファイルのパスを取得
function getUserStateFile($user) {
    return 'user_states/' . $user . '_state.json';
}

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
