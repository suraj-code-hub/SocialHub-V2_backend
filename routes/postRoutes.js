// import express from "express";

// import {
//   createPost,
//   getPosts,
//   getPostById,
//   updatePost,
//   deletePost,
// } from "../controllers/postController.js";

// import upload from "../middleware/upload.js";

// const router = express.Router();

// // Create Post
// router.post("/", upload.single("image"), createPost);

// // Get All Posts
// router.get("/", getPosts);

// // Get Single Post
// router.get("/:id", getPostById);

// // Update Post
// router.put("/:id", updatePost);

// // Delete Post
// router.delete("/:id", deletePost);

// export default router;

import express from "express";

import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  syncPosts,
} from "../controllers/postController.js";

import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Post
router.post("/", protect, upload.single("image"), createPost);
// Sync Posts From Social Platforms
router.post("/sync", protect, syncPosts);

// Get All Posts
// router.get("/", getPosts);
router.get("/", protect, getPosts);

// Get Single Post
router.get("/:id", getPostById);

// Update Post
router.put("/:id", updatePost);

// Delete Post
router.delete("/:id", deletePost);

export default router;
