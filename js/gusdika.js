// Fungsi untuk melakukan smooth scroll saat tombol navigasi diklik
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Mengatur Observers untuk animasi muncul dan pembaruan menu aktif saat scroll
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".page-section");
    const navButtons = document.querySelectorAll(".nav-item");
    const container = document.getElementById("snapContainer");

    // Konfigurasi IntersectionObserver
    const observerOptions = {
        root: container,
        threshold: 0.5 // Memicu animasi & menu aktif ketika 50% bagian halaman terlihat
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // 1. Tambahkan class aktif untuk memicu animasi CSS reveal
                entry.target.classList.add("active-section");

                // 2. Perbarui status tombol navigasi aktif
                const currentId = entry.target.getAttribute("id");
                navButtons.forEach((btn) => {
                    btn.classList.remove("active");
                    if (btn.getAttribute("onclick").includes(currentId)) {
                        btn.classList.add("active");
                    }
                });
            } else {
                // Hapus class agar animasi dapat terulang kembali saat dikunjungi
                entry.target.classList.remove("active-section");
            }
        });
    }, observerOptions);

    // Daftarkan semua section ke observer
    sections.forEach((section) => observer.observe(section));
});