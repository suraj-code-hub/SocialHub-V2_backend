import express from "express";

import {
  getSettings,
  updateSettings,
  updateTheme,
  updateNotificationSettings,
} from "../controllers/settingsController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get User Settings
router.get("/", protect, getSettings);

// Update All Settings
router.put("/", protect, updateSettings);

// Update Theme
router.patch("/theme", protect, updateTheme);

// Update Notification Settings
router.patch(
  "/notifications",
  protect,
  updateNotificationSettings
);

export default router;