const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema(
  {
    // Participants
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Matching Criteria Used
    matchingCriteria: {
      subjectAlignment: Number,
      gradeAlignment: Number,
      locationAlignment: Number,
      styleAlignment: Number,
      compatibilityScore: Number,
    },
    
    // Program Details
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    duration: String, // e.g., '3 months', '6 months'
    
    // Progress Tracking
    checkInSchedule: String, // 'weekly', 'biweekly', 'monthly'
    lastCheckInDate: Date,
    checkInHistory: [
      {
        date: Date,
        mentorNotes: String,
        menteeNotes: String,
      },
    ],
    
    // Goals & Progress
    mentorshipGoals: [String],
    progressNotes: [
      {
        date: Date,
        author: mongoose.Schema.Types.ObjectId,
        note: String,
      },
    ],
    
    // Resources Shared
    sharedResources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
      },
    ],
    
    // Status
    status: {
      type: String,
      enum: ['active', 'paused', 'completed', 'discontinued'],
      default: 'active',
    },
    
    // Feedback & Ratings
    menteeRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      feedback: String,
      submittedAt: Date,
    },
    mentorRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      feedback: String,
      submittedAt: Date,
    },
    
    // XP & Gamification
    xpEarned: {
      type: Number,
      default: 0,
    },
    badgeEarned: String,
    
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

module.exports = mongoose.model('Mentorship', mentorshipSchema);
