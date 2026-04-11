# Website SIKU

Website resmi PT Sinergi Insan Karya Utama (SIKU) - Konsultasi Manajemen & SDM

## 🚀 Fitur

- **Responsive Design**: Kompatibel dengan desktop dan mobile
- **Multi-language**: Dukungan bahasa Indonesia dan Inggris
- **AI Chatbot**: Asisten virtual SISIKU menggunakan OpenRouter API
- **WhatsApp Integration**: Integrasi dengan FlowKirim untuk komunikasi
- **Modern UI**: Desain dengan Plus Jakarta Sans font

## 📁 Struktur Folder

```
├── 📄 index.html              # Halaman beranda
├── 📄 layanan.html            # Halaman layanan
├── 📄 pelatihan.html          # Halaman pelatihan
├── 📄 kontak.html             # Halaman kontak
├── 📄 tim.html                # Halaman tim ahli
├── 📄 components.js           # Header/footer terpusat
├── 📄 config.example.js       # Template konfigurasi API
├── 📄 package.json            # Dependencies dan scripts
├── 📁 assets/
│   ├── 📁 css/
│   │   └── 📄 style.css       # Styling utama
│   ├── 📁 js/
│   │   ├── 📄 main.js         # Script utama
│   │   └── 📄 chatbot.js      # Chatbot SISIKU
│   └── 📁 images/             # Gambar dan logo
├── 📄 .env.example            # Template environment variables
├── 📄 .gitignore              # File yang di-ignore git
├── 📄 SECURITY.md             # Kebijakan keamanan
└── 📄 README.md               # Dokumentasi ini
```

## 🔧 Setup & Instalasi

### Prerequisites
- Node.js >= 14.0.0
- Git

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/username/website-siku.git
   cd website-siku
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup konfigurasi API**
   ```bash
   cp config.example.js config.js
   # Edit config.js dan isi API keys yang sebenarnya
   ```

4. **Setup environment (opsional)**
   ```bash
   cp .env.example .env
   # Edit .env jika diperlukan
   ```

5. **Jalankan development server**
   ```bash
   npm run dev
   ```

## 🔒 Keamanan

**PENTING:** Jangan commit file `config.js` atau `.env` ke repository!

- API keys disimpan di `config.js` (tidak di-commit)
- Gunakan `config.example.js` sebagai template
- Baca `SECURITY.md` untuk detail kebijakan keamanan

## 📜 Scripts

- `npm start` - Jalankan server production
- `npm run dev` - Jalankan development server
- `npm run preview` - Preview build

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📞 Kontak

PT Sinergi Insan Karya Utama
- Email: ptsiku.indonesia@gmail.com
- WhatsApp: +62 822-7839-9722
- Alamat: Jl. Sukardi Hamdani No. 27/11, Labuhan Ratu, Bandar Lampung

## 📄 Lisensi

© 2026 PT Sinergi Insan Karya Utama. Hak Cipta Dilindungi.