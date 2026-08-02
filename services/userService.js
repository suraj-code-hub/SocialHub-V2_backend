import User from "../models/User.js";

// ==============================
// Get All Users
// ==============================

export const getUsersService = async () => {
  return await User.find()
    .select("-password")
    .sort({ createdAt: -1 });
};

// ==============================
// Get Single User
// ==============================

export const getUserByIdService = async (id) => {
  return await User.findById(id).select("-password");
};

// ==============================
// Update User
// ==============================

export const updateUserService = async (id, data) => {
  const user = await User.findByIdAndUpdate(
    id,
    {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      department: data.department,
      role: data.role,
      status: data.status,
      profileImage: data.profileImage,
    },
    {
      // new: true,
       returnDocument: "after",
      runValidators: true,
    }
  ).select("-password");

  return user;
};

// ==============================
// Delete User
// ==============================

export const deleteUserService = async (id) => {
  return await User.findByIdAndDelete(id);
};

// ==============================
// Change Role
// ==============================

export const changeRoleService = async (
  id,
  role
) => {
  const allowedRoles = [
    "Super Admin",
    "Admin",
    "Editor",
    "Viewer",
  ];

  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid role");
  }

  return await User.findByIdAndUpdate(
    id,
    { role },
    {
      // new: true,
       returnDocument: "after",
      runValidators: true,
    }
  ).select("-password");
};

// ==============================
// Change Status
// ==============================

export const changeStatusService = async (
  id,
  status
) => {
  const allowedStatus = [
    "Active",
    "Blocked",
  ];

  if (!allowedStatus.includes(status)) {
    throw new Error("Invalid status");
  }

  return await User.findByIdAndUpdate(
    id,
    { status },
    {
      // new: true,
       returnDocument: "after",
      runValidators: true,
    }
  ).select("-password");
};