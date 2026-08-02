import express from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeRole,
  changeStatus,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get All Users
router.get(
  "/",
  protect,
  allowRoles("Super Admin", "Admin"),
  getUsers
);

// Get Single User
router.get(
  "/:id",
  protect,
  allowRoles("Super Admin", "Admin"),
  getUserById
);

// Update User
router.put(
  "/:id",
  protect,
  allowRoles("Super Admin"),
  updateUser
);

// Delete User
router.delete(
  "/:id",
  protect,
  allowRoles("Super Admin"),
  deleteUser
);

// Change Role
router.patch(
  "/:id/role",
  protect,
  allowRoles("Super Admin"),
  changeRole
);

// Change Status
router.patch(
  "/:id/status",
  protect,
  allowRoles("Super Admin", "Admin"),
  changeStatus
);

router.get(
  "/",
  protect,
  allowRoles("Super Admin", "Admin"),
  getUsers
);

router.get(
  "/:id",
  protect,
  allowRoles("Super Admin", "Admin"),
  getUserById
);

router.put(
  "/:id",
  protect,
  allowRoles("Super Admin"),
  updateUser
);

router.delete(
  "/:id",
  protect,
  allowRoles("Super Admin"),
  deleteUser
);

router.patch(
  "/:id/role",
  protect,
  allowRoles("Super Admin"),
  changeRole
);

router.patch(
  "/:id/status",
  protect,
 allowRoles("Super Admin"),
  changeStatus
);

export default router;