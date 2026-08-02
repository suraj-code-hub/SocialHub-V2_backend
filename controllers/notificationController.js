import {
  createNotificationService,
  getNotificationsService,
  getUnreadCountService,
  updateNotificationService,
  deleteNotificationService,
  markReadService,
  markAllReadService,
} from "../services/notificationService.js";

// Create
export const createNotification = async (req, res) => {
  try {
    const notification = await createNotificationService(req.body);

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await getNotificationsService(req.user._id);

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Unread Count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await getUnreadCountService(req.user._id);

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update
export const updateNotification = async (req, res) => {
  try {
    const notification = await updateNotificationService(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete
export const deleteNotification = async (req, res) => {
  try {
    await deleteNotificationService(req.params.id);

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark One Read
export const markRead = async (req, res) => {
  try {
    const notification = await markReadService(req.params.id);

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark All Read
export const markAllRead = async (req, res) => {
  try {
    await markAllReadService(req.user._id);

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};