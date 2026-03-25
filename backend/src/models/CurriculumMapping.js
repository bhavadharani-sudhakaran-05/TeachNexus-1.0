const mongoose = require('mongoose');

const curriculumMappingSchema = new mongoose.Schema(
  {
    // School & Owner
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Mapping Details
    subject: {
      type: String,
      required: true,
    },
    gradeLevel: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    
    // Curriculum Standard References
    curriculumFramework: String, // e.g., 'Common Core', 'NGSS', 'IB'
    
    // Timeline Structure - Weeks/Quarters mapped to standards & resources
    mappingGrid: [
      {
        weekNumber: Number,
        standardsToTeach: [String],
        topicsToTeach: [String],
        linkedResources: [mongoose.Schema.Types.ObjectId],
        linkedLessonPlans: [mongoose.Schema.Types.ObjectId],
        status: {
          type: String,
          enum: ['planned', 'in_progress', 'completed'],
          default: 'planned',
        },
        completionDate: Date,
      },
    ],
    
    // Gap Analysis
    gapAnalysis: {
      coveragePercentage: Number,
      uncoveredStandards: [String],
      underservedTopics: [String],
      recommendedResources: [
        {
          topicName: String,
          urgencyLevel: String, // 'high', 'medium', 'low'
          suggestedResourceTypes: [String],
        },
      ],
    },
    
    // Overall Stats
    totalStandardsToTeach: Number,
    standardsCovered: Number,
    resourcesCovered: Number,
    completionPercentage: Number,
    
    // Status
    isPublished: {
      type: Boolean,
      default: false,
    },
    
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

module.exports = mongoose.model('CurriculumMapping', curriculumMappingSchema);
