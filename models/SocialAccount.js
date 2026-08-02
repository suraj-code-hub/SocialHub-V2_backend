import mongoose from "mongoose";

const socialAccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    platform: {
      type: String,
      enum: ["instagram", "facebook"],
      required: true,
    },

    socialId: {
      type: String,
      default: "",
    },

    username: {
      type: String,
      default: "",
    },

    pageId: {
      type: String,
      default: "",
    },

    pageName: {
      type: String,
      default: "",
    },

    accessToken: {
      type: String,
      required: true,
    },

    userAccessToken: {
      type: String,
      default: "",
    },

    tokenExpiresAt: {
      type: Date,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    followers: {
      type: Number,
      default: 0,
    },

    following: {
      type: Number,
      default: 0,
    },

    posts: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("SocialAccount", socialAccountSchema);
