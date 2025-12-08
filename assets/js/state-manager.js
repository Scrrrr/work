// ユーザー状態管理機能
class StateManager {
    constructor() {
        this.answeredQuestions = new Set();
    }

    // 現在のユーザーIDを取得
    getCurrentUserId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('username') || 'default';
    }

    // 正解済みの問題を復元（localStorageから）
    restoreAnsweredQuestions() {
        const userId = this.getCurrentUserId();
        const storageKey = 'answeredQuestions_' + userId;
        const answeredQuestionsList = JSON.parse(localStorage.getItem(storageKey) || '[]');
        answeredQuestionsList.forEach(questionId => {
            this.answeredQuestions.add(questionId);
            this.restoreQuestionState(questionId);
        });
    }

    // サーバーから取得した状態で問題を復元
    restoreAnsweredQuestionsFromServer(answeredQuestionsList) {
        answeredQuestionsList.forEach(questionId => {
            this.answeredQuestions.add(questionId);
            this.restoreQuestionState(questionId);
        });
    }

    // 個別の問題の状態を復元
    restoreQuestionState(questionId) {
        const input = document.getElementById(questionId + '_input');
        const button = document.querySelector('[data-question-id="' + questionId + '"]');
        const successMessage = document.getElementById(questionId + '_success');
        
        if (input && button) {
            // 正解済みの状態を復元
            input.classList.add('correct');
            input.disabled = true;
            button.disabled = true;
            
            // サーバーから回答を取得して表示
            window.apiManager.getAnswer(questionId, (success, answer) => {
                const resolvedAnswer = success ? answer : '';
                input.value = resolvedAnswer;
                
                // 正解メッセージを表示
                if (successMessage) {
                    successMessage.style.display = 'block';
                }
                
                // スポイラーを解除（リトライ機能付き）
                window.spoilerManager.revealSpoilersWithRetry(questionId, resolvedAnswer);
            });
        }
    }

    // 正解した問題を保存
    saveAnsweredQuestion(questionId) {
        this.answeredQuestions.add(questionId);
        
        // localStorageに保存（ユーザー別）
        const userId = this.getCurrentUserId();
        const storageKey = 'answeredQuestions_' + userId;
        const answeredQuestionsList = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (!answeredQuestionsList.includes(questionId)) {
            answeredQuestionsList.push(questionId);
            localStorage.setItem(storageKey, JSON.stringify(answeredQuestionsList));
        }
    }

    // 問題が回答済みかチェック
    isAnswered(questionId) {
        return this.answeredQuestions.has(questionId);
    }
}

// グローバルインスタンス
window.stateManager = new StateManager();
