const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  markNotificationsAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/mark-read', protect, markNotificationsAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
