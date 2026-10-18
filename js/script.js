document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi elemen DOM utama untuk loader dan kontrol halaman
    const loader = document.getElementById('loader');
    const scissorWrapper = document.getElementById('scissor-wrapper');
    const topHalf = document.querySelector('.loader-top');
    const loaderText = document.getElementById('loader-text');
    const slotStrip = document.getElementById('slot-strip');
    const geometryWrapper = document.getElementById('geometry-wrapper');

    let isPageUnlocked = false;

    // Fungsi idempoten untuk membuka kunci scroll halaman dan menghapus elemen loader dari DOM
    function unlockPageStage() {
        if (isPageUnlocked) return;
        isPageUnlocked = true;

        if (loader && loader.parentNode) {
            loader.remove();
        }
        document.documentElement.classList.add('loaded');
        document.body.classList.add('loaded');

        requestAnimationFrame(() => {
            measureStageGeometry();
            updateScrollInput();
        });
    }

    if (loader) {
        const textContent = loaderText.textContent.trim();
        loaderText.textContent = '';
        const textFragment = document.createDocumentFragment();

        // Memecah teks KEL_COMMIT menjadi span per karakter dengan delay acak untuk animasi reveal
        textContent.split('').forEach((char) => {
            const span = document.createElement('span');
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            const randomDelay = (Math.random() * 0.5).toFixed(2);
            span.style.transitionDelay = `${randomDelay}s`;
            textFragment.appendChild(span);
        });
        loaderText.appendChild(textFragment);

        // Injeksi elemen angka 000-100 untuk pita mesin slot mekanikal
        const slotFragment = document.createDocumentFragment();
        for (let i = 0; i <= 100; i++) {
            const numDiv = document.createElement('div');
            numDiv.textContent = i.toString().padStart(3, '0');
            slotFragment.appendChild(numDiv);
        }
        slotStrip.appendChild(slotFragment);

        // Paint lock: Memastikan state awal ter-render di GPU sebelum memicu transisi .start
        requestAnimationFrame(() => {
            setTimeout(() => {
                loader.classList.add('start');
            }, 50);
        });

        // Rantai transisi sekuensial loader (Scissor -> Swoop -> Split -> Unlock)
        scissorWrapper.addEventListener('transitionend', (e) => {
            if (e.propertyName === 'transform' && e.target === scissorWrapper) {
                loader.classList.add('swoop');
            }
        });

        geometryWrapper.addEventListener('transitionend', (e) => {
            if (e.propertyName === 'transform' && e.target === geometryWrapper) {
                loader.classList.add('split');
            }
        });

        topHalf.addEventListener('transitionend', (e) => {
            if (e.propertyName === 'transform' && e.target === topHalf) {
                unlockPageStage();
            }
        });

        // Fallback timer pengaman jika transisi CSS terinterupsi
        setTimeout(unlockPageStage, 5100);
    } else {
        unlockPageStage();
    }

    // Segmentasi karakter judul Hero untuk efek de-blur progresif dari kiri ke kanan
    document.querySelectorAll('[data-blur-text]').forEach((lineEl) => {
        const text = lineEl.textContent;
        lineEl.textContent = '';
        const frag = document.createDocumentFragment();
        const isSecondLine = lineEl.classList.contains('hero-line-second');
        const baseOffset = isSecondLine ? 0.32 : 0.08;

        text.split('').forEach((ch, idx) => {
            const span = document.createElement('span');
            span.className = 'blur-char';
            span.innerHTML = ch === ' ' ? '&nbsp;' : ch;
            span.style.setProperty('--char-delay', `${(baseOffset + idx * 0.028).toFixed(3)}s`);
            frag.appendChild(span);
        });
        lineEl.appendChild(frag);
    });

    // Cache elemen DOM untuk mesin fisika pergerakan artefak 3D dan kartu kontributor
    const mainStage = document.getElementById('main-content');
    const heroContainer = document.getElementById('hero-container');
    const commitArtifact = document.getElementById('commit-artifact');
    const artifactBody = document.getElementById('artifact-3d-body');
    const artifactRotor = document.getElementById('artifact-rotor');
    const originAnchor = document.getElementById('artifact-origin');
    const targetAnchor = document.getElementById('artifact-target');

    const trajectorySvg = document.getElementById('trajectory-svg');
    const trajLineOutside = document.getElementById('traj-line-outside');
    const cardBlueprintSvg = document.getElementById('card-blueprint-svg');
    const bpMainTrajectory = document.getElementById('bp-main-trajectory');
    const bpVline = document.getElementById('bp-vline');
    const bpHline = document.getElementById('bp-hline');
    const bpDiagDashed = document.getElementById('bp-diag-dashed');
    const bpC1 = document.getElementById('bp-c1');
    const bpC2 = document.getElementById('bp-c2');
    const bpC3 = document.getElementById('bp-c3');
    const backToTopBtn = document.getElementById('back-to-top');

    const contributorsSection = document.getElementById('contributors-section');
    const contributorsTopBar = document.getElementById('contributors-top-bar');
    const contributorsBottomCaption = document.getElementById('contributors-bottom-caption');
    const flipCardSlots = Array.from(document.querySelectorAll('.flip-card-slot')).map((slot) => ({
        slot,
        inner3d: slot.querySelector('.flip-card-3d'),
        baseTilt: parseFloat(slot.getAttribute('data-tilt') || '-3.5')
    }));

    let currentHeroProgress = 0;
    let targetHeroProgress = 0;
    let currentCardsProgress = 0;
    let targetCardsProgress = 0;

    let originCoords = { x: 0, y: 0 };
    let targetCoords = { x: 0, y: 0 };

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Kalkulasi geometri presisi untuk lintasan diagonal artefak 3D
    function measureStageGeometry() {
        const stageRect = mainStage.getBoundingClientRect();
        const originRect = originAnchor.getBoundingClientRect();
        const targetRect = targetAnchor.getBoundingClientRect();
        const bpRect = cardBlueprintSvg.getBoundingClientRect();

        originCoords = {
            x: (originRect.left - stageRect.left) + (originRect.width / 2),
            y: (originRect.top - stageRect.top) + (originRect.height / 2)
        };

        targetCoords = {
            x: (targetRect.left - stageRect.left),
            y: (targetRect.top - stageRect.top)
        };

        trajectorySvg.setAttribute('viewBox', `0 0 ${stageRect.width} ${stageRect.height}`);
        cardBlueprintSvg.setAttribute('viewBox', `0 0 ${bpRect.width} ${bpRect.height}`);

        const localOriginX = originCoords.x - (bpRect.left - stageRect.left);
        const localOriginY = originCoords.y - (bpRect.top - stageRect.top);
        const localTargetX = targetCoords.x - (bpRect.left - stageRect.left);
        const localTargetY = targetCoords.y - (bpRect.top - stageRect.top);

        [bpC1, bpC2, bpC3].forEach((circle) => {
            circle.setAttribute('cx', localOriginX.toFixed(1));
            circle.setAttribute('cy', localOriginY.toFixed(1));
        });

        bpVline.setAttribute('x1', localOriginX.toFixed(1));
        bpVline.setAttribute('x2', localOriginX.toFixed(1));
        bpVline.setAttribute('y2', bpRect.height.toFixed(1));

        bpHline.setAttribute('y1', localOriginY.toFixed(1));
        bpHline.setAttribute('y2', localOriginY.toFixed(1));
        bpHline.setAttribute('x2', bpRect.width.toFixed(1));

        const dx = localTargetX - localOriginX;
        const dy = localTargetY - localOriginY;
        const slope = dx / (dy || 1);

        const topEdgeX = localOriginX - slope * localOriginY;
        const bottomEdgeX = localOriginX + slope * (bpRect.height - localOriginY);

        bpMainTrajectory.setAttribute('x1', topEdgeX.toFixed(1));
        bpMainTrajectory.setAttribute('y1', '0');
        bpMainTrajectory.setAttribute('x2', bottomEdgeX.toFixed(1));
        bpMainTrajectory.setAttribute('y2', bpRect.height.toFixed(1));

        bpDiagDashed.setAttribute('x1', (localOriginX - 280).toFixed(1));
        bpDiagDashed.setAttribute('y1', '0');
        bpDiagDashed.setAttribute('x2', (localOriginX + 280).toFixed(1));
        bpDiagDashed.setAttribute('y2', bpRect.height.toFixed(1));
    }

    // Membaca posisi scroll vertikal untuk menggerakkan animasi progresif secara real-time
    function updateScrollInput() {
        const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

        const settleDistance = Math.max(targetCoords.y - 175, 420);
        targetHeroProgress = clamp(scrollY / settleDistance, 0, 1);

        if (contributorsSection) {
            const rect = contributorsSection.getBoundingClientRect();
            const scrollableRunway = Math.max(rect.height - window.innerHeight, 1);
            const leadInPx = window.innerHeight * 0.12;
            const scrolledPx = -rect.top + leadInPx;
            targetCardsProgress = clamp(scrolledPx / (scrollableRunway + leadInPx), 0, 1);
        }

        if (scrollY > 140) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    // Render loop berbasis requestAnimationFrame dengan Linear Interpolation (Lerp) untuk kelancaran 60FPS
    function renderLoop() {
        currentHeroProgress += (targetHeroProgress - currentHeroProgress) * 0.11;
        if (Math.abs(targetHeroProgress - currentHeroProgress) < 0.0004) {
            currentHeroProgress = targetHeroProgress;
        }

        const expandPhase = Math.min(currentHeroProgress / 0.48, 1);
        const easedExpand = 1 - Math.pow(1 - expandPhase, 2.2);
        const cardLeftPercent = 48 * (1 - easedExpand);
        heroContainer.style.setProperty('--card-left', `${cardLeftPercent.toFixed(3)}%`);

        const curX = originCoords.x + (targetCoords.x - originCoords.x) * currentHeroProgress;
        const curY = originCoords.y + (targetCoords.y - originCoords.y) * currentHeroProgress;
        const scale = 1 - (0.08 * currentHeroProgress);

        commitArtifact.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;

        const rotorAngle = -14 + (currentHeroProgress * 72);
        artifactRotor.style.transform = `rotate(${rotorAngle.toFixed(2)}deg)`;
        const bodyTilt = -18 + (currentHeroProgress * 10);
        artifactBody.style.transform = `rotateZ(${bodyTilt.toFixed(2)}deg)`;

        trajLineOutside.setAttribute('x1', originCoords.x.toFixed(1));
        trajLineOutside.setAttribute('y1', originCoords.y.toFixed(1));
        trajLineOutside.setAttribute('x2', curX.toFixed(1));
        trajLineOutside.setAttribute('y2', curY.toFixed(1));

        currentCardsProgress += (targetCardsProgress - currentCardsProgress) * 0.12;
        if (Math.abs(targetCardsProgress - currentCardsProgress) < 0.0004) {
            currentCardsProgress = targetCardsProgress;
        }

        const staggerStep = 0.12;
        const cardWindow = 0.38;
        const globalSettle = easeInOutCubic(clamp((currentCardsProgress - 0.76) / 0.18, 0, 1));

        flipCardSlots.forEach((item, index) => {
            const startP = index * staggerStep;
            const localP = clamp((currentCardsProgress - startP) / cardWindow, 0, 1);

            const risePhase = easeOutCubic(clamp(localP / 0.68, 0, 1));
            const hoverOffsetVh = (index % 2 === 0 ? -1.8 : 1.8) * (1 - globalSettle);
            const translateYVh = (1 - risePhase) * 76 + (risePhase * hoverOffsetVh);

            const flipPhase = easeInOutCubic(clamp((localP - 0.22) / 0.56, 0, 1));
            const rotateYDeg = flipPhase * 180;

            const activeTiltZ = item.baseTilt * (1 - globalSettle);

            item.slot.style.transform = `translate3d(0, ${translateYVh.toFixed(2)}vh, 0)`;
            item.inner3d.style.transform = `rotateZ(${activeTiltZ.toFixed(2)}deg) rotateY(${rotateYDeg.toFixed(2)}deg)`;
        });

        const chromeReveal = easeOutCubic(clamp((currentCardsProgress - 0.74) / 0.18, 0, 1));
        if (contributorsTopBar && contributorsBottomCaption) {
            contributorsTopBar.style.opacity = chromeReveal.toFixed(3);
            contributorsTopBar.style.transform = `translate3d(0, ${((1 - chromeReveal) * -14).toFixed(1)}px, 0)`;

            contributorsBottomCaption.style.opacity = chromeReveal.toFixed(3);
            contributorsBottomCaption.style.transform = `translate3d(0, ${((1 - chromeReveal) * 14).toFixed(1)}px, 0)`;
        }

        requestAnimationFrame(renderLoop);
    }

    // Dataset anatomi internal Git untuk komponen X-Ray Inspector
    const xrayDataset = {
        hash: {
            badge: 'LAPISAN 01 // IDENTITAS KRIPTOGRAFIS',
            title: 'SHA-1 / SHA-256 Checksum Hash',
            desc: 'Setiap commit tidak dinamai dengan angka urut (1, 2, 3), melainkan dikalkulasi menggunakan fungsi hash kriptografis dari seluruh isi file, struktur direktori, dan riwayat sebelumnya. Jika satu titik koma saja diubah di dalam kode, hash ini akan berubah total—menjamin integritas mutlak tanpa risiko manipulasi diam-diam.'
        },
        tree: {
            badge: 'LAPISAN 02 // SNAPSHOT SISTEM FILE',
            title: 'Root Tree Pointer & Blob Graph',
            desc: 'Objek commit menyimpan satu pointer menuju "Root Tree" yang merepresentasikan struktur folder dan file (blob) proyek Anda pada detik itu. File yang tidak mengalami perubahan tidak akan digandakan, melainkan langsung menunjuk ke alamat blob lama sehingga penyimpanan Git tetap sangat ringan.'
        },
        parent: {
            badge: 'LAPISAN 03 // RANTAI KRONOLOGIS (DAG)',
            title: 'Parent Commit Lineage Pointer',
            desc: 'Berisi alamat hash dari commit tepat sebelumnya. Ikatan satu arah ke masa lalu ini membentuk Directed Acyclic Graph (DAG), memungkinkan tim melacak riwayat mundur, memisahkan branch eksperimen, dan menggabungkannya kembali (merge) dengan presisi.'
        },
        author: {
            badge: 'LAPISAN 04 // KONTEKS & AKUNTABILITAS',
            title: 'Author, Timestamp & Conventional Message',
            desc: 'Merekam siapa yang menulis perubahan, zona waktu presisi dalam detik Unix epoch, serta pesan deskriptif (seperti feat: atau fix:) yang menjelaskan alasan rekayasa di balik perubahan tersebut bagi anggota tim lainnya.'
        }
    };

    const layerButtons = document.querySelectorAll('.xray-layer-btn');
    const codeLines = document.querySelectorAll('[data-code-layer]');
    const dagElements = document.querySelectorAll('[data-node-layer]');
    const insightBadge = document.getElementById('insight-badge');
    const insightTitle = document.getElementById('insight-title');
    const insightDesc = document.getElementById('insight-desc');

    function activateXrayLayer(layerKey) {
        const data = xrayDataset[layerKey];
        if (!data) return;

        layerButtons.forEach((btn) => {
            const isMatch = btn.getAttribute('data-layer') === layerKey;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });

        codeLines.forEach((line) => {
            line.classList.toggle('is-highlighted', line.getAttribute('data-code-layer') === layerKey);
        });

        dagElements.forEach((node) => {
            node.classList.toggle('is-active', node.getAttribute('data-node-layer') === layerKey);
        });

        insightBadge.textContent = data.badge;
        insightTitle.textContent = data.title;
        insightDesc.textContent = data.desc;
    }

    layerButtons.forEach((btn) => {
        const layerKey = btn.getAttribute('data-layer');
        btn.addEventListener('click', () => activateXrayLayer(layerKey));
        btn.addEventListener('mouseenter', () => activateXrayLayer(layerKey));
    });

    measureStageGeometry();
    updateScrollInput();
    requestAnimationFrame(renderLoop);

    window.addEventListener('resize', () => {
        measureStageGeometry();
        updateScrollInput();
    }, { passive: true });

    window.addEventListener('scroll', updateScrollInput, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});