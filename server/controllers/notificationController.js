import Notification from "../models/Notification.js";

// ======================================
// Get Student Notifications
// ======================================

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      student: req.student._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Mark Notification As Read
// ======================================

export const markAsRead = async (req, res) => {
  try {
    // Find notification belonging to the logged-in student
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        student: req.student._id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};