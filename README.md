# Markdown Parser

Ubuntu/Rocky Linuxインストールマニュアル用のカスタムMarkdownパーサーです。標準的なMarkdownに加えて、独自の拡張記法をサポートしています。

## ディレクトリ構造

```
work/
├── README.md                    # このファイル
├── markdown-parser.js           # メインのMarkdownパーサークラス
├── generate-html.js             # HTML生成スクリプト
├── installUbuntu.md             # Ubuntuインストールマニュアル（Markdown）
├── installUbuntu.php            # Ubuntuマニュアル用PHPテンプレート
├── installRocky.md              # Rocky Linuxインストールマニュアル（Markdown）
├── installRocky.php             # Rocky Linuxマニュアル用PHPテンプレート
└── assets/                      # 静的リソース
    ├── css/
    │   └── styles.css           # メインスタイルシート
    ├── js/
    │   └── script.js            # JavaScript機能
    ├── images/                  # 画像ファイル
    └── source/                  # 生成されたHTMLファイル
        ├── installUbuntu.html
        ├── installUbuntu_.html
        ├── installRocky.html
        └── installRocky_.html
```

## 機能

### 1. 標準Markdown機能
- 見出し（H1-H6）
- 段落
- リスト（順序なし・順序あり）
- コードブロック
- インラインコード
- 強調（太字・斜体）

### 2. 独自拡張記法

#### ヒントボックス
```markdown
:::hint
これはヒントボックスの内容です。
複数行のテキストも記述できます。
:::
```

#### ファイル名付きコードブロック
```markdown
# 形式1: {file=filename}
```{file=~/.vimrc}
set nocompatible
set number
```

# 形式2: language:filename
```bash:install.sh
#!/bin/bash
echo "Hello World"
```
```

#### Git差分表示
```markdown
```bash
# 追加されたファイル（緑色の背景）
+[[新しいファイルを追加]]

# 削除されたファイル（赤色の背景）
-[[古いファイルを削除]]

# 通常のコマンド
git status
```
```

#### 動的変数
Markdown内で`{{variableName}}`形式の変数を使用できます。これらはPHPのecho文に変換されます。

```markdown
サーバー名: {{serverHostname}}
IPアドレス: {{serverIP}}
ゲートウェイ: {{gatewayIP}}
```

## 使用方法

### 1. 基本的な使用方法

```javascript
const MarkdownParser = require('./markdown-parser.js');

const parser = new MarkdownParser();

// 動的変数を設定
parser.variables = {
    serverHostname: 'server1',
    serverIP: '192.168.1.100',
    gatewayIP: '192.168.1.1'
};

// Markdownをパース
const markdown = fs.readFileSync('installUbuntu.md', 'utf8');
const html = parser.parse(markdown);
```

### 2. 完全なHTMLページの生成

```javascript
const fullHTML = parser.generateFullHTML(markdown, 'Ubuntuのインストール');
```

### 3. インクルード用HTMLの生成

```javascript
const includeHTML = parser.generateIncludeHTML(markdown);
```

### 4. コマンドラインからの使用

```bash
# 基本的な変換
node generate-html.js

# 出力ファイルを指定
node generate-html.js -d output.html

# タイトルを指定
node generate-html.js -t "カスタムタイトル"

# ヘルプを表示
node generate-html.js -h
```

## スタイリング

### CSSクラス

- `.hint` - ヒントボックス
- `.code-file-info` - ファイル名表示
- `.git-add` - Git追加（緑色の背景）
- `.git-remove` - Git削除（赤色の背景）
- `.toc` - 目次
- `.page-top` - ページトップボタン

### カスタマイズ

`assets/css/styles.css`を編集してスタイルをカスタマイズできます。特に以下の要素を調整できます：

- カラーテーマ
- フォントサイズ
- レイアウト
- レスポンシブデザイン

## 目次機能

パーサーは自動的に目次（TOC）を生成します：

- H1とH2の見出しのみが目次に含まれます
- 見出しには自動的にIDが付与されます
- サイドバーに表示されます

## 技術仕様

- **Node.js**: 対応
- **ブラウザ**: モダンブラウザ対応
- **依存関係**: なし（純粋なJavaScript）
- **Prism.js**: シンタックスハイライト対応

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献

バグ報告や機能追加の提案は、GitHubのIssueでお知らせください。

## 更新履歴

- v1.0.0: 基本的なMarkdownパーサー機能
- v1.1.0: ヒントボックス機能追加
- v1.2.0: ファイル名表示機能追加
- v1.3.0: Git差分表示機能追加
- v1.4.0: 動的変数機能追加
