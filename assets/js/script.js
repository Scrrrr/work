// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    // PAGE TOPボタンの要素を取得
    const pageTopButton = document.getElementById('pageTop');
    
    // 目次のリンク要素を取得
    const tocLinks = document.querySelectorAll('.toc a');
    
    // 見出し要素を取得
    const headings = document.querySelectorAll('h1, h2, h3, h4');
    
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
    
    // 現在の見出しに基づいて目次のアクティブ状態を更新
    function updateActiveTocLink() {
        let currentHeading = null;
        
        // 現在表示されている見出しを特定
        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentHeading = heading;
            }
        });
        
        // 目次のアクティブ状態をリセット
        tocLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // 現在の見出しに対応する目次リンクをアクティブにする
        if (currentHeading) {
            const activeLink = document.querySelector(`.toc a[href="#${currentHeading.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // スクロールイベントリスナー
    function handleScroll() {
        togglePageTopButton();
        updateActiveTocLink();
    }
    
    // スクロールイベントを追加（パフォーマンスを考慮してthrottle）
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 10);
    });
    
    // 初期状態の設定
    togglePageTopButton();
    updateActiveTocLink();
    
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
    
    // 目次の折りたたみ機能（オプション）
    const tocItems = document.querySelectorAll('.toc > li');
    tocItems.forEach(item => {
        const subList = item.querySelector('ul');
        if (subList) {
            const mainLink = item.querySelector('a:first-child');
            if (mainLink) {
                mainLink.style.cursor = 'pointer';
                mainLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    subList.style.display = subList.style.display === 'none' ? 'block' : 'none';
                });
            }
        }
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
            const url = new URL(window.location);
            url.hash = this.id;
            window.history.pushState(null, '', url);
        });
    });

    // Prism.jsの初期化（前処理で余計な改行や前後空白を除去）
    function initializePrism() {
        // command-line ブロックの前後空白や末尾改行を削除
        document.querySelectorAll('pre.command-line code').forEach(function(codeEl) {
            if (codeEl && codeEl.textContent) {
                codeEl.textContent = codeEl.textContent.replace(/^\s+|\s+$/g, '');
            }
        });
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }
    
    initializePrism();
});