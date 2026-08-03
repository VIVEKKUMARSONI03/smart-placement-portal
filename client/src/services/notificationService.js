import api from "./api";

// ======================================
// Get All Notifications
// ======================================

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

// ======================================
// Mark Notification As Read
// ======================================

export const markNotificationRead = async (id) => {
  const res = await api.put(`/notifications/${id}`);
  return res.data;
};