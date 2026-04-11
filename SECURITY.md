# Kebijakan Keamanan - Website SIKU

## 🔒 Praktik Keamanan

Website ini menerapkan beberapa langkah keamanan untuk melindungi data dan API keys:

### API Keys Protection
- API keys TIDAK boleh di-hardcode dalam source code
- Gunakan file `config.js` (yang tidak di-commit ke git) untuk menyimpan API keys
- File `.env` juga tidak di-commit dan hanya untuk development server

### File yang Tidak Di-commit
- `.env` - Environment variables
- `config.js` - API configuration
- `node_modules/` - Dependencies
- File log dan cache

### Penggunaan API
- OpenRouter API: Digunakan untuk chatbot AI dengan rate limiting
- FlowKirim API: Digunakan untuk WhatsApp integration dengan validasi input

### HTTPS
- Pastikan website di-deploy dengan HTTPS untuk keamanan komunikasi

## 🚨 Laporan Kerentanan

Jika Anda menemukan kerentanan keamanan, harap hubungi:
- Email: security@ptsiku.com
- WhatsApp: +62 822-7839-9722

## 📋 Checklist Keamanan Sebelum Deploy

- [ ] Hapus semua API keys dari source code
- [ ] Pastikan `.env` dan `config.js` tidak di-commit
- [ ] Gunakan HTTPS di production
- [ ] Validasi semua input user
- [ ] Rate limiting untuk API calls
- [ ] Monitor logs untuk aktivitas mencurigakan

## 🔧 Setup Aman

1. Copy `config.example.js` ke `config.js`
2. Isi API keys yang sebenarnya di `config.js`
3. Pastikan `config.js` ada di `.gitignore`
4. Jangan commit `config.js` ke repository publik