require('dotenv').config();
const axios = require('axios');

const T = process.env.WHATSAPP_TOKEN;
const WABA = '1361397339534989';

async function main() {
  try {
    const r = await axios.post(
      `https://graph.facebook.com/v23.0/${WABA}/subscribed_apps`,
      new URLSearchParams({ subscribed_fields: 'messages,message_status,conversations' }).toString(),
      { headers: { Authorization: `Bearer ${T}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log('SUBSCRIBE OK:', JSON.stringify(r.data));
  } catch (e) {
    console.log('SUBSCRIBE ERROR ' + e.response?.status + ' ' + JSON.stringify(e.response?.data));
  }

  try {
    const r = await axios.get(`https://graph.facebook.com/v23.0/${WABA}/subscribed_apps`, {
      headers: { Authorization: `Bearer ${T}` },
    });
    console.log('\nNOW SUBSCRIBED:');
    console.log(JSON.stringify(r.data, null, 2));
  } catch (e) {
    console.log('CHECK ERROR ' + e.response?.status + ' ' + JSON.stringify(e.response?.data));
  }
}

main();
