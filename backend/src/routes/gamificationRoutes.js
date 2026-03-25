const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getGameificationStats,
  getAchievements,
  getMonthlyLeaderboard,
  getTeachingChallenges,
  joinChallenge,
  completeChallenge,
} = require('../controllers/gamificationController');

const router = express.Router();

router.get('/stats', protect, getGameificationStats);
router.get('/achievements', protect, getAchievements);
router.get('/leaderboard', protect, getMonthlyLeaderboard);
router.get('/challenges', protect, getTeachingChallenges);
router.post('/challenges/:challengeId/join', protect, joinChallenge);
router.post('/challenges/:challengeId/complete', protect, completeChallenge);

module.exports = router;
