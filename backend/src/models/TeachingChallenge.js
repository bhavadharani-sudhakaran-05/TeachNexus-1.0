const mongoose = require('mongoose');

const teachingChallengeSchema = new mongoose.Schema(
  {
    // Challenge Details
    title: {
      type: String,
      required: true,
    },
    description: String,
    objective: String,
    
    // Duration & Schedule
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'one_time'],
      default: 'weekly',
    },
    
    // Categories
    category: {
      type: String,
      enum: [
        'resource_sharing',
        'student_engagement',
        'community_building',
        'professional_development',
      ],
    },
    
    // Requirements & Rewards
    requirements: [String],
    xpReward: {
      type: Number,
      default: 100,
    },
    badgeReward: mongoose.Schema.Types.ObjectId,
    
    // Difficulty Level
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    
    // Participation & Stats
    participants: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        joinedAt: Date,
        completed: Boolean,
        completedAt: Date,
      },
    ],
    totalParticipants: {
      type: Number,
      default: 0,
    },
    completionCount: {
      type: Number,
      default: 0,
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TeachingChallenge', teachingChallengeSchema);
