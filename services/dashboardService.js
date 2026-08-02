import Post from "../models/Post.js";
import User from "../models/User.js";
import Schedule from "../models/Schedule.js";
import Account from "../models/Account.js";

export const getDashboardService = async () => {
  // ==========================
  // Counts
  // ==========================

  const totalUsers = await User.countDocuments();

  const totalPosts = await Post.countDocuments();

  const totalAccounts = await Account.countDocuments();

  const totalScheduled = await Schedule.countDocuments({
    status: "Scheduled",
  });

  const totalPublished = await Schedule.countDocuments({
    status: "Published",
  });

  const totalDraft = await Schedule.countDocuments({
    status: "Draft",
  });

  // ==========================
  // Platform Counts
  // ==========================

  const instagram = await Account.countDocuments({
    platform: "Instagram",
  });

  const facebook = await Account.countDocuments({
    platform: "Facebook",
  });

  const linkedin = await Account.countDocuments({
    platform: "LinkedIn",
  });

  const youtube = await Account.countDocuments({
    platform: "YouTube",
  });

  // ==========================
  // Recent Posts
  // ==========================

  const recentPosts = await Schedule.find()
    .sort({ createdAt: -1 })
    .limit(5);

  // ==========================
  // Recent Users
  // ==========================

  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    stats: {
      totalUsers,
      totalPosts,
      totalAccounts,
      totalScheduled,
      totalPublished,
      totalDraft,
    },

    platforms: [
      {
        name: "Instagram",
        username: "instagram",
        followers: instagram,
        growth: 12,
        connected: instagram > 0,
        color: "#E1306C",
      },
      {
        name: "Facebook",
        username: "facebook",
        followers: facebook,
        growth: 8,
        connected: facebook > 0,
        color: "#1877F2",
      },
      {
        name: "LinkedIn",
        username: "linkedin",
        followers: linkedin,
        growth: 5,
        connected: linkedin > 0,
        color: "#0A66C2",
      },
      {
        name: "YouTube",
        username: "youtube",
        followers: youtube,
        growth: 10,
        connected: youtube > 0,
        color: "#FF0000",
      },
    ],

    growthChart: [
      { month: "Jan", posts: 5 },
      { month: "Feb", posts: 12 },
      { month: "Mar", posts: 18 },
      { month: "Apr", posts: 24 },
      { month: "May", posts: 30 },
      { month: "Jun", posts: totalPublished },
    ],

    recentActivities: recentUsers,

    upcomingPosts: recentPosts.filter(
      (post) => post.status === "Scheduled"
    ),

    recentPosts,

    aiInsights: {
      engagement:
        "Instagram engagement increased by 18% this week.",
      recommendation:
        "Best posting time is between 7 PM and 9 PM.",
    },
  };
};