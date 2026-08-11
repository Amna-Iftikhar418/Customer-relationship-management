const express = require('express');
const {
  listMessages,
  createMessage,
  updateMessageStatus,
} = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', listMessages);
router.post('/', createMessage);
router.patch('/:id/status', updateMessageStatus);

module.exports = router;
