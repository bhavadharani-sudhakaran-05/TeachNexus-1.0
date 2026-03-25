const User = require('../models/User');
const Resource = require('../models/Resource');
const Gamification = require('../models/Gamification');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('uploadedResources', 'title subject downloads views rating')
      .populate('favoriteResources', 'title subject')
      .populate('joinedCommunities', 'name subject memberCount');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Error fetching profile' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, biography, subjectSpecializations, gradeLevels, schoolName } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        biography,
        subjectSpecializations,
        gradeLevels,
        schoolName,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Error updating profile' });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const gamification = await Gamification.findOne({ userId: req.userId });

    const stats = {
      totalResourcesUploaded: user.totalResourcesUploaded,
      totalDownloads: user.totalDownloads,
      communityReputation: user.communityReputation,
      experiencePoints: user.experiencePoints,
      currentLevel: user.level,
      badges: user.achievementBadges.length,
      cpdPoints: user.cpdPointsEarned,
    };

    const recommendations = await Resource.find({
      subject: { $in: user.subjectSpecializations },
      isPublic: true,
    })
      .limit(5)
      .sort({ views: -1 });

    return res.status(200).json({
      success: true,
      stats,
      recommendations,
      greeting: `Welcome back, ${user.firstName}! 📚`,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ message: 'Error loading dashboard' });
  }
};

exports.getUserPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate('uploadedResources', 'title subject downloads rating')
      .populate('joinedCommunities', 'name subject');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
        biography: user.biography,
        subjectSpecializations: user.subjectSpecializations,
        gradeLevels: user.gradeLevels,
        experiencePoints: user.experiencePoints,
        level: user.level,
        totalResourcesUploaded: user.totalResourcesUploaded,
        totalDownloads: user.totalDownloads,
        communityReputation: user.communityReputation,
        uploadedResources: user.uploadedResources,
        joinedCommunities: user.joinedCommunities,
        achievementBadges: user.achievementBadges,
      },
    });
  } catch (error) {
    console.error('Public profile error:', error);
    return res.status(500).json({ message: 'Error fetching profile' });
  }
};
