import { Router } from "express";

import {
  createNotification,
  getUserNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = Router();


// Create notification
router.post("/", createNotification);

// Get all notifications of a user
router.get("/user/:userId", getUserNotifications);

// Mark all notifications as read
router.patch("/user/:userId/read-all", markAllAsRead);

// Get notification by ID
router.get("/:notificationId", getNotificationById);

// Mark notification as read
router.patch("/:notificationId/read", markAsRead);

// Delete notification
router.delete("/:notificationId", deleteNotification);


export default router;