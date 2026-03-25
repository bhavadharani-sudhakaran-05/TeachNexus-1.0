const mongoose = require('mongoose');

const discussionThreadSchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: [true, 'Thread title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Thread content is required'],
    },
    
    // Author & Community
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
      required: true,
    },
    
    // Content Classification
    category: {
      type: String,
      enum: ['discussion', 'question', 'resource_share', 'poll', 'announcement'],
      default: 'discussion',
    },
    tags: [String],
    
    // Engagement
    replies: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        author: mongoose.Schema.Types.ObjectId,
        content: String,
        likes: Number,
        createdAt: Date,
        isMarkedCorrect: Boolean,
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    
    // Status
    isPinned: {
      type: Boolean,
      default: false,
    },
    isSolved: {
      type: Boolean,
      default: false,
    },
    solvedAt: Date,
    
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

module.exports = mongoose.model('DiscussionThread', discussionThreadSchema);
