document.addEventListener('DOMContentLoaded', () => {
    const chronologyRunway = document.getElementById('chronology-runway');
    const backdropLayers = Array.from(document.querySelectorAll('[data-backdrop]')).map((layer) => ({
        layer,
        mover: layer.querySelector('.backdrop-img-mover')
    }));
    const storySlides = Array.from(document.querySelectorAll('[data-slide]'));
    const chapterCounter = document.getElementById('chapter-counter');
    const horizonDot = document.getElementById('horizon-dot');
    const horizonAxisBar = document.getElementById('horizon-axis-bar');
    const storyContentStage = document.getElementById('story-content-stage');
    const storyScrollPrompt = document.getElementById('story-scroll-prompt');

    const manifestoSection = document.getElementById('manifesto-section');
    const manifestoParagraph = document.getElementById('manifesto-paragraph');
    const manifestoSquareImg = document.getElementById('manifesto-square-img');
    const manifestoLeadBox = document.getElementById('manifesto-lead-box');
    const polaroidCards = Array.from(document.querySelectorAll('[data-polaroid]')).map((card, index) => ({
        card,
        img: card.querySelector('.polaroid-img'),
        index
    }));

    const showcaseSection = document.getElementById('showcase-section');
    const showcasePanels = Array.from(document.querySelectorAll('[data-showcase-panel]')).map((panel, index) => ({
        panel,
        plane: panel.querySelector('[data-showcase-plane]'),
        index,
        targetMouseX: 0,
        targetMouseY: 0,
        currentMouseX: 0,
        currentMouseY: 0
    }));

    // 1. Segmentasi kata pada judul Curtain Story untuk animasi optical de-blur
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

    // 2. Segmentasi kata pada paragraf Manifesto untuk progressive scroll scrubbing
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

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // 3. Native Inertial Smooth Scroll Engine (Menghilangkan kesan patah-patah saat melewati Curtain Story)
    let virtualTargetScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    let virtualCurrentScrollY = virtualTargetScrollY;
    let isWheelSmoothingActive = false;

    function getMaxScrollLimit() {
        return Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    }

    window.addEventListener('wheel', (e) => {
        if (e.ctrlKey) return;
        e.preventDefault();

        const deltaMultiplier = e.deltaMode === 1 ? 36 : e.deltaMode === 2 ? window.innerHeight : 1;
        const rawDelta = e.deltaY * deltaMultiplier * 0.92;

        if (!isWheelSmoothingActive) {
            virtualCurrentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
            virtualTargetScrollY = virtualCurrentScrollY;
            isWheelSmoothingActive = true;
        }

        virtualTargetScrollY = clamp(virtualTargetScrollY + rawDelta, 0, getMaxScrollLimit());
    }, { passive: false });

    window.addEventListener('scroll', () => {
        if (!isWheelSmoothingActive) {
            const nativeY = window.scrollY || document.documentElement.scrollTop || 0;
            virtualCurrentScrollY = nativeY;
            virtualTargetScrollY = nativeY;
        }
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
        const stepKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];
        if (stepKeys.includes(e.key)) {
            isWheelSmoothingActive = false;
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        virtualTargetScrollY = clamp(virtualTargetScrollY, 0, getMaxScrollLimit());
    }, { passive: true });

    // 4. Cursor Float Micro-Parallax pada Panel Showcase (Section 3)
    showcasePanels.forEach((item) => {
        item.panel.addEventListener('mousemove', (e) => {
            const rect = item.panel.getBoundingClientRect();
            const normX = ((e.clientX - rect.left) / rect.width) - 0.5;
            const normY = ((e.clientY - rect.top) / rect.height) - 0.5;
            item.targetMouseX = normX * 14;
            item.targetMouseY = normY * 14;
        }, { passive: true });

        item.panel.addEventListener('mouseleave', () => {
            item.targetMouseX = 0;
            item.targetMouseY = 0;
        }, { passive: true });
    });

    // 5. Frame-Rate Independent Master Choreography Loop
    let currentCurtainProgress = 0;
    let currentExitHandoff = 0;
    let currentManifestoProgress = 0;
    let currentManifestoScrollRatio = 0;
    let currentShowcaseProgress = 0;
    let lastTimestamp = performance.now();

    function renderMasterLoop(now) {
        const dt = Math.min((now - lastTimestamp) / 1000, 0.064);
        lastTimestamp = now;

        // Frame-rate independent exponential smoothing factor
        const scrollAlpha = 1 - Math.exp(-9.5 * dt);
        const motionAlpha = 1 - Math.exp(-8.5 * dt);

        if (isWheelSmoothingActive) {
            virtualCurrentScrollY += (virtualTargetScrollY - virtualCurrentScrollY) * scrollAlpha;
            if (Math.abs(virtualTargetScrollY - virtualCurrentScrollY) < 0.15) {
                virtualCurrentScrollY = virtualTargetScrollY;
                isWheelSmoothingActive = false;
            }
            window.scrollTo(0, virtualCurrentScrollY);
        }

        const vh = window.innerHeight || 1;

        // A. SECTION 1: CURTAIN STORY & EXIT PARALLAX HANDOFF (00:00 - 00:10)
        if (chronologyRunway) {
            const cRect = chronologyRunway.getBoundingClientRect();
            const maxRunway = Math.max(cRect.height - vh, 1);
            const targetCurtainProgress = clamp(-cRect.top / maxRunway, 0, 1);

            currentCurtainProgress += (targetCurtainProgress - currentCurtainProgress) * motionAlpha;
            if (Math.abs(targetCurtainProgress - currentCurtainProgress) < 0.0002) {
                currentCurtainProgress = targetCurtainProgress;
            }

            // Mengukur seberapa jauh Section 2 (Manifesto) telah naik menyelimuti Bab 04
            const rawOverrunPx = Math.max(-cRect.top - maxRunway, 0);
            const targetExitHandoff = clamp(rawOverrunPx / vh, 0, 1);
            currentExitHandoff += (targetExitHandoff - currentExitHandoff) * motionAlpha;

            const stage = currentCurtainProgress * 3;

            backdropLayers.forEach((item, i) => {
                if (i === 0) {
                    item.layer.style.transform = 'translate3d(0, 0vh, 0)';
                } else {
                    const topVh = Math.max(0, (i - stage) * 86);
                    item.layer.style.transform = `translate3d(0, ${topVh.toFixed(2)}vh, 0)`;
                }

                if (item.mover) {
                    const delta = stage - i;
                    let imgTranslateVh = 0;
                    if (delta >= 0) {
                        imgTranslateVh = -clamp(delta, 0, 1.2) * 26;
                    } else {
                        imgTranslateVh = clamp(-delta, 0, 1) * 12;
                    }
                    // Saat keluar dari Bab 04 menuju Manifesto, gambar ke-4 terus bergerak parallax ke atas
                    if (i === 3 && currentExitHandoff > 0) {
                        imgTranslateVh -= currentExitHandoff * 22;
                    }
                    item.mover.style.transform = `translate3d(0, ${imgTranslateVh.toFixed(2)}vh, 0)`;
                }
            });

            // Geser panggung teks dan garis sumbu ke atas secara halus saat diselimuti oleh seksi Manifesto
            const exitLiftVh = -currentExitHandoff * 16;
            const exitOpacity = clamp(1 - (currentExitHandoff * 1.35), 0, 1);
            if (storyContentStage && horizonAxisBar && storyScrollPrompt) {
                storyContentStage.style.transform = `translate3d(0, ${exitLiftVh.toFixed(2)}vh, 0)`;
                horizonAxisBar.style.transform = `translate3d(0, ${(exitLiftVh * 0.75).toFixed(2)}vh, 0)`;
                storyScrollPrompt.style.transform = `translate3d(0, ${(exitLiftVh * 0.5).toFixed(2)}vh, 0)`;
                storyScrollPrompt.style.opacity = exitOpacity.toFixed(3);
            }

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

            const localPhase = clamp(stage - (nearestIndex - 0.38), 0, 0.76) / 0.76;
            const dotLeftPercent = 15.2 + (localPhase * 10.2);
            horizonDot.style.left = `${dotLeftPercent.toFixed(2)}%`;
        }

        // B. SECTION 2: MANIFESTO SCRUBBING, WINDOW PARALLAX & DIFFERENTIAL POLAROID GLIDE (00:09 - 00:13)
        if (manifestoSection) {
            const mSectionRect = manifestoSection.getBoundingClientRect();
            const targetSectionRatio = clamp((vh - mSectionRect.top) / (vh + mSectionRect.height), 0, 1);
            currentManifestoScrollRatio += (targetSectionRatio - currentManifestoScrollRatio) * motionAlpha;

            // 1. Inner Window Parallax pada gambar persegi kiri
            if (manifestoSquareImg) {
                const squareParallaxY = (currentManifestoScrollRatio - 0.5) * 34;
                manifestoSquareImg.style.transform = `translate3d(0, ${squareParallaxY.toFixed(2)}px, 0) scale(1.06)`;
            }

            if (manifestoLeadBox) {
                const leadLiftY = (0.5 - currentManifestoScrollRatio) * 14;
                manifestoLeadBox.style.transform = `translate3d(0, ${leadLiftY.toFixed(2)}px, 0)`;
            }

            // 2. Word-by-word contrast reveal pada paragraf Manifesto
            if (manifestoParagraph) {
                const pRect = manifestoParagraph.getBoundingClientRect();
                const startRevealY = vh * 0.92;
                const endRevealY = vh * 0.32;
                const targetWordP = clamp((startRevealY - pRect.top) / (startRevealY - endRevealY), 0, 1);
                currentManifestoProgress += (targetWordP - currentManifestoProgress) * motionAlpha;

                const totalWords = manifestoWords.length || 1;
                manifestoWords.forEach((wordSpan, idx) => {
                    const wordThreshold = (idx / totalWords) * 0.74;
                    const localWordP = clamp((currentManifestoProgress - wordThreshold) / 0.26, 0, 1);
                    const easedWordP = easeOutCubic(localWordP);
                    const opacity = 0.22 + (easedWordP * 0.78);
                    wordSpan.style.opacity = opacity.toFixed(3);
                });
            }

            // 3. Differential Staggered Parallax pada kedua kartu Polaroid kanan
            const polaroidEntryProgress = easeOutCubic(clamp((currentManifestoScrollRatio - 0.08) / 0.46, 0, 1));
            const polaroidPostDrift = (currentManifestoScrollRatio - 0.54) * -28;

            polaroidCards.forEach((item) => {
                const staggerMultiplier = item.index === 0 ? 44 : 76;
                const entryOffsetPx = (1 - polaroidEntryProgress) * staggerMultiplier;
                const driftMultiplier = item.index === 0 ? 0.75 : 1.15;
                const totalCardY = entryOffsetPx + (polaroidPostDrift * driftMultiplier);

                item.card.style.transform = `translate3d(0, ${totalCardY.toFixed(2)}px, 0)`;

                if (item.img) {
                    const innerPhotoY = (currentManifestoScrollRatio - 0.5) * 28;
                    item.img.style.transform = `translate3d(0, ${innerPhotoY.toFixed(2)}px, 0) scale(1.05)`;
                }
            });
        }

        // C. SECTION 3: 2-COLUMN SHOWCASE PARALLAX & CURSOR FLOAT (00:12 - 00:15)
        if (showcaseSection) {
            const sRect = showcaseSection.getBoundingClientRect();
            const targetShowcaseP = clamp((vh - sRect.top) / (vh + sRect.height), 0, 1);
            currentShowcaseProgress += (targetShowcaseP - currentShowcaseProgress) * motionAlpha;

            const entrancePhase = easeOutCubic(clamp(currentShowcaseProgress / 0.48, 0, 1));

            showcasePanels.forEach((item) => {
                item.currentMouseX += (item.targetMouseX - item.currentMouseX) * motionAlpha;
                item.currentMouseY += (item.targetMouseY - item.currentMouseY) * motionAlpha;

                const staggerRise = item.index === 0 ? 36 : 56;
                const scrollLiftY = (1 - entrancePhase) * staggerRise + ((currentShowcaseProgress - 0.5) * -18);

                if (item.plane) {
                    const finalX = item.currentMouseX;
                    const finalY = scrollLiftY + item.currentMouseY;
                    item.plane.style.transform = `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0)`;
                }
            });
        }

        requestAnimationFrame(renderMasterLoop);
    }

    requestAnimationFrame(renderMasterLoop);
});