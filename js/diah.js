document.addEventListener('DOMContentLoaded', () => {
  // 1. Loader Overlay Otomatis Hilang
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 200);

  // 2. Efek Kursor Cahaya Mengikuti Mouse (Khusus Desktop)
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // 3. Menu Navigasi Mobile (Hamburger Toggle)
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('show');
    });

    // Otomatis tutup menu ketika salah satu link diklik
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('show');
      });
    });
  }
});
