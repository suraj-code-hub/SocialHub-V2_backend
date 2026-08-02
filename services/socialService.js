import SocialAccount from "../models/SocialAccount.js";
import jwt from "jsonwebtoken";

import {
  getAccessTokenService,
  getLongLivedTokenService,
  getFacebookPagesService,
  getInstagramBusinessAccountService,
  syncInstagramProfileService,
} from "./instagramService.js";

import {
  getInstagramProfileService,
  getInstagramPostsService,
  getInstagramInsightsService,
  getInstagramFollowerHistoryService,
} from "./instagramService.js";

import {
  getFacebookPagePostsService,
  getFacebookPageProfileService,
  syncFacebookProfileService,
} from "./facebookService.js";

import { retry } from "./retryService.js";
import { logger } from "../config/logger.js";

import {
  buildDashboardStats,
  buildRecentPosts,
  buildTopPost,
  buildEngagement,
  buildAudience,
  buildInsights,
  buildPlatformCards,
  buildGrowthChart,
} from "./dashboardBuilder.js";

import { createNotificationService } from "./notificationService.js";

import Schedule from "../models/Schedule.js";
import Post from "../models/Post.js";

import { publishInstagramPostService } from "./instagramService.js";

import { publishFacebookPostService } from "./facebookService.js";
import { publishPlatformPostService } from "./platformService.js";

// ======================================================
// Get All Accounts Of User
// ======================================================

export const getAccountsService = async (userId) => {
  return await SocialAccount.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
};

// ======================================================
// Get Single Account By Platform
// ======================================================

export const getAccountByPlatformService = async (userId, platform) => {
  return await SocialAccount.findOne({
    user: userId,
    platform,
    isActive: true,
  });
};

// ======================================================
// Get Account By Id
// ======================================================

export const getAccountByIdService = async (id) => {
  return await SocialAccount.findById(id);
};

// ======================================================
// Save Or Update Account
// ======================================================

export const saveOrUpdateAccountService = async (
  userId,
  platform,
  accountData,
) => {
  const account = await SocialAccount.findOneAndUpdate(
    {
      user: userId,
      platform,
    },
    {
      ...accountData,
      isActive: true,
    },
    {
      upsert: true,
      // new: true,
      returnDocument: "after",
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  return account;
};

// ======================================================
// Update Stats
// ======================================================

export const updateAccountStatsService = async (id, stats) => {
  return await SocialAccount.findByIdAndUpdate(
    id,
    {
      followers: stats.followers,
      following: stats.following,
      posts: stats.posts,
      updatedAt: new Date(),
    },
    {
      // new: true,
      returnDocument: "after",
    },
  );
};

// ======================================================
// Update Profile
// ======================================================

export const updateAccountProfileService = async (id, profile) => {
  return await SocialAccount.findByIdAndUpdate(
    id,
    {
      username: profile.username,
      pageName: profile.pageName,
      profilePicture: profile.profilePicture,
      updatedAt: new Date(),
    },
    {
      // new: true,
      returnDocument: "after",
    },
  );
};

// ======================================================
// Mark Account Inactive
// ======================================================

export const deactivateAccountService = async (id) => {
  return await SocialAccount.findByIdAndUpdate(
    id,
    {
      isActive: false,
    },
    {
      // new: true,
      returnDocument: "after",
    },
  );
};

// ======================================================
// Delete Account
// ======================================================

export const deleteAccountService = async (id) => {
  return await SocialAccount.findByIdAndDelete(id);
};

// ======================================================
// Validate Token
// ======================================================

export const validateTokenService = (tokenExpiresAt) => {
  if (!tokenExpiresAt) return false;

  return new Date(tokenExpiresAt) > new Date();
};

// ======================================================
// Check Expiry
// ======================================================

export const isTokenExpiredService = (tokenExpiresAt) => {
  if (!tokenExpiresAt) return true;

  return new Date(tokenExpiresAt) <= new Date();
};

// ======================================================
// Update Last Sync
// ======================================================

export const updateLastSyncService = async (id) => {
  return await SocialAccount.findByIdAndUpdate(
    id,
    {
      lastSync: new Date(),
    },
    {
      // new: true,
      returnDocument: "after",
    },
  );
};

// ======================================================
// Update Last Publish
// ======================================================

export const updateLastPublishService = async (id) => {
  return await SocialAccount.findByIdAndUpdate(
    id,
    {
      lastPublishAt: new Date(),
    },
    {
      // new: true,
      returnDocument: "after",
    },
  );
};

export const instagramLoginService = async (userId) => {
  const state = jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10m",
    },
  );

  const scope = [
    "public_profile",
    "pages_show_list",
    "pages_read_engagement",
    "pages_read_user_content",
    "instagram_basic",
    "instagram_manage_insights",
    "business_management",
  ].join(",");

  const url =
    `https://www.facebook.com/${process.env.META_API_VERSION}/dialog/oauth` +
    `?client_id=${process.env.FACEBOOK_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI)}` +
    `&scope=${scope}` +
    `&state=${state}` +
    `&response_type=code`;

  return url;
};

