import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    caption: {
      type: String,
      required: true,
    },

    platform: {
      type: String,
      enum: [
        "Instagram",
        "Facebook",
        "LinkedIn",
        "YouTube",
      ],
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    // 👇 Auto Scheduler isi field ko check karega
    publishAt: {
      type: Date,
      required: true,
      index: true,
    },

    // 👇 Publish hone ke baad Social Media Post ID
    socialPostId: {
      type: String,
      default: "",
    },

    // 👇 Publish hone ka time
    publishedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Scheduled", "Published", "Failed"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Schedule", scheduleSchema);