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
        ├── installRocky.html
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

```bash
# 基本的な変換
node generate-html.js installRocky.md

# 出力ファイルを指定
node generate-html.js installRocky.md -d assets/source/installRocky.html

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
