/**
 * Vercel API Route: Chat Proxy for SIKU
 * File: api/chat.js
 */

// Vercel secara otomatis menyediakan process.env dari Environment Variables dashboard

const SYSTEM_PROMPT = `Anda adalah SISIKU, asisten virtual PT Sinergi Insan Karya Utama (SIKU).
Perusahaan kami menyediakan layanan:
1. Konsultasi Manajemen (KPI, OKR, SOP, Risk Management)
2. Manajemen SDM (Rekrutmen, HR Outsourcing, Payroll System)
3. Jasa Administrasi Kantor (Virtual Assistant, Manajemen Dokumen)

Jawab pertanyaan pelanggan dengan profesional, ringkas, dan helpful dalam Bahasa Indonesia.
Tawarkan untuk menghubungkan dengan tim WhatsApp jika diperlukan konsultasi lebih detail.`;

export default async function handler(req, res) {
  // 1. Handle CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', reply: 'Only POST allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message', reply: 'Pesan tidak valid.' });
    }

    console.log('Received message:', message.substring(0, 50) + '...');

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const SITE_URL = process.env.SITE_URL || 'https://ptsiku.vercel.app'; // Sesuaikan nanti

    if (!OPENROUTER_API_KEY) {
      console.error('Missing OPENROUTER_API_KEY');
      return res.status(500).json({ error: 'Config Error', reply: 'Fitur chat sedang maintenance (Key missing).' });
    }

    // 2. Call OpenRouter with Stable Free Model
    try {
      console.log('Calling OpenRouter...');
      
      // Gunakan Model ID yang Stabil & Gratis
      const MODEL_ID = 'meta-llama/llama-3.1-8b-instruct:free'; 

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': SITE_URL,
          'X-Title': 'SIKU Chatbot'
        },
        body: JSON.stringify({
          model: MODEL_ID,
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
        const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak memahami pertanyaan Anda.';
        console.log('OpenRouter Success');
        return res.status(200).json({ reply });
      } else {
        const errorText = await response.text();
        console.error('OpenRouter API Error:', response.status, errorText);
        
        if (response.status === 429) {
             return res.status(429).json({ error: 'Rate Limit', reply: 'Server AI sedang sibuk. Silakan tunggu sebentar.' });
        }
        
        if (response.status === 401) {
             return res.status(401).json({ error: 'Auth Error', reply: 'API Key tidak valid.' });
        }
        
        return res.status(response.status).json({ error: 'OpenRouter Error', reply: 'Terjadi kesalahan pada server AI.' });
      }
    } catch (err) {
      console.error('OpenRouter Exception:', err.message);
      return res.status(502).json({ error: 'Network Error', reply: 'Gagal menghubungi server AI.' });
    }

  } catch (error) {
    console.error('Chat API Critical Error:', error);
    return res.status(500).json({ error: 'Internal Error', reply: 'Terjadi kesalahan sistem.' });
  }
}