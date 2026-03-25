const express = require('express');
const { protect } = require('../middleware/auth');
const {
  generateLessonPlan,
  summarizeResource,
  voiceToLessonPlan,
  scanWhiteboard,
  predictStudentPerformance,
  analyzeResourceGaps,
  teachbotQuery,
  recommendResources,
} = require('../controllers/aiToolsController');

const router = express.Router();

// All AI tools require authentication
router.post('/lesson-planner', protect, generateLessonPlan);
router.post('/summarizer', protect, summarizeResource);
router.post('/voice-to-lesson', protect, voiceToLessonPlan);
router.post('/whiteboard-scanner', protect, scanWhiteboard);
router.post('/student-predictor', protect, predictStudentPerformance);
router.get('/gap-analyzer', protect, analyzeResourceGaps);
router.post('/teachbot', protect, teachbotQuery);
router.get('/recommendations', protect, recommendResources);

module.exports = router;
