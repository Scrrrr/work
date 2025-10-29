/**
 * 最終版MarkdownParser
 * 既存のUbuntuインストールマニュアルテーマに完全対応
 */
class MarkdownParser {
    constructor(appPrefix = '') {
        // 動的変数は外部で設定される
        this.variables = {};
        // 問題データを保存
        this.questions = [];
        this.questionCounter = 0;
        // アプリケーションのプレフィックス（例: 'ubuntu_' または 'rocky_'）
        this.appPrefix = appPrefix;
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

        // 情報ボックス記法を処理
        processed = processed.replace(
            /:::hint\s*\n([\s\S]*?)\n:::/g,
            '<div class="hint">\n<p><strong>ヒント:</strong></p>\n<p>$1</p>\n</div>'
        );

        processed = processed.replace(
            /:::note\s*\n([\s\S]*?)\n:::/g,
            '<div class="note">\n<p><strong>注記:</strong></p>\n<p>$1</p>\n</div>'
        );

        processed = processed.replace(
            /:::important\s*\n([\s\S]*?)\n:::/g,
            '<div class="important">\n<p><strong>重要:</strong></p>\n<p>$1</p>\n</div>'
        );

        processed = processed.replace(
            /:::warning\s*\n([\s\S]*?)\n:::/g,
            '<div class="warning">\n<p><strong>警告:</strong></p>\n<p>$1</p>\n</div>'
        );

        processed = processed.replace(
            /:::caution\s*\n([\s\S]*?)\n:::/g,
            '<div class="caution">\n<p><strong>注意:</strong></p>\n<p>$1</p>\n</div>'
        );

        // 動的変数の処理
        processed = this.processDynamicVariables(processed);

        // 問題ボックスの処理
        processed = this.processQuestions(processed);

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
     * 問題ボックスの処理
     */
    processQuestions(markdown) {
        let processed = markdown;
        
        // {question:質問文}{answer:回答} のペアを検出（同じ行内）
        const questionAnswerRegex = /\{question:([^}]+)\}\{answer:([^}]+)\}/g;
        
        let match;
        
        // 問題と回答のペアを処理
        while ((match = questionAnswerRegex.exec(markdown)) !== null) {
            const questionText = match[1];
            const answerText = match[2];
            this.questionCounter++;
            const questionId = `${this.appPrefix}question_${this.questionCounter}`;
            
            // 問題データを保存
            this.questions.push({
                id: questionId,
                question: questionText,
                answer: answerText
            });
            
            // 問題ボックスのHTMLを生成
            const questionBox = this.generateQuestionBox(questionId, questionText, answerText);
            
            // 元のテキストを置換
            const fullText = match[0];
            processed = processed.replace(fullText, questionBox);
        }
        
