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

    // サーバーからユーザー状態を取得
    loadUserStateFromServer() {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.baseUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response.answeredQuestions);
                } else if (xhr.readyState === 4 && xhr.status !== 200) {
                    // サーバーからの取得に失敗した場合は空配列を返す
                    resolve([]);
                }
            };
            xhr.send('action=get_user_state');
        });
    }
}

// グローバルインスタンス
window.apiManager = new ApiManager();
