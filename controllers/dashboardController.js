import { getDashboardService } from "../services/dashboardService.js";

export const getDashboardData = async (req, res) => {
  try {
    const dashboard = await getDashboardService();

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};