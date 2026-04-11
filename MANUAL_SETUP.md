# 📖 MANUAL SETUP & DEPLOYMENT - Website SIKU

Panduan lengkap untuk setup, development, dan deployment manual website PT SINERGI INSAN KARYA UTAMA (SIKU).

---

## 1. SETUP LOKAL (Development)

### Langkah 1: Clone Repository

```powershell
# Buka folder tempat Anda ingin project
cd D:\projects

# Clone dari GitHub
git clone https://github.com/robby4505/website-ptsiku.git
cd website-ptsiku
```

### Langkah 2: Install Dependencies

```powershell
# Install npm packages
npm install
```

**Expected output:**
```
added XX packages in X.XXs
```

### Langkah 3: Setup Environment Variables

```powershell
# Copy template ke .env
copy .env.example .env

# Edit .env dengan text editor (Notepad, VSCode, dll)
# Isi dengan API keys Anda:
# OPENROUTER_API_KEY=sk-or-v1-xxxx
# FLOWKIRIM_API_KEY=your-key
```

**File `.env` (JANGAN commit ke git):**
```
OPENROUTER_API_KEY=sk-or-v1-your_actual_key_here
FLOWKIRIM_API_KEY=your_actual_key_here
PORT=5000
NODE_ENV=development
SITE_URL=http://localhost:3000
SITE_NAME=SIKU Chatbot
```

### Langkah 4: Jalankan Frontend

```powershell
# Terminal 1 - Jalankan frontend
npm run dev

# Output:
# npx serve . -l 3000
# Serving!
# - Local:    http://localhost:3000
# - Network:  http://192.168.x.x:3000
```

**Buka browser:** http://localhost:3000

### Langkah 5: Jalankan Backend (di terminal baru)

```powershell
# Terminal 2 - Jalankan backend server
npm run server

# Output:
# 🚀 SIKU Backend Server running on http://localhost:5000
# 📍 API endpoints:
#    POST /api/chat       - Chat with SISIKU
#    POST /api/whatsapp   - Send WhatsApp message
#    GET  /api/health     - Health check
```

### Langkah 6: Test API

```powershell
# Terminal 3 - Test chat endpoint
curl -X POST http://localhost:5000/api/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"Halo SIKU\"}"

# Expected response:
# {"reply":"...balasan dari AI..."}
```

---

## 2. STRUKTUR FOLDER

```
website-ptsiku/
├── index.html                 # Halaman utama
├── components.js              # Header & Footer reusable
├── server.js                  # Backend proxy server
├── package.json               # Dependencies
├── .env.example               # Template environment variables
├── .env                       # Actual keys (JANGAN commit)
├── .gitignore                 # File yang diignore git
│
├── assets/
│   ├── css/
│   │   └── style.css          # Semua styling
│   ├── js/
│   │   ├── chatbot.js         # Chatbot widget (tanpa API keys)
│   │   └── main.js            # Blog & archive logic
│   ├── images/
│   │   └── logo-siku.png
│   ├── data/
│   │   └── blog-archive.json  # Metadata 10 artikel
│   └── blog/
│       ├── article-1.html
│       ├── article-2.html
│       └── ... (10 artikel)
│
├── MANUAL_SETUP.md            # File ini
├── DEPLOYMENT_SECURE.md       # Panduan deployment aman
├── SECURITY.md                # Informasi keamanan
└── README.md                  # Overview project
```

---

## 3. DEVELOPMENT

### Edit HTML

**File:** `index.html`
- Hero section, About, Training Schedule, Services, CTA

**File:** `components.js`
- Header dengan navbar dan translator widget
- Footer dengan informasi perusahaan

**Blog pages:** `assets/blog/article-X.html`
- 10 artikel (article-1.html sampai article-10.html)

### Edit CSS

**File:** `assets/css/style.css`
- Semua styling (header, hero, sections, responsive, chatbot)
- Update di sini untuk perubahan design

### Edit JavaScript

**File:** `assets/js/chatbot.js`
- Chatbot widget logic (UI, event handlers)
- Panggilan ke backend: `/api/chat`, `/api/whatsapp`
- JANGAN simpan API keys di sini

**File:** `assets/js/main.js`
- Blog archive loading dari JSON
- Category filter dan rendering

**File:** `server.js`
- Backend proxy untuk OpenRouter dan FlowKirim
- Handle API calls dengan API keys aman

### Workflow Development

```powershell
# 1. Edit file (HTML/CSS/JS)
# ..edit index.html atau assets/css/style.css..

# 2. Save file (Ctrl+S)

# 3. Browser auto-refresh (live reload)
# - Frontend: http://localhost:3000 auto-refresh
# - Backend: restart manual (Ctrl+C, npm run server)

# 4. Test di browser, check console (F12)

# 5. Setelah fix, git add dan commit
git add .
git commit -m "Fix: deskripsi perubahan"
git push origin master
```

---

## 4. DEPLOYMENT

