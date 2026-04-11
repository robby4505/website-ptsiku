/**
 * Netlify Function: Chat Proxy
 * Proxies requests to OpenRouter API securely
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL || 'https://ptsiku.netlify.app';

const SYSTEM_PROMPT = `Anda adalah SISIKU, asisten virtual PT Sinergi Insan Karya Utama (SIKU).
Perusahaan kami menyediakan layanan:
1. Konsultasi Manajemen (KPI, OKR, SOP, Risk Management)
2. Manajemen SDM (Rekrutmen, HR Outsourcing, Payroll System)
3. Jasa Administrasi Kantor (Virtual Assistant, Manajemen Dokumen)

Jawab pertanyaan pelanggan dengan profesional, ringkas, dan helpful.
Tawarkan untuk menghubungkan dengan tim jika diperlukan konsultasi lebih detail.`;

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { message } = JSON.parse(event.body || '{}');

    if (!message || typeof message !== 'string') {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid message' })
      };
    }

    if (!OPENROUTER_API_KEY) {
      console.error('Missing OPENROUTER_API_KEY');
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          error: 'API configuration missing',
          reply: 'Maaf, fitur chat sedang tidak tersedia. Silakan hubungi kami via WhatsApp.'
        })
      };
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': SITE_URL,
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

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', error);
      return {
        statusCode: response.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          error: 'Chat API Error',
          reply: 'Maaf, ada kesalahan saat memproses permintaan Anda.'
        })
      };
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa memproses permintaan ini.';

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: error.message,
        reply: 'Maaf, ada kesalahan teknis. Silakan coba lagi.'
      })
    };
  }
};
