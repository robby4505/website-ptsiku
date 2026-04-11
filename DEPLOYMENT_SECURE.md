# 🔒 SIKU Secure Deployment Guide

## Arsitektur Keamanan

Website SIKU menggunakan **backend proxy pattern** untuk menjaga API keys tetap aman:

```
Client (Frontend)           Backend Proxy Server          External APIs
┌──────────────┐           ┌──────────────┐            ┌─────────────┐
│   Chatbot    │──POST──→  │ /api/chat    │──POST──→  │ OpenRouter  │
│   Widget     │           │ /api/whatsapp│           │ FlowKirim   │
└──────────────┘           └──────────────┘            └─────────────┘
  No secrets               API Keys here (secure)       Public APIs
  Exposed in              Environment Variables         with tokens
  GitHub                  Never in source code
```

## Perbedaan Environment

### 1. Development (Local)

```bash
# Install dependencies
npm install

# Set up local .env file (NOT committed to git)
echo "OPENROUTER_API_KEY=sk-or-v1-xxxx" > .env
echo "FLOWKIRIM_API_KEY=your-key-here" >> .env

# Run both frontend and backend
npm run dev           # Frontend on port 3000
npm run server:dev    # Backend on port 5000
```

### 2. Production (GitHub Pages / Netlify / Vercel)

**Option A: GitHub Pages (Static Only)**
- ✅ Frontend hanya berisi kode HTML/CSS/JS publik
- ❌ Chatbot features disabled (tanpa backend)

**Option B: Netlify (Recommended)**
1. Fork repository
2. Deploy ke Netlify
3. Set environment variables di Netlify UI:
   - `OPENROUTER_API_KEY` = your_key
   - `FLOWKIRIM_API_KEY` = your_key
4. Ubah `API_CONFIG` di `assets/js/chatbot.js`:
   ```javascript
   const API_CONFIG = {
     CHAT_ENDPOINT: '/.netlify/functions/chat',
     WHATSAPP_ENDPOINT: '/.netlify/functions/whatsapp',
     PHONE_NUMBER: '6282278399722'
   };
   ```
5. Buat `/netlify/functions/chat.js` dan `/netlify/functions/whatsapp.js` dengan isi `server.js`

**Option C: Vercel (Recommended)**
1. Fork repository
2. Deploy ke Vercel
3. Set environment variables di Vercel UI
4. Ubah `API_CONFIG` di `assets/js/chatbot.js`:
   ```javascript
   const API_CONFIG = {
     CHAT_ENDPOINT: '/api/chat',
     WHATSAPP_ENDPOINT: '/api/whatsapp',
     PHONE_NUMBER: '6282278399722'
   };
   ```
5. Buat `/api/chat.js` dan `/api/whatsapp.js` dengan isi `server.js`

**Option D: Traditional VPS/Server**
1. Install Node.js
2. Clone repository
3. Set environment variables:
   ```bash
   export OPENROUTER_API_KEY=sk-or-v1-xxxx
   export FLOWKIRIM_API_KEY=your-key
   export PORT=5000
   ```
4. Run server: `npm run server`
5. Use reverse proxy (nginx/apache) untuk handle frontend + backend

## Checklist Keamanan

✅ **Sudah Aman:**
- [ ] API keys hanya ada di `.env` atau environment variables
- [ ] `config.js` dan `.env` ada di `.gitignore`
- [ ] `assets/js/chatbot.js` tidak lagi import `config.js`
- [ ] Semua API calls via backend proxy
- [ ] Tidak ada secrets di source code yang di-commit

**Jika deploy ke GitHub:**
- [ ] Set private repository ATAU hanya commit file publik
- [ ] Jangan pernah commit `.env` atau `config.js`
- [ ] Gunakan GitHub Secrets untuk CI/CD (jika ada)

**Jika deploy ke Netlify/Vercel:**
- [ ] Set environment variables di dashboard (bukan di code)
- [ ] Gunakan Netlify Functions atau Vercel Functions
- [ ] Test API endpoints sebelum production

## Testing

### Local Test

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend  
npm run server:dev

# Terminal 3: Test API
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Halo SIKU"}' 

curl -X GET http://localhost:5000/api/health
```

## Environment Variables

File `.env` (JANGAN commit ke git):

```env
# OpenRouter - AI Chat API
OPENROUTER_API_KEY=sk-or-v1-xxxx_your_actual_key_here

# FlowKirim - WhatsApp Messaging
FLOWKIRIM_API_KEY=your_actual_flowkirim_key_here

# Optional
PORT=5000
SITE_URL=http://localhost:3000
SITE_NAME=SIKU Chatbot
NODE_ENV=development
```

## Troubleshooting

**Error: "API configuration missing"**
- Set `OPENROUTER_API_KEY` di `.env`
- Jalankan `npm run server` dengan env vars set

**Error: "Invalid message"**
- Frontend mengirim data berformat salah
- Periksa console browser untuk error

**Error: "Chat API Error"**
- OpenRouter API down atau API key invalid
- Cek API key dan rate limits

## Deployment Checklist

- [ ] `.env` dan `config.js` TIDAK di-commit
- [ ] `.gitignore` berisi `.env` dan `config.js`
- [ ] Backend proxy (`server.js`) sudah tested
- [ ] Environment variables set di production
- [ ] CORS dienable hanya dari domain yang diizinkan
- [ ] API rate limiting dienable (di OpenRouter/FlowKirim dashboard)
- [ ] Monitoring dan logging aktif
- [ ] SSL/HTTPS enabled di production

## Support

Untuk pertanyaan keamanan atau masalah deployment, hubungi tim SIKU.
