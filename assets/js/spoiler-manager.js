// スポイラー管理機能
class SpoilerManager {
    constructor() {
        this.processedSpoilers = new Set();
    }

    // ページ読み込み後にスポイラーを動的に生成
    generateSpoilersAfterLoad() {
        const questions = window.questionsData || [];
        
        questions.forEach(question => {
            const answer = question.answer;
            const questionId = question.id;
            
            // 既に処理済みの場合はスキップ
            if (this.processedSpoilers.has(questionId)) {
                return;
            }
            
            this.createSpoilersForQuestion(questionId, answer);
            this.processedSpoilers.add(questionId);
        });
    }

    // 特定の問題のスポイラーを作成
    createSpoilersForQuestion(questionId, answer) {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.textContent.trim() === '') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        textNodes.forEach(textNode => {
            this.processTextNode(textNode, answer, questionId);
        });
    }

    // テキストノードを処理してスポイラー化
    processTextNode(textNode, answer, questionId) {
        const text = textNode.textContent;
        
        // 既にスポイラー要素内のテキストはスキップ
        if (textNode.parentElement && textNode.parentElement.classList.contains('spoiler')) {
            return;
        }
        
        // 単純な文字列検索（大文字小文字を区別しない）
        const lowerText = text.toLowerCase();
        const lowerAnswer = answer.toLowerCase();
        
        if (lowerText.includes(lowerAnswer)) {
            // 親要素が問題ボックス内や既に処理済みでないことを確認
            if (this.isInExcludedArea(textNode)) {
                return;
            }
            
            this.replaceTextWithSpoiler(textNode, text, answer, questionId);
        }
    }

    // 除外エリア内かチェック
    isInExcludedArea(textNode) {
        let parent = textNode.parentElement;
        while (parent) {
            if (parent.classList) {
                if (parent.classList.contains('question-box') || 
                    parent.classList.contains('answer-input') ||
                    parent.classList.contains('spoiler')) {
                    return true;
                }
                // 入力欄内かチェック
                if (parent.tagName === 'INPUT') {
                    return true;
                }
            }
            parent = parent.parentElement;
        }
        return false;
    }

    // テキストをスポイラーに置換
    replaceTextWithSpoiler(textNode, text, answer, questionId) {
        const parts = text.split(new RegExp('(' + answer + ')', 'gi'));
        if (parts.length > 1) {
            const fragment = document.createDocumentFragment();
            parts.forEach((part, index) => {
                if (part.toLowerCase() === answer.toLowerCase()) {
                    const span = document.createElement('span');
                    span.className = 'spoiler processed';
                    span.setAttribute('data-question-id', questionId);
                    span.textContent = '*'.repeat(part.length);
                    fragment.appendChild(span);
                } else if (part) {
                    fragment.appendChild(document.createTextNode(part));
                }
            });
            textNode.parentNode.replaceChild(fragment, textNode);
        }
    }

    // スポイラー解除（リトライ機能付き）
    revealSpoilersWithRetry(questionId, retryCount = 0) {
        const selector = '.spoiler[data-question-id="' + questionId + '"]';
        const spoilers = document.querySelectorAll(selector);
        
        if (spoilers.length > 0) {
            // スポイラーが見つかった場合
            const questions = window.questionsData || [];
            const question = questions.find(q => q.id === questionId);
            const answer = question ? question.answer : '';
            
            spoilers.forEach(spoiler => {
                spoiler.textContent = answer;
                spoiler.classList.add('revealed');
            });
        } else if (retryCount < 10) {
            // スポイラーが見つからない場合、リトライ
            setTimeout(() => {
                this.revealSpoilersWithRetry(questionId, retryCount + 1);
            }, 5);
        }
    }
}

// グローバルインスタンス
window.spoilerManager = new SpoilerManager();
