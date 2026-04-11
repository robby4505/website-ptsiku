// config.example.js - API Configuration Template
// Copy this file to config.js and fill in your actual API keys
// DO NOT commit config.js to git

const CONFIG = {
  OPENROUTER: {
    API_KEY: 'your_openrouter_api_key_here',
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    MODEL: 'qwen/qwen3.6-plus-preview:free',
    SITE_URL: window.location.origin,
    SITE_NAME: 'SIKU - PT Sinergi Insan Karya Utama'
  },
  FLOWKIRIM: {
    API_KEY: 'your_flowkirim_api_key_here',
    API_URL: 'https://api.flowkirim.com/v1/send-message',
    PHONE_NUMBER: '6282278399722'
  },
  SYSTEM_PROMPT: `Anda adalah SISIKU, asisten virtual PT Sinergi Insan Karya Utama.
Tugas: membantu pengunjung dengan informasi tentang layanan konsultasi manajemen (KPI, OKR, SOP, Risk Management),
pelatihan SDM, administrasi kantor, dan solusi software NEXTUS (ERP, HRIS, Financial).
Jawab dengan ramah, profesional, singkat (max 3 kalimat), dalam bahasa Indonesia.
Jika ditanya kontak: Email: ptsiku.indonesia@gmail.com | WA: 0822-7839-9722 | Alamat: Jl. Sukardi Hamdani No. 27/11, Bandar Lampung.
Jika pertanyaan di luar scope, arahkan ke halaman kontak atau WhatsApp.`,
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7
};

export default CONFIG;