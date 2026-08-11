const http = require('http');
const crypto = require('crypto');

const messages = [
  { from: '923289941739', text: 'Hi, I have a question about my order' },
  { from: '923123456789', text: 'What are your business hours?' },
  { from: '923987654321', text: 'I need to return a product' },
  { from: '923112233445', text: 'Is this item in stock?' },
  { from: '923556677889', text: 'Thanks for your help!' }
];

async function sendMessages() {
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const body = JSON.stringify({
      object: "whatsapp_business_account",
      entry: [{
        changes: [{
          field: "messages",
          value: {
            metadata: { phone_number_id: "1324293490758020" },
            messages: [{
              from: msg.from,
              id: "wamid_test_" + Date.now() + "_" + i,
              type: "text",
              text: { body: msg.text },
              timestamp: Math.floor(Date.now() / 1000).toString()
            }],
            contacts: [{ profile: { name: msg.from } }]
          }
        }]
      }]
    });

    const sig = 'sha256=' + crypto.createHmac('sha256', 'saad8april').update(body).digest('hex');

    await new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/webhook',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'X-Hub-Signature-256': sig
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          console.log(`[${i + 1}] ${msg.from}: "${msg.text}" → ${res.statusCode} ${data}`);
          resolve();
        });
      });

      req.on('error', (e) => {
        console.error(`[${i + 1}] Error: ${e.message}`);
        reject(e);
      });

      req.write(body);
      req.end();
    });
  }
  console.log('\nAll messages sent.');
  process.exit(0);
}

sendMessages();