### Option A: GitHub Pages (Frontend Only)

**Kelebihan:** Gratis, cepat, tidak perlu backend
**Kekurangan:** Chatbot features tidak berfungsi

**Steps:**
1. Push ke GitHub repo
2. Settings → Pages → Deploy from branch `master`
3. Akses: https://robby4505.github.io/website-ptsiku/

### Option B: Netlify (Recommended)

**Kelebihan:** Gratis, support serverless functions, auto-deploy dari GitHub
**Kekurangan:** Setup sedikit lebih kompleks

**Steps:**

1. **Login ke Netlify:**
   - Buka https://netlify.com
   - Sign up / Login (pakai GitHub account)

2. **Connect Repository:**
   - New site from Git → GitHub
   - Authorize Netlify
   - Select: `robby4505/website-ptsiku`

3. **Configure Build:**
   ```
   Build command: npm install
   Publish directory: . (current directory)
   ```

4. **Set Environment Variables:**
   - Site settings → Build & deploy → Environment
   - Add variables:
     ```
     OPENROUTER_API_KEY = sk-or-v1-xxxx
     FLOWKIRIM_API_KEY = your-key
     PORT = 5000
     ```

5. **Create Netlify Functions:**
   - Buat folder: `/netlify/functions/`
   - Copy isi `/server.js` ke 2 files:
     - `/netlify/functions/chat.js` - handle `/api/chat`
     - `/netlify/functions/whatsapp.js` - handle `/api/whatsapp`
   - Update `assets/js/chatbot.js`:
     ```javascript
     const API_CONFIG = {
       CHAT_ENDPOINT: '/.netlify/functions/chat',
       WHATSAPP_ENDPOINT: '/.netlify/functions/whatsapp',
       PHONE_NUMBER: '6282278399722'
     };
     ```

6. **Deploy:**
   - Push changes ke GitHub
   - Netlify auto-deploy
   - Akses: https://website-ptsiku.netlify.app/

### Option C: Vercel

**Kelebihan:** Gratis, cepat, serverless functions
**Kekurangan:** Setup mirip Netlify

**Steps:**

1. **Login ke Vercel:**
   - Buka https://vercel.com
   - Sign up / Login (pakai GitHub)

2. **Import Project:**
   - New Project → GitHub
   - Select `website-ptsiku`
   - Framework: Next.js(?) → Other (custom)

3. **Configure:**
   - Build Command: `npm install`
   - Output Directory: `.`
   - Environment Variables:
     ```
     OPENROUTER_API_KEY = sk-or-v1-xxxx
     FLOWKIRIM_API_KEY = your-key
     ```

4. **Create Vercel Functions:**
   - Buat folder: `/api/`
   - File: `/api/chat.js` dan `/api/whatsapp.js`
   - Copy dari `/server.js` handler
   - Update `assets/js/chatbot.js`:
     ```javascript
     const API_CONFIG = {
       CHAT_ENDPOINT: '/api/chat',
       WHATSAPP_ENDPOINT: '/api/whatsapp',
       PHONE_NUMBER: '6282278399722'
     };
     ```

5. **Deploy:**
   - Vercel auto-deploy dari GitHub
   - Akses: https://website-ptsiku.vercel.app/

### Option D: VPS / Server Sendiri

**Kelebihan:** Full control, tidak ada batasan
**Kekurangan:** Perlu bayar hosting, manage server sendiri

**Requirements:**
- VPS / Dedicated Server
- Node.js v14+ installed
- Domain (optional tapi recommended)

**Setup:**

1. **SSH ke Server:**
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Node.js & Git:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs git
   ```

3. **Clone Repository:**
   ```bash
   cd /var/www
   git clone https://github.com/robby4505/website-ptsiku.git
   cd website-ptsiku
   npm install
   ```

4. **Setup Environment:**
   ```bash
   nano .env
   # Isi dengan API keys
   # Tekan Ctrl+X, Y, Enter untuk save
   ```

5. **Install PM2 (Process Manager):**
   ```bash
   npm install -g pm2
   ```

6. **Start Server:**
   ```bash
   pm2 start server.js --name "siku-backend"
   pm2 start "npx serve . -l 3000" --name "siku-frontend"
   pm2 save
   pm2 startup
   ```

7. **Setup Reverse Proxy (Nginx):**
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   **Isi dengan:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Frontend
       location / {
           proxy_pass http://localhost:3000;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
       }
   }
   ```

   ```bash
   sudo systemctl restart nginx
   ```

8. **Setup SSL (HTTPS):**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

9. **Akses:** https://your-domain.com/

---

## 5. TESTING

### Test Frontend

```
1. Open http://localhost:3000
2. Check:
   - Header & navbar (hamburger di mobile)
   - Hero section dengan buttons
   - About section (Visi/Misi/Nilai)
   - Blog sidebar (filter kategori, article list)
   - Training schedule table
   - Services section
   - CTA buttons
   - Footer
```

