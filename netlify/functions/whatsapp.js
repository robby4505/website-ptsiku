/**
 * Netlify Function: WhatsApp Proxy
 * Proxies requests to FlowKirim API securely
 */

const FLOWKIRIM_API_KEY = process.env.FLOWKIRIM_API_KEY;

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
    const { to, message, type = 'text' } = JSON.parse(event.body || '{}');

    if (!to || !message) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid to or message' })
      };
    }

    if (!FLOWKIRIM_API_KEY) {
      console.error('Missing FLOWKIRIM_API_KEY');
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          success: false,
          error: 'WhatsApp API configuration missing'
        })
      };
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
      return {
        statusCode: response.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          success: false,
          error: 'WhatsApp API Error'
        })
      };
    }

    const result = await response.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: result.success || false })
    };
  } catch (error) {
    console.error('WhatsApp function error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
