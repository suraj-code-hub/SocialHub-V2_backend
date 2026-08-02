import express from "express";

import {
  addAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
} from "../controllers/accountController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get All Accounts & Add Account
router
  .route("/")
  .get(protect, getAccounts)
  .post(protect, addAccount);

// Get, Update & Delete Single Account
router
  .route("/:id")
  .get(protect, getAccountById)
  .put(protect, updateAccount)
  .delete(protect, deleteAccount);

export default router;