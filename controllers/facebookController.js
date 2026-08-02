import {
  getFacebookPageProfileService,
  getFacebookPagePostsService,
  publishFacebookPostService,
  getFacebookAnalyticsService,
} from "../services/facebookService.js";

// =========================================
// Get Facebook Page Profile
// =========================================
export const getFacebookProfile = async (req, res) => {
  try {
    const { pageId, accessToken } = req.query;

    if (!pageId || !accessToken) {
      return res.status(400).json({
        success: false,
        message: "pageId and accessToken are required",
      });
    }

    const profile = await getFacebookPageProfileService(
      pageId,
      accessToken
    );

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.log(
      "Facebook Profile Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch Facebook profile",
      error: error.response?.data || error.message,
    });
  }
};

// =========================================
// Get Facebook Posts
// =========================================
export const getFacebookPosts = async (req, res) => {
  try {
    const { pageId, accessToken } = req.query;

    if (!pageId || !accessToken) {
      return res.status(400).json({
        success: false,
        message: "pageId and accessToken are required",
      });
    }

    const posts = await getFacebookPagePostsService(
      pageId,
      accessToken
    );

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(
      "Facebook Posts Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch Facebook posts",
      error: error.response?.data || error.message,
    });
  }
};

// =========================================
// Publish Facebook Post
// =========================================
export const publishFacebookPost = async (req, res) => {
  try {
    const {
      pageId,
      accessToken,
      imageUrl,
      caption,
    } = req.body;

    if (!pageId || !accessToken || !imageUrl) {
      return res.status(400).json({
        success: false,
        message:
          "pageId, accessToken and imageUrl are required",
      });
    }

    const post = await publishFacebookPostService(
      pageId,
      accessToken,
      imageUrl,
      caption
    );

    res.status(200).json({
      success: true,
      message: "Facebook post published successfully",
      post,
    });
  } catch (error) {
    console.log(
      "Facebook Publish Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to publish Facebook post",
      error: error.response?.data || error.message,
    });
  }
};

// =========================================
// Facebook Analytics
// =========================================
export const getFacebookAnalytics = async (req, res) => {
  try {
    const { pageId, accessToken } = req.query;

    if (!pageId || !accessToken) {
      return res.status(400).json({
        success: false,
        message: "pageId and accessToken are required",
      });
    }

    const analytics = await getFacebookAnalyticsService(
      pageId,
      accessToken
    );

    res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.log(
      "Facebook Analytics Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch Facebook analytics",
      error: error.response?.data || error.message,
    });
  }
};