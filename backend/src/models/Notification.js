const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    
    // Recipient & Type
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'resource_shared',
        'resource_downloaded',
        'comment',
        'community_invite',
        'mentor_match',
        'xp_earned',
        'badge_unlocked',
        'challenge_completed',
        'peer_review_result',
        'message_received',
        'system_announcement',
        'school_announcement',
      ],
      required: true,
    },
    
    // Content & Action
    relatedContent: {
      type: String, // ID of related content (resource, thread, etc.)
    },
    actionUrl: String,
    
    // Status
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    
    // Category
    category: {
      type: String,
      enum: ['social', 'system', 'achievement', 'announcement'],
      default: 'system',
    },
    
    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
