const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, 'School name is required'],
      unique: true,
      trim: true,
    },
    motto: String,
    description: String,
    
    // Contact & Location
    email: {
      type: String,
      required: true,
    },
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    
    // School Identity
    logo: {
      url: String,
      publicId: String,
    },
    website: String,
    
    // Administration
    principal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    administrators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    
    // School Details
    studentCount: Number,
    teacherCount: Number,
    classroomCount: Number,
    establishedYear: Number,
    schoolType: {
      type: String,
      enum: ['public', 'private', 'charter', 'international'],
    },
    
    // Curriculum & Standards
    supportedCurriculumStandards: [String],
    subjects: [String],
    
    // Gamification Stats
    totalTeachersOnPlatform: {
      type: Number,
      default: 0,
    },
    totalResourcesShared: {
      type: Number,
      default: 0,
    },
    schoolEngagementScore: {
      type: Number,
      default: 0,
    },
    
    // Subscription
    subscriptionTier: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    subscriptionEndDate: Date,
    
    // Settings
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model('School', schoolSchema);