### Test Chatbot

```
1. Click tombol "S" di bottom-right
2. Ketik: "Halo"
3. Check:
   - Chat window muncul
   - Message terkirim
   - Response dari AI muncul (jika backend running)
   - Typing indicator
```

### Test API Backend

**Terminal test:**
```powershell
# Test /api/health
curl -X GET http://localhost:5000/api/health

# Test /api/chat
curl -X POST http://localhost:5000/api/chat `
  -H "Content-Type: application/json" `
  -d "{\"message\":\"Apa itu SIKU?\"}"

# Expected response:
# {"reply":"Kami adalah PT Sinergi Insan..."}
```

### Test Blog

```
1. Scroll ke Artikel & Insights (section kiri)
2. Check:
   - 10 artikel terbaru terlihat
   - Filter kategori ada 4 tipe
   - Klik kategori → list berubah
   - Klik artikel → buka article page
3. Check article page:
   - Judul, date, category
   - Konten artikel
   - Breadcrumb navigation
```

### Test Responsive (Mobile)

```
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Test breakpoints:
   - Mobile (320px): Menu hamburger
   - Tablet (768px): 2-column layout
   - Desktop (1200px): Full layout
4. Check:
   - Text readability
   - Button ukuran
   - Image scaling
   - Form input
```

---

## 6. GIT WORKFLOW

### Daily Development

```powershell
# 1. Check status
git status

# 2. Add changes
git add .
git add index.html assets/css/style.css

# 3. Commit
git commit -m "Feature: add new blog section"

# 4. Push
git push origin master

# 5. Pull (update dari team)
git pull origin master
```

### Important: Never Commit

```powershell
# ❌ JANGAN commit ini:
git add .env        # ❌ API keys exposed!
git add config.js   # ❌ Secrets exposed!

# ✅ Only add safe files:
git add index.html assets/ components.js
```

### Check Ignored Files

```powershell
# Verify .env dan config.js ignored
git check-ignore .env config.js
# Output: .gitignore:11:.env
```

---

## 7. TROUBLESHOOTING

### Error: "Port 3000 already in use"

```powershell
# Find process using :3000
netstat -ano | findstr :3000

# Kill process (replace XXXX dengan PID)
taskkill /PID XXXX /F

# Or use different port
npx serve . -l 3001
```

### Error: "Cannot find module 'express'"

```powershell
# Install dependencies
npm install

# Or specific package
npm install express cors node-fetch dotenv
```

### Error: "OPENROUTER_API_KEY is missing"

```
1. Check .env file exists
2. Verify API key filled in
3. Restart backend: npm run server
4. Check .env example format
```

### Frontend tidak connect ke Backend

```
1. Check backend running: curl http://localhost:5000/api/health
2. Check CORS enabled di server.js
3. Check API_CONFIG endpoint benar di chatbot.js
4. Check browser console (F12) untuk error
```

### Blog articles tidak load

```
1. Check assets/data/blog-archive.json exist
2. Check browser console (F12) untuk fetch error
3. Verify JSON format valid (gunakan https://jsonlint.com/)
4. Check assets path di main.js benar
```

---

## 8. QUICK COMMANDS

```powershell
# Development
npm install          # Install packages
npm run dev          # Frontend :3000
npm run server       # Backend :5000
npm run server:dev   # Backend dengan watch

# Git
git status           # Check changes
git add .            # Stage semua
git commit -m "msg"  # Commit
git push             # Push ke GitHub
git pull             # Pull dari GitHub
git log --oneline    # See commits

# Browser Test
http://localhost:3000      # Frontend
http://localhost:5000      # Backend
http://localhost:5000/api/health  # Health check
```

---

## 9. CHECKLIST BEFORE DEPLOYMENT

- [ ] `.env` file created dengan API keys terisi
- [ ] `npm install` sudah jalan
- [ ] Frontend bisa diakses http://localhost:3000
- [ ] Backend bisa diakses http://localhost:5000/api/health
- [ ] Chatbot widget bisa dikirim message
- [ ] Blog articles loading
- [ ] Responsive design OK di mobile
- [ ] Tidak ada console errors (F12)
- [ ] `.env` dan `config.js` ada di .gitignore
- [ ] Commit message jelas dan deskriptif
- [ ] Push ke GitHub successful

---

## 10. SUPPORT

Jika ada pertanyaan atau error:

1. **Check console:**
   - Browser: F12 → Console
   - Terminal: lihat error message

2. **Check logs:**
   - Backend: cek output terminal
   - Frontend: check Network tab (F12)

3. **Common errors:**
   - Missing .env → create from .env.example
   - Port in use → kill process atau ganti port
   - Module not found → npm install
   - CORS error → check server.js

4. **Contact:**
   - Tim SIKU: ptsiku.indonesia@gmail.com
   - WhatsApp: +62 822-7839-9722

---

**Last Updated:** April 11, 2026
**Version:** 1.0
**Status:** Production Ready
