import Notification from "../models/Notification.js";

// ======================================
// Get Student Notifications
// ======================================

export const getNotifications = async (req, res) => {
  try {

    const notifications = await Notification.find({
      student: req.student.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });

  } catch (error) {

    res.status(500).json({
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

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
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

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};