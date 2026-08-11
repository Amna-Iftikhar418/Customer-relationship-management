require('dotenv').config();
const axios = require('axios');

const T = process.env.WHATSAPP_TOKEN;
const APP = '1626974785744293';
const WABA = '1361397339534989';
const PHONE = process.env.WHATSAPP_PHONE_NUMBER_ID;

const checks = [
  ['APP_SUBSCRIPTIONS', `https://graph.facebook.com/v23.0/${APP}/subscriptions`],
  ['APP_WHATSAPP_CONFIG', `https://graph.facebook.com/v23.0/${APP}/whatsapp_business_management?fields=webhook_config`],
  ['WABA_WEBHOOKS', `https://graph.facebook.com/v23.0/${WABA}/webhooks`],
  ['PHONE_ID_INFO', `https://graph.facebook.com/v23.0/${PHONE}?fields=id,display_phone_number,verified_name,code_verification_status,is_verified`],
  ['WABA_SUBSCRIBED_APPS', `https://graph.facebook.com/v23.0/${WABA}/subscribed_apps`],
];

async function main() {
  for (const [name, url] of checks) {
    try {
      const r = await axios.get(url, { headers: { Authorization: `Bearer ${T}` } });
      console.log('\n=== ' + name + ' ===');
      console.log(JSON.stringify(r.data, null, 2));
    } catch (e) {
      console.log('\n=== ' + name + ' === ERROR ' + e.response?.status + ' ' + JSON.stringify(e.response?.data));
    }
  }
}

main();
