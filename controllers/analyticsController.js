import { getAnalyticsService } from "../services/socialService.js";

export const getAnalytics = async (req, res) => {
  try {
    console.log("Analytics API Called");
    console.log("User ID:", req.user._id);

    const analytics = await getAnalyticsService(req.user._id);

    console.log("Analytics:", analytics);

    res.json({
      success: true,
      analytics,
    });
  } catch (err) {
    console.error("Analytics Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
};