export const instagramCallbackService = async (code, state) => {
  const decoded = jwt.verify(state, process.env.JWT_SECRET);

  const userId = decoded.userId;

  // Short Token

  const shortToken = await getAccessTokenService(code);

  // Long Token

  const longToken = await getLongLivedTokenService(shortToken.access_token);

  let tokenExpiresAt = null;

  if (longToken.expires_in) {
    tokenExpiresAt = new Date(Date.now() + Number(longToken.expires_in) * 1000);
  }

  // Facebook Page

  const pages = await getFacebookPagesService(longToken.access_token);

  if (!pages.data.length) {
    throw new Error("No Facebook Page Found");
  }

  const page = pages.data[0];

  // Instagram Business

  const instagram = await getInstagramBusinessAccountService(
    page.id,
    page.access_token,
  );

  // Instagram Profile

  const igProfile = await syncInstagramProfileService(
    instagram.id,
    page.access_token,
  );

  // Facebook Profile

  const fbProfile = await getFacebookPageProfileService(
    page.id,
    page.access_token,
  );

  // Save Account

  const account = await saveOrUpdateAccountService(userId, "instagram", {
    socialId: instagram.id,

    username: igProfile.username,

    pageId: page.id,

    pageName: page.name,

    followers: igProfile.followers_count || 0,

    following: igProfile.follows_count || 0,

    posts: igProfile.media_count || 0,

    profilePicture:
      igProfile.profile_picture_url || fbProfile.picture?.data?.url || "",

    accessToken: page.access_token,

    userAccessToken: longToken.access_token,

    tokenExpiresAt,
  });

  // ==========================================
  // Save Facebook Account
  // ==========================================

  await saveOrUpdateAccountService(userId, "facebook", {
    socialId: page.id,

    pageId: page.id,

    pageName: page.name,

    username: page.name,

    followers: fbProfile.followers_count || 0,

    following: 0,

    posts: 0,

    profilePicture: fbProfile.picture?.data?.url || "",

    accessToken: page.access_token,

    userAccessToken: longToken.access_token,

    tokenExpiresAt,
  });

  await createNotificationService({
    user: userId,

    title: "Instagram Connected",

    message: "Instagram account connected successfully.",

    type: "success",
  });

  return account;
};

export const getDashboardAccountService = async (userId) => {
  const account = await getAccountByPlatformService(userId, "instagram");

  if (!account) {
    throw new Error("Instagram account not connected");
  }

  return account;
};

export const getDashboardDataService = async (userId) => {
  const account = await getDashboardAccountService(userId);

  // Run all APIs in parallel
  const [
    instagramProfile,
    instagramPosts,
    instagramInsights,
    facebookProfile,
    facebookPosts,
    followerHistory,
  ] = await Promise.all([
    getInstagramProfileService(account.socialId, account.accessToken),

    getInstagramPostsService(account.socialId, account.accessToken),

    getInstagramInsightsService(account.socialId, account.accessToken),

    getFacebookPageProfileService(account.pageId, account.accessToken),

    getFacebookPagePostsService(account.pageId, account.accessToken),

    getInstagramFollowerHistoryService(account.socialId, account.accessToken),
  ]);

  const recentPosts = buildRecentPosts(instagramPosts.data, facebookPosts.data);

  const topPost = buildTopPost(recentPosts);

  const reachMetric =
    instagramInsights.data.find((item) => item.name === "reach") || {};

  const viewsMetric =
    instagramInsights.data.find((item) => item.name === "views") || {};

  const profileViewsMetric =
    instagramInsights.data.find((item) => item.name === "profile_views") || {};

  const reach =
    reachMetric.total_value?.value ?? reachMetric.values?.[0]?.value ?? 0;

  const impressions =
    viewsMetric.total_value?.value ?? viewsMetric.values?.[0]?.value ?? 0;

  const profileViews =
    profileViewsMetric.total_value?.value ??
    profileViewsMetric.values?.[0]?.value ??
    0;

  return {
    userName: instagramProfile.username,

    stats: buildDashboardStats(instagramProfile, facebookProfile, reach),

    platforms: buildPlatformCards(
      instagramProfile,
      facebookProfile,
      facebookPosts,
    ),

    growthChart: buildGrowthChart(
      instagramProfile.followers_count,
      facebookProfile.followers_count,
      followerHistory,
    ),

    recentPosts,

    topPost,

    engagement: buildEngagement(recentPosts, instagramProfile, reach),

    audience: buildAudience(),

    insights: buildInsights(reach, impressions, profileViews),
  };
};

