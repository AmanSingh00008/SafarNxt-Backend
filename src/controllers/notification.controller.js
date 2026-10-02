import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import { notification } from "../models/notification.model.js";
import { user } from "../models/user.models.js";


// Create Notification
const createNotification = asyncHandler(async (req, res) => {
  const {
    user: userId,
    title,
    message,
    type,
  } = req.body;

  if (!userId?.trim()) {
    throw new ApiError(400, "User is required");
  }

  if (!title?.trim()) {
    throw new ApiError(400, "Notification title is required");
  }

  if (!message?.trim()) {
    throw new ApiError(400, "Notification message is required");
  }

  if (!type?.trim()) {
    throw new ApiError(400, "Notification type is required");
  }

  // Check user exists
  const existingUser = await user.findById(userId);

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  const newNotification = await notification.create({
    user: userId,
    title,
    message,
    type,
    isRead: false,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      newNotification,
      "Notification created successfully"
    )
  );
});


// Get User Notifications
const getUserNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const existingUser = await user.findById(userId);

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  const notifications = await notification
    .find({ user: userId })
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      notifications,
      "Notifications fetched successfully"
    )
  );
});


// Get Notification By ID
const getNotificationById = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  if (!notificationId) {
    throw new ApiError(400, "Notification ID is required");
  }

  const notificationData =
    await notification.findById(notificationId);

  if (!notificationData) {
    throw new ApiError(404, "Notification not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      notificationData,
      "Notification fetched successfully"
    )
  );
});


// Mark Notification As Read
const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  if (!notificationId) {
    throw new ApiError(400, "Notification ID is required");
  }

  const updatedNotification =
    await notification.findByIdAndUpdate(
      notificationId,
      {
        $set: {
          isRead: true,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!updatedNotification) {
    throw new ApiError(404, "Notification not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedNotification,
      "Notification marked as read"
    )
  );
});


// Mark All Notifications As Read
const markAllAsRead = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const existingUser = await user.findById(userId);

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  await notification.updateMany(
    {
      user: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "All notifications marked as read"
    )
  );
});


// Delete Notification
const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  if (!notificationId) {
    throw new ApiError(400, "Notification ID is required");
  }

  const deletedNotification =
    await notification.findByIdAndDelete(notificationId);

  if (!deletedNotification) {
    throw new ApiError(404, "Notification not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      deletedNotification,
      "Notification deleted successfully"
    )
  );
});


export {
  createNotification,
  getUserNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};