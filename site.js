(function () {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const frame = lightbox.querySelector('.lightbox-frame');
    const caption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const icon = frame.querySelector('i');
    const placeholderText = frame.querySelector('.lightbox-placeholder-text');
    const imgEl = frame.querySelector('img');
    const videoEl = frame.querySelector('video');
    const pdfEl = frame.querySelector('.lightbox-pdf');

    function open(slot) {
        const label = slot.getAttribute('data-label') || '';
        const kind = slot.getAttribute('data-kind') || 'photo';
        const src = slot.getAttribute('data-src');

        caption.textContent = label;

        // reset every media element before showing the right one
        imgEl.style.display = 'none';
        imgEl.removeAttribute('src');
        videoEl.pause();
        videoEl.style.display = 'none';
        videoEl.removeAttribute('src');
        pdfEl.style.display = 'none';
        pdfEl.removeAttribute('src');

        if (kind === 'video') {
            icon.className = 'fa-solid fa-film';
        } else if (kind === 'pdf') {
            icon.className = 'fa-solid fa-file-lines';
        } else {
            icon.className = 'fa-solid fa-image';
        }

        if (src) {
            // Real media provided — load it into the matching element
            placeholderText.style.display = 'none';
            icon.style.display = 'none';

            if (kind === 'video') {
                videoEl.src = src;
                videoEl.style.display = 'block';
            } else if (kind === 'pdf') {
                pdfEl.src = src;
                pdfEl.style.display = 'block';
            } else {
                imgEl.src = src;
                imgEl.alt = label;
                imgEl.style.display = 'block';
            }
        } else {
            const labelText = kind === 'video' ? 'Video coming soon' : (kind === 'pdf' ? 'PDF coming soon' : 'Photo coming soon');
            placeholderText.style.display = 'block';
            placeholderText.textContent = labelText;
            icon.style.display = 'block';
        }

        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
        videoEl.pause();
    }

    document.querySelectorAll('.media-slot, .media-slot-inline').forEach(slot => {
        slot.addEventListener('click', () => open(slot));
    });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
})();

// YouTube embeds: add data-youtube="VIDEO_ID" to a .video-card to swap its placeholder for a live embed
(function () {
    document.querySelectorAll('[data-youtube]').forEach(card => {
        const id = card.getAttribute('data-youtube');
        if (!id) return;
        const iframe = card.querySelector('iframe');
        const placeholder = card.querySelector('.video-placeholder');
        if (iframe) {
            iframe.src = `https://www.youtube.com/embed/${id}`;
            iframe.style.display = 'block';
        }
        if (placeholder) placeholder.style.display = 'none';
    });
})();

// Work detail modal (Papers / Project cards)
(function () {
    const modal = document.getElementById('work-modal');
    if (!modal) return;

    const frame = modal.querySelector('.work-modal-frame');
    const closeBtn = modal.querySelector('.work-modal-close');
    const titleEl = frame.querySelector('.work-modal-title');
    const tagsEl = frame.querySelector('.work-modal-tags');
    const bodyEl = frame.querySelector('.work-modal-body');
    const linkEl = frame.querySelector('.work-modal-link');

    function open(card) {
        const template = document.getElementById(card.getAttribute('data-detail'));
        if (!template) return;

        titleEl.textContent = card.getAttribute('data-title') || '';

        const tags = (card.getAttribute('data-tags') || '').split(',').map(t => t.trim()).filter(Boolean);
        tagsEl.innerHTML = tags.map(t => `<span class="tool-tag">${t}</span>`).join('');

        bodyEl.innerHTML = '';
        bodyEl.appendChild(template.content.cloneNode(true));

        const href = card.getAttribute('data-link');
        if (href) {
            linkEl.href = href;
            linkEl.style.display = 'inline-flex';
            linkEl.textContent = card.getAttribute('data-link-label') || 'View Link ↗';
        } else {
            linkEl.style.display = 'none';
        }

        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-detail]').forEach(card => {
        card.addEventListener('click', () => open(card));
    });

    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
})();