        return processed;
    }

    

    /**
     * 正規表現用の文字列エスケープ
     */
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * 問題ボックスのHTMLを生成
     */
    generateQuestionBox(questionId, questionText, answerText) {
        const answerLength = answerText.length;
        const asteriskHint = '*'.repeat(answerLength);
        
        return `<div class="question-box" id="${questionId}"><div class="question-content"><div class="question-header"><p class="question-text">${questionText}</p><span class="success-message" id="${questionId}_success" style="display: none;">正解</span></div><div class="answer-input-container"><input type="text" id="${questionId}_input" class="answer-input" placeholder="${asteriskHint}" data-question-id="${questionId}"><button type="button" class="submit-answer-btn" data-question-id="${questionId}">回答</button><button type="button" class="giveup-btn" id="${questionId}_giveup" data-question-id="${questionId}" style="display: none;">回答を見る</button></div></div></div>`;
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
        let inTable = false;
        let tableRows = [];
        let tableOptions = { autoLayout: false };
        let inBlockquote = false;
        
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

            // テーブルの処理
            if (this.isTableRow(trimmedLine)) {
                if (!inTable) {
                    // テーブル開始
                    inTable = true;
                    tableRows = [];
                    tableOptions = { autoLayout: false }; // デフォルトオプション
                    // リストが開いている場合は閉じる
                    if (inList) {
                        html += `</${listType}>\n`;
                        inList = false;
                        listType = '';
                    }
                }
                
                // テーブルオプションの検出
                const tableRowData = this.parseTableRow(trimmedLine);
                if (this.detectTableOptions(tableRowData, tableOptions)) {
                    continue; // オプション行はスキップ
                }
                
                tableRows.push(tableRowData);
                continue;
            } else if (inTable) {
                // テーブル終了
                html += this.generateTable(tableRows, tableOptions);
                inTable = false;
                tableRows = [];
                tableOptions = null;
            }

            // 水平線の処理
            if (trimmedLine.match(/^[-*_]{3,}$/)) {
                if (inList) {
                    html += `</${listType}>\n`;
                    inList = false;
                    listType = '';
                }
                if (inBlockquote) {
                    html += '</blockquote>\n';
                    inBlockquote = false;
                }
                html += '<hr>\n';
                continue;
            }

            // 引用ブロックの処理
            if (trimmedLine.startsWith('>')) {
                if (!inBlockquote) {
                    // 引用ブロック開始
                    inBlockquote = true;
                    // リストが開いている場合は閉じる
                    if (inList) {
                        html += `</${listType}>\n`;
                        inList = false;
                        listType = '';
                    }
                    html += '<blockquote>\n';
                }
                const quoteContent = trimmedLine.substring(1).trim();
                html += `<p>${this.processInlineMarkdown(quoteContent)}</p>\n`;
                continue;
            } else if (inBlockquote && trimmedLine === '') {
                // 空行で引用ブロック終了
                html += '</blockquote>\n';
                inBlockquote = false;
                continue;
            } else if (inBlockquote) {
                // 引用ブロック内の非引用行で引用ブロック終了
                html += '</blockquote>\n';
                inBlockquote = false;
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
                
                // インラインマークダウンの処理
                text = this.processInlineMarkdown(text);
                
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
                
                // インラインマークダウンの処理
                text = this.processInlineMarkdown(text);
                
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
            
            // 問題ボックスの開始または終了、または問題ボックス内の行の場合は段落として処理しない
            if (paragraph.includes('<div class="question-box"') || 
                paragraph.includes('</div>') ||
                paragraph.trim().startsWith('<div') ||
                paragraph.trim().startsWith('</div') ||
                paragraph.trim().startsWith('<input') ||
                paragraph.trim().startsWith('<button') ||
                paragraph.trim().startsWith('<span') ||
                paragraph.trim().startsWith('<strong')) {
                html += paragraph + '\n';
                continue;
            }
            
            // インラインマークダウンの処理
            paragraph = this.processInlineMarkdown(paragraph);
            
            html += `<p>${paragraph}</p>\n`;
        }

        // リストが最後まで続いている場合の処理
        if (inList) {
            html += `</${listType}>\n`;
        }

        // テーブルが最後まで続いている場合の処理
        if (inTable) {
            html += this.generateTable(tableRows, tableOptions);
        }

        // 引用ブロックが最後まで続いている場合の処理
        if (inBlockquote) {
            html += '</blockquote>\n';
        }

        return html;
    }

    /**
     * インラインマークダウンを処理
     */
    processInlineMarkdown(text) {
        // 画像の処理 [alt](url "title")
        text = text.replace(/!\[([^\]]*)\]\(([^)]+)(?:\s+"([^"]*)")?\)/g, (match, alt, url, title) => {
            const titleAttr = title ? ` title="${title}"` : '';
            return `<img src="${url}" alt="${alt}"${titleAttr}>`;
        });

        // リンクの処理 [text](url "title")
        text = text.replace(/\[([^\]]+)\]\(([^)]+)(?:\s+"([^"]*)")?\)/g, (match, linkText, url, title) => {
            const titleAttr = title ? ` title="${title}"` : '';
            return `<a href="${url}"${titleAttr}>${linkText}</a>`;
        });

        // 自動リンクの処理 <url>
        text = text.replace(/<([^>]+)>/g, (match, url) => {
            if (url.match(/^https?:\/\//)) {
                return `<a href="${url}">${url}</a>`;
            }
            return match;
        });

        // インラインコードの処理
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // 強調の処理
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        return text;
    }

    /**
     * テーブル行かどうかを判定
     */
    isTableRow(line) {
        return line.includes('|') && !line.match(/^[-|:\s]+$/);
    }

    /**
     * テーブル行を解析
     */
    parseTableRow(line) {
        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
        return cells.map(cell => this.processInlineMarkdown(cell));
    }

    /**
     * テーブルオプションを検出
     */
    detectTableOptions(rowData, tableOptions) {
        if (rowData.length === 1 && rowData[0].toLowerCase().includes('auto')) {
            // "auto" オプションを検出
            if (rowData[0].toLowerCase().includes('auto')) {
                tableOptions.autoLayout = true;
                return true;
            }
        }
        return false;
    }

    /**
     * テーブルHTMLを生成
     */
    generateTable(rows, options = {}) {
        if (rows.length === 0) return '';

        // テーブルレイアウトのオプション
        const autoLayout = options.autoLayout || false;
        const tableClass = autoLayout ? 'table-auto' : 'table-fixed';
        
        let html = `<table class="${tableClass}">\n`;
        
        // ヘッダー行
        if (rows.length > 0) {
            html += '<thead>\n<tr>\n';
            rows[0].forEach(cell => {
                html += `<th>${cell}</th>\n`;
            });
            html += '</tr>\n</thead>\n';
        }

        // ボディ行
        if (rows.length > 1) {
            html += '<tbody>\n';
            for (let i = 1; i < rows.length; i++) {
                html += '<tr>\n';
                rows[i].forEach(cell => {
                    html += `<td>${cell}</td>\n`;
                });
                html += '</tr>\n';
            }
            html += '</tbody>\n';
        }

        html += '</table>\n';
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
                     .replace(/\+\[\[(.*?)\]\]/g, '<span class="git-add">$1</span>')
                     .replace(/\-\[\[(.*?)\]\]/g, '<span class="git-remove">$1</span>');
                
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

        // 情報ボックスの重複<p>タグを修正
        html = html.replace(
            /<p><div class="hint"><\/p>\s*<p><p><strong>ヒント:<\/strong><\/p><\/p>\s*<p><p>([\s\S]*?)<\/p><\/p>\s*<p><\/div><\/p>/g,
            '<div class="hint">\n<p><strong>ヒント:</strong></p>\n<p>$1</p>\n</div>'
        );

        html = html.replace(
            /<p><div class="note"><\/p>\s*<p><p><strong>注記:<\/strong><\/p><\/p>\s*<p><p>([\s\S]*?)<\/p><\/p>\s*<p><\/div><\/p>/g,
            '<div class="note">\n<p><strong>注記:</strong></p>\n<p>$1</p>\n</div>'
        );

        html = html.replace(
            /<p><div class="important"><\/p>\s*<p><p><strong>重要:<\/strong><\/p><\/p>\s*<p><p>([\s\S]*?)<\/p><\/p>\s*<p><\/div><\/p>/g,
            '<div class="important">\n<p><strong>重要:</strong></p>\n<p>$1</p>\n</div>'
        );

        html = html.replace(
            /<p><div class="warning"><\/p>\s*<p><p><strong>警告:<\/strong><\/p><\/p>\s*<p><p>([\s\S]*?)<\/p><\/p>\s*<p><\/div><\/p>/g,
            '<div class="warning">\n<p><strong>警告:</strong></p>\n<p>$1</p>\n</div>'
        );

        html = html.replace(
            /<p><div class="caution"><\/p>\s*<p><p><strong>注意:<\/strong><\/p><\/p>\s*<p><p>([\s\S]*?)<\/p><\/p>\s*<p><\/div><\/p>/g,
            '<div class="caution">\n<p><strong>注意:</strong></p>\n<p>$1</p>\n</div>'
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
     * インクルード用のHTMLコンテンツを生成（TOCと本文のみ）
     */
    generateIncludeHTML(markdown) {
        const content = this.parse(markdown);
        const toc = this.generateTOC(content);

        // スポイラー処理は動的生成で実行されるため、ここではそのまま使用
        const spoilerProcessedContent = content;

        // PHP用の問題データを生成
        const questionsPHP = this.generateQuestionsPHP();

        return `<?php
// 問題データ
${questionsPHP}
?>

    <!-- ハンバーガーメニュー -->
    <button id="hamburger" class="hamburger" aria-label="メニューを開く">
        <span></span>
        <span></span>
        <span></span>
    </button>

    <!-- オーバーレイ -->
    <div id="sidebarOverlay" class="sidebar-overlay"></div>

    <div class="container">
        <!-- サイドバー（目次） -->
        <nav class="sidebar">
            <h3>目次</h3>
            ${toc}
        </nav>

        <!-- メインコンテンツ -->
        <main class="main-content">
                ${spoilerProcessedContent}
        </main>
    </div>

        <script>
            // 問題データをグローバル変数に設定
            window.questionsData = ${JSON.stringify(this.questions)};
        </script>
        <script src="assets/js/questions.js"></script>
        `;
    }

    /**
     * PHP用の問題データ配列を生成
     */
    generateQuestionsPHP() {
        if (this.questions.length === 0) {
            return '$questions = array();';
        }
        
        let phpCode = '$questions = array(\n';
        this.questions.forEach((q, index) => {
            phpCode += `    '${q.id}' => '${q.answer}'`;
            if (index < this.questions.length - 1) {
                phpCode += ',';
            }
            phpCode += '\n';
        });
        phpCode += ');';
        
        return phpCode;
    }
}

module.exports = MarkdownParser;