export const getGrowthChartService = async (userId) => {
  const account = await getDashboardAccountService(userId);

  const history = await getInstagramFollowerHistoryService(
    account.socialId,
    account.accessToken,
  );

  const facebookProfile = await getFacebookPageProfileService(
    account.pageId,
    account.accessToken,
  );

  const growth =
    history?.data?.[0]?.values?.map((item) => ({
      date: item.end_time.split("T")[0],

      instagram: item.value,

      facebook: facebookProfile.followers_count || 0,
    })) || [];

  return growth;
};

// ======================================================
// Schedule New Post
// ======================================================

export const schedulePostService = async (data) => {
  const schedule = await Schedule.create({
    caption: data.caption,
    platform: data.platform,
    image: data.image,
    date: data.date,
    time: data.time,
    status: "Scheduled",
  });

  return schedule;
};

// ======================================================
// Get Scheduled Posts
// ======================================================

export const getScheduledPostsService = async () => {
  return await Schedule.find().sort({
    createdAt: -1,
  });
};

// ======================================================
// Get Single Scheduled Post
// ======================================================

export const getScheduledPostByIdService = async (id) => {
  return await Schedule.findById(id);
};

// ======================================================
// Update Scheduled Post
// ======================================================

export const updateScheduledPostService = async (id, data) => {
  return await Schedule.findByIdAndUpdate(
    id,

    {
      ...data,
    },

    {
      // new: true,
      returnDocument: "after",
      runValidators: true,
    },
  );
};

// ======================================================
// Delete Scheduled Post
// ======================================================

export const deleteScheduledPostService = async (id) => {
  return await Schedule.findByIdAndDelete(id);
};

// ======================================================
// Publish One Post
// ======================================================

export const publishPostService = async (schedule) => {
  const account = await getAccountByPlatformService(
    schedule.user,
    schedule.platform.toLowerCase(),
  );

  if (!account) {
    throw new Error(`${schedule.platform} account not connected`);
  }

  await retry(() =>
    publishPlatformPostService(
      schedule.platform,
      schedule.platform === "Instagram" ? account.socialId : account.pageId,
      account.accessToken,
      schedule.image,
      schedule.caption,
    ),
  );

  return true;
};

// ======================================================
// Save Published Post
// ======================================================

export const syncPublishedPostService = async (schedule) => {
  const post = await Post.create({
    caption: schedule.caption,

    platform: schedule.platform,

    image: schedule.image,

    status: "Published",

    publishedAt: new Date(),
  });

  return post;
};

// ======================================================
// Publish Scheduled Post
// ======================================================

// export const publishScheduledPostService = async (scheduleId) => {

//   const schedule =
//     await getScheduledPostByIdService(
//       scheduleId
//     );

//   if (!schedule) {

//     throw new Error(
//       "Schedule not found"
//     );

//   }

//   if (
//     schedule.status === "Published"
//   ) {

//     return schedule;

//   }

//   await publishPostService(
//     schedule
//   );

//   await syncPublishedPostService(
//     schedule
//   );

//   schedule.status = "Published";

//   await schedule.save();

//   return schedule;

// };

// ======================================================
// Publish Scheduled Post
// ======================================================

