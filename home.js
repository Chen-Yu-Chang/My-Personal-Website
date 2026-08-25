(function () {
    const stage = document.getElementById('stage');
    const panels = Array.from(document.querySelectorAll('.panel'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;

    let leaving = false;

    function activate(panel) {
        if (leaving) return;
        stage.classList.add('is-active');
        panels.forEach(p => p.classList.toggle('is-focused', p === panel));
    }

    function deactivate() {
        if (leaving) return;
        stage.classList.remove('is-active');
        panels.forEach(p => p.classList.remove('is-focused'));
        panels.forEach(p => resetTilt(p));
    }

    function resetTilt(panel) {
        const img = panel.querySelector('.panel-photo img');
        if (img) img.style.transform = 'translate(-50%, -50%) scale(1)';
    }

    function applyTilt(panel, evt) {
        if (reduceMotion || leaving) return;
        const rect = panel.getBoundingClientRect();
        const x = (evt.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
        const y = (evt.clientY - rect.top) / rect.height - 0.5;

        const rotateY = x * 10;   // left-right lean
        const rotateX = y * -8;   // up-down lean
        const img = panel.querySelector('.panel-photo img');
        if (img) {
            img.style.transform =
                `translate(-50%, -50%) scale(1.06) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        }
    }

    // Portal transition: expand the chosen panel to fill the screen, then navigate
    function enterPortal(panel, href) {
        if (leaving) return;
        leaving = true;

        // clear any inline tilt transform so the portal zoom takes over cleanly
        const img = panel.querySelector('.panel-photo img');
        if (img) img.style.transform = '';

        stage.classList.add('is-leaving');
        panel.classList.add('is-portal');

        if (reduceMotion) {
            window.location.href = href;
            return;
        }

        window.setTimeout(() => {
            window.location.href = href;
        }, 820);
    }

    panels.forEach(panel => {
        panel.addEventListener('click', (e) => {
            e.preventDefault();
            enterPortal(panel, panel.href);
        });
    });

    if (!isTouch) {
        panels.forEach(panel => {
            panel.addEventListener('mouseenter', () => activate(panel));
            panel.addEventListener('mousemove', (e) => applyTilt(panel, e));
            panel.addEventListener('focus', () => activate(panel));
        });

        stage.addEventListener('mouseleave', deactivate);
    } else {
        // Touch: tap once to preview/expand, tap again to trigger the portal + navigate
        panels.forEach(panel => {
            panel.addEventListener('touchstart', (e) => {
                if (!panel.classList.contains('is-focused')) {
                    e.preventDefault();
                    activate(panel);
                }
            }, { passive: false });
        });
    }
})();
