/**
 * Node.js用MarkdownParser
 * 既存のUbuntuインストールマニュアルテーマに最適化
 */
class MarkdownParser {
    constructor(options = {}) {
        this.options = {
            enableTOC: true,
            enableCheckboxes: true,
            enableSyntaxHighlight: true,
            enableShellPrompt: true,
            enableHintBoxes: true,
            enableDynamicVars: true,
            ...options
        };
        
        // 動的変数のデフォルト値
        this.variables = {
            serverHostname: 'tr253',
            serverIP: '10.10.0.253',
            gatewayIP: '10.10.0.254',
            clientIP: '10.10.0.1'
        };
    }

    /**
     * MarkdownをHTMLに変換
     */
    parse(markdown) {
        // 前処理：独自拡張記法を処理
        let processed = this.preprocess(markdown);
        
        // 標準Markdownを処理
        let html = this.parseStandardMarkdown(processed);
        
        // 後処理：テーマ固有の処理
        html = this.postprocess(html);
        
        return html;
    }

    /**
     * 前処理：独自拡張記法を標準Markdownに変換
     */
    preprocess(markdown) {
        let processed = markdown;

        // ヒントボックス記法を処理
        if (this.options.enableHintBoxes) {
            processed = processed.replace(
                /:::hint\s*\n([\s\S]*?)\n:::/g,
                '<div class="hint">\n<p><strong>ヒント:</strong></p>\n$1\n</div>'
            );
        }

        // シェルプロンプトの処理
        if (this.options.enableShellPrompt) {
            processed = this.processShellPrompts(processed);
        }

        // 動的変数の処理
        if (this.options.enableDynamicVars) {
            processed = this.processDynamicVariables(processed);
        }

        return processed;
    }

    /**
     * シェルプロンプトの処理
     */
    processShellPrompts(markdown) {
        // コードブロック内のシェルプロンプトを処理
        return markdown.replace(
            /```bash\n([\s\S]*?)```/g,
            (match, code) => {
                const processedCode = code
                    .split('\n')
                    .map(line => {
                        // シェルプロンプトのパターンを検出
                        if (line.match(/^\w+@\w+[:\$]\s*.*$/)) {
                            const parts = line.split('$');
                            if (parts.length === 2) {
                                return `<span class="shell-prompt">${parts[0]}$</span>${parts[1]}`;
                            }
                        }
                        return line;
                    })
                    .join('\n');
                
                return `\`\`\`bash\n${processedCode}\n\`\`\``;
            }
        );
    }

    /**
     * 動的変数の処理
     */
    processDynamicVariables(markdown) {
        let processed = markdown;
        
        // {{variable}} 形式の変数を処理
        Object.keys(this.variables).forEach(key => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            processed = processed.replace(regex, this.variables[key]);
        });
        
        return processed;
    }

    /**
     * 標準MarkdownをHTMLに変換
     */
    parseStandardMarkdown(markdown) {
        let html = markdown;

        // 見出しの処理（IDを生成）
        html = html.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
            const level = hashes.length;
            const id = this.generateId(text);
            return `<h${level} id="${id}">${text}</h${level}>`;
        });

        // コードブロックの処理（最初に処理）
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'text';
            return `<pre><code class="language-${language}">${code.trim()}</code></pre>`;
        });

        // インラインコードの処理
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // 強調の処理
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // リストの処理（より正確に）
        html = html.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
        // 連続するliタグをulで囲む
        html = html.replace(/(<li>.*<\/li>)(\s*<li>.*<\/li>)*/g, (match) => {
            return `<ul>${match}</ul>`;
        });

        // 番号付きリストの処理
        html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
        // 連続するliタグをolで囲む（ulと区別）
        html = html.replace(/(<li>.*<\/li>)(\s*<li>.*<\/li>)*/g, (match) => {
            if (match.includes('<ul>')) return match; // 既にulで囲まれている場合はスキップ
            return `<ol>${match}</ol>`;
        });

        // 段落の処理（見出し、コードブロック、リスト以外）
        html = html.replace(/^(?!<[h1-6]|<div|<pre|<ul|<ol|#|\*|\-|\d+\.)(.+)$/gm, '<p>$1</p>');

        // 改行の処理を改善
        html = html.replace(/\n\n/g, '\n');
        html = html.replace(/\n/g, '\n');

        return html;
    }

    /**
     * 後処理：テーマ固有の処理
     */
    postprocess(html) {
        // ヒントボックスの改行処理
        html = html.replace(/<div class="hint">\s*<p><strong>ヒント:<\/strong><\/p>\s*([\s\S]*?)<\/div>/g, (match, content) => {
            const processedContent = content
                .replace(/<br>\s*/g, '\n')
                .replace(/\n\s*/g, '\n')
                .trim()
                .split('\n')
                .map(line => `<p>${line}</p>`)
                .join('\n');
            
            return `<div class="hint">\n<p><strong>ヒント:</strong></p>\n${processedContent}\n</div>`;
        });

        return html;
    }

    /**
     * IDを生成
     */
    generateId(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    }

    /**
     * 目次を生成
     */
    generateTOC(html) {
        const headings = html.match(/<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/g);
        if (!headings) return '';

        let toc = '<ul class="toc">';
        let currentLevel = 0;
        let openTags = '';

        headings.forEach(heading => {
            const levelMatch = heading.match(/<h([1-6])/);
            const idMatch = heading.match(/id="([^"]*)"/);
            const textMatch = heading.match(/>([^<]*)</);
            
            if (!levelMatch || !idMatch || !textMatch) return;

            const level = parseInt(levelMatch[1]);
            const id = idMatch[1];
            const text = textMatch[1];

            // レベルに応じてタグを調整
            while (currentLevel < level) {
                toc += '<ul>';
                openTags += '</ul>';
                currentLevel++;
            }
            while (currentLevel > level) {
                toc += '</ul>';
                openTags = openTags.replace('</ul>', '');
                currentLevel--;
            }

            toc += `<li><a href="#${id}">${text}</a></li>`;
        });

        toc += openTags + '</ul>';
        return toc;
    }

    /**
     * 完全なHTMLページを生成
     */
    generateFullHTML(markdown, title = 'マニュアル') {
        const content = this.parse(markdown);
        const toc = this.generateTOC(content);

        return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs/themes/prism.min.css">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <div class="container">
        <!-- サイドバー（目次） -->
        <nav class="sidebar">
            <h3>目次</h3>
            ${toc}
        </nav>

        <!-- メインコンテンツ -->
        <main class="main-content">
            ${content}
        </main>
    </div>

    <!-- PAGE TOP ボタン -->
    <button id="pageTop" class="page-top" title="ページトップへ">↑</button>

    <script src="https://cdn.jsdelivr.net/npm/prismjs/prism.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs/components/prism-bash.min.js"></script>
    <script src="assets/js/script.js"></script>
</body>
</html>`;
    }
}

module.exports = MarkdownParser;
