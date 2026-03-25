const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    content: {
      type: String,
      required: true,
    },
    
    // File/Media
    file: {
      url: String,
      publicId: String,
      fileName: String,
      fileSize: Number,
      fileType: String, // 'pdf', 'docx', 'pptx', etc.
    },
    
    // Classification
    resourceType: {
      type: String,
      enum: [
        'lesson_plan',
        'worksheet',
        'assessment',
        'presentation',
        'video',
        'article',
        'interactive_tool',
        'project',
        'other',
      ],
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    gradeLevels: [String], // e.g., ['Grade 9', 'Grade 10']
    skillTags: [String], // Custom tags
    curriculumStandards: [String], // Links to standards
    
    // Author & Sharing
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    
    // Remix System
    isRemix: {
      type: Boolean,
      default: false,
    },
    remixedFromId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
    },
    remixedFromAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remixHistory: [
      {
        resourceId: mongoose.Schema.Types.ObjectId,
        author: mongoose.Schema.Types.ObjectId,
        timestamp: Date,
        version: Number,
      },
    ],
    
    // Engagement & Stats
    downloads: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      ratingCount: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String,
        createdAt: Date,
      },
    ],
    
    // Quality & Verification
    isPeerReviewed: {
      type: Boolean,
      default: false,
    },
    peerReviewStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'none'],
      default: 'none',
    },
    peerReviewers: [
      {
        reviewerId: mongoose.Schema.Types.ObjectId,
        status: String,
        feedback: String,
        submittedAt: Date,
      },
    ],
    
    // XP & Gamification
    xpValue: {
      type: Number,
      default: 10,
    },
    downloadXpValue: {
      type: Number,
      default: 1,
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

// Index for search optimization
resourceSchema.index({ title: 'text', description: 'text', content: 'text' });
resourceSchema.index({ subject: 1, gradeLevels: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
