import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";

import {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createSchedule);
router.get("/", protect, getSchedules);
router.put("/:id", protect, updateSchedule);
router.delete("/:id", protect, deleteSchedule);

export default router;