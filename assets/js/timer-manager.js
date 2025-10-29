// Give Upタイマー管理機能
class TimerManager {
    constructor() {
        this.giveUpTimers = new Map();
    }

    // 問題ごとのGive Upボタンのタイマーを開始（最初の誤答から3分）
    startGiveUpTimerForQuestion(questionId, answeredQuestions) {
        // 既にタイマーが開始されている場合はスキップ
        if (this.giveUpTimers.has(questionId)) {
            return;
        }
        
        // 既に回答済みの場合はスキップ
        if (answeredQuestions.has(questionId)) {
            return;
        }
        
        // 3分（180秒）後にGive Upボタンを表示
        const timerId = setTimeout(() => {
            const giveUpBtn = document.getElementById(questionId + '_giveup');
            if (giveUpBtn) {
                // まだ回答済みでない場合のみ表示
                if (!answeredQuestions.has(questionId)) {
                    giveUpBtn.style.display = 'inline-block';
                }
            }
            this.giveUpTimers.delete(questionId);
        }, 180000); // 3分 = 180秒 = 180000ミリ秒
      //  }, 10000); // 10秒 = 10000ミリ秒 Debug用
        
        this.giveUpTimers.set(questionId, timerId);
    }

    // タイマーをクリア
    clearTimer(questionId) {
        if (this.giveUpTimers.has(questionId)) {
            clearTimeout(this.giveUpTimers.get(questionId));
            this.giveUpTimers.delete(questionId);
        }
    }

    // Give Upボタンをクリックした時の処理
    showAnswerAndDisable(questionId) {
        const input = document.getElementById(questionId + '_input');
        const button = document.querySelector('[data-question-id="' + questionId + '"].submit-answer-btn');
        const giveUpBtn = document.getElementById(questionId + '_giveup');
        const successMessage = document.getElementById(questionId + '_success');
        
        // 問題データから回答を取得
        const questions = window.questionsData || [];
        const question = questions.find(q => q.id === questionId);
        const answer = question ? question.answer : '';
        
        if (input && button && giveUpBtn) {
            // 回答を表示
            input.value = answer;
            input.classList.add('correct');
            input.disabled = true;
            button.disabled = true;
            giveUpBtn.style.display = 'none';
            
            if (successMessage) {
                successMessage.style.display = 'none'; // Give Upの場合は「正解」メッセージは表示しない
            }
            
            // スポイラーを解除
            window.spoilerManager.revealSpoilersWithRetry(questionId);
        }
    }
}

// グローバルインスタンス
window.timerManager = new TimerManager();
