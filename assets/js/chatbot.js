/**
 * SISIKU Chatbot - OpenRouter + FlowKirim Integration
 * PT Sinergi Insan Karya Utama
 */

// Import configuration
import CONFIG from '../../config.js';

// ================= CHATBOT WIDGET CREATOR =================
function createChatbotWidget() {
  // Cek apakah widget sudah ada
  if (document.getElementById('sisiku-chatbot')) return;

  const widgetHTML = `
    <div id="sisiku-chatbot" class="sisiku-chatbot-widget">
      <!-- Toggle Button -->
      <button id="chatbot-toggle" class="chatbot-toggle-btn" aria-label="Buka Chatbot">
        <span class="toggle-logo-text">S</span>
        <span class="toggle-badge">💬</span>
      </button>

      <!-- Chat Container -->
      <div id="chatbot-container" class="chatbot-container">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-logo">
            <span class="logo-text">S</span>
          </div>
          <div class="chatbot-title">
            <h3>SISIKU</h3>
            <p>Asisten Virtual SIKU</p>
          </div>
          <button id="chatbot-close" class="chatbot-close-btn" aria-label="Tutup">&times;</button>
        </div>

        <!-- Messages Area -->
        <div id="chatbot-messages" class="chatbot-messages">
          <div class="message bot">
            <div class="message-avatar">
              <span class="avatar-text">S</span>
            </div>
            <div class="message-content">
              Halo! Selamat datang di SIKU. Saya SISIKU, asisten virtual yang siap membantu. Ada yang bisa saya bantu? 🤝
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div id="typing-indicator" class="typing-indicator">
          <span></span><span></span><span></span>
        </div>

        <!-- Input Area -->
        <div class="chatbot-input-area">
          <input type="text" id="chatbot-input" class="chatbot-input" placeholder="Ketik pesan Anda..." autocomplete="off">
          <button id="chatbot-send" class="chatbot-send-btn" aria-label="Kirim">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', widgetHTML);
  initChatbotEvents();
}

// ================= EVENT HANDLERS =================
function initChatbotEvents() {
  const toggleBtn = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const container = document.getElementById('chatbot-container');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  const messages = document.getElementById('chatbot-messages');
  const typing = document.getElementById('typing-indicator');

  // Toggle open/close
  toggleBtn?.addEventListener('click', () => {
    container.classList.add('active');
    toggleBtn.style.display = 'none';
    input?.focus();
  });

  closeBtn?.addEventListener('click', () => {
    container.classList.remove('active');
    toggleBtn.style.display = 'flex';
  });

  // Send message
  const sendMessage = async () => {
    const text = input.value.trim();
    if (!text) return;

    // Add user message
    addMessage(text, 'user');
    input.value = '';
    typing.classList.add('active');
    scrollToBottom();

    try {
      const reply = await callOpenRouterAPI(text);
      typing.classList.remove('active');
      addMessage(reply, 'bot');
    } catch (error) {
      console.error('Chatbot error:', error);
      typing.classList.remove('active');
      addMessage('⚠️ Maaf, terjadi kesalahan koneksi. Silakan hubungi kami via WhatsApp: 0822-7839-9722', 'bot');
    }
  };

  sendBtn?.addEventListener('click', sendMessage);
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Auto-scroll
  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }
}

// ================= ADD MESSAGE TO UI =================
function addMessage(text, sender) {
  const messages = document.getElementById('chatbot-messages');
  if (!messages) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  if (sender === 'bot') {
    avatar.innerHTML = `<span class="avatar-text">S</span>`;
  } else {
    avatar.innerHTML = `<span class="avatar-text">U</span>`;
  }
  
  const content = document.createElement('div');
  content.className = 'message-content';
  content.textContent = text;
  
  msgDiv.appendChild(avatar);
  msgDiv.appendChild(content);
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

// ================= CALL OPENROUTER API =================
async function callOpenRouterAPI(userMessage) {
  const config = CONFIG.OPENROUTER;
  
  const response = await fetch(config.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.API_KEY}`,
      'HTTP-Referer': config.SITE_URL,
      'X-Title': config.SITE_NAME
    },
    body: JSON.stringify({
      model: config.MODEL,
      messages: [
        { role: 'system', content: CONFIG.SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      temperature: CONFIG.TEMPERATURE,
      max_tokens: CONFIG.MAX_TOKENS
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${err.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa memproses permintaan ini.';
}

// ================= FLOWKIRIM WHATSAPP INTEGRATION =================
async function sendViaFlowKirim(message, phoneNumber = CONFIG.FLOWKIRIM.PHONE_NUMBER) {
  try {
    const response = await fetch(CONFIG.FLOWKIRIM.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.FLOWKIRIM.API_KEY}`
      },
      body: JSON.stringify({
        to: phoneNumber,
        message: message,
        type: 'text'
      })
    });
    
    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error('FlowKirim error:', error);
    return false;
  }
}

// ================= AUTO-INIT =================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createChatbotWidget);
} else {
  createChatbotWidget();
}