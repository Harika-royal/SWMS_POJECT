import { create } from 'zustand';
import { Notification } from '@/types/warehouse';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  loadNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
markAllAsRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
}

const defaultNotifications: Notification[] = [
  { id: '1', title: 'Low Stock Alert', message: 'SKU WH-10482 is below minimum threshold.', type: 'warning', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 30) },
  { id: '2', title: 'New Order', message: 'Order ORD-2024-08472 received.', type: 'info', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: '3', title: 'System Maintenance', message: 'Scheduled maintenance at 02:00 AM UTC.', type: 'info', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: '4', title: 'Shipment Delayed', message: 'Shipment #TRK-9982 is delayed by carrier.', type: 'error', read: false, createdAt: new Date() },
  { id: '5', title: 'Report Generated', message: 'Monthly inventory report is ready.', type: 'success', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: defaultNotifications,
  unreadCount: defaultNotifications.filter(n => !n.read).length,
  loadNotifications: async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

     set({
  notifications: data.notifications,
  unreadCount: data.notifications.filter((n: any) => !n.read).length,
});
  } catch (err) {
    console.error(err);
  }
},
  markAsRead: (id) => set((state) => {
    const notifications = state.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    return { notifications, unreadCount: notifications.filter(n => !n.read).length };
  }),
  markAllAsRead: () => set((state) => {
    const notifications = state.notifications.map(n => ({ ...n, read: true }));
    return { notifications, unreadCount: 0 };
  }),
  addNotification: (n) => set((state) => {
    const newNotification: Notification = {
      ...n,
      id: Math.random().toString(36).substring(7),
      read: false,
      createdAt: new Date(),
    };
    const notifications = [newNotification, ...state.notifications];
    return { notifications, unreadCount: state.unreadCount + 1 };
  }),
}));
