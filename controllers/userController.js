import {
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  changeRoleService,
  changeStatusService,
} from "../services/userService.js";

// ==============================
// Get All Users
// ==============================

export const getUsers = async (req, res) => {
  try {
    const users = await getUsersService();

    res.status(200).json({
      success: true,
      users, // <-- yahi change kiya hai
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Get Single User
// ==============================

export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Update User
// ==============================

export const updateUser = async (req, res) => {
  try {
    const user = await updateUserService(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Delete User
// ==============================

export const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Change Role
// ==============================

export const changeRole = async (req, res) => {
  try {
    const user = await changeRoleService(req.params.id, req.body.role);

    res.status(200).json({
      success: true,
      data: user,
      message: "Role updated successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Change Status
// ==============================

export const changeStatus = async (req, res) => {
  try {
    const user = await changeStatusService(req.params.id, req.body.status);

    res.status(200).json({
      success: true,
      data: user,
      message: "Status updated successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};