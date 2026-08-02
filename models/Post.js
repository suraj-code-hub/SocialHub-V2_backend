import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      enum: ["Instagram", "Facebook", "LinkedIn", "YouTube"],
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    // Social Media Original Post ID
    socialPostId: {
      type: String,
      unique: true,
      sparse: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Scheduled", "Published"],
      default: "Draft",
    },

    schedule: {
      type: Date,
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    likes: {
      type: Number,
      default: 0,
    },

    comments: {
      type: Number,
      default: 0,
    },

    shares: {
      type: Number,
      default: 0,
    },

    reach: {
      type: Number,
      default: 0,
    },

    impressions: {
      type: Number,
      default: 0,
    },

    permalink: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Useful Indexes
postSchema.index({
  platform: 1,
  status: 1,
});

postSchema.index({
  publishedAt: -1,
});

export default mongoose.model("Post", postSchema);