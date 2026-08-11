require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const customerRoutes = require('./routes/customers');
const conversationRoutes = require('./routes/conversations');
const messageRoutes = require('./routes/messages');
const webhookRoutes = require('./routes/webhook');

const app = express();

app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  },
}));

app.use((req, res, next) => {
  if (req.path.includes('/webhook')) {
    console.log(`[webhook-request] ${req.method} ${req.originalUrl}`);
    console.log(`[webhook-headers] x-hub-signature-256=${req.headers['x-hub-signature-256'] || '(none)'}`);
    if (req.method === 'POST') {
      console.log(`[webhook-body] ${JSON.stringify(req.body)}`);
    }
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', webhookRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error('[unhandled-error]', new Date().toISOString());
  console.error('[unhandled-error] path:', req.originalUrl);
  console.error('[unhandled-error] stack:', err.stack || err.message || err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
