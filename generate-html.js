const fs = require('fs');
const path = require('path');

// MarkdownParserクラスを読み込み
const MarkdownParser = require('./markdown-parser-final.js');

// Markdownファイルを読み込み
const markdownContent = fs.readFileSync('./installUbuntu.md', 'utf8');

// MarkdownParserのインスタンスを作成
const parser = new MarkdownParser({
    enableTOC: true,
    enableCheckboxes: true,
    enableSyntaxHighlight: true,
    enableShellPrompt: true,
    enableHintBoxes: true,
    enableDynamicVars: true
});

// 動的変数を設定
parser.variables = {
    serverHostname: 'tr253',
    serverIP: '10.10.0.253',
    gatewayIP: '10.10.0.254',
    clientIP: '10.10.0.1'
};

// HTMLを生成
const html = parser.generateFullHTML(markdownContent, 'Ubuntuのインストール');

// HTMLファイルに出力
fs.writeFileSync('./installUbuntu.html', html, 'utf8');

console.log('HTMLファイルが生成されました: installUbuntu.html');
