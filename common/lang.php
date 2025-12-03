<?php

/**
 * 言語パラメータを取得する
 * GETパラメータのlangが'en'の場合は'en'を、それ以外は'ja'を返す
 * 
 * @return string 'en' または 'ja'
 */
function getLanguage() {
    return isset($_GET['lang']) && $_GET['lang'] === 'en' ? 'en' : 'ja';
}

