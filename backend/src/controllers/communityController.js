const Community = require('../models/Community');
const DiscussionThread = require('../models/DiscussionThread');
const User = require('../models/User');

exports.createCommunity = async (req, res) => {
  try {
    const { name, description, subject, gradeLevels } = req.body;

    const community = await Community.create({
      name,
      description,
      subject,
      gradeLevels,
      creator: req.userId,
      members: [{ userId: req.userId, role: 'moderator' }],
    });

    // Add community to user
    await User.findByIdAndUpdate(req.userId, {
      $push: { joinedCommunities: community._id },
      $inc: { experiencePoints: 30 },
    });

    return res.status(201).json({
      success: true,
      message: 'Community created successfully',
      community,
    });
  } catch (error) {
    console.error('Create community error:', error);
    return res.status(500).json({ message: 'Error creating community' });
  }
};

exports.getCommunities = async (req, res) => {
  try {
    const { subject, page = 1, limit = 12 } = req.query;

    let query = { isPublic: true };
    if (subject) query.subject = subject;

    const skip = (page - 1) * limit;

    const communities = await Community.find(query)
      .populate('creator', 'firstName lastName profilePicture')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ memberCount: -1 });

    const total = await Community.countDocuments(query);

    return res.status(200).json({
      success: true,
      communities,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get communities error:', error);
    return res.status(500).json({ message: 'Error fetching communities' });
  }
};

exports.getCommunityById = async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findById(id)
      .populate('creator', 'firstName lastName profilePicture')
      .populate('discussions', '-replies');

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    return res.status(200).json({
      success: true,
      community,
    });
  } catch (error) {
    console.error('Get community error:', error);
    return res.status(500).json({ message: 'Error fetching community' });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const isMember = community.members.some((m) => m.userId.toString() === req.userId);
    if (isMember) {
      return res.status(400).json({ message: 'Already a member of this community' });
    }

    community.members.push({ userId: req.userId, joinedAt: new Date() });
    community.memberCount += 1;
    await community.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { joinedCommunities: community._id },
      $inc: { experiencePoints: 10 },
    });

    return res.status(200).json({
      success: true,
      message: 'Joined community successfully',
    });
  } catch (error) {
    console.error('Join community error:', error);
    return res.status(500).json({ message: 'Error joining community' });
  }
};

exports.createDiscussionThread = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { title, content, category, tags } = req.body;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const thread = await DiscussionThread.create({
      title,
      content,
      category,
      tags,
      author: req.userId,
      community: communityId,
    });

    // Add thread to community
    community.discussionThreads.push(thread._id);
    community.totalPosts += 1;
    community.activityScore += 5;
    await community.save();

    // Award XP
    await User.findByIdAndUpdate(req.userId, {
      $inc: { experiencePoints: 5, communityReputation: 1 },
    });

    return res.status(201).json({
      success: true,
      message: 'Discussion thread created successfully',
      thread,
    });
  } catch (error) {
    console.error('Create discussion thread error:', error);
    return res.status(500).json({ message: 'Error creating discussion thread' });
  }
};

exports.getDiscussionThreads = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const threads = await DiscussionThread.find({ community: communityId })
      .populate('author', 'firstName lastName profilePicture')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ isPinned: -1, createdAt: -1 });

    const total = await DiscussionThread.countDocuments({ community: communityId });

    return res.status(200).json({
      success: true,
      threads,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get discussion threads error:', error);
    return res.status(500).json({ message: 'Error fetching discussion threads' });
  }
};
