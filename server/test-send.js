const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const http = require('http');

const prisma = new PrismaClient();

async function test() {
  // Get an admin user
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) { console.log('No admin user found'); process.exit(1); }

  // Generate JWT token
  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
    { expiresIn: '7d' }
  );
  console.log('Token generated for:', admin.email, '(', admin.role, ')');

  // Find a conversation
  const conv = await prisma.conversation.findFirst({
    where: { status: { in: ['NEW', 'ASSIGNED', 'IN_PROGRESS'] } },
    include: { customer: true }
  });
  if (!conv) { console.log('No conversation found'); process.exit(1); }
  console.log('Conversation:', conv.id, 'Customer:', conv.customer.whatsapp_number);

  // Test send endpoint
  const body = JSON.stringify({
    conversation_id: conv.id,
    message: 'Test reply from CRM'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/webhook/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'Authorization': 'Bearer ' + token
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Status:', res.statusCode);
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
}

test().catch(e => { console.error(e); process.exit(1); });
