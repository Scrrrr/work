/**
 * 最終版MarkdownParser
 * 既存のUbuntuインストールマニュアルテーマに完全対応
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

        // 動的変数の処理
        if (this.options.enableDynamicVars) {
            processed = this.processDynamicVariables(processed);
        }

        return processed;
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
        let lines = markdown.split('\n');
        let html = '';
        let inCodeBlock = false;
        let codeBlockLang = '';
        let codeBlockContent = '';
        let inList = false;
        let listType = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // コードブロックの開始
            if (trimmedLine.startsWith('```')) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeBlockLang = trimmedLine.substring(3).trim();
                    codeBlockContent = '';
                } else {
                    // コードブロックの終了
                    inCodeBlock = false;
                    html += `<pre><code class="language-${codeBlockLang}">${codeBlockContent.trim()}</code></pre>\n`;
                    codeBlockContent = '';
                }
                continue;
            }

            // コードブロック内
            if (inCodeBlock) {
                codeBlockContent += line + '\n';
                continue;
            }

            // 見出しの処理
            if (trimmedLine.match(/^#{1,6}\s/)) {
                const match = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
                if (match) {
                    const level = match[1].length;
                    const text = match[2];
                    const id = this.generateId(text);
                    html += `<h${level} id="${id}">${text}</h${level}>\n`;
                }
                continue;
            }

            // リストの処理
            if (trimmedLine.match(/^[\-\*]\s/)) {
                if (!inList || listType !== 'ul') {
                    if (inList) html += `</${listType}>\n`;
                    html += '<ul>\n';
                    inList = true;
                    listType = 'ul';
                }
                const text = trimmedLine.substring(2);
                html += `<li>${text}</li>\n`;
                continue;
            }

            if (trimmedLine.match(/^\d+\.\s/)) {
                if (!inList || listType !== 'ol') {
                    if (inList) html += `</${listType}>\n`;
                    html += '<ol>\n';
                    inList = true;
                    listType = 'ol';
                }
                const text = trimmedLine.substring(trimmedLine.indexOf('.') + 2);
                html += `<li>${text}</li>\n`;
                continue;
            }

            // リストの終了
            if (inList && trimmedLine === '') {
                html += `</${listType}>\n`;
                inList = false;
                listType = '';
                continue;
            }

            // 空行の処理
            if (trimmedLine === '') {
                if (inList) {
                    html += `</${listType}>\n`;
                    inList = false;
                    listType = '';
                }
                html += '\n';
                continue;
            }

            // 段落の処理
            let paragraph = line;
            
            // インラインコードの処理
            paragraph = paragraph.replace(/`([^`]+)`/g, '<code>$1</code>');
            
            // 強調の処理
            paragraph = paragraph.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            paragraph = paragraph.replace(/\*(.+?)\*/g, '<em>$1</em>');
            
            html += `<p>${paragraph}</p>\n`;
        }

        // リストが最後まで続いている場合の処理
        if (inList) {
            html += `</${listType}>\n`;
        }

        return html;
    }

    /**
     * 後処理：テーマ固有の処理
     */
    postprocess(html) {
        // シェルプロンプトの処理
        if (this.options.enableShellPrompt) {
            html = html.replace(
                /<pre><code class="language-bash">([\s\S]*?)<\/code><\/pre>/g,
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
                    
                    return `<pre><code class="language-bash">${processedCode}</code></pre>`;
                }
            );
        }

        // ヒントボックスの改行処理
        html = html.replace(/<div class="hint">\s*<p><strong>ヒント:<\/strong><\/p>\s*([\s\S]*?)<\/div>/g, (match, content) => {
            const processedContent = content
                .replace(/<p>(.*?)<\/p>/g, '$1')
                .trim()
                .split('\n')
                .filter(line => line.trim())
                .map(line => `<p>${line.trim()}</p>`)
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

        let toc = '';
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
                toc += '<ul>\n';
                openTags += '</ul>\n';
                currentLevel++;
            }
            while (currentLevel > level) {
                toc += '</ul>\n';
                openTags = openTags.replace('</ul>\n', '');
                currentLevel--;
            }

            toc += `<li><a href="#${id}">${text}</a></li>\n`;
        });

        toc += openTags;
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
