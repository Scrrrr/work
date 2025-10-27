// 問題機能のJavaScript
// 正解済みの問題を追跡するグローバル変数
let answeredQuestions = new Set();

document.addEventListener('DOMContentLoaded', function() {
    // 回答入力欄のイベントリスナー
    document.querySelectorAll('.answer-input').forEach(input => {
        const questionId = input.getAttribute('data-question-id');
        
        // Enterキーでの回答
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkAnswerAndUpdateUI(questionId);
            }
        });
        
        // 入力時の背景色リセット
        input.addEventListener('input', function() {
            if (this.classList.contains('correct') || this.classList.contains('incorrect')) {
                this.classList.remove('correct', 'incorrect');
            }
        });
    });
    
    // 回答ボタンのイベントリスナー
    document.querySelectorAll('.submit-answer-btn').forEach(button => {
        button.addEventListener('click', function() {
            const questionId = this.getAttribute('data-question-id');
            checkAnswerAndUpdateUI(questionId);
        });
    });
    
    // ページ読み込み時に正解済みの問題を復元してからスポイラーを生成
    loadUserStateFromServer().then(() => {
        // 正解済み問題の復元後にスポイラーを動的に生成（遅延を短く）
        setTimeout(() => {
            generateSpoilersAfterLoad();
        }, 5);
    });
    
    // ページ読み込み後にスポイラーを動的に生成する関数
    function generateSpoilersAfterLoad() {
        // 問題データを取得（グローバル変数から）
        const questions = window.questionsData || [];
        
        questions.forEach(question => {
            const answer = question.answer;
            const questionId = question.id;
            
            // 正解済みの問題はスキップ
            if (answeredQuestions.has(questionId)) {
                return;
            }
            
            // ページ内の回答文字列を検索してスポイラー化（コードブロック内も含む）
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        // テキストノードで、空でないものを対象とする
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
                    let parent = textNode.parentElement;
                    let isInQuestionBox = false;
                    let isInInputField = false;
                    while (parent) {
                        if (parent.classList) {
                            if (parent.classList.contains('question-box') || 
                                parent.classList.contains('answer-input') ||
                                parent.classList.contains('spoiler')) {
                                isInQuestionBox = true;
                                break;
                            }
                            // 入力欄内かチェック
                            if (parent.tagName === 'INPUT') {
                                isInInputField = true;
                                break;
                            }
                        }
                        parent = parent.parentElement;
                    }
                    
                    if (!isInQuestionBox && !isInInputField) {
                        // 単語境界を考慮した置換
                        const parts = text.split(new RegExp('(' + answer + ')', 'gi'));
                        if (parts.length > 1) {
                            const fragment = document.createDocumentFragment();
                            parts.forEach((part, index) => {
                                if (part.toLowerCase() === lowerAnswer) {
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
                }
            });
        });
    }
});

// 正解判定とUI更新を行う関数
function checkAnswerAndUpdateUI(questionId) {
    const input = document.getElementById(questionId + '_input');
    const button = document.querySelector('[data-question-id="' + questionId + '"]');
    const userAnswer = input.value.trim();
    
    if (userAnswer === '') {
        return; // 空の場合は何もしない
    }
    
    // PHPにAJAXリクエストを送信して正解判定
    checkAnswer(questionId, userAnswer, function(isCorrect, correctAnswer) {
        if (isCorrect) {
            // 正解の場合 - 緑色の背景とメッセージ表示
            input.classList.remove('incorrect');
            input.classList.add('correct');
            input.disabled = true;
            button.disabled = true;
            
            // 正解メッセージを表示
            const successMessage = document.getElementById(questionId + '_success');
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            
            // スポイラーを解除（遅延実行とDOM監視）
            revealSpoilersWithRetry(questionId);
            
            // 正解した問題IDをlocalStorageに保存（ユーザー別）
            const userId = getCurrentUserId();
            const storageKey = 'answeredQuestions_' + userId;
            const answeredQuestionsList = JSON.parse(localStorage.getItem(storageKey) || '[]');
            if (!answeredQuestionsList.includes(questionId)) {
                answeredQuestionsList.push(questionId);
                localStorage.setItem(storageKey, JSON.stringify(answeredQuestionsList));
            }
            
            // 正解済み問題セットに追加
            answeredQuestions.add(questionId);
        } else {
            // 不正解の場合 - 赤色の背景
            input.classList.remove('correct');
            input.classList.add('incorrect');
            
            // 少し遅延してから背景色をリセット（再入力可能にする）
            setTimeout(() => {
                input.classList.remove('incorrect');
                input.focus();
            }, 1000);
        }
    });
}

