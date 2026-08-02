import Schedule from "../models/Schedule.js";

// ==============================
// Create Schedule
// ==============================
export const createScheduleService = async (data) => {
  return await Schedule.create({
    user: data.user,

    caption: data.caption,

    platform: data.platform,

    image: data.image || "",

    date: data.date,

    time: data.time,

    // Scheduler Cron isi field ko use karega
    publishAt: data.publishAt,

    status: data.status || "Scheduled",
  });
};

// ==============================
// Get All Schedules
// ==============================
export const getSchedulesService = async () => {
  return await Schedule.find().sort({
    publishAt: 1,
  });
};

// ==============================
// Update Schedule
// ==============================
export const updateScheduleService = async (id, data) => {
  return await Schedule.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  });
};

// ==============================
// Delete Schedule
// ==============================
export const deleteScheduleService = async (id) => {
  return await Schedule.findByIdAndDelete(id);
};