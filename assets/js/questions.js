// 問題機能のメインJavaScript（短縮版）
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
    
    // Give Upボタンのイベントリスナー
    document.querySelectorAll('.giveup-btn').forEach(button => {
        button.addEventListener('click', function() {
            const questionId = this.getAttribute('data-question-id');
            window.timerManager.showAnswerAndDisable(questionId);
        });
    });
    
    // ヒントアイコンのイベントリスナー
    document.querySelectorAll('.hint-icon').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const questionId = this.getAttribute('data-question-id');
            const popup = document.getElementById(questionId + '_hint_popup');
            
            if (popup) {
                // 他のポップアップを閉じる
                document.querySelectorAll('.hint-popup').forEach(p => {
                    if (p !== popup) {
                        p.style.display = 'none';
                    }
                });
                
                // 現在のポップアップを表示/非表示を切り替え
                if (popup.style.display === 'none' || popup.style.display === '') {
                    // ヒントアイコンの位置を取得してポップアップの位置を調整
                    const iconRect = this.getBoundingClientRect();
                    const questionHeader = popup.closest('.question-header') || popup.parentElement;
                    
                    if (questionHeader) {
                        const headerRect = questionHeader.getBoundingClientRect();
                        
                        // ポップアップを一時的に表示してサイズを取得
                        popup.style.display = 'block';
                        const popupRect = popup.getBoundingClientRect();
                        const popupWidth = popupRect.width;
                        
                        // ヒントアイコンの位置を基準に左位置を計算（question-headerからの相対位置）
                        let leftOffset = iconRect.left - headerRect.left;
                        
                        // 画面右端からはみ出すかどうかを判定
                        const windowWidth = window.innerWidth;
                        const iconRight = iconRect.right;
                        const spaceRight = windowWidth - iconRight;
                        const margin = 20; // 画面端からのマージン
                        
                        // 右側に十分なスペースがない場合、位置を調整
                        if (spaceRight < popupWidth + margin) {
                            // ポップアップの右端を画面右端に合わせる（マージンを考慮）
                            const popupRight = windowWidth - margin; // 絶対座標：ポップアップの右端
                            const popupLeftAbsolute = popupRight - popupWidth; // 絶対座標：ポップアップの左端
                            const headerLeft = headerRect.left; // 絶対座標：question-headerの左端
                            leftOffset = popupLeftAbsolute - headerLeft; // question-header内での相対位置
                            // 左端からはみ出さないようにする
                            leftOffset = Math.max(0, leftOffset);
                        } else {
                            // 通常通り右側に表示（アイコンの位置を基準に）
                            leftOffset = Math.max(0, leftOffset - 10);
                        }
                        
                        popup.style.left = leftOffset + 'px';
                    } else {
                        // question-headerが見つからない場合は単純に表示
                        popup.style.display = 'block';
                    }
                } else {
                    popup.style.display = 'none';
                }
            }
        });
    });
    
    // ドキュメント全体のクリックでポップアップを閉じる
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.hint-icon') && !e.target.closest('.hint-popup')) {
            document.querySelectorAll('.hint-popup').forEach(popup => {
                popup.style.display = 'none';
            });
        }
    });
    
    // ページ読み込み時に正解済みの問題を復元してからスポイラーを生成
    window.apiManager.loadUserStateFromServer().then((result) => {
        if (result && result.success) {
            // サーバー応答が成功: サーバーの結果のみを採用（空配列でもそのまま）
            window.stateManager.restoreAnsweredQuestionsFromServer(result.answeredQuestions);
            // localStorageもサーバーの状態に同期
            const userId = window.stateManager.getCurrentUserId();
            const storageKey = 'answeredQuestions_' + userId;
            localStorage.setItem(storageKey, JSON.stringify(result.answeredQuestions));
        } else {
            // サーバー取得に失敗した場合のみlocalStorageから復元
            window.stateManager.restoreAnsweredQuestions();
        }

        // 正解済み問題の復元後にスポイラーを動的に生成
        setTimeout(() => {
            window.spoilerManager.generateSpoilersAfterLoad();
        }, 5);
    });
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
    window.apiManager.checkAnswer(questionId, userAnswer, function(isCorrect, correctAnswer) {
        if (isCorrect) {
            // 正解の場合 - 緑色の背景とメッセージ表示
            input.classList.remove('incorrect');
            input.classList.add('correct');
            input.disabled = true;
            button.disabled = true;
            
            // Give Upボタンを非表示にする（既に表示されていた場合）
            const giveUpBtn = document.getElementById(questionId + '_giveup');
            if (giveUpBtn) {
                giveUpBtn.style.display = 'none';
            }
            
            // タイマーをクリア
            window.timerManager.clearTimer(questionId);
            
            // 正解メッセージを表示
            const successMessage = document.getElementById(questionId + '_success');
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            
            // スポイラーを解除
            window.spoilerManager.revealSpoilersWithRetry(questionId);
            
            // 正解した問題を保存
            window.stateManager.saveAnsweredQuestion(questionId);
        } else {
            // 不正解の場合 - 赤色の背景
            input.classList.remove('correct');
            input.classList.add('incorrect');
            
            // 最初の誤答から3分後にGive Upボタンを表示
            window.timerManager.startGiveUpTimerForQuestion(questionId, window.stateManager.answeredQuestions);
            
            // 少し遅延してから背景色をリセット（再入力可能にする）
            setTimeout(() => {
                input.classList.remove('incorrect');
                input.focus();
            }, 1000);
        }
    });
}