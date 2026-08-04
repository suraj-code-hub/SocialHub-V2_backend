import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

import Schedule from "../models/Schedule.js";
import { publishPlatformPostService } from "../services/platformService.js";

import {
  createPostService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} from "../services/postService.js";

import Post from "../models/Post.js";
import SocialAccount from "../models/SocialAccount.js";

import { getInstagramPostsService } from "../services/instagramService.js";

import { getFacebookPagePostsService } from "../services/facebookService.js";

import {
  getPostsService,
  syncAllPostsService,
} from "../services/socialService.js";

export const createPost = async (req, res) => {
  try {
    let imageUrl = "";

    // ===========================
    // Upload Image
    // ===========================
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "socialhub/posts",
          },
          (error, result) => {
            if (error) return reject(error);

            resolve(result.secure_url);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    }

    const { caption, platform, schedule } = req.body;
    const action = String(req.body.action || "").toLowerCase().trim();

    if (!caption?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Caption is required",
      });
    }

    if (!platform?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Platform is required",
      });
    }

    const parsedSchedule = schedule ? new Date(schedule) : null;

    if (schedule && Number.isNaN(parsedSchedule?.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid schedule date and time",
      });
    }

    console.log("========== CREATE POST ==========");
    console.log(req.body);

    // =====================================
    // Draft
    // =====================================

    if (action === "draft") {
      const post = await createPostService({
        caption: caption.trim(),
        platform,
        image: imageUrl,
        schedule: null,
        status: "Draft",
        createdBy: req.user._id,
      });

      return res.status(201).json({
        success: true,
        message: "Draft saved",
        data: post,
      });
    }

    // =====================================
    // Schedule
    // =====================================

    if (action === "schedule") {
      if (!schedule || Number.isNaN(parsedSchedule?.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Please choose a schedule date and time",
        });
      }

      const schedulePost = await Schedule.create({
        user: req.user._id,
        caption: caption.trim(),
        platform,
        image: imageUrl,
        date: parsedSchedule.toISOString().split("T")[0],
        time: parsedSchedule.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        publishAt: parsedSchedule,
        status: "Scheduled",
      });

      const post = await createPostService({
        caption: caption.trim(),
        platform,
        image: imageUrl,
        schedule: parsedSchedule,
        status: "Scheduled",
        createdBy: req.user._id,
      });

      return res.status(201).json({
        success: true,
        message: "Scheduled successfully",
        schedule: schedulePost,
        data: post,
      });
    }

    // =====================================
    // Publish Now
    // =====================================

    if (action === "publish") {
      if (!imageUrl) {
        return res.status(400).json({
          success: false,
          message: "Please upload an image before publishing",
        });
      }

      const account = await SocialAccount.findOne({
        user: req.user._id,
        platform: platform.toLowerCase(),
        isActive: true,
      });

      if (!account) {
        return res.status(404).json({
          success: false,
          message: platform + " account not connected",
        });
      }

      console.log("========== PUBLISH ==========");
      console.log("Platform :", platform);
      console.log("Image :", imageUrl);
      console.log("Caption :", caption);
      console.log("=============================");

      const result = await publishPlatformPostService(
        platform,
        platform === "Instagram" ? account.socialId : account.pageId,
        account.accessToken,
        imageUrl,
        caption.trim(),
      );

      const post = await createPostService({
        caption: caption.trim(),
        platform,
        image: imageUrl,
        status: "Published",
        publishedAt: new Date(),
        socialPostId: result.id || "",
        permalink: result.permalink || "",
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
        reach: 0,
        createdBy: req.user._id,
      });

      return res.status(201).json({
        success: true,
        message: "Published Successfully",
        social: result,
        data: post,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid action",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const data = await getPostsService(req.user._id, req.query);

    res.json({
      success: true,
      ...data,
    });
  } catch (err) {
    console.error("GET POSTS ERROR:");
    console.error(err);
    console.error(err.stack);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Get Single Post
// ==============================

export const getPostById = async (req, res) => {
  try {
    const post = await getPostByIdService(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Post
// ==============================

export const updatePost = async (req, res) => {
  try {
    const post = await updatePostService(req.params.id, req.body);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Post
// ==============================

export const deletePost = async (req, res) => {
  try {
    const post = await deletePostService(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const syncPosts = async (req, res) => {
  try {
    await syncAllPostsService(req.user._id);

    res.json({
      success: true,

      message: "Posts synced successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};
