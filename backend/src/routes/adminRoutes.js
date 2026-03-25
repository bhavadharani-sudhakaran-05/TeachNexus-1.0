const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getSchoolHealthReport,
  generateTimetable,
  createPoll,
  createCurriculumMapping,
  matchMentor,
} = require('../controllers/adminController');

const router = express.Router();

// School admin routes
router.get('/school/:schoolId/health-report', protect, authorize('school_admin', 'admin'), getSchoolHealthReport);
router.post('/timetable/generate', protect, authorize('school_admin', 'admin'), generateTimetable);
router.post('/polls', protect, authorize('teacher'), createPoll);
router.post('/curriculum-mapping', protect, authorize('school_admin', 'admin'), createCurriculumMapping);

// Mentor matching
router.post('/mentor/match', protect, matchMentor);

module.exports = router;
