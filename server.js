/**
 * SIKU Backend Proxy Server
 * Secure API gateway untuk OpenRouter & FlowKirim
 * API Keys hidden from client-side code
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Load API keys from environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://api.openai.com/v1/chat/completions';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-mini';
const FLOWKIRIM_API_KEY = process.env.FLOWKIRIM_API_KEY;

if (!OPENROUTER_API_KEY && !GEMINI_API_KEY) {
  console.warn('⚠️  WARNING: Missing chat API keys in environment variables');
  console.warn('   Set OPENROUTER_API_KEY or GEMINI_API_KEY in .env file');
}

if (!FLOWKIRIM_API_KEY) {
  console.warn('⚠️  WARNING: Missing FLOWKIRIM_API_KEY in environment variables');
  console.warn('   Set FLOWKIRIM_API_KEY in .env file');
}

// System Prompt
const SYSTEM_PROMPT = `Anda adalah SISIKU, asisten virtual PT Sinergi Insan Karya Utama (SIKU).
Perusahaan kami menyediakan layanan:
1. Konsultasi Manajemen (KPI, OKR, SOP, Risk Management)
2. Manajemen SDM (Rekrutmen, HR Outsourcing, Payroll System)
3. Jasa Administrasi Kantor (Virtual Assistant, Manajemen Dokumen)

Jawab pertanyaan pelanggan dengan profesional, ringkas, dan helpful.
Tawarkan untuk menghubungkan dengan tim jika diperlukan konsultasi lebih detail.`;

// ================= CHAT PROXY =================
const callGemini = async (message) => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GEMINI_API_KEY}`
    },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error: ${response.status} ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa memproses permintaan ini.';
};

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    if (!OPENROUTER_API_KEY && !GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'API configuration missing',
        reply: 'Maaf, fitur chat sedang tidak tersedia. Silakan hubungi kami via WhatsApp.'
      });
    }

    if (OPENROUTER_API_KEY) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.SITE_URL || 'http://localhost:5000',
            'X-Title': 'SIKU Chatbot'
          },
          body: JSON.stringify({
            model: 'qwen/qwen3.6-plus-preview:free',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa memproses permintaan ini.';
          return res.json({ reply });
        }

        const error = await response.json().catch(() => ({}));
        console.error('OpenRouter API error:', error);
      } catch (error) {
        console.error('OpenRouter request failed:', error);
      }
    }

    if (GEMINI_API_KEY) {
      try {
        const reply = await callGemini(message);
        return res.json({ reply });
      } catch (error) {
        console.error('Gemini API error:', error);
        return res.status(502).json({
          error: 'Gemini API Error',
          reply: 'Maaf, ada masalah dengan server chat. Silakan coba lagi nanti.'
        });
      }
    }

    return res.status(500).json({
      error: 'Chat API Error',
      reply: 'Maaf, fitur chat sedang tidak tersedia. Silakan hubungi kami via WhatsApp.'
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: error.message,
      reply: 'Maaf, ada kesalahan teknis. Silakan coba lagi.'
    });
  }
});

// ================= WHATSAPP PROXY =================
app.post('/api/whatsapp', async (req, res) => {
  try {
    const { to, message, type = 'text' } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Invalid to or message' });
    }

    if (!FLOWKIRIM_API_KEY) {
      return res.status(500).json({ 
        success: false,
        error: 'WhatsApp API configuration missing' 
      });
    }

    const response = await fetch('https://api.flowkirim.com/v1/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FLOWKIRIM_API_KEY}`
      },
      body: JSON.stringify({
        to,
        message,
        type
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('FlowKirim API error:', error);
      return res.status(response.status).json({
        success: false,
        error: 'WhatsApp API Error'
      });
    }

    const result = await response.json();
    res.json({ success: result.success || false });
  } catch (error) {
    console.error('WhatsApp endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ================= HEALTH CHECK =================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SIKU backend is running' });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`\n🚀 SIKU Backend Server running on http://localhost:${PORT}`);
  console.log('📍 API endpoints:');
  console.log('   POST /api/chat       - Chat with SISIKU');
  console.log('   POST /api/whatsapp   - Send WhatsApp message');
  console.log('   GET  /api/health     - Health check\n');
});
