import {
  getSettingsService,
  updateSettingsService,
  updateThemeService,
  updateNotificationSettingsService,
} from "../services/settingsService.js";

// Get Settings
export const getSettings = async (req, res) => {
  try {
    const settings = await getSettingsService(req.user.id);

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update All Settings
export const updateSettings = async (req, res) => {
  try {
    const settings = await updateSettingsService(
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Theme
export const updateTheme = async (req, res) => {
  try {
    const settings = await updateThemeService(
      req.user.id,
      req.body.theme
    );

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Notification Settings
export const updateNotificationSettings = async (
  req,
  res
) => {
  try {
    const settings =
      await updateNotificationSettingsService(
        req.user.id,
        req.body
      );

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};