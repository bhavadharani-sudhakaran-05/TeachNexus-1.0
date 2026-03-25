const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  getDashboard,
  getUserPublicProfile,
} = require('../controllers/userController');

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/dashboard', protect, getDashboard);
router.get('/:userId', getUserPublicProfile);

module.exports = router;