export const publishScheduledPostService = async (scheduleId) => {
  const schedule = await getScheduledPostByIdService(scheduleId);

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  if (schedule.status === "Published") {
    return schedule;
  }

  // Publish to Social Platform
  await publishPostService(schedule);

  // Save in Posts Collection
  await syncPublishedPostService(schedule);

  // Update Schedule Status
  schedule.status = "Published";
  await schedule.save();

  // ======================================================
  // AUTO SYNC AFTER PUBLISH  <-- YAHI ADD KARNA HAI
  // ======================================================

  await autoSyncAfterPublishService(
    schedule.user,
    schedule.platform.toLowerCase(),
  );

  return schedule;
};

// ======================================================
// Publish Due Posts
// ======================================================

export const publishDuePostsService = async () => {
  const schedules = await Schedule.find({
    status: "Scheduled",
  });

  const now = new Date();

  for (const schedule of schedules) {
    const publishTime = new Date(`${schedule.date}T${schedule.time}:00`);

    if (publishTime <= now) {
      try {
        await publishScheduledPostService(schedule._id);
      } catch (err) {
        console.log("Publish Failed:", err.message);
      }
    }
  }
};

// ======================================================
// Get All Posts
// ======================================================

export const getPostsService = async (userId, query = {}) => {
  console.log("========== GET POSTS ==========");
  console.log("User:", userId);
  console.log("Query:", query);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.platform && query.platform !== "All") {
    filter.platform = query.platform;
  }

  if (query.status && query.status !== "All") {
    filter.status = query.status;
  }

  if (query.search) {
    filter.caption = {
      $regex: query.search,
      $options: "i",
    };
  }

  console.log("Mongo Filter:", filter);

  const total = await Post.countDocuments(filter);

  const posts = await Post.find(filter)
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit);

  console.log("Total Posts:", posts.length);
  console.log(posts);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// ======================================================
// Get Single Post
// ======================================================

export const getPostByIdService = async (id) => {
  return await Post.findById(id);
};

// ======================================================
// Delete Post
// ======================================================

export const deletePostService = async (id) => {
  return await Post.findByIdAndDelete(id);
};

// ======================================================
// Sync Instagram Posts
// ======================================================

export const syncPostsFromInstagramService = async (userId) => {
  const account = await getAccountByPlatformService(userId, "instagram");

  if (!account) {
    throw new Error("Instagram account not connected");
  }

  const response = await getInstagramPostsService(
    account.socialId,

    account.accessToken,
  );

  for (const item of response.data) {
    await Post.findOneAndUpdate(
      {
        socialPostId: item.id,
      },

      {
        socialPostId: item.id,

        caption: item.caption || "",

        image: item.media_url || item.thumbnail_url || "",

        platform: "Instagram",

        status: "Published",

        publishedAt: item.timestamp,
      },

      {
        upsert: true,

        // new: true,
        returnDocument: "after",
      },
    );
  }

  return true;
};

// ======================================================
// Sync Facebook Posts
// ======================================================

export const syncPostsFromFacebookService = async (userId) => {
  const account = await getAccountByPlatformService(userId, "facebook");

  if (!account) {
    throw new Error("Facebook account not connected");
  }

  const response = await getFacebookPagePostsService(
    account.pageId,

    account.accessToken,
  );

  for (const item of response.data) {
    await Post.findOneAndUpdate(
      {
        socialPostId: item.id,
      },

      {
        socialPostId: item.id,

        caption: item.message || "",

        image: item.full_picture || "",

        platform: "Facebook",

        status: "Published",

        publishedAt: item.created_time,
      },

      {
        upsert: true,

        // new: true,
        returnDocument: "after",
      },
    );
  }

  return true;
};

// ======================================================
// Sync All Posts
// ======================================================

export const syncAllPostsService = async (userId) => {
  try {
    await syncPostsFromInstagramService(userId);
  } catch (err) {
    logger.error(`Instagram Sync: ${err.message}`);
  }

  try {
    await syncPostsFromFacebookService(userId);
  } catch (err) {
    console.log("Facebook Sync:", err.message);
  }

  return true;
};

// ======================================================
// Post Statistics
// ======================================================

export const getPostStatsService = async () => {
  const total = await Post.countDocuments();

  const published = await Post.countDocuments({
    status: "Published",
  });

  const scheduled = await Schedule.countDocuments({
    status: "Scheduled",
  });

  return {
    total,

    published,

    scheduled,
  };
};

// ======================================================
// Calculate Engagement
// ======================================================

