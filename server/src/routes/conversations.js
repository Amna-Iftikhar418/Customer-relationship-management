const express = require('express');
const {
  listConversations,
  getConversation,
  createConversation,
  updateStatus,
  deleteConversation,
  assignConversation,
  reassignConversation,
} = require('../controllers/conversationController');
const authMiddleware = require('../middleware/auth');
const rbacMiddleware = require('../middleware/rbac');

const router = express.Router();

router.use(authMiddleware);

router.get('/', listConversations);
router.get('/:id', getConversation);
router.post('/', createConversation);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteConversation);
router.post('/:id/assign', rbacMiddleware('ADMIN'), assignConversation);
router.put('/:id/assign', rbacMiddleware('ADMIN'), reassignConversation);

module.exports = router;
