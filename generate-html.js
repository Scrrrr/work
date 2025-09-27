const fs = require('fs');
const path = require('path');

// コマンドライン引数を解析
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        input: 'installUbuntu.md',
        output: 'installUbuntu.html',
        title: 'Ubuntuのインストール'
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        if (arg === '-d' || arg === '--output') {
            // 出力ファイル指定
            if (i + 1 < args.length) {
                options.output = args[i + 1];
                i++; // 次の引数をスキップ
            }
        } else if (arg === '-t' || arg === '--title') {
            // タイトル指定
            if (i + 1 < args.length) {
                options.title = args[i + 1];
                i++; // 次の引数をスキップ
            }
        } else if (arg === '-h' || arg === '--help') {
            // ヘルプ表示
            console.log(`
使用方法: node generate-html.js [入力ファイル] [オプション]

引数:
  入力ファイル          Markdownファイルのパス (デフォルト: installUbuntu.md)

オプション:
  -d, --output <ファイル>  出力HTMLファイルのパス (デフォルト: installUbuntu.html)
  -t, --title <タイトル>    HTMLのタイトル (デフォルト: Ubuntuのインストール)
  -h, --help              このヘルプを表示

例:
  node generate-html.js installUbuntu.md -d ./source/installUbuntu.html
  node generate-html.js installRocky.md -d ./source/installRocky.html -t "RockyLinuxのインストール"
            `);
            process.exit(0);
        } else if (!arg.startsWith('-')) {
            // 入力ファイル指定
            options.input = arg;
        }
    }

    return options;
}

// 引数を解析
const options = parseArgs();

// 引数が指定されていない場合はヘルプを表示
if (process.argv.length === 2) {
    console.log(`
使用方法: node generate-html.js [入力ファイル] [オプション]

引数:
  入力ファイル          Markdownファイルのパス (デフォルト: installUbuntu.md)

オプション:
  -d, --output <ファイル>  出力HTMLファイルのパス (デフォルト: installUbuntu.html)
  -t, --title <タイトル>    HTMLのタイトル (デフォルト: Ubuntuのインストール)
  -h, --help              このヘルプを表示

例:
  node generate-html.js installUbuntu.md -d ./source/installUbuntu.html
  node generate-html.js installRocky.md -d ./source/installRocky.html -t "RockyLinuxのインストール"
            `);
    process.exit(0);
}

// MarkdownParserクラスを読み込み
const MarkdownParser = require('./markdown-parser.js');

// Markdownファイルを読み込み
let markdownContent;
try {
    markdownContent = fs.readFileSync(options.input, 'utf8');
} catch (error) {
    console.error(`エラー: 入力ファイル '${options.input}' が見つかりません。`);
    process.exit(1);
}

// MarkdownParserのインスタンスを作成
const parser = new MarkdownParser();

// 動的変数を設定（PHPのecho文として出力される）
parser.variables = {
    serverHostname: 'serverHostname',
    serverIP: 'serverIP', 
    gatewayIP: 'gatewayIP',
    clientIP: 'clientIP'
};

// HTMLを生成（インクルード用）
const html = parser.generateIncludeHTML(markdownContent);

// 出力ディレクトリを作成（必要に応じて）
const outputDir = path.dirname(options.output);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// HTMLファイルに出力
try {
    fs.writeFileSync(options.output, html, 'utf8');
    console.log(`HTMLファイルが生成されました: ${options.output}`);
} catch (error) {
    console.error(`エラー: 出力ファイル '${options.output}' の書き込みに失敗しました。`);
    console.error(error.message);
    process.exit(1);
}
