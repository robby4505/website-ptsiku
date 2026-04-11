/**
 * SIKU - Reusable Components & Language Switcher
 * Header & Footer terpusat via JavaScript
 */

// ================= TRANSLATIONS DATA =================
const translations = {
  id: {
    nav_home: "Beranda",
    nav_services: "Layanan",
    nav_training: "Program Pelatihan",
    nav_team: "Tim Ahli",
    nav_contact: "Kontak",
    hero_title: "Sinergi Strategis untuk Pertumbuhan Bisnis Anda",
    hero_desc: "Konsultasi manajemen, optimasi SDM, dan solusi administrasi terpadu yang dirancang untuk skalabilitas & efisiensi perusahaan.",
    btn_consult: "Konsultasi Gratis",
    btn_services: "Lihat Layanan",
    about_title: "Tentang Kami",
    about_desc: "PT SINERGI INSAN KARYA UTAMA (SIKU) hadir sebagai mitra strategis dalam transformasi operasional & pengembangan sumber daya manusia, berlandaskan NIB 0904250066404.",
    vision_title: "Visi",
    vision_text: "Menjadi partner konsultasi terdepan yang memberdayakan bisnis Indonesia melalui tata kelola profesional & SDM unggul.",
    mission_title: "Misi",
    mission_text: "Memberikan solusi berbasis data, pelatihan terukur, dan pendampingan implementasi yang berkelanjutan.",
    values_title: "Nilai Inti",
    values_text: "Integritas, Kolaborasi, Adaptabilitas, & Hasil Terukur.",
    services_title: "Layanan Unggulan",
    services_desc: "Solusi komprehensif sesuai KBLI: 70209, 78300, 82110 & 85500.",
    why_title: "Mengapa Memilih SIKU?",
    cta_title: "Siap Tingkatkan Performa Bisnis Anda?",
    cta_desc: "Konsultasikan kebutuhan perusahaan Anda dengan tim ahli kami. Tanpa biaya awal.",
    cta_wa: "Hubungi via WhatsApp"
  },
  en: {
    nav_home: "Home",
    nav_services: "Services",
    nav_training: "Training Programs",
    nav_team: "Expert Team",
    nav_contact: "Contact",
    hero_title: "Strategic Synergy for Your Business Growth",
    hero_desc: "Integrated management consulting, HR optimization, and administrative solutions designed for scalability & efficiency.",
    btn_consult: "Free Consultation",
    btn_services: "View Services",
    about_title: "About Us",
    about_desc: "PT SINERGI INSAN KARYA UTAMA (SIKU) is a strategic partner in operational transformation & human resource development, based on NIB 0904250066404.",
    vision_title: "Vision",
    vision_text: "To be a leading consulting partner empowering Indonesian businesses through professional governance & excellent HR.",
    mission_title: "Mission",
    mission_text: "Providing data-driven solutions, measurable training, and sustainable implementation support.",
    values_title: "Core Values",
    values_text: "Integrity, Collaboration, Adaptability, & Measurable Results.",
    services_title: "Featured Services",
    services_desc: "Comprehensive solutions aligned with KBLI: 70209, 78300, 82110 & 85500.",
    why_title: "Why Choose SIKU?",
    cta_title: "Ready to Boost Your Business Performance?",
    cta_desc: "Consult your company's needs with our expert team. No upfront cost.",
    cta_wa: "Contact via WhatsApp"
  }
};

// ================= LANGUAGE SWITCHER LOGIC =================
function setLanguage(lang) {
  const dict = translations[lang] || translations.id;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  localStorage.setItem('siku_lang', lang);
  const switcher = document.getElementById('lang-switcher');
  if (switcher) switcher.value = lang;
  document.documentElement.lang = lang;
}