// 正解判定のAJAX関数
function checkAnswer(questionId, userAnswer, callback) {
    const xhr = new XMLHttpRequest();
    // 現在のページ名からアプリ名を取得
    const pageName = window.location.pathname.split('/').pop().replace('install', '').replace('.php', '');
    const apiUrl = 'api/questions.php?app=' + encodeURIComponent(pageName);
    xhr.open('POST', apiUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            callback(response.isCorrect, response.correctAnswer);
        }
    };
    xhr.send('action=check_answer&question_id=' + encodeURIComponent(questionId) + '&answer=' + encodeURIComponent(userAnswer));
}

// 正解済みの問題を復元
function restoreAnsweredQuestions() {
    const userId = getCurrentUserId();
    const storageKey = 'answeredQuestions_' + userId;
    const answeredQuestionsList = JSON.parse(localStorage.getItem(storageKey) || '[]');
    answeredQuestionsList.forEach(questionId => {
        // 正解済み問題セットに追加
        answeredQuestions.add(questionId);
        
        const input = document.getElementById(questionId + '_input');
        const button = document.querySelector('[data-question-id="' + questionId + '"]');
        const successMessage = document.getElementById(questionId + '_success');
        
        if (input && button) {
            // 正解済みの状態を復元
            input.classList.add('correct');
            input.disabled = true;
            button.disabled = true;
            
            // 回答を表示（問題データから取得）
            const questions = window.questionsData || [];
            const question = questions.find(q => q.id === questionId);
            if (question) {
                input.value = question.answer;
            }
            
            // 正解メッセージを表示
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            
            // スポイラーを解除（リトライ機能付き）
            revealSpoilersWithRetry(questionId);
        }
    });
}

// 現在のユーザーIDを取得
function getCurrentUserId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('username') || 'default';
}

// サーバーからユーザー状態を取得
function loadUserStateFromServer() {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        // 現在のページ名からアプリ名を取得
        const pageName = window.location.pathname.split('/').pop().replace('install', '').replace('.php', '');
        const apiUrl = 'api/questions.php?app=' + encodeURIComponent(pageName);
        xhr.open('POST', apiUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                restoreAnsweredQuestionsFromServer(response.answeredQuestions);
                resolve();
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                // サーバーからの取得に失敗した場合はlocalStorageから復元
                restoreAnsweredQuestions();
                resolve();
            }
        };
        xhr.send('action=get_user_state');
    });
}

// サーバーから取得した状態で問題を復元
function restoreAnsweredQuestionsFromServer(answeredQuestionsList) {
    answeredQuestionsList.forEach(questionId => {
        // 正解済み問題セットに追加
        answeredQuestions.add(questionId);
        
        const input = document.getElementById(questionId + '_input');
        const button = document.querySelector('[data-question-id="' + questionId + '"]');
        const successMessage = document.getElementById(questionId + '_success');
        
        if (input && button) {
            // 正解済みの状態を復元
            input.classList.add('correct');
            input.disabled = true;
            button.disabled = true;
            
            // 回答を表示（問題データから取得）
            const questions = window.questionsData || [];
            const question = questions.find(q => q.id === questionId);
            if (question) {
                input.value = question.answer;
            }
            
            // 正解メッセージを表示
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            
            // スポイラーを解除（リトライ機能付き）
            revealSpoilersWithRetry(questionId);
        }
    });
}

// スポイラー解除関数（リトライ機能付き）
function revealSpoilersWithRetry(questionId, retryCount = 0) {
    const selector = '.spoiler[data-question-id="' + questionId + '"]';
    const spoilers = document.querySelectorAll(selector);
    
    if (spoilers.length > 0) {
        // スポイラーが見つかった場合
        // 問題データから回答を取得
        const questions = window.questionsData || [];
        const question = questions.find(q => q.id === questionId);
        const answer = question ? question.answer : '';
        
        spoilers.forEach(spoiler => {
            spoiler.textContent = answer;
            spoiler.classList.add('revealed');
        });
    } else if (retryCount < 10) {
        // スポイラーが見つからない場合、リトライ（間隔を短く）
        setTimeout(() => {
            revealSpoilersWithRetry(questionId, retryCount + 1);
        }, 5);
    }
}
