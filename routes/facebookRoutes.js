import express from "express";

import {
  getFacebookProfile,
  getFacebookPosts,
  publishFacebookPost,
  getFacebookAnalytics,
} from "../controllers/facebookController.js";

const router = express.Router();

// ==============================
// Facebook Profile
// GET:
// /api/facebook/profile?pageId=PAGE_ID&accessToken=TOKEN
// ==============================
router.get("/profile", getFacebookProfile);

// ==============================
// Facebook Posts
// GET:
// /api/facebook/posts?pageId=PAGE_ID&accessToken=TOKEN
// ==============================
router.get("/posts", getFacebookPosts);

// ==============================
// Facebook Analytics
// GET:
// /api/facebook/analytics?pageId=PAGE_ID&accessToken=TOKEN
// ==============================
router.get("/analytics", getFacebookAnalytics);

// ==============================
// Publish Facebook Post
// POST:
// /api/facebook/publish
// ==============================
router.post("/publish", publishFacebookPost);

export default router;