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
            input.value = correctAnswer || input.value;
            
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
            window.spoilerManager.revealSpoilersWithRetry(questionId, correctAnswer);
            
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