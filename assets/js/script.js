// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    // PAGE TOPボタンの要素を取得
    const pageTopButton = document.getElementById('pageTop');
    
    // 目次のリンク要素を取得
    const tocLinks = document.querySelectorAll('.toc a');
    
    // 見出し要素を取得（メインコンテンツのみ）
    const headings = document.querySelectorAll('.main-content h1, .main-content h2, .main-content h3, .main-content h4');
    
    // ハンバーガーメニューとサイドバーの要素を取得
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    // PAGE TOPボタンの表示/非表示制御
    function togglePageTopButton() {
        if (window.scrollY > 300) {
            pageTopButton.classList.add('show');
        } else {
            pageTopButton.classList.remove('show');
        }
    }
    
    // PAGE TOPボタンのクリックイベント
    pageTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 目次のリンククリックイベント
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 目次リンクのアクティブハイライト機能は無効化
    
    // スクロールイベントリスナー
    function handleScroll() {
        togglePageTopButton();
    }
    
    // スクロールイベントを追加（パフォーマンスを考慮して簡易debounce）
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 10);
    });
    
    // 初期状態の設定
    togglePageTopButton();
    
    // ページ読み込み時のスムーズスクロール対応
    if (window.location.hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    }

    // ハンバーガーメニューの開閉機能
    function toggleSidebar() {
        if (hamburger && sidebar && sidebarOverlay) {
            const isOpen = sidebar.classList.contains('open');
            
            if (isOpen) {
                // サイドバーを閉じる
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('open');
                hamburger.classList.remove('active');
            } else {
                // サイドバーを開く
                sidebar.classList.add('open');
                sidebarOverlay.classList.add('open');
                hamburger.classList.add('active');
            }
        }
    }

    // ハンバーガーメニューのクリックイベント
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSidebar();
        });
    }

    // オーバーレイのクリックイベント（サイドバーを閉じる）
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            toggleSidebar();
        });
    }

    // 目次リンククリック時にサイドバーを閉じる（モバイル時）
    tocLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('open')) {
                toggleSidebar();
            }
        });
    });
    
    // キーボードナビゲーション対応
    document.addEventListener('keydown', function(e) {
        // Ctrl + Home でページトップ
        if (e.ctrlKey && e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Ctrl + End でページボトム
        if (e.ctrlKey && e.key === 'End') {
            e.preventDefault();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    });
    
    // 見出しのアンカーリンク機能（クリックでURLにハッシュを追加）
    headings.forEach(heading => {
        heading.style.cursor = 'pointer';
        heading.addEventListener('click', function() {
            if (!this.id) return;
            const url = new URL(window.location);
            url.hash = this.id;
            window.history.pushState(null, '', url);
        });
    });

    // 見出しにチェックボックスを追加（h1と目次は除外）
    function addCheckboxesToHeadings() {
        headings.forEach(heading => {
            // h1は除外
            if (heading.tagName.toLowerCase() === 'h1') return;
            
            // 目次の見出しは除外
            if (heading.textContent.trim() === '目次') return;
            
            // 既にチェックボックスが存在する場合はスキップ
            if (heading.querySelector('.chkbo')) return;
            
            // チェックボックスを作成
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'chkbo';
            checkbox.id = `checkbox-${heading.id}`;
            
            // 見出しにチェックボックスを追加
            heading.appendChild(checkbox);
            
            // チェックボックスの状態をローカルストレージに保存
            const storageKey = `heading-checked-${heading.id}`;
            const isChecked = localStorage.getItem(storageKey) === 'true';
            checkbox.checked = isChecked;
            
            // チェックボックスの変更イベント
            checkbox.addEventListener('change', function() {
                localStorage.setItem(storageKey, this.checked);
            });
        });
    }

    // チェックボックスを追加
    addCheckboxesToHeadings();

    // Prism.jsの初期化
    function initializePrism() {
        if (window.Prism) {
            // シェルプロンプト用のカスタムハイライト
            Prism.hooks.add('before-highlight', function(env) {
                if (env.language === 'bash') {
                    // シェルプロンプトを一時的に置換して、コメントとして認識されないようにする
                    env.code = env.code.replace(
                        /^(\s*)([^#\s]+@[^#\s]+[:\~][^#]*)#(\s*)/gm,
                        '$1$2__PROMPT_SYMBOL__$3'
                    );
                }
            });
            
            Prism.hooks.add('after-highlight', function(env) {
                if (env.language === 'bash') {
                    // プロンプト記号を元に戻してスタイルを適用
                    env.element.innerHTML = env.element.innerHTML.replace(
                        /__PROMPT_SYMBOL__/g,
                        '<span class="token prompt-symbol">#</span>'
                    );
                    
                    // シェルプロンプト全体にスタイルを適用
                    env.element.innerHTML = env.element.innerHTML.replace(
                        /(\s*)([^#\s]+@[^#\s]+[:\~][^#]*<span class="token prompt-symbol">#<\/span>)\s*/g,
                        '$1<span class="token prompt">$2</span> '
                    );
                }
            });
            
            Prism.highlightAll();
        } else {
            setTimeout(initializePrism, 100);
        }
    }

    initializePrism();
});