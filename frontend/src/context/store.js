import create from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export const useResourceStore = create((set) => ({
  resources: [],
  currentResource: null,
  isLoading: false,

  setResources: (resources) => set({ resources }),
  setCurrentResource: (resource) => set({ currentResource: resource }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  setNotifications: (notifications) => set({ notifications }),
  markAsRead: (ids) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        ids.includes(n._id) ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - ids.length),
    })),
}));
