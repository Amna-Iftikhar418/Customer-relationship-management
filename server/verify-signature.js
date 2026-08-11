const crypto = require('crypto');

const RAW = process.env.RAW;
const raw = Buffer.from(RAW, 'base64');
const headerEnd = raw.indexOf('\r\n\r\n');
const body = raw.slice(headerEnd + 4);

// extract signature from headers
const headerStr = raw.slice(0, headerEnd).toString('latin1');
const m = headerStr.match(/x-hub-signature-256:\s*(.*)/i);
const received = m ? m[1].trim().replace(/^sha256=/, '') : '(not found)';
const contentLength = headerStr.match(/content-length:\s*(\d+)/i);

console.log('Content-Length header:', contentLength ? contentLength[1] : '(none)');
console.log('Actual body bytes:', body.length);
console.log('Received sig-256:', received);

for (const secret of ['Amnawhatsapp//00', 'saad8april']) {
  const e = crypto.createHmac('sha256', secret).update(body).digest('hex');
  console.log(`\nsecret "${secret}" -> ${e} MATCH: ${e === received}`);
}
