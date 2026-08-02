import Notification from "../models/Notification.js";

// ======================================
// Create Notification
// ======================================

export const createNotificationService = async (data) => {
  return await Notification.create(data);
};

// ======================================
// Get Logged-in User Notifications
// ======================================

export const getNotificationsService = async (userId) => {
  return await Notification.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
};

// ======================================
// Get Unread Count
// ======================================

export const getUnreadCountService = async (userId) => {
  return await Notification.countDocuments({
    user: userId,
    read: false,
  });
};

// ======================================
// Update Notification
// ======================================

export const updateNotificationService = async (
  id,
  data
) => {
  return await Notification.findByIdAndUpdate(
    id,
    data,
    {
      // new: true,
      returnDocument: "after",
      runValidators: true,
    }
  );
};

// ======================================
// Delete Notification
// ======================================

export const deleteNotificationService = async (
  id
) => {
  return await Notification.findByIdAndDelete(id);
};

// ======================================
// Mark One Notification Read
// ======================================

export const markReadService = async (id) => {
  return await Notification.findByIdAndUpdate(
    id,
    {
      read: true,
    },
    {
      // new: true,
      returnDocument: "after",
    }
  );
};

// ======================================
// Mark All Notifications Read
// ======================================

export const markAllReadService = async (
  userId
) => {
  return await Notification.updateMany(
    {
      user: userId,
      read: false,
    },
    {
      $set: {
        read: true,
      },
    }
  );
};