export const calculateEngagementService = (posts = [], followers = 0) => {
  if (!posts.length || followers === 0) {
    return 0;
  }

  const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);

  const totalComments = posts.reduce((sum, p) => sum + (p.comments || 0), 0);

  const engagement = ((totalLikes + totalComments) / followers) * 100;

  return Number(engagement.toFixed(2));
};

// ======================================================
// Reach
// ======================================================

export const getReachService = async (instagramInsights) => {
  const metric = instagramInsights.data.find((item) => item.name === "reach");

  return metric?.total_value?.value || metric?.values?.[0]?.value || 0;
};

// ======================================================
// Impressions
// ======================================================

export const getImpressionsService = async (instagramInsights) => {
  const metric = instagramInsights.data.find((item) => item.name === "views");

  return metric?.total_value?.value || metric?.values?.[0]?.value || 0;
};

// ======================================================
// Followers Growth
// ======================================================

export const getFollowerGrowthService = async (userId) => {
  const account = await getDashboardAccountService(userId);

  const history = await getInstagramFollowerHistoryService(
    account.socialId,
    account.accessToken,
  );

  return history.data?.[0]?.values || [];
};

// ======================================================
// Analytics Chart
// ======================================================

export const buildAnalyticsChartService = async (userId) => {
  const growth = await getFollowerGrowthService(userId);

  return growth.map((item) => ({
    date: item.end_time.split("T")[0],

    followers: item.value,
  }));
};

// ======================================================
// Analytics Summary
// ======================================================

export const buildAnalyticsSummaryService = async (
  instagramProfile,

  instagramInsights,

  posts,
) => {
  const reach = await getReachService(instagramInsights);

  const impressions = await getImpressionsService(instagramInsights);

  const engagement = calculateEngagementService(
    posts,

    instagramProfile.followers_count,
  );

  return {
    followers: instagramProfile.followers_count,

    following: instagramProfile.follows_count,

    posts: instagramProfile.media_count,

    reach,

    impressions,

    engagement,
  };
};

// ======================================================
// Analytics Main Service
// ======================================================

// export const getAnalyticsService = async (userId) => {
//   const account = await getDashboardAccountService(userId);

//   const instagramProfile = await getInstagramProfileService(
//     account.socialId,
//     account.accessToken,
//   );

//   const instagramPosts = await getInstagramPostsService(
//     account.socialId,
//     account.accessToken,
//   );

//   const instagramInsights = await getInstagramInsightsService(
//     account.socialId,
//     account.accessToken,
//   );

//   const reach = await getReachService(instagramInsights);

//   const totalLikes = instagramPosts.data.reduce(
//     (sum, post) => sum + (post.like_count || 0),
//     0,
//   );

//   const totalComments = instagramPosts.data.reduce(
//     (sum, post) => sum + (post.comments_count || 0),
//     0,
//   );

//   const chart = await buildAnalyticsChartService(userId);

//   return {
//     totalPosts: instagramPosts.data.length,

//     totalLikes,

//     totalComments,

//     totalReach: reach,

//     chart,

//     topPosts: instagramPosts.data
//       .sort(
//         (a, b) =>
//           (b.like_count || 0) +
//           (b.comments_count || 0) -
//           ((a.like_count || 0) + (a.comments_count || 0)),
//       )
//       .slice(0, 5),

//     platformStats: [
//       {
//         _id: "Instagram",
//         total: instagramPosts.data.length,
//       },
//     ],
//   };
// };

export const getAnalyticsService = async (userId) => {
  const account = await getDashboardAccountService(userId);

  // Instagram APIs
  const instagramProfile = await getInstagramProfileService(
    account.socialId,
    account.accessToken,
  );

  const instagramPosts = await getInstagramPostsService(
    account.socialId,
    account.accessToken,
  );

  const instagramInsights = await getInstagramInsightsService(
    account.socialId,
    account.accessToken,
  );

  const posts = instagramPosts.data || [];
  // Facebook Posts
  const facebookPosts = await getFacebookPagePostsService(
    account.pageId,
    account.accessToken,
  );

  const fbPosts = facebookPosts.data || [];
  // Reach
  const reachMetric =
    instagramInsights.data.find((item) => item.name === "reach") || {};

  const totalReach =
    reachMetric.total_value?.value || reachMetric.values?.[0]?.value || 0;

  // Likes
  const instagramLikes = posts.reduce(
    (sum, post) => sum + (post.like_count || 0),
    0,
  );

  const facebookLikes = fbPosts.reduce(
    (sum, post) => sum + (post.likes?.summary?.total_count || 0),
    0,
  );

  const totalLikes = instagramLikes + facebookLikes;

  // Comments
  const instagramComments = posts.reduce(
    (sum, post) => sum + (post.comments_count || 0),
    0,
  );

  const facebookComments = fbPosts.reduce(
    (sum, post) => sum + (post.comments?.summary?.total_count || 0),
    0,
  );

  const totalComments = instagramComments + facebookComments;

  // Chart
  const followerHistory = await getInstagramFollowerHistoryService(
    account.socialId,
    account.accessToken,
  );

  const chartData =
    followerHistory?.data?.[0]?.values?.map((item) => ({
      date: item.end_time.split("T")[0],
      followers: item.value,
    })) || [];

  // Platform Pie Chart
  const platformStats = [
    {
      _id: "Instagram",
      total: posts.length,
    },
    {
      _id: "Facebook",
      total: fbPosts.length,
    },
  ];

  // Top Posts
  const topPosts = [
    ...posts.map((post) => ({
      id: post.id,
      caption: post.caption || "",
      image: post.media_url || post.thumbnail_url || "",
      likes: post.like_count || 0,
      comments: post.comments_count || 0,
      reach: totalReach,
      platform: "Instagram",
      publishedAt: post.timestamp,
      engagement: (post.like_count || 0) + (post.comments_count || 0),
    })),

    ...fbPosts.map((post) => ({
      id: post.id,
      caption: post.message || "",
      image: post.full_picture || "",
      likes: post.likes?.summary?.total_count || 0,
      comments: post.comments?.summary?.total_count || 0,
      reach: 0,
      platform: "Facebook",
      publishedAt: post.created_time,
      engagement:
        (post.likes?.summary?.total_count || 0) +
        (post.comments?.summary?.total_count || 0),
    })),
  ]
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 10);

  return {
    totalPosts: posts.length + fbPosts.length,

    totalLikes,

    totalComments,

    totalReach,

    platformStats,

    topPosts,

    chartData,
  };
};

// ======================================================
// Analytics Cache Placeholder
// ======================================================

export const getCachedAnalyticsService = async (userId) => {
  // Redis Cache Future

  return await getAnalyticsService(userId);
};

// ======================================================
// Auto Sync Account
// ======================================================

export const autoSyncAccountService = async (userId, platform) => {
  if (platform === "instagram") {
    await syncPostsFromInstagramService(userId);
  }

  if (platform === "facebook") {
    await syncPostsFromFacebookService(userId);
  }

  return true;
};

// ======================================================
// Refresh Dashboard
// ======================================================

export const refreshDashboardService = async (userId) => {
  return await getDashboardDataService(userId);
};

// ======================================================
// Refresh Analytics
// ======================================================

export const refreshAnalyticsService = async (userId) => {
  return await getAnalyticsService(userId);
};

// ======================================================
// Notification
// ======================================================

export const notifyService = async (
  user,

  title,

  message,

  type = "info",
) => {
  return await createNotificationService({
    user,

    title,

    message,

    type,
  });
};

// ======================================================
// Check Token
// ======================================================

export const checkTokenService = async (userId, platform) => {
  const account = await getAccountByPlatformService(userId, platform);

  if (!account) {
    throw new Error("Account not connected");
  }

  if (isTokenExpiredService(account.tokenExpiresAt)) {
    await notifyService(
      userId,

      "Reconnect Required",

      `${platform} token expired.`,

      "warning",
    );

    return {
      expired: true,
    };
  }

  return {
    expired: false,
  };
};

// ======================================================
// Auto Sync After Publish
// ======================================================

export const autoSyncAfterPublishService = async (
  userId,

  platform,
) => {
  await autoSyncAccountService(
    userId,

    platform,
  );

  await refreshDashboardService(userId);

  await refreshAnalyticsService(userId);

  await notifyService(
    userId,

    "Post Published",

    `${platform} post published successfully.`,

    "success",
  );

  return true;
};

// ======================================================
// Background Sync
// ======================================================

