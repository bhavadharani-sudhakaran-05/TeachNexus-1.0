const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    // Badge Info
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    icon: String, // emoji or URL
    color: String,
    
    // Categories
    category: {
      type: String,
      enum: [
        'resource_sharing',
        'community',
        'collaboration',
        'gamification',
        'learning',
        'teaching_excellence',
        'milestone',
      ],
      required: true,
    },
    
    // Requirements
    requirement: {
      type: String, // e.g., 'uploadedResources:10', 'receivedXP:5000'
    },
    requiredValue: Number,
    
    // XP Reward
    xpReward: Number,
    
    // Rarity
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'legendary'],
      default: 'uncommon',
    },
    
    // Stats
    totalUnlocked: {
      type: Number,
      default: 0,
    },
    
    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Achievement', achievementSchema);
