document.addEventListener('DOMContentLoaded', () => {
    const chronologyRunway = document.getElementById('chronology-runway');
    const backdropLayers = Array.from(document.querySelectorAll('[data-backdrop]')).map((layer) => ({
        layer,
        mover: layer.querySelector('.backdrop-img-mover')
    }));
    const storySlides = Array.from(document.querySelectorAll('[data-slide]'));
    const chapterCounter = document.getElementById('chapter-counter');
    const horizonDot = document.getElementById('horizon-dot');
    const manifestoParagraph = document.getElementById('manifesto-paragraph');

    // Segmentasi kata pada setiap judul Curtain Story untuk animasi de-blur berurutan dari kiri ke kanan
    document.querySelectorAll('[data-story-heading]').forEach((headingEl) => {
        const words = headingEl.textContent.trim().split(/\s+/);
        headingEl.textContent = '';
        const frag = document.createDocumentFragment();

        words.forEach((word, idx) => {
            const span = document.createElement('span');
            span.className = 'story-word';
            span.style.setProperty('--w-idx', idx);
            span.textContent = word;
            frag.appendChild(span);
        });
        headingEl.appendChild(frag);
    });

    // Segmentasi kata pada paragraf Manifesto untuk efek progressive scroll reveal
    const manifestoWords = [];
    if (manifestoParagraph) {
        const words = manifestoParagraph.textContent.trim().split(/\s+/);
        manifestoParagraph.textContent = '';
        const frag = document.createDocumentFragment();

        words.forEach((word, idx) => {
            const span = document.createElement('span');
            span.className = 'manifesto-word';
            span.textContent = word + (idx < words.length - 1 ? ' ' : '');
            frag.appendChild(span);
            manifestoWords.push(span);
        });
        manifestoParagraph.appendChild(frag);
    }

    let currentScrollProgress = 0;
    let targetScrollProgress = 0;
    let currentManifestoProgress = 0;
    let targetManifestoProgress = 0;

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    function updateScrollTargets() {
        if (chronologyRunway) {
            const rect = chronologyRunway.getBoundingClientRect();
            const maxRunway = Math.max(rect.height - window.innerHeight, 1);
            targetScrollProgress = clamp(-rect.top / maxRunway, 0, 1);
        }

        if (manifestoParagraph) {
            const mRect = manifestoParagraph.getBoundingClientRect();
            const startRevealY = window.innerHeight * 0.9;
            const endRevealY = window.innerHeight * 0.3;
            targetManifestoProgress = clamp((startRevealY - mRect.top) / (startRevealY - endRevealY), 0, 1);
        }
    }

    // Loop fisika 60FPS dengan kelembaman (Lerp 0.085) untuk pergerakan gambar 2 arah & de-blur teks
    function renderChronology() {
        currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.085;
        if (Math.abs(targetScrollProgress - currentScrollProgress) < 0.0003) {
            currentScrollProgress = targetScrollProgress;
        }

        // Rentang stage kontinu dari 0.00 hingga 3.00 (4 bab = 3 transisi tirai)
        const stage = currentScrollProgress * 3;

        // Pergerakan fisik setiap bingkai foto (86vh stack) dan inner parallax gambar saat scroll naik/turun
        backdropLayers.forEach((item, i) => {
            if (i === 0) {
                item.layer.style.transform = 'translate3d(0, 0vh, 0)';
            } else {
                // Saat stage = 0: Layer 1 berada di 86vh (mengintip 14vh di bawah), Layer 2 di 172vh, Layer 3 di 258vh
                const topVh = Math.max(0, (i - stage) * 86);
                item.layer.style.transform = `translate3d(0, ${topVh.toFixed(2)}vh, 0)`;
            }

            // Inner Image Parallax: gambar saat ini bergerak ke atas (-26vh) saat tirai berikutnya naik menutupnya
            if (item.mover) {
                const delta = stage - i;
                let imgTranslateVh = 0;
                if (delta >= 0) {
                    imgTranslateVh = -clamp(delta, 0, 1.2) * 26;
                } else {
                    imgTranslateVh = clamp(-delta, 0, 1) * 12;
                }
                item.mover.style.transform = `translate3d(0, ${imgTranslateVh.toFixed(2)}vh, 0)`;
            }
        });

        // Deteksi zona transisi tengah (saat perpotongan gambar melewati garis horisontal seperti detik 00:03 di referensi)
        const nearestIndex = Math.min(Math.max(Math.round(stage), 0), 3);
        const distanceToNearest = Math.abs(stage - nearestIndex);
        const isCrossingMidline = distanceToNearest > 0.38;

        chapterCounter.textContent = `0${nearestIndex + 1}`;
        chapterCounter.style.opacity = isCrossingMidline ? '0' : '1';
        horizonDot.style.opacity = isCrossingMidline ? '0' : '1';

        storySlides.forEach((slide, idx) => {
            const shouldShow = idx === nearestIndex && !isCrossingMidline;
            slide.classList.toggle('is-active', shouldShow);
        });

        // Pergerakan titik putih di sepanjang garis horisontal (dari 15% menuju 25.4%)
        const localPhase = clamp(stage - (nearestIndex - 0.38), 0, 0.76) / 0.76;
        const dotLeftPercent = 15.2 + (localPhase * 10.2);
        horizonDot.style.left = `${dotLeftPercent.toFixed(2)}%`;

        // Progressive word-by-word contrast reveal pada seksi Manifesto
        currentManifestoProgress += (targetManifestoProgress - currentManifestoProgress) * 0.1;
        const totalWords = manifestoWords.length || 1;
        manifestoWords.forEach((wordSpan, idx) => {
            const wordThreshold = (idx / totalWords) * 0.72;
            const localWordP = clamp((currentManifestoProgress - wordThreshold) / 0.28, 0, 1);
            const opacity = 0.25 + (localWordP * 0.75);
            wordSpan.style.opacity = opacity.toFixed(2);
        });

        requestAnimationFrame(renderChronology);
    }

    updateScrollTargets();
    requestAnimationFrame(renderChronology);

    window.addEventListener('scroll', updateScrollTargets, { passive: true });
    window.addEventListener('resize', updateScrollTargets, { passive: true });
});