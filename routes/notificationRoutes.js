import express from "express";

import {
  createNotification,
  getNotifications,
  getUnreadCount,
  updateNotification,
  deleteNotification,
  markRead,
  markAllRead,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require login
router.use(protect);

// GET
router.get("/", getNotifications);

router.get("/unread-count", getUnreadCount);

// POST
router.post("/", createNotification);

// PATCH
router.patch("/:id/read", markRead);

router.patch("/read-all", markAllRead);

// PUT
router.put("/:id", updateNotification);

// DELETE
router.delete("/:id", deleteNotification);

export default router;