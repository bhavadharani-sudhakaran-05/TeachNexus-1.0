import React, { useEffect } from 'react';
import { useNotificationStore } from '../context/store';
import { notificationsAPI } from '../utils/api';
import '../styles/notifications.css';

const NotificationCenter = ({ socket }) => {
  const { notifications, addNotification, setNotifications } = useNotificationStore();

  useEffect(() => {
    // Load initial notifications
    loadNotifications();

    // Listen for socket events
    if (socket) {
      socket.on('new_notification', (notification) => {
        addNotification(notification);
      });
    }

    return () => {
      if (socket) {
        socket.off('new_notification');
      }
    };
  }, [socket]);

  const loadNotifications = async () => {
    try {
      const response = await notificationsAPI.getNotifications({});
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  return (
    <div className="notification-center">
      {notifications.slice(0, 5).map((notif) => (
        <div key={notif._id} className={`notif-item ${notif.isRead ? 'read' : 'unread'}`}>
          <p>{notif.message}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
