const mongoose = require('mongoose');

const lessonPlanSchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: [true, 'Lesson plan title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    gradeLevel: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    
    // Lesson Components
    objectives: [String],
    materials: [String],
    prerequisites: [String],
    
    // Detailed Lesson Content
    introduction: String,
    instructionalStrategies: String,
    studentActivities: String,
    closure: String,
    assessment: String,
    accommodations: String,
    
    // Creator & Collaboration
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborators: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        role: {
          type: String,
          enum: ['editor', 'viewer', 'commenter'],
        },
        joinedAt: Date,
      },
    ],
    
    // Collaboration Features
    isCollaborativeEnabled: {
      type: Boolean,
      default: false,
    },
    yDocId: String, // For Yjs real-time collaboration
    
    // Scheduling
    scheduledDate: Date,
    isRecurring: Boolean,
    recurringPattern: String, // 'daily', 'weekly', 'monthly'
    
    // Linked Resources
    linkedResources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
      },
    ],
    
    // Engagement
    views: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        comment: String,
        createdAt: Date,
      },
    ],
    
    // Status
    isPublic: {
      type: Boolean,
      default: false,
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    
    // Timestamps
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

module.exports = mongoose.model('LessonPlan', lessonPlanSchema);
