<?php
/**
 * HTMLを読み込み、PHPを評価した上で回答文字列をサーバー側でスポイラー化するヘルパー
 * @param string $htmlFile インクルードするHTMLファイルのパス
 * @param array  $vars     インクルード先で使う変数（例: $config の展開）
 * @return string スポイラー済みのHTML文字列
 */
function render_with_spoiler($htmlFile, array $vars = []) {
    // HTMLを評価して出力を取得
    ob_start();
    if (!empty($vars)) {
        // 呼び出し元の値をインクルード先で使えるようにする
        extract($vars, EXTR_SKIP);
    }
    require $htmlFile; // ここで $questions 配列が定義される想定
    $htmlContent = ob_get_clean();

    // 回答をサーバー側でマスク（大文字小文字を区別しない、HTMLタグ内も対象）
    if (isset($questions) && is_array($questions)) {
        foreach ($questions as $qId => $answer) {
            if ($answer === '') {
                continue;
            }
            $mask = str_repeat('*', mb_strlen($answer, 'UTF-8'));
            $spoiler = '<span class="spoiler processed" data-question-id="' . htmlspecialchars($qId, ENT_QUOTES, 'UTF-8') . '">' . $mask . '</span>';
            
            // 正規表現で大文字小文字を区別しない置換
            // HTMLエンティティやタグ内の文字列も置換対象にする
            // \b で単語境界を使用（ただし日本語には使えないため、完全一致のみ）
            $pattern = '/' . preg_quote($answer, '/') . '/iu';
            $htmlContent = preg_replace($pattern, $spoiler, $htmlContent);
        }
    }

    return $htmlContent;
}

