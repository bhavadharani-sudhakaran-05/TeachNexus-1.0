const mongoose = require('mongoose');

const resourceGapAnalysisSchema = new mongoose.Schema(
  {
    // Analysis Metadata
    subject: {
      type: String,
      required: true,
    },
    gradeLevel: String,
    lastAnalyzedAt: {
      type: Date,
      default: Date.now,
    },
    
    // Coverage Analysis
    allTopics: [
      {
        topic: String,
        standard: String,
        resourceCount: Number,
        averageQuality: Number,
        coverage: {
          type: String,
          enum: ['abundant', 'adequate', 'limited', 'none'],
        },
        urgency: {
          type: String,
          enum: ['critical', 'high', 'medium', 'low'],
        },
        lastUpdated: Date,
      },
    ],
    
    // Critical Gaps (Most Needed Resources)
    criticalGaps: [
      {
        topic: String,
        standard: String,
        reason: String, // why it's critical
        suggestedResourceTypes: [String],
        qualifiedContributors: [
          {
            userId: mongoose.Schema.Types.ObjectId,
            subjectMatch: Number, // 0-100
          },
        ],
      },
    ],
    
    // Statistics
    totalTopics: Number,
    adequatelyCovered: Number,
    underservedTopics: Number,
    resourceCoveragePercentage: Number,
    
    // Trend Data
    monthlyGapTrend: [
      {
        month: String,
        gapPercentage: Number,
      },
    ],
    
    // Notifications Sent
    suggestedPromptsSent: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        topic: String,
        sentAt: Date,
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

module.exports = mongoose.model('ResourceGapAnalysis', resourceGapAnalysisSchema);
