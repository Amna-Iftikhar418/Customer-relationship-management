const axios = require('axios');

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const META_API_VERSION = 'v23.0';
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

async function sendTextMessage(to, text) {
  const url = `${META_API_BASE}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  try {
    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('[whatsapp-sendText] URL:', url);
    console.error('[whatsapp-sendText] to:', to);
    console.error('[whatsapp-sendText] status:', error.response?.status);
    console.error('[whatsapp-sendText] data:', JSON.stringify(error.response?.data));
    throw error;
  }
}

async function sendTemplateMessage(to, templateName, languageCode = 'en') {
  const url = `${META_API_BASE}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  try {
    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('[whatsapp-sendTemplate] URL:', url);
    console.error('[whatsapp-sendTemplate] to:', to);
    console.error('[whatsapp-sendTemplate] status:', error.response?.status);
    console.error('[whatsapp-sendTemplate] data:', JSON.stringify(error.response?.data));
    throw error;
  }
}

module.exports = { sendTextMessage, sendTemplateMessage };
