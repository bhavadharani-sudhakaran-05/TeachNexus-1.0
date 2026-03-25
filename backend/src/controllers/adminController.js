const School = require('../models/School');
const CurriculumMapping = require('../models/CurriculumMapping');
const User = require('../models/User');
const Mentorship = require('../models/Mentorship');

// Admin: Get School Health Report
exports.getSchoolHealthReport = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const school = await School.findById(schoolId).populate('administrators');

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Verify user is admin of school
    const isAdmin = school.administrators.some(
      (admin) => admin._id.toString() === req.userId
    );

    if (!isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view school report' });
    }

    const report = {
      schoolName: school.name,
      teacherCount: school.teacherCount,
      totalTPlatformCount: school.totalTeachersOnPlatform,
      totalResourcesShared: school.totalResourcesShared,
      schoolEngagementScore: school.schoolEngagementScore,
      timestamp: new Date(),
    };

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('School health report error:', error);
    return res.status(500).json({ message: 'Error fetching school report' });
  }
};

// Admin: Smart Timetable Builder
exports.generateTimetable = async (req, res) => {
  try {
    const { schoolId, subjects, teachers, classrooms, constraints } = req.body;

    // Mock intelligent timetable generation
    const timetable = {
      monday: ['Period 1: Subject A', 'Period 2: Subject B', 'Period 3: Subject C'],
      tuesday: ['Period 1: Subject D', 'Period 2: Subject A', 'Period 3: Subject B'],
      wednesday: ['Period 1: Subject B', 'Period 2: Subject C', 'Period 3: Subject D'],
      thursday: ['Period 1: Subject A', 'Period 2: Subject B', 'Period 3: Subject C'],
      friday: ['Period 1: Subject C', 'Period 2: Subject D', 'Period 3: Subject A'],
      conflictCount: 0,
      optimizationScore: 95,
    };

    return res.status(200).json({
      success: true,
      timetable,
    });
  } catch (error) {
    console.error('Generate timetable error:', error);
    return res.status(500).json({ message: 'Error generating timetable' });
  }
};

// Admin: Classroom Polling Tool
exports.createPoll = async (req, res) => {
  try {
    const { question, options, classroomId } = req.body;

    // Mock poll creation
    const poll = {
      _id: new Date().getTime(),
      question,
      options: options.map((opt) => ({ text: opt, votes: 0 })),
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
      pollUrl: `${process.env.FRONTEND_URL}/poll/${new Date().getTime()}`,
      isActive: true,
    };

    return res.status(201).json({
      success: true,
      poll,
    });
  } catch (error) {
    console.error('Create poll error:', error);
    return res.status(500).json({ message: 'Error creating poll' });
  }
};

// Admin: Curriculum Mapping
exports.createCurriculumMapping = async (req, res) => {
  try {
    const {
      schoolId,
      subject,
      gradeLevel,
      academicYear,
      curriculumFramework,
    } = req.body;

    const mapping = await CurriculumMapping.create({
      schoolId,
      subject,
      gradeLevel,
      academicYear,
      curriculumFramework,
      createdBy: req.userId,
      mappingGrid: [],
    });

    return res.status(201).json({
      success: true,
      mapping,
    });
  } catch (error) {
    console.error('Create curriculum mapping error:', error);
    return res.status(500).json({ message: 'Error creating curriculum mapping' });
  }
};

// Teacher Buddy Mentor Matching
exports.matchMentor = async (req, res) => {
  try {
    const menteeId = req.userId;
    const mentee = await User.findById(menteeId);

    // Find compatible mentors
    const mentors = await User.find({
      userType: 'teacher',
      _id: { $ne: menteeId },
      subjectSpecializations: { $in: mentee.subjectSpecializations },
      isActive: true,
    }).limit(5);

    if (mentors.length === 0) {
      return res.status(404).json({ message: 'No suitable mentors found' });
    }

    // Simple matching algorithm - in production, more sophisticated
    const selectedMentor = mentors[0];

    const mentorship = await Mentorship.create({
      mentor: selectedMentor._id,
      mentee: menteeId,
      matchingCriteria: {
        subjectAlignment: 95,
        gradeAlignment: 85,
        compatibilityScore: 90,
      },
      duration: '3 months',
    });

    // Notify mentor
    const io = require('../server').io;
    io.to(`user_${selectedMentor._id}`).emit('mentor_match', {
      mentorshipId: mentorship._id,
      menteeName: mentee.firstName,
      menteeProfile: mentee.getPublicProfile(),
    });

    return res.status(201).json({
      success: true,
      message: 'Mentor matched successfully',
      mentorship,
    });
  } catch (error) {
    console.error('Mentor matching error:', error);
    return res.status(500).json({ message: 'Error matching mentor' });
  }
};
