/**
 * Netlify Function: Chat Proxy for SIKU
 * Proxies requests to OpenRouter securely using Qwen3 Next 80B A3B Instruct (Free)
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL || 'http://localhost:8888';

const SYSTEM_PROMPT = `Anda adalah SISIKU, asisten virtual PT Sinergi Insan Karya Utama (SIKU).
Perusahaan kami menyediakan layanan:
1. Konsultasi Manajemen (KPI, OKR, SOP, Risk Management)
2. Manajemen SDM (Rekrutmen, HR Outsourcing, Payroll System)
3. Jasa Administrasi Kantor (Virtual Assistant, Manajemen Dokumen)

Jawab pertanyaan pelanggan dengan profesional, ringkas, dan helpful dalam Bahasa Indonesia.
Tawarkan untuk menghubungkan dengan tim WhatsApp jika diperlukan konsultasi lebih detail.`;

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

    console.log('Received message:', message.substring(0, 50) + '...');

    // 2. Check API Key
    if (!OPENROUTER_API_KEY) {
      console.error('Missing OPENROUTER_API_KEY');
      return buildErrorResponse(500, 'Config Error', 'Fitur chat sedang maintenance (Key missing).');
    }

    // 3. Call OpenRouter with Qwen3 Next 80B A3B Instruct (Free)
    try {
      console.log('Calling OpenRouter with Qwen3 Next 80B...');
      
      // PERBAIKAN: Gunakan Model ID yang Anda temukan di Screenshot
      // Pastikan ID ini persis sama dengan yang ada di URL OpenRouter Anda
      const MODEL_ID = 'qwen/qwen3-next-80b-a3b-instruct:free'; 

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
        return buildSuccessResponse(reply);
      } else {
        const errorText = await response.text();
        console.error('OpenRouter API Error:', response.status, errorText);
        
        if (response.status === 401) {
             return buildErrorResponse(401, 'Auth Error', 'API Key tidak valid.');
        }
        
        return buildErrorResponse(response.status, 'OpenRouter Error', 'Terjadi kesalahan pada server AI.');
      }
    } catch (err) {
      console.error('OpenRouter Exception:', err.message);
      return buildErrorResponse(502, 'Network Error', 'Gagal menghubungi server AI.');
    }

  } catch (error) {
    console.error('Chat Function Critical Error:', error);
    return buildErrorResponse(500, 'Internal Error', 'Terjadi kesalahan sistem.');
  }
};