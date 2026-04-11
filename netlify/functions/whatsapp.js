/**
 * Netlify Function: WhatsApp Proxy for SIKU
 * Proxies requests to FlowKirim API securely
 */

const FLOWKIRIM_API_KEY = process.env.FLOWKIRIM_API_KEY;

exports.handler = async (event, context) => {
  // 1. Handle CORS preflight
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

  // 2. Validate Method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { to, message, type = 'text' } = JSON.parse(event.body || '{}');

    if (!to || !message) {
      return {
        statusCode: 400,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Nomor tujuan dan pesan wajib diisi.' })
      };
    }

    if (!FLOWKIRIM_API_KEY) {
      console.error('Missing FLOWKIRIM_API_KEY');
      return {
        statusCode: 500,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Konfigurasi WhatsApp belum diatur.'
        })
      };
    }

    // 3. Call FlowKirim API
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

    const result = await response.json();

    if (!response.ok) {
      console.error('FlowKirim API Error:', result);
      return {
        statusCode: response.status,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: result.error || 'Gagal mengirim pesan WhatsApp.'
        })
      };
    }

    return {
      statusCode: 200,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true,
        data: result 
      })
    };

  } catch (error) {
    console.error('WhatsApp Function Error:', error);
    return {
      statusCode: 500,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Terjadi kesalahan internal server.'
      })
    };
  }
};