// ================= HEADER HTML (Switcher dipindah ke Nav) =================
const headerHTML = `
<header class="header" id="header">
  <div class="container header__inner">
    <a href="index.html" class="header__brand">
      <img src="assets/images/logo-siku.png" alt="Logo SIKU" class="header__logo" onerror="this.src='https://via.placeholder.com/150x40/0F172A/FFFFFF?text=SIKU'">
      <span class="header__name">SIKU</span>
    </a>
    <button class="header__toggle" aria-label="Toggle Menu">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
    </button>
    <nav class="nav" id="mainNav">
      <ul class="nav__list">
        <li><a href="index.html" class="nav__link" data-i18n="nav_home">Beranda</a></li>
        <li><a href="layanan.html" class="nav__link" data-i18n="nav_services">Layanan</a></li>
        <li><a href="pelatihan.html" class="nav__link" data-i18n="nav_training">Program Pelatihan</a></li>
        <li><a href="tim.html" class="nav__link" data-i18n="nav_team">Tim Ahli</a></li>
        <li><a href="kontak.html" class="nav__link nav__cta" data-i18n="nav_contact">Kontak</a></li>
        <li class="nav-lang-wrapper">
          <select id="lang-switcher" class="nav-lang-switcher" aria-label="Language Switcher">
            <option value="id">🇮🇩 ID</option>
            <option value="en">🇬 EN</option>
          </select>
        </li>
      </ul>
    </nav>
  </div>
</header>
`;

// ================= FOOTER HTML =================
const footerHTML = `
<footer class="footer">
  <div class="container footer__grid">
    <div class="footer__brand">
      <img src="assets/images/logo-siku.png" alt="Logo SIKU" class="footer__logo" onerror="this.src='https://via.placeholder.com/120x30/0F172A/FFFFFF?text=SIKU'">
      <p class="footer__company">PT SINERGI INSAN KARYA UTAMA<br>SIKU</p>
      <p class="footer__legal">NIB: 0904250066404 | Skala Usaha: Mikro</p>
    </div>
    <nav class="footer__nav">
      <h4 class="footer__nav-title">Navigasi</h4>
      <ul class="footer__links">
        <li><a href="index.html" data-i18n="nav_home">Beranda</a></li>
        <li><a href="layanan.html" data-i18n="nav_services">Layanan</a></li>
        <li><a href="pelatihan.html" data-i18n="nav_training">Program Pelatihan</a></li>
        <li><a href="tim.html" data-i18n="nav_team">Tim Ahli</a></li>
        <li><a href="kontak.html" data-i18n="nav_contact">Kontak</a></li>
      </ul>
    </nav>
    <address class="footer__contact">
      <h4 class="footer__contact-title">Kontak</h4>
      <p>📍 Jl. Sukardi Hamdani No. 27/11, Labuhan Ratu, Bandar Lampung</p>
      <p>📧 <a href="mailto:ptsiku.indonesia@gmail.com">ptsiku.indonesia@gmail.com</a></p>
      <p>📱 +62 822-7839-9722</p>
    </address>
  </div>
  <div class="footer__bottom container">
    <p>&copy; <span id="year"></span> PT Sinergi Insan Karya Utama. Hak Cipta Dilindungi.</p>
  </div>
</footer>
`;

// ================= INJECT & INIT =================
function injectComponents() {
  const headerPH = document.getElementById('header-placeholder');
  if (headerPH) {
    headerPH.innerHTML = headerHTML;
    initHeader();
    initLanguageSwitcher();
  }
  
  const footerPH = document.getElementById('footer-placeholder');
  if (footerPH) {
    footerPH.innerHTML = footerHTML;
    document.getElementById('year').textContent = new Date().getFullYear();
  }
}

function initHeader() {
  const toggle = document.querySelector('.header__toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;
  
  const bars = toggle.querySelectorAll('.bar');
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    bars[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,6px)' : 'none';
    bars[1].style.opacity = isOpen ? '0' : '1';
    bars[2].style.transform = isOpen ? 'rotate(-45deg) translate(7px,-7px)' : 'none';
  });
  
  nav.querySelectorAll('.nav__link, .nav-lang-switcher').forEach(el => {
    el.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      bars.forEach(b => { b.style.transform = 'none'; b.style.opacity = '1'; });
    });
  });
  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === currentPage);
  });
}

function initLanguageSwitcher() {
  const switcher = document.getElementById('lang-switcher');
  if (!switcher) return;
  
  const savedLang = localStorage.getItem('siku_lang') || 'id';
  setLanguage(savedLang);
  
  switcher.addEventListener('change', (e) => setLanguage(e.target.value));
}

// ================= AUTO-INIT =================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectComponents);
} else {
  injectComponents();
}