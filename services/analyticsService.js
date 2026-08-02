import Post from "../models/Post.js";

export const getAnalyticsService = async (filter = "7D") => {
  let startDate = new Date();

  switch (filter) {
    case "30D":
      startDate.setDate(startDate.getDate() - 30);
      break;

    case "90D":
      startDate.setDate(startDate.getDate() - 90);
      break;

    default:
      startDate.setDate(startDate.getDate() - 7);
  }

  const query = {
    createdAt: {
      $gte: startDate,
    },
  };

  const totalPosts = await Post.countDocuments(query);

  const totalLikes = await Post.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$likes",
        },
      },
    },
  ]);

  const totalComments = await Post.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$comments",
        },
      },
    },
  ]);

  const totalReach = await Post.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$reach",
        },
      },
    },
  ]);

  const platformStats = await Post.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: "$platform",
        total: {
          $sum: 1,
        },
      },
    },
  ]);

  const topPosts = await Post.find()
  .sort({ likes: -1 })
  .limit(5);

return {
  totalPosts,
  totalLikes: totalLikes[0]?.total || 0,
  totalComments: totalComments[0]?.total || 0,
  totalReach: totalReach[0]?.total || 0,
  platformStats,
  topPosts,
};
};