const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createLessonPlan,
  getLessonPlans,
  getLessonPlanById,
  updateLessonPlan,
  publishLessonPlan,
  deleteLessonPlan,
} = require('../controllers/lessonPlanController');

const router = express.Router();

router.post('/', protect, createLessonPlan);
router.get('/', protect, getLessonPlans);
router.get('/:id', getLessonPlanById);
router.put('/:id', protect, updateLessonPlan);
router.post('/:id/publish', protect, publishLessonPlan);
router.delete('/:id', protect, deleteLessonPlan);

module.exports = router;
