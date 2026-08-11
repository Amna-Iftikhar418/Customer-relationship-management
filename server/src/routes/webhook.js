const express = require('express');
const {
  verifyWebhook,
  receiveWebhook,
  sendMessage,
  sendTemplate,
} = require('../controllers/webhookController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/webhook', verifyWebhook);
router.post('/webhook', receiveWebhook);

router.post('/send', authMiddleware, sendMessage);
router.post('/send-template', authMiddleware, sendTemplate);

module.exports = router;
