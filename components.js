/**
 * SIKU - Reusable Components & Language Switcher
 * Header & Footer terpusat via JavaScript
 */

// ================= TRANSLATOR SETUP =================
function initGoogleTranslate() {
  if (window.googleTranslateInitialized) return;
  window.googleTranslateInitialized = true;

  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'id',
      includedLanguages: 'en,id',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element');
  };

  const script = document.createElement('script');
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.type = 'text/javascript';
  document.body.appendChild(script);
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
        <li><a href="index.html" class="nav__link">Beranda</a></li>
        <li><a href="layanan.html" class="nav__link">Layanan</a></li>
        <li><a href="pelatihan.html" class="nav__link">Program Pelatihan</a></li>
        <li><a href="tim.html" class="nav__link">Tim Ahli</a></li>
        <li><a href="kontak.html" class="nav__link nav__cta">Kontak</a></li>
        <li class="nav-lang-wrapper">
          <div id="google_translate_element"></div>
        </li>
      </ul>
    </nav>
  </div>
</header>
`;

// ================= FOOTER HTML =================
const footerHTML = `
<footer class="footer">
  <div class="container">
    <div class="footer__top">
      <div class="footer__section footer__brand">
        <img src="assets/images/logo-siku.png" alt="Logo SIKU" class="footer__logo" onerror="this.src='https://via.placeholder.com/100x25/0F172A/FFFFFF?text=SIKU'">
        <div class="footer__info">
          <p class="footer__company">PT SINERGI INSAN KARYA UTAMA</p>
          <p class="footer__company">SIKU</p>
          <p class="footer__legal">NIB: 0904250066404 | Skala Usaha: Mikro</p>
        </div>
      </div>
      <nav class="footer__section footer__nav">
        <h4 class="footer__nav-title">Navigasi</h4>
        <ul class="footer__links">
          <li><a href="index.html">Beranda</a></li>
          <li><a href="layanan.html">Layanan</a></li>
          <li><a href="pelatihan.html">Program Pelatihan</a></li>
          <li><a href="tim.html">Tim Ahli</a></li>
          <li><a href="kontak.html">Kontak</a></li>
        </ul>
      </nav>
      <address class="footer__section footer__contact">
        <h4 class="footer__contact-title">Kontak</h4>
        <p>📍 Jl. Sukardi Hamdani No. 27/11, Labuhan Ratu, Bandar Lampung</p>
        <p>📧 <a href="mailto:ptsiku.indonesia@gmail.com">ptsiku.indonesia@gmail.com</a></p>
        <p>📱 +62 822-7839-9722</p>
      </address>
    </div>
    <div class="footer__bottom">
      <p>&copy; <span id="year"></span> PT Sinergi Insan Karya Utama. Hak Cipta Dilindungi.</p>
    </div>
  </div>
</footer>
`;

// ================= INJECT & INIT =================
function injectComponents() {
  const headerPH = document.getElementById('header-placeholder');
  if (headerPH) {
    headerPH.innerHTML = headerHTML;
    initHeader();
    initGoogleTranslate();
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
  
  nav.querySelectorAll('.nav__link').forEach(el => {
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

// ================= AUTO-INIT =================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectComponents);
} else {
  injectComponents();
}