# Kelompok Commit (KEL_COMMIT)

Dokumentasi repositori proyek web edukasi arsitektur sistem kontrol versi **Git Commit** dan portofolio kontributor tim. Seluruh antarmuka dan animasi dibangun menggunakan **HTML5, CSS3, dan JavaScript Native** tanpa pustaka (*library*) atau kerangka kerja (*framework*) eksternal.

---

## Deskripsi

### Tema Tampilan

Website ini menggunakan **tema terang teknikal-editorial (*light mode*)** sebagai tampilan utama pada halaman beranda, yang dipadukan dengan kontras panel **hijau zamrud gelap** (![](#-163832) `#163832` dan ![](#-0b6457) `#0b6457`) serta aksen **hijau limau** (![](#-7ab800) `#7ab800` dan ![](#-a3e635) `#a3e635`).

Gaya visualnya mengadaptasi estetika cetak biru (*technical blueprint*) dengan latar pola *grid* presisi berukuran `62px × 62px`, skema vektor SVG, panel inspektor bergaya terminal, serta kartu kontributor berbentuk tiket 3D. Pada halaman profil anggota, tampilan bertransisi dari panggung gelap berfotografi penuh menuju permukaan terang hangat (*warm stone* ![](#-f3f2ec) `#f3f2ec`).

### Palet Warna

| Peran | Kode Warna | Keterangan Penggunaan |
| :--- | :--- | :--- |
| Latar belakang utama | ![](#-ffffff) `#ffffff` | Kanvas dasar halaman utama dengan pola *grid* `rgba(13, 99, 86, 0.055)` |
| Latar layar pembuka & panel gelap | ![](#-163832) `#163832` | Tirai *loader*, sisi belakang kartu 3D, *badge* utama, dan tombol aksi |
| Latar permukaan sekunder | ![](#-f4f8f7) `#f4f8f7` / ![](#-f5f9f8) `#f5f9f8` | Kontainer *Lifecycle Pipeline*, *header* tabel inspektor, dan *pill* |
| Latar permukaan profil | ![](#-f3f2ec) `#f3f2ec` / ![](#-e8e6de) `#e8e6de` | Latar seksi *Manifesto*, bingkai kartu *Polaroid*, dan panel galeri proyek |
| Teks utama | ![](#-111716) `#111716` | Judul bab, navigasi utama, dan isi paragraf pada latar terang |
| Teks kontras | ![](#-ffffff) `#ffffff` | Teks di atas layar *loader*, kartu hijau Hero, dan terminal inspektor |
| Teks pendukung | ![](#-485b56) `#485b56` / ![](#-556964) `#556964` | Subjudul, keterangan spesifikasi, dan deskripsi pendukung |
| Aksen utama (*Brand Teal*) | ![](#-0b6457) `#0b6457` | Sorotan judul, garis lintasan artefak, *border* aktif, dan ikon vektor |
| Aksen sekunder (*Brand Deep*) | ![](#-073b32) `#073b32` | Gradasi kedalaman panel terminal dan bayangan komponen |
| Aksen sorotan (*Lime*) | ![](#-7ab800) `#7ab800` / ![](#-a3e635) `#a3e635` | Indikator status aktif, *hash* komit pada terminal, dan titik fokus SVG |
| Garis batas (*Border*) | ![](#-d5e0dd) `#d5e0dd` | Garis pemisah antarkomponen, kartu pilar, dan kontainer *bento* |

- **Kartu Hero & Viewport Terminal:** menggunakan gradasi hijau zamrud (![](#-0c6a5b) `#0c6a5b` → ![](#-095549) `#095549` → ![](#-074238) `#074238`) pada kartu utama dan gradasi gelap (![](#-0b332c) `#0b332c` → ![](#-07221d) `#07221d`) pada layar *Object Inspector*.
- **Status Siklus File Git:** menggunakan indikator warna semantik khusus, yakni kuning amber (![](#-fef3c7) `#fef3c7` / ![](#-b45309) `#b45309`) untuk *Modified*, biru langit (![](#-e0f2fe) `#e0f2fe` / ![](#-0369a1) `#0369a1`) untuk *Staged*, dan hijau daun (![](#-dcfce7) `#dcfce7` / ![](#-15803d) `#15803d`) untuk *Immutable*.
- **Identitas Kartu Anggota:** setiap kartu kontributor memiliki nomor seri, kode inisial tiga huruf (`RHZ`, `GDK`, `DIA`, `HND`, `JYA`), nama cabang (*branch*), *hash* SHA, dan susunan matriks SVG tersendiri.

### Tipografi

- **Helvetica Neue / System Sans-Serif** (`'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif`) digunakan untuk judul utama, navigasi, penjelasan arsitektur, dan teks isi.
- **SFMono-Regular / Monospace** (`'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`) digunakan untuk perintah terminal Git, *hash* SHA-1, label tahapan, kode seri tiket, dan pita angka *slot machine* pada layar pembuka.

### Ciri Visual

- **Layar Pembuka (*Split-Curtain Loader*):** menampilkan animasi gunting yang memotong garis putus-putus horizontal dari kiri ke kanan, indikator persentase *slot machine* (`000%` hingga `100%`), serta lima objek geometri (*circle, square, pill, diamond, triangle*) dengan cincin orbit sebelum layar terbelah secara vertikal.
- **Inversi Warna Teks Sub-Piksel (*Dual-Layer Clip-Path*):** judul pada seksi Hero memadukan dua lapisan teks identik (gelap dan putih) yang dipotong secara dinamis menggunakan `clip-path` mengikuti pergerakan batas kiri kartu hijau saat halaman digulir.
- **Artefak 3D Commit Core:** objek kompas 3D berbasis SVG yang bergerak menelusuri garis lintasan diagonal dari titik awal di seksi Hero menuju soket pendaratan di seksi kedua sembari berotasi mengikuti progres *scroll*.
- **Inspektor Objek Git Interaktif (*X-Ray Inspector*):** simulasi output perintah `git cat-file -p HEAD` dan bagan *Directed Acyclic Graph (DAG)* yang menyorot lapisan *Checksum*, *Root Tree*, *Parent Commit*, dan *Author* secara langsung saat pengguna memilih tab atau mengarahkan kursor.
- **Kartu Tiket 3D Scroll-Flip:** lima kartu kontributor dengan desain tiket berporforasi dan *barcode* CSS murni yang bergerak naik dari bawah layar lalu berputar `180deg` pada sumbu Y secara bertahap mengikuti posisi *scroll*.
- **Smooth Scroll Inersia & Bebas Pergeseran Tata Letak:** menggunakan perhitungan inersia berbasis delta waktu pada *event wheel* di JavaScript serta menyembunyikan *scrollbar* visual bawaan *browser* agar lebar halaman tidak bergeser saat *loader* selesai.

### Isi Website

- **Beranda (`index.html`):**
  - **Hero Section:** menampilkan tajuk utama *Navigator of Commit History — KEL_COMMIT*, grafik cetak biru, dan titik awal artefak 3D.
  - **Anatomy (`#commit-architecture`):** menjelaskan konsep dasar komit pada Git dan menyediakan fitur interaktif *Object Inspector* untuk membedah isi memori internal objek komit.
  - **Lifecycle (`#commit-lifecycle`):** memetakan alur kerja perubahan file melalui tiga ruang isolasi Git (*Working Directory* → `git add` → *Staging Area* → `git commit` → *Local Repository*).
  - **Pillars (`#commit-pillars`):** menjabarkan empat pilar arsitektur Git, meliputi model data *Snapshot DAG*, *Immutability Checksum*, isolasi *branch* ringan (41 *bytes pointer*), serta standar *Atomic & Conventional Commits*.
  - **Contributors (`#contributors-section`):** panggung *sticky* yang menampilkan kartu perkenalan 3D dari kelima anggota tim beserta peran, spesifikasi keahlian, jumlah komit, dan tautan menuju halaman profil masing-masing.
- **Bagian Tiap Anggota (`pages/`):** halaman portofolio mandiri untuk setiap anggota (`rheza.html`, `gusdika.html`, `diah.html`, `hendra.html`, dan `jaya.html`) yang memuat perjalanan teknis, manifesto rekayasa perangkat lunak, tonggak pencapaian, serta proyek yang pernah dibangun.

---

## Struktur Direktori

Proyek ini menerapkan pemisahan file (*file isolation*) untuk setiap anggota guna mencegah konflik penggabungan (*merge conflict*) saat bekerja secara paralel di cabang (*branch*) masing-masing:

```text
kel_commit/
├── index.html          # Halaman utama (Landing Page & penjelasan Git Commit)
├── README.md           # Dokumentasi proyek
├── css/
│   ├── style.css       # Styling khusus halaman utama (index.html)
│   └── [nama].css      # Styling terisolasi untuk halaman profil masing-masing anggota
├── js/
│   ├── script.js       # Mesin animasi loader, artefak 3D, dan kartu halaman utama
│   └── [nama].js       # Script interaksi terisolasi untuk halaman profil anggota
├── images/
│   └── [nama]-*.png    # Aset gambar dengan awalan nama anggota
└── pages/
    ├── rheza.html      # Halaman profil Rheza
    ├── gusdika.html    # Halaman profil Gus Dika
    ├── diah.html       # Halaman profil Diah
    ├── hendra.html     # Halaman profil Hendra
    └── jaya.html       # Halaman profil Jaya
```

---

## Anggota Kelompok

| No | Nama Lengkap | Nama Panggilan | Branch Kerja | Halaman Profil | Instansi |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Rheza Favian Amanullah | Rheza | branch-rheza | pages/rheza.html | Undiksha |
| 2 | Ida Bagus Andhika Dwi Putra Pidada | Gus Dika | branch-gusdika | pages/gusdika.html | Undiksha |
| 3 | I Gusti Ayu Diah Permata Sukmahartawan | Diah | branch-diah | pages/diah.html | Undiksha |
| 4 | Komang Hendra Swantara | Hendra | branch-hendra.Sw | pages/hendra.html | Undiksha |
| 5 | I Putu Bagus Ananta Wijaya | Jaya | branch-jaya | pages/jaya.html | Undiksha |
