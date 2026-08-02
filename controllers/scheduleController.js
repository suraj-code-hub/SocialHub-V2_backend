import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

import {
  createScheduleService,
  getSchedulesService,
  updateScheduleService,
  deleteScheduleService,
} from "../services/scheduleService.js";
// Create
export const createSchedule = async (req, res) => {
  try {
    console.log("========== NEW SCHEDULE ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    let imageUrl = "";

    if (req.file) {
      console.log("Uploading image to Cloudinary...");

      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "socialhub/schedules",
          },
          (error, result) => {
            if (error) {
              console.log("Cloudinary Error:", error);
              return reject(error);
            }

            console.log("Cloudinary Success:", result.secure_url);

            resolve(result.secure_url);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    }

    console.log("Final Image URL:", imageUrl);
    
    const publishAt = new Date(`${req.body.date}T${req.body.time}:00`);

    const schedule = await createScheduleService({
      user: req.user._id,
      caption: req.body.caption,
      platform: req.body.platform,
      image: imageUrl,

      date: req.body.date,
      time: req.body.time,

      publishAt,

      status: "Scheduled",
    });

    res.status(201).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get
export const getSchedules = async (req, res) => {
  try {
    const schedules = await getSchedulesService();

    res.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update
export const updateSchedule = async (req, res) => {
  try {
    const schedule = await updateScheduleService(req.params.id, req.body);

    res.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete
export const deleteSchedule = async (req, res) => {
  try {
    await deleteScheduleService(req.params.id);

    res.json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
