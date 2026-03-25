const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, 'Community name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Community description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    
    // Community Type
    subject: {
      type: String,
      required: true,
    },
    gradeLevels: [String],
    
    // Visual Identity
    coverImage: {
      url: String,
      publicId: String,
    },
    icon: String, // emoji or icon name
    color: {
      type: String,
      default: '#2C3E50',
    },
    
    // Membership & Moderation
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    members: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        joinedAt: Date,
        role: {
          type: String,
          enum: ['member', 'moderator'],
          default: 'member',
        },
      },
    ],
    memberCount: {
      type: Number,
      default: 1,
    },
    
    // Engagement
    discussionThreads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DiscussionThread',
      },
    ],
    
    // Community Settings
    isPublic: {
      type: Boolean,
      default: true,
    },
    approvalRequired: {
      type: Boolean,
      default: false,
    },
    
    // Stats
    totalPosts: {
      type: Number,
      default: 0,
    },
    totalMembers: {
      type: Number,
      default: 0,
    },
    activityScore: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model('Community', communitySchema);
