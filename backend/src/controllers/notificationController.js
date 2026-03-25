const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;

    let query = { userId: req.userId };
    if (category) query.category = category;

    const skip = (page - 1) * limit;

    const notifications = await Notification.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(query);

    return res.status(200).json({
      success: true,
      notifications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ message: 'Error fetching notifications' });
  }
};

exports.markNotificationsAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;

    await Notification.updateMany(
      { _id: { $in: notificationIds }, userId: req.userId },
      { isRead: true, readAt: new Date() }
    );

    return res.status(200).json({
      success: true,
      message: 'Notifications marked as read',
    });
  } catch (error) {
    console.error('Mark notifications error:', error);
    return res.status(500).json({ message: 'Error marking notifications' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    return res.status(500).json({ message: 'Error deleting notification' });
  }
};
