const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Experience & Leveling
    totalXP: {
      type: Number,
      default: 0,
    },
    currentLevel: {
      type: Number,
      default: 1,
    },
    xpForNextLevel: {
      type: Number,
      default: 1000,
    },
    
    // Achievements & Badges
    unlockedBadges: [
      {
        badgeId: String,
        badgeName: String,
        description: String,
        icon: String,
        unlockedAt: Date,
      },
    ],
    totalBadges: {
      type: Number,
      default: 0,
    },
    
    // CPD Points
    cpdPointsThisYear: {
      type: Number,
      default: 0,
    },
    cpdPointsAllTime: {
      type: Number,
      default: 0,
    },
    cpdActivities: [
      {
        activityType: String,
        pointsEarned: Number,
        description: String,
        completedAt: Date,
      },
    ],
    
    // Monthly Leaderboard Position
    leaderboardRank: Number,
    leaderboardScore: Number,
    
    // Streaks & Challenges
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    activeChallenge: mongoose.Schema.Types.ObjectId,
    completedChallenges: [
      {
        challengeId: mongoose.Schema.Types.ObjectId,
        completedAt: Date,
        reward: Number,
      },
    ],
    
    // Stats
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gamification', gamificationSchema);
