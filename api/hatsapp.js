/**
 * Vercel API Route: WhatsApp Proxy for SIKU
 * File: api/whatsapp.js
 * 
 * Menghubungkan ke FlowKirim API untuk mengirim pesan WhatsApp.
 */

export default async function handler(req, res) {
  // 1. Handle CORS (Cross-Origin Resource Sharing)
  // Agar frontend bisa mengakses API ini dari domain berbeda
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Ganti '*' dengan domain website Anda jika ingin lebih aman
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { to, message, type = 'text' } = req.body;

    // Validasi Input Sederhana
    if (!to || !message) {
      return res.status(400).json({ success: false, error: 'Nomor tujuan dan pesan wajib diisi.' });
    }

    const FLOWKIRIM_API_KEY = process.env.FLOWKIRIM_API_KEY;

    if (!FLOWKIRIM_API_KEY) {
      console.error('Missing FLOWKIRIM_API_KEY in Environment Variables');
      return res.status(500).json({ success: false, error: 'Konfigurasi server WhatsApp belum lengkap.' });
    }

    // Konfigurasi Request ke FlowKirim
    // Catatan: Pastikan URL endpoint ini sesuai dengan dokumentasi terbaru FlowKirim.
    // Umumnya FlowKirim menggunakan endpoint seperti https://api.flowkirim.com/send-message atau serupa.
    // Jika FlowKirim Anda menggunakan provider lain (misal Fonnte/Wablas), sesuaikan URL dan Body-nya.
    
    const FLOWKIRIM_ENDPOINT = 'https://api.flowkirim.com/v1/message/send'; // Contoh URL, cek docs FlowKirim Anda

    const payload = {
      phone: to,       // Nomor tujuan (format internasional tanpa +, misal 628123456789)
      message: message,
      type: type       // 'text', 'image', 'document', dll.
      // Beberapa provider membutuhkan field 'api_key' di dalam body, bukan header.
      // Jika FlowKirim Anda butuh api_key di body, tambahkan: api_key: FLOWKIRIM_API_KEY
    };

    console.log('Sending WhatsApp via FlowKirim to:', to);

    const response = await fetch(FLOWKIRIM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // FlowKirim biasanya menggunakan Header Authorization Bearer atau x-api-key
        // Cek dokumentasi FlowKirim Anda. Jika pakai x-api-key, ganti baris di bawah:
        'Authorization': `Bearer ${FLOWKIRIM_API_KEY}`,
        // Atau jika pakai x-api-key:
        // 'x-api-key': FLOWKIRIM_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('WhatsApp sent successfully:', data);
      return res.status(200).json({ success: true, data: data });
    } else {
      console.error('FlowKirim API Error:', response.status, data);
      return res.status(response.status).json({ 
        success: false, 
        error: 'Gagal mengirim pesan WhatsApp.', 
        details: data 
      });
    }

  } catch (error) {
    console.error('WhatsApp API Critical Error:', error.message);
    return res.status(500).json({ success: false, error: 'Terjadi kesalahan internal pada server WhatsApp.' });
  }
}