// import express from "express";

// import { protect } from "../middleware/authMiddleware.js";

// import {
//   instagramLogin,
//   instagramCallback,
//   getInstagramProfile,
//   getInstagramPosts,
//   getInstagramInsights,
//   getFacebookPageProfile,
//   getFacebookPagePosts,
//   getDashboardData,
//   getGrowthChart,
//   getAccounts, 
//   syncAccount,
//   updateAccount,
//   deleteAccount,
//   getRecentPosts,
//   reconnectAccount,
// } from "../controllers/socialController.js";

// const router = express.Router();

// router.get("/dashboard", getDashboardData);

// router.get("/accounts", protect, getAccounts);

// router.get("/login", protect, instagramLogin);

// router.get("/callback", instagramCallback);

// router.get("/instagram/profile", getInstagramProfile);

// router.get("/instagram/posts", getInstagramPosts);

// router.get("/instagram/insights", getInstagramInsights);

// router.get("/facebook/profile", getFacebookPageProfile);

// router.get("/facebook/posts", getFacebookPagePosts);

// router.get("/growth-chart", getGrowthChart);

// router.put("/sync/:platform", syncAccount);

// router.put("/account/:id", updateAccount);

// router.delete("/account/:id", deleteAccount);

// router.get("/posts/:platform", protect, getRecentPosts);

// router.get("/reconnect/:platform", reconnectAccount);

// export default router;

import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  instagramLogin,
  instagramCallback,
  getInstagramProfile,
  getInstagramPosts,
  getInstagramInsights,
  getFacebookPageProfile,
  getFacebookPagePosts,
  getDashboardData,
  getGrowthChart,
  getAccounts,
  syncAccount,
  updateAccount,
  deleteAccount,
  getRecentPosts,
  reconnectAccount,
} from "../controllers/socialController.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", protect, getDashboardData);

// Accounts
router.get("/accounts", protect, getAccounts);

// Connect Instagram
router.get("/login", protect, instagramLogin);

// OAuth Callback
router.get("/callback", instagramCallback);

// Instagram
router.get("/instagram/profile", protect, getInstagramProfile);
router.get("/instagram/posts", protect, getInstagramPosts);
router.get("/instagram/insights", protect, getInstagramInsights);

// Facebook
router.get("/facebook/profile", protect, getFacebookPageProfile);
router.get("/facebook/posts", protect, getFacebookPagePosts);

// Analytics
router.get("/growth-chart", protect, getGrowthChart);

// Account Management
router.put("/sync/:platform", protect, syncAccount);
router.put("/account/:id", protect, updateAccount);
router.delete("/account/:id", protect, deleteAccount);

// Posts
router.get("/posts/:platform", protect, getRecentPosts);

// Reconnect
router.get("/reconnect/:platform", protect, reconnectAccount);

export default router;