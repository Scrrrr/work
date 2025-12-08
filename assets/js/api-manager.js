// API通信管理機能
class ApiManager {
    constructor() {
        this.baseUrl = this.getApiUrl();
    }

    // APIのベースURLを取得
    getApiUrl() {
        const pageName = window.location.pathname.split('/').pop().replace('install', '').replace('.php', '');
        return 'api/questions.php?app=' + encodeURIComponent(pageName);
    }

    // 正解判定のAJAX関数
    checkAnswer(questionId, userAnswer, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.baseUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(response.isCorrect, response.correctAnswer);
            }
        };
        xhr.send('action=check_answer&question_id=' + encodeURIComponent(questionId) + '&answer=' + encodeURIComponent(userAnswer));
    }

    // 解答のみ取得（Give Upや復元用）
    getAnswer(questionId, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.baseUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(response.success, response.answer || '');
            }
        };
        xhr.send('action=get_answer&question_id=' + encodeURIComponent(questionId));
    }

    // サーバーからユーザー状態を取得
    // 成功時: { success: true, answeredQuestions: [...] }
    // 失敗時: { success: false }
    loadUserStateFromServer() {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.baseUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        resolve({ success: true, answeredQuestions: response.answeredQuestions || [] });
                    } else {
                        resolve({ success: false });
                    }
                }
            };
            xhr.send('action=get_user_state');
        });
    }
}

// グローバルインスタンス
window.apiManager = new ApiManager();
