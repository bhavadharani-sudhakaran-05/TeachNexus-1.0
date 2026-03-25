const Gamification = require('../models/Gamification');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const TeachingChallenge = require('../models/TeachingChallenge');

exports.getGameificationStats = async (req, res) => {
  try {
    let gamification = await Gamification.findOne({ userId: req.userId });

    if (!gamification) {
      gamification = await Gamification.create({ userId: req.userId });
    }

    return res.status(200).json({
      success: true,
      gamification,
    });
  } catch (error) {
    console.error('Get gamification stats error:', error);
    return res.status(500).json({ message: 'Error fetching gamification stats' });
  }
};

exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({}).sort({ _id: 1 });

    return res.status(200).json({
      success: true,
      achievements,
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    return res.status(500).json({ message: 'Error fetching achievements' });
  }
};

exports.getMonthlyLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Gamification.find()
      .populate('userId', 'firstName lastName profilePicture subjectSpecializations')
      .sort({ leaderboardScore: -1 })
      .limit(100);

    const userRank = await Gamification.findOne({ userId: req.userId }).sort({ leaderboardScore: -1 });

    return res.status(200).json({
      success: true,
      leaderboard,
      userRank: userRank ? userRank.leaderboardRank : null,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

exports.getTeachingChallenges = async (req, res) => {
  try {
    const challenges = await TeachingChallenge.find({ isActive: true })
      .sort({ startDate: -1 });

    return res.status(200).json({
      success: true,
      challenges,
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    return res.status(500).json({ message: 'Error fetching challenges' });
  }
};

exports.joinChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await TeachingChallenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const isParticipating = challenge.participants.some(
      (p) => p.userId.toString() === req.userId
    );

    if (isParticipating) {
      return res.status(400).json({ message: 'Already participating in this challenge' });
    }

    challenge.participants.push({
      userId: req.userId,
      joinedAt: new Date(),
      completed: false,
    });
    challenge.totalParticipants += 1;
    await challenge.save();

    return res.status(200).json({
      success: true,
      message: 'Joined challenge successfully',
    });
  } catch (error) {
    console.error('Join challenge error:', error);
    return res.status(500).json({ message: 'Error joining challenge' });
  }
};

exports.completeChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await TeachingChallenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const participant = challenge.participants.find(
      (p) => p.userId.toString() === req.userId
    );

    if (!participant) {
      return res.status(400).json({ message: 'Not participating in this challenge' });
    }

    if (participant.completed) {
      return res.status(400).json({ message: 'Challenge already completed' });
    }

    participant.completed = true;
    participant.completedAt = new Date();
    challenge.completionCount += 1;
    await challenge.save();

    // Award XP
    const gamification = await Gamification.findOne({ userId: req.userId });
    if (gamification) {
      gamification.totalXP += challenge.xpReward;
      await gamification.save();
    }

    await User.findByIdAndUpdate(req.userId, {
      $inc: { experiencePoints: challenge.xpReward },
    });

    return res.status(200).json({
      success: true,
      message: 'Challenge completed successfully',
      xpEarned: challenge.xpReward,
    });
  } catch (error) {
    console.error('Complete challenge error:', error);
    return res.status(500).json({ message: 'Error completing challenge' });
  }
};
