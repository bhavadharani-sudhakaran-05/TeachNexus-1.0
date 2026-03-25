const LessonPlan = require('../models/LessonPlan');
const User = require('../models/User');

exports.createLessonPlan = async (req, res) => {
  try {
    const {
      title,
      subject,
      gradeLevel,
      duration,
      objectives,
      materials,
      prerequisites,
      introduction,
      instructionalStrategies,
      studentActivities,
      closure,
      assessment,
      accommodations,
    } = req.body;

    const lessonPlan = await LessonPlan.create({
      title,
      subject,
      gradeLevel,
      duration,
      objectives,
      materials,
      prerequisites,
      introduction,
      instructionalStrategies,
      studentActivities,
      closure,
      assessment,
      accommodations,
      createdBy: req.userId,
    });

    // Update user stats
    await User.findByIdAndUpdate(req.userId, {
      $inc: { experiencePoints: 20 },
    });

    return res.status(201).json({
      success: true,
      message: 'Lesson plan created successfully',
      lessonPlan,
    });
  } catch (error) {
    console.error('Create lesson plan error:', error);
    return res.status(500).json({ message: 'Error creating lesson plan' });
  }
};

exports.getLessonPlans = async (req, res) => {
  try {
    const { subject, gradeLevel, page = 1, limit = 12 } = req.query;

    let query = { createdBy: req.userId, isDraft: false };

    if (subject) query.subject = subject;
    if (gradeLevel) query.gradeLevel = gradeLevel;

    const skip = (page - 1) * limit;

    const lessonPlans = await LessonPlan.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await LessonPlan.countDocuments(query);

    return res.status(200).json({
      success: true,
      lessonPlans,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get lesson plans error:', error);
    return res.status(500).json({ message: 'Error fetching lesson plans' });
  }
};

exports.getLessonPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const lessonPlan = await LessonPlan.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('createdBy', 'firstName lastName profilePicture');

    if (!lessonPlan) {
      return res.status(404).json({ message: 'Lesson plan not found' });
    }

    return res.status(200).json({
      success: true,
      lessonPlan,
    });
  } catch (error) {
    console.error('Get lesson plan error:', error);
    return res.status(500).json({ message: 'Error fetching lesson plan' });
  }
};

exports.updateLessonPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, objectives, materials, introduction, instructionalStrategies, studentActivities, closure, assessment } = req.body;

    const lessonPlan = await LessonPlan.findById(id);

    if (!lessonPlan) {
      return res.status(404).json({ message: 'Lesson plan not found' });
    }

    if (lessonPlan.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this lesson plan' });
    }

    const updatedLessonPlan = await LessonPlan.findByIdAndUpdate(
      id,
      { title, objectives, materials, introduction, instructionalStrategies, studentActivities, closure, assessment },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Lesson plan updated successfully',
      lessonPlan: updatedLessonPlan,
    });
  } catch (error) {
    console.error('Update lesson plan error:', error);
    return res.status(500).json({ message: 'Error updating lesson plan' });
  }
};

exports.publishLessonPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const lessonPlan = await LessonPlan.findById(id);

    if (!lessonPlan) {
      return res.status(404).json({ message: 'Lesson plan not found' });
    }

    if (lessonPlan.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to publish this lesson plan' });
    }

    lessonPlan.isDraft = false;
    lessonPlan.isPublic = true;
    await lessonPlan.save();

    // Award XP for publishing
    await User.findByIdAndUpdate(req.userId, {
      $inc: { experiencePoints: 50 },
    });

    return res.status(200).json({
      success: true,
      message: 'Lesson plan published successfully',
      lessonPlan,
    });
  } catch (error) {
    console.error('Publish lesson plan error:', error);
    return res.status(500).json({ message: 'Error publishing lesson plan' });
  }
};

exports.deleteLessonPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const lessonPlan = await LessonPlan.findById(id);

    if (!lessonPlan) {
      return res.status(404).json({ message: 'Lesson plan not found' });
    }

    if (lessonPlan.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this lesson plan' });
    }

    await LessonPlan.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Lesson plan deleted successfully',
    });
  } catch (error) {
    console.error('Delete lesson plan error:', error);
    return res.status(500).json({ message: 'Error deleting lesson plan' });
  }
};
