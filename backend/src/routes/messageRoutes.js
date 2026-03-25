const express = require('express');
const { protect } = require('../middleware/auth');
const {
  sendMessage,
  getConversation,
  getConversations,
} = require('../controllers/messageController');

const router = express.Router();

router.post('/send', protect, sendMessage);
router.get('/conversation/:recipientId', protect, getConversation);
router.get('/', protect, getConversations);

module.exports = router;
