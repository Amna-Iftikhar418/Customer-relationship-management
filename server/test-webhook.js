const http = require('http');
const crypto = require('crypto');

const body = JSON.stringify({
  object: "whatsapp_business_account",
  entry: [{
    changes: [{
      field: "messages",
      value: {
        metadata: { phone_number_id: "1324293490758020" },
        messages: [{
          from: "923289941739",
          id: "wamid_live_test_" + Date.now(),
          type: "text",
          text: { body: "Hello, I need help with my order" },
          timestamp: Math.floor(Date.now() / 1000).toString()
        }],
        contacts: [{ profile: { name: "Customer" } }]
      }
    }]
  }]
});

const sig = 'sha256=' + crypto.createHmac('sha256', 'saad8april').update(body).digest('hex');

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
    console.log('Webhook Status:', res.statusCode);
    console.log('Response:', data);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
  process.exit(1);
});

req.write(body);
req.end();
