const DirectMessage = require('../models/DirectMessage');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.userId;

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const conversationId = [senderId, recipientId].sort().join('_');

    const directMessage = await DirectMessage.create({
      sender: senderId,
      recipient: recipientId,
      message,
      conversationId,
    });

    // Emit via Socket.io for real-time notification
    const io = require('../server').io;
    io.to(`user_${recipientId}`).emit('new_message', {
      from: senderId,
      message: directMessage,
    });

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      directMessage,
    });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ message: 'Error sending message' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const userId = req.userId;

    const conversationId = [userId, recipientId].sort().join('_');

    const messages = await DirectMessage.find({ conversationId })
      .populate('sender', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .limit(50);

    // Mark as read
    await DirectMessage.updateMany(
      { conversationId, recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    return res.status(500).json({ message: 'Error fetching conversation' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all unique conversations
    const conversations = await DirectMessage.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $last: '$$ROOT' },
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
    ]);

    const enriched = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId =
          conv.lastMessage.sender.toString() === userId
            ? conv.lastMessage.recipient
            : conv.lastMessage.sender;

        const otherUser = await User.findById(otherUserId).select(
          'firstName lastName profilePicture'
        );

        return {
          conversationId: conv._id,
          otherUser,
          lastMessage: conv.lastMessage.message,
          lastMessageTime: conv.lastMessage.createdAt,
          unreadCount: await DirectMessage.countDocuments({
            conversationId: conv._id,
            recipient: userId,
            isRead: false,
          }),
        };
      })
    );

    return res.status(200).json({
      success: true,
      conversations: enriched,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    return res.status(500).json({ message: 'Error fetching conversations' });
  }
};