export const backgroundSyncService = async () => {
  const accounts = await SocialAccount.find({
    isActive: true,
  });

  for (const account of accounts) {
    try {
      if (account.platform === "instagram") {
        await syncPostsFromInstagramService(account.user);
      }

      if (account.platform === "facebook") {
        await syncPostsFromFacebookService(account.user);
      }
    } catch (err) {
      console.log(
        account.platform,

        err.message,
      );
    }
  }

  logger.info("Background Sync Completed");
};

export const getInstagramProfileControllerService = async (userId) => {
  const account = await getAccountByPlatformService(userId, "instagram");

  if (!account) {
    throw new Error("Instagram account not connected");
  }

  return await getInstagramProfileService(
    account.socialId,
    account.accessToken,
  );
};

export const getInstagramPostsControllerService = async (userId) => {
  const account = await getAccountByPlatformService(userId, "instagram");

  if (!account) {
    throw new Error("Instagram account not connected");
  }

  return await getInstagramPostsService(account.socialId, account.accessToken);
};

export const getInstagramInsightsControllerService = async (userId) => {
  const account = await getAccountByPlatformService(userId, "instagram");

  if (!account) {
    throw new Error("Instagram account not connected");
  }

  return await getInstagramInsightsService(
    account.socialId,
    account.accessToken,
  );
};

export const getFacebookProfileDataService = async (userId) => {
  const account = await SocialAccount.findOne({
    user: userId,
    platform: "facebook",
    isActive: true,
  });

  if (!account) {
    throw new Error("Facebook account not connected.");
  }

  return await getFacebookPageProfileService(
    account.pageId,
    account.accessToken,
  );
};

export const getFacebookPostsDataService = async (userId) => {
  const account = await SocialAccount.findOne({
    user: userId,
    platform: "facebook",
    isActive: true,
  });

  if (!account) {
    throw new Error("Facebook account not connected.");
  }

  return await getFacebookPagePostsService(account.pageId, account.accessToken);
};

export const updateAccountService = async (userId, accountId, data) => {
  const account = await SocialAccount.findOne({
    _id: accountId,
    user: userId,
  });

  if (!account) {
    throw new Error("Account not found");
  }

  account.username = data.username || account.username;
  account.pageName = data.pageName || account.pageName;
  account.profilePicture = data.profilePicture || account.profilePicture;

  await account.save();

  return account;
};

export const syncAccountService = async (userId, platform) => {
  const account = await SocialAccount.findOne({
    user: userId,
    platform,
    isActive: true,
  });

  if (!account) {
    throw new Error("Account not found");
  }

  let profile = {};

  if (platform === "instagram") {
    profile = await syncInstagramProfileService(
      account.socialId,
      account.accessToken,
    );
  }

  if (platform === "facebook") {
    profile = await syncFacebookProfileService(
      account.pageId,
      account.accessToken,
    );
  }

  account.username = profile.username || profile.name || account.username;

  account.profilePicture =
    profile.profile_picture_url ||
    profile.picture?.data?.url ||
    account.profilePicture;

  account.followers = profile.followers_count ?? account.followers;

  account.following = profile.follows_count ?? account.following;

  account.posts = profile.media_count ?? account.posts;

  account.updatedAt = new Date();

  await account.save();

  return account;
};

import axios from "axios";

export const getRecentPostsService = async (platform) => {
  if (platform === "instagram") {
    const response = await axios.get(
      `https://graph.facebook.com/v23.0/me/media`,
      {
        params: {
          fields:
            "id,caption,media_url,thumbnail_url,like_count,comments_count,timestamp",
          access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
        },
      },
    );

    return response.data.data;
  }

  return [];
};

export const reconnectAccountService = async (platform) => {
  if (platform !== "instagram" && platform !== "facebook") {
    throw new Error("Invalid platform");
  }

  const state = jwt.sign(
    {
      reconnect: true,
      platform,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10m",
    },
  );

  const scope = [
    "public_profile",
    "pages_show_list",
    "pages_read_engagement",
    "pages_read_user_content",
    "instagram_basic",
    "instagram_manage_insights",
    "business_management",
  ].join(",");

  return (
    `https://www.facebook.com/${process.env.META_API_VERSION}/dialog/oauth` +
    `?client_id=${process.env.FACEBOOK_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI)}` +
    `&scope=${scope}` +
    `&state=${state}` +
    `&response_type=code`
  );
};
