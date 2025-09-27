const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// MarkdownParserクラスを読み込み
const MarkdownParser = require('./markdown-parser.js');

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

// PHPファイルから動的変数を取得する関数
function getPHPVariables(username = 'u1') {
    try {
        // 専用のPHPファイルを実行して変数を取得
        const result = execSync(`php get-variables.php ${username}`, { encoding: 'utf8' });
        return JSON.parse(result);
    } catch (error) {
        console.warn('PHP変数の取得に失敗しました。デフォルト値を使用します。', error.message);
        return {
            serverHostname: 'tr253',
            serverIP: '10.10.0.253',
            gatewayIP: '10.10.0.254',
            clientIP: '10.10.0.1'
        };
    }
}

// コマンドライン引数からユーザー名を取得（デフォルト: u1）
const username = process.argv[2] || 'u1';

// PHPファイルから動的変数を取得
console.log(`ユーザー名: ${username} で変数を取得中...`);
const variables = getPHPVariables(username);

// 動的変数を設定
parser.variables = variables;

console.log('取得した変数:', variables);

// HTMLを生成
const html = parser.generateFullHTML(markdownContent, 'Ubuntuのインストール');

// HTMLファイルに出力
fs.writeFileSync('./installUbuntu.html', html, 'utf8');

console.log('HTMLファイルが生成されました: installUbuntu.html');
