document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const scissorWrapper = document.getElementById('scissor-wrapper');
    const topHalf = document.querySelector('.loader-top');
    const loaderText = document.getElementById('loader-text');
    const slotStrip = document.getElementById('slot-strip');
    const geometryWrapper = document.getElementById('geometry-wrapper');

    // Injeksi span per karakter menggunakan DocumentFragment untuk meminimalkan DOM reflow
    const textContent = loaderText.textContent.trim();
    loaderText.textContent = '';
    const textFragment = document.createDocumentFragment();

    textContent.split('').forEach((char) => {
        const span = document.createElement('span');
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        const randomDelay = (Math.random() * 0.5).toFixed(2);
        span.style.transitionDelay = `${randomDelay}s`;
        textFragment.appendChild(span);
    });
    loaderText.appendChild(textFragment);

    // Injeksi elemen angka 000-100 untuk pita indikator slot
    const slotFragment = document.createDocumentFragment();
    for (let i = 0; i <= 100; i++) {
        const numDiv = document.createElement('div');
        numDiv.textContent = i.toString().padStart(3, '0');
        slotFragment.appendChild(numDiv);
    }
    slotStrip.appendChild(slotFragment);

    // Paint lock: Memastikan state awal (-100vw) ter-render di GPU sebelum memicu transisi .start
    requestAnimationFrame(() => {
        setTimeout(() => {
            loader.classList.add('start');
        }, 50);
    });

    // Rantai transisi sekuensial dengan validasi e.target untuk mencegah event bubbling dari child elements
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

    // Hapus elemen loader dari DOM setelah animasi selesai dan aktifkan kembali scroll halaman
    topHalf.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'transform' && e.target === topHalf) {
            loader.remove();
            document.body.classList.add('loaded');
        }
    });
});