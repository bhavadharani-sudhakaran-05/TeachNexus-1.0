const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`📱 User connected: ${socket.id}`);

    // User online status
    socket.on('user_online', (userId) => {
      socket.join(`user_${userId}`);
      io.emit('user_status_update', { userId, status: 'online' });
    });

    // Real-time notifications
    socket.on('notify', (data) => {
      const { recipientId, notification } = data;
      io.to(`user_${recipientId}`).emit('new_notification', notification);
    });

    // Direct messaging
    socket.on('send_message', (data) => {
      const { senderId, recipientId, message } = data;
      io.to(`user_${recipientId}`).emit('receive_message', {
        senderId,
        message,
        timestamp: new Date(),
      });
    });

    // Collaborative lesson editing (Yjs)
    socket.on('join_lesson', (lessonId) => {
      socket.join(`lesson_${lessonId}`);
      socket.broadcast.to(`lesson_${lessonId}`).emit('collaborator_joined', socket.id);
    });

    socket.on('lesson_update', (data) => {
      const { lessonId, update } = data;
      socket.broadcast.to(`lesson_${lessonId}`).emit('lesson_update', update);
    });

    // Community discussions
    socket.on('join_community', (communityId) => {
      socket.join(`community_${communityId}`);
    });

    socket.on('new_post', (data) => {
      const { communityId, post } = data;
      io.to(`community_${communityId}`).emit('post_created', post);
    });

    // Typing indicators
    socket.on('typing', (data) => {
      const { recipientId, typingStatus } = data;
      io.to(`user_${recipientId}`).emit('typing_indicator', { status: typingStatus });
    });

    // Connection closed
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
      io.emit('user_status_update', { userId: socket.id, status: 'offline' });
    });
  });
};

module.exports = socketHandler;
