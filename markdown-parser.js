/**
 * 最終版MarkdownParser
 * 既存のUbuntuインストールマニュアルテーマに完全対応
 */
class MarkdownParser {
    constructor() {
        // 動的変数は外部で設定される
        this.variables = {};
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
        processed = processed.replace(
            /:::hint\s*\n([\s\S]*?)\n:::/g,
            '<div class="hint">\n<p><strong>ヒント:</strong></p>\n<p>$1</p>\n</div>'
        );

        // 動的変数の処理
        processed = this.processDynamicVariables(processed);

        return processed;
    }

    /**
     * 動的変数の処理
     */
    processDynamicVariables(markdown) {
        let processed = markdown;
        
        // {{variable}} 形式の変数をPHPのecho文に変換
        Object.keys(this.variables).forEach(key => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            processed = processed.replace(regex, `<?php echo $${key}; ?>`);
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
        
        // セクション番号の追跡
        let sectionNumber = 0;
        let subsectionNumber = 0;
        let currentSection = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // コードブロックの開始
            if (trimmedLine.startsWith('```')) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    const langAndFile = trimmedLine.substring(3).trim();
                    
                    // {file=filename} 形式を処理
                    const fileMatch = langAndFile.match(/^\{file=([^}]+)\}$/);
                    if (fileMatch) {
                        codeBlockLang = '';
                        this.currentCodeBlockFile = fileMatch[1];
                    } else {
                        // language:filename 形式を処理
                        if (langAndFile.includes(':')) {
                            const parts = langAndFile.split(':');
                            codeBlockLang = parts[0];
                            this.currentCodeBlockFile = parts[1];
                        } else {
                            codeBlockLang = langAndFile;
                            this.currentCodeBlockFile = null;
                        }
                    }
                    codeBlockContent = '';
                } else {
                    // コードブロックの終了
                    inCodeBlock = false;
                    
                    // ファイル名の表示を追加
                    let fileInfo = '';
                    if (this.currentCodeBlockFile) {
                        fileInfo = `<div class="code-file-info">📁 ${this.currentCodeBlockFile}</div>\n`;
                    }
                    
                    // bashまたはshellの場合のみclass="language-bash"を適用
                    const className = (codeBlockLang === 'bash' || codeBlockLang === 'shell') ? 'language-bash' : '';
                    const classAttr = className ? ` class="${className}"` : '';
                    html += `${fileInfo}<pre><code${classAttr}>${codeBlockContent.trim()}</code></pre>\n`;
                    codeBlockContent = '';
                    this.currentCodeBlockFile = null;
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
                    
                    // セクション番号の更新
                    if (level === 1) {
                        sectionNumber++;
                        subsectionNumber = 0;
                        currentSection = sectionNumber;
                    } else if (level === 2) {
                        subsectionNumber++;
                    }
                    
                    const id = this.generateId(text, level, sectionNumber, subsectionNumber);
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
                let text = trimmedLine.substring(2);
                
                // インラインコードの処理
                text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
                
                // 強調の処理
                text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
                
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
                let text = trimmedLine.substring(trimmedLine.indexOf('.') + 2);
                
                // インラインコードの処理
                text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
                
                // 強調の処理
                text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
                
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
        // すべてのコードブロックでgitの追加と削除を表す背景を処理（Prism.jsの処理前に実行）
        html = html.replace(
            /<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g,
            (match, code) => {
                const processedCode = code
                    .replace(/\+\[\[([^\]]+)\]\]/g, '<span class="git-add">$1</span>')
                    .replace(/\-\[\[([^\]]+)\]\]/g, '<span class="git-remove">$1</span>');
                
                return match.replace(code, processedCode);
            }
        );

        // シェルプロンプトの処理（class="language-bash"が適用されている場合のみ）
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

        // ヒントボックスの重複<p>タグを修正
        html = html.replace(
            /<p><div class="hint"><\/p>\s*<p><p><strong>ヒント:<\/strong><\/p><\/p>\s*<p><p>([\s\S]*?)<\/p><\/p>\s*<p><\/div><\/p>/g,
            '<div class="hint">\n<p><strong>ヒント:</strong></p>\n<p>$1</p>\n</div>'
        );

        return html;
    }

    /**
     * IDを生成（番号ベース）
     */
    generateId(text, level, sectionNumber, subsectionNumber = null) {
        if (level === 1) {
            return sectionNumber.toString();
        } else if (level === 2) {
            return `${sectionNumber}.${subsectionNumber}`;
        } else if (level >= 3) {
            // レベル3以上は、レベル2の番号に追加の番号を付与
            return `${sectionNumber}.${subsectionNumber}.${this.getSubSubSectionNumber()}`;
        }
        return '';
    }

    /**
     * サブサブセクション番号を取得（簡易実装）
     */
    getSubSubSectionNumber() {
        if (!this.subSubSectionCounter) {
            this.subSubSectionCounter = 1;
        } else {
            this.subSubSectionCounter++;
        }
        return this.subSubSectionCounter;
    }

    /**
     * 目次を生成（レベル1とレベル2のみ）
     */
    generateTOC(html) {
        const headings = this.extractHeadings(html);
        if (!headings.length) return '';

        const sections = this.groupHeadingsByLevel1(headings);
        return this.buildTOC(sections);
    }

    /**
     * HTMLから見出しを抽出
     */
    extractHeadings(html) {
        const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/g;
        const headings = [];
        let match;

        while ((match = headingRegex.exec(html)) !== null) {
            const level = parseInt(match[1]);
            const id = match[2];
            const text = match[3];

            // レベル1とレベル2のみを対象とする
            if (level === 1 || level === 2) {
                headings.push({ level, id, text });
            }
        }

        return headings;
    }

    /**
     * 見出しをレベル1でグループ化
     */
    groupHeadingsByLevel1(headings) {
        const sections = [];
        let currentSection = null;

        headings.forEach(heading => {
            if (heading.level === 1) {
                // 新しいレベル1セクションを開始
                currentSection = {
                    level1: heading,
                    level2s: []
                };
                sections.push(currentSection);
            } else if (heading.level === 2 && currentSection) {
                // 現在のセクションにレベル2を追加
                currentSection.level2s.push(heading);
            }
        });

        return sections;
    }

    /**
     * TOCのHTMLを構築
     */
    buildTOC(sections) {
        let toc = '<ul class="toc">\n';

        sections.forEach(section => {
            const { level1, level2s } = section;
            
            // レベル1の見出し
            toc += `<li><a href="#${level1.id}">${level1.text}</a>`;
            
            // レベル2の見出しがある場合
            if (level2s.length > 0) {
                toc += '\n<ul>\n';
                level2s.forEach(level2 => {
                    toc += `<li><a href="#${level2.id}">${level2.text}</a></li>\n`;
                });
                toc += '</ul>\n';
            }
            
            toc += '</li>\n';
        });

        toc += '</ul>';
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

    /**
     * インクルード用のHTMLコンテンツを生成（TOCと本文のみ）
     */
    generateIncludeHTML(markdown) {
        const content = this.parse(markdown);
        const toc = this.generateTOC(content);

        return `<div class="container">
        <!-- サイドバー（目次） -->
        <nav class="sidebar">
            <h3>目次</h3>
            ${toc}
        </nav>

        <!-- メインコンテンツ -->
        <main class="main-content">
            ${content}
        </main>
    </div>`;
    }
}

module.exports = MarkdownParser;
