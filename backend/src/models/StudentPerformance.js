const mongoose = require('mongoose');

const studentPerformanceSchema = new mongoose.Schema(
  {
    // Teacher & Class Info
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
    },
    className: String,
    academicYear: String,
    
    // Student Data Input
    studentAssessments: [
      {
        studentName: String,
        studentId: String,
        recentScores: [Number],
        attendancePercentage: Number,
        participationLevel: {
          type: String,
          enum: ['low', 'medium', 'high'],
        },
        behaviorNotes: String,
      },
    ],
    
    // AI Analysis Results
    analysis: {
      analyzedAt: Date,
      riskStudents: [
        {
          studentName: String,
          studentId: String,
          riskLevel: {
            type: String,
            enum: ['low', 'medium', 'high'],
          },
          riskFactors: [String],
          predictedOutcome: String,
          suggestedInterventions: [String],
          parentCommunicationDraft: String,
        },
      ],
      overallClassTrend: String,
      classStrengths: [String],
      classAreasOfImprovement: [String],
    },
    
    // Action Taken
    interventionsApplied: [
      {
        studentId: String,
        intervention: String,
        date: Date,
        results: String,
      },
    ],
    
    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentPerformance', studentPerformanceSchema);
