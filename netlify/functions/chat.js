/**
 * Netlify Function: Chat Proxy for SIKU
 * Proxies requests to OpenRouter or Gemini API securely
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// URL Resmi Google Generative Language API (Bukan OpenAI)
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'; 
const SITE_URL = process.env.SITE_URL || ''; // Ambil dari Env Vars Netlify, jangan hardcode

const SYSTEM_PROMPT = `Anda adalah SISIKU, asisten virtual PT Sinergi Insan Karya Utama (SIKU).
Layanan kami:
1. Konsultasi Manajemen (KPI, OKR, SOP)
2. Manajemen SDM (Rekrutmen, HR Outsourcing)
3. Jasa Administrasi Kantor

Jawab dengan profesional, ringkas, dan helpful dalam Bahasa Indonesia.`;

const buildSuccessResponse = (reply) => ({
  statusCode: 200,
  headers: { 
    'Access-Control-Allow-Origin': '*', 
    'Content-Type': 'application/json' 
  },
  body: JSON.stringify({ reply })
});

const buildErrorResponse = (status, error, reply) => ({
  statusCode: status,
  headers: { 
    'Access-Control-Allow-Origin': '*', 
    'Content-Type': 'application/json' 
  },
  body: JSON.stringify({ error, reply })
});

// Helper khusus untuk format API Gemini (Google AI SDK Format)
const callGemini = async (message) => {
  if (!GEMINI_API_KEY) throw new Error('Missing Gemini Key');

  const payload = {
    contents: [{
      parts: [{
        text: `${SYSTEM_PROMPT}\n\nUser: ${message}`
      }]
    }]
  };

  // Gemini menggunakan query parameter key, bukan Header Authorization
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API Error: ${response.status} - ${JSON.stringify(errData)}`);
  }

  const data = await response.json();
  // Extract text dari struktur respons Gemini
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, saya tidak bisa memproses permintaan ini.';
};

exports.handler = async (event) => {
  // 1. Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return buildErrorResponse(405, 'Method Not Allowed', 'Only POST allowed');
  }

  try {
    const { message } = JSON.parse(event.body || '{}');

    if (!message || typeof message !== 'string') {
      return buildErrorResponse(400, 'Invalid message', 'Pesan tidak valid.');
    }

    if (!OPENROUTER_API_KEY && !GEMINI_API_KEY) {
      return buildErrorResponse(500, 'Config Error', 'Fitur chat sedang maintenance.');
    }

    // 2. Try OpenRouter (Qwen) First
    if (OPENROUTER_API_KEY) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': SITE_URL,
            'X-Title': 'SIKU Chatbot'
          },
          body: JSON.stringify({
            model: 'qwen/qwen-2.5-7b-instruct:free', // Model stabil & free
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
          return buildSuccessResponse(reply);
        }
      } catch (err) {
        console.warn('OpenRouter failed, falling back to Gemini');
      }
    }

    // 3. Fallback to Gemini
    if (GEMINI_API_KEY) {
      try {
        const reply = await callGemini(message);
        return buildSuccessResponse(reply);
      } catch (err) {
        console.error('Gemini Error:', err.message);
        return buildErrorResponse(502, 'Gemini Error', 'Terjadi kesalahan pada server AI.');
      }
    }

    return buildErrorResponse(500, 'No Provider', 'Layanan chat tidak tersedia.');

  } catch (error) {
    console.error('Chat Function Critical Error:', error);
    return buildErrorResponse(500, 'Internal Error', 'Terjadi kesalahan sistem.');
  }
};