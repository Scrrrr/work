// スポイラー管理機能
class SpoilerManager {
    constructor() {
        // Prism.js処理時のプレースホルダー管理
        this.elementPlaceholders = new WeakMap();
        this.initializePrism();
    }

    // Prism.jsの初期化（スポイラー要素の保護）
    initializePrism() {
        if (window.Prism) {
            // シェルプロンプト用のカスタムハイライト
            Prism.hooks.add('before-highlight', (env) => {
                // env.element の innerHTML からスポイラー要素を検出して保護
                if (env.element && env.element.innerHTML) {
                    const spoilerRegex = /<span class="spoiler processed" data-question-id="([^"]+)">([^<]+)<\/span>/g;
                    let match;
                    const spoilers = [];
                    const spoilerPlaceholders = new Map();
                    let placeholderCounter = 0;
                    
                    // すべてのスポイラー要素を検出
                    let htmlContent = env.element.innerHTML;
                    while ((match = spoilerRegex.exec(htmlContent)) !== null) {
                        spoilers.push({
                            fullMatch: match[0],
                            questionId: match[1],
                            mask: match[2],
                            index: match.index
                        });
                    }
                    
                    // 後ろから前に処理（インデックスを維持するため）
                    spoilers.reverse().forEach(spoiler => {
                        const placeholder = `__SPOILER_PLACEHOLDER_${Date.now()}_${placeholderCounter}__`;
                        spoilerPlaceholders.set(placeholder, {
                            html: spoiler.fullMatch,
                            questionId: spoiler.questionId,
                            mask: spoiler.mask
                        });
                        placeholderCounter++;
                        
                        // HTMLを更新
                        htmlContent = 
                            htmlContent.substring(0, spoiler.index) +
                            placeholder +
                            htmlContent.substring(spoiler.index + spoiler.fullMatch.length);
                    });
                    
                    // 更新されたHTMLを設定
                    env.element.innerHTML = htmlContent;
                    
                    // この要素のプレースホルダーを保存
                    if (spoilerPlaceholders.size > 0) {
                        this.elementPlaceholders.set(env.element, spoilerPlaceholders);
                    }
                    
                    // 保護されたHTMLからenv.codeを更新
                    env.code = env.element.textContent || env.element.innerText || env.code;
                }

                // シェルプロンプトを一時的にプレースホルダーに置換し、コメントと誤判定されないようにする
                if (env.language === 'bash') {
                    env.code = env.code.replace(
                        /^(\s*)([^#\s]+@[^#\s]+[:\~][^#]*)#(\s*)/gm,
                        '$1$2__PROMPT_SYMBOL__$3'
                    );
                }
            });
            
            Prism.hooks.add('after-highlight', (env) => {
                // この要素のプレースホルダーを取得
                const spoilerPlaceholders = this.elementPlaceholders.get(env.element);
                if (spoilerPlaceholders) {
                    // プレースホルダーを元のスポイラー要素に戻す
                    spoilerPlaceholders.forEach((spoilerData, placeholder) => {
                        const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        env.element.innerHTML = env.element.innerHTML.replace(
                            new RegExp(escapedPlaceholder, 'g'),
                            spoilerData.html
                        );
                    });
                    this.elementPlaceholders.delete(env.element);
                }

                // シェルプロンプトを復元して装飾
                if (env.language === 'bash') {
                    // # を元に戻す（追加のタグは付けない）
                    env.element.innerHTML = env.element.innerHTML.replace(
                        /__PROMPT_SYMBOL__/g,
                        '#'
                    );
                }
            });
            
            Prism.highlightAll();
        } else {
            setTimeout(() => this.initializePrism(), 100);
        }
    }

    // スポイラー解除（リトライ機能付き、Prism.js処理後も対応）
    revealSpoilersWithRetry(questionId, providedAnswer = '', retryCount = 0) {
        let answer = providedAnswer || '';
        if (!answer) {
            const questions = window.questionsData || [];
            const question = questions.find(q => q.id === questionId);
            answer = question ? (question.answer || '') : '';
        }
        
        if (!answer) {
            return;
        }
        
        const answerLength = answer.length;
        
        // 通常のスポイラー要素を検索
        const selector = '.spoiler[data-question-id="' + questionId + '"]';
        const spoilers = document.querySelectorAll(selector);
        
        let found = false;
        if (spoilers.length > 0) {
            found = true;
            spoilers.forEach(spoiler => {
                spoiler.textContent = answer;
                spoiler.classList.add('revealed');
            });
        }
        
        // Prism.js処理後のコードブロック内のマスク文字列も検索して復元
        const codeBlocks = document.querySelectorAll('code.language-bash, code[class*="language-"]');
        codeBlocks.forEach(codeBlock => {
            // テキストノードを走査してマスク文字列を検索
            const walker = document.createTreeWalker(
                codeBlock,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        // スポイラー要素内のテキストは除外
                        let parent = node.parentElement;
                        while (parent && parent !== codeBlock) {
                            if (parent.classList && parent.classList.contains('spoiler')) {
                                return NodeFilter.FILTER_REJECT;
                            }
                            parent = parent.parentElement;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                },
                false
            );
            
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.includes('*'.repeat(answerLength))) {
                    textNodes.push(node);
                }
            }
            
            textNodes.forEach(textNode => {
                const text = textNode.textContent;
                const maskPattern = new RegExp(`(\\*{${answerLength}})`, 'g');
                
                if (maskPattern.test(text)) {
                    // マスク文字列をスポイラー要素に置換
                    const parts = text.split(maskPattern);
                    if (parts.length > 1) {
                        const fragment = document.createDocumentFragment();
                        
                        parts.forEach((part, index) => {
                            if (part === '*'.repeat(answerLength)) {
                                // マスク文字列をスポイラー要素に変換
                                const spoilerSpan = document.createElement('span');
                                spoilerSpan.className = 'spoiler processed revealed';
                                spoilerSpan.setAttribute('data-question-id', questionId);
                                spoilerSpan.textContent = answer;
                                fragment.appendChild(spoilerSpan);
                            } else if (part) {
                                fragment.appendChild(document.createTextNode(part));
                            }
                        });
                        
                        textNode.parentNode.replaceChild(fragment, textNode);
                        found = true;
                    }
                }
            });
        });
        
        if (found) {
            return; // 見つかった場合は終了
        }
        
        // 見つからない場合、リトライ
        if (retryCount < 10) {
            setTimeout(() => {
                this.revealSpoilersWithRetry(questionId, providedAnswer, retryCount + 1);
            }, 50); // リトライ間隔を少し長くする
        }
    }
}

// グローバルインスタンス
window.spoilerManager = new SpoilerManager();

// DOM読み込み後にPrism.jsを初期化
document.addEventListener('DOMContentLoaded', function() {
    if (window.Prism && !window.spoilerManager.prismInitialized) {
        window.spoilerManager.initializePrism();
        window.spoilerManager.prismInitialized = true;
    }
});
