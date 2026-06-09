(function () {
    function setAccountMenuState(card, isOpen) {
        if (!card) return;

        const menu = card.querySelector('.account-menu');
        const toggle = card.querySelector('.account-toggle');

        card.classList.toggle('open', isOpen);

        if (menu) {
            menu.hidden = !isOpen;
            menu.classList.toggle('is-hidden', !isOpen);
        }

        if (toggle) {
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Close account menu' : 'Open account menu');
        }
    }

    function closeAllAccountMenus() {
        document.querySelectorAll('.account-card').forEach((card) => setAccountMenuState(card, false));
    }

    function updateAccountLabels() {
        const currentUser = sessionStorage.getItem('ftm_currentUser') || 'Admin';
        const labelNodes = document.querySelectorAll('.current-user-label, #currentUser');
        labelNodes.forEach((el) => {
            el.textContent = currentUser;
        });
    }

    function setMenuOpen(open) {
        const nav = document.querySelector('.mobile-nav');
        const overlay = document.querySelector('.mobile-nav-overlay');
        const toggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');

        if (nav) nav.classList.toggle('open', open);
        if (overlay) overlay.classList.toggle('open', open);
        if (toggle) {
            toggle.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', String(open));
        }
        if (sidebar) sidebar.classList.toggle('open', open);
        document.body.classList.toggle('nav-open', open);
    }

    function closeMenus() {
        closeAllAccountMenus();
        setMenuOpen(false);
    }

    function openLoginPage(tab = 'login') {
        const target = new URL('/FrontendPage/login.html', window.location.origin);
        if (tab === 'register') target.search = 'tab=register';
        window.location.href = target.toString();
    }

    function logoutCurrentUser() {
        sessionStorage.removeItem('ftm_currentUser');
        openLoginPage('login');
    }

    function bindAccountCards() {
        document.querySelectorAll('.account-card').forEach((card) => {
            const toggle = card.querySelector('.account-toggle');
            const menu = card.querySelector('.account-menu');
            if (!toggle || !menu) return;

            toggle.addEventListener('click', (event) => {
                event.stopPropagation();
                const shouldOpen = !card.classList.contains('open');

                document.querySelectorAll('.account-card').forEach((other) => {
                    if (other !== card) setAccountMenuState(other, false);
                });

                setAccountMenuState(card, shouldOpen);
            });

            const switchBtn = card.querySelector('.switch-account-btn');
            const registerBtn = card.querySelector('.register-account-btn');
            const logoutBtn = card.querySelector('.logout-btn');

            if (switchBtn) switchBtn.addEventListener('click', () => { closeMenus(); logoutCurrentUser(); });
            if (registerBtn) registerBtn.addEventListener('click', () => { closeMenus(); openLoginPage('register'); });
            if (logoutBtn) logoutBtn.addEventListener('click', () => { closeMenus(); logoutCurrentUser(); });
        });
    }

    function bindMobileNav() {
        const toggle = document.querySelector('.menu-toggle');
        const overlay = document.querySelector('.mobile-nav-overlay');
        const nav = document.querySelector('.mobile-nav');

        if (!toggle || !overlay || !nav) return;

        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            setMenuOpen(!nav.classList.contains('open'));
        });

        const closeButton = nav.querySelector('.mobile-nav-close');
        if (closeButton) {
            closeButton.addEventListener('click', (event) => {
                event.stopPropagation();
                setMenuOpen(false);
            });
        }

        overlay.addEventListener('click', () => setMenuOpen(false));
        nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
    }

    document.addEventListener('click', (event) => {
        const target = event.target;
        const element = target instanceof Element ? target : null;
        const accountCard = element ? element.closest('.account-card') : null;
        const menuToggle = element ? element.closest('.menu-toggle') : null;
        const mobileNav = element ? element.closest('.mobile-nav') : null;

        if (!accountCard && !menuToggle && !mobileNav) {
            closeAllAccountMenus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 980) closeMenus();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAllAccountMenus();
            setMenuOpen(false);
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        updateAccountLabels();
        closeAllAccountMenus();
        bindAccountCards();
        bindMobileNav();
    });
})();
