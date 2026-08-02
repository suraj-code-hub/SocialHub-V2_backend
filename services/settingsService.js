import Settings from "../models/Settings.js";

// Get Settings
export const getSettingsService = async (userId) => {
  let settings = await Settings.findOne({
    user: userId,
  });

  // Agar user ki settings nahi hai to default create kar do
  if (!settings) {
    settings = await Settings.create({
      user: userId,
    });
  }

  return settings;
};

// Update All Settings
export const updateSettingsService = async (
  userId,
  data
) => {
  return await Settings.findOneAndUpdate(
    { user: userId },
    data,
    {
      // new: true,
       returnDocument: "after",
      upsert: true,
    }
  );
};

// Update Theme
export const updateThemeService = async (
  userId,
  theme
) => {
  return await Settings.findOneAndUpdate(
    { user: userId },
    { theme },
    {
      // new: true,
       returnDocument: "after",
      upsert: true,
    }
  );
};

// Update Notification Settings
export const updateNotificationSettingsService = async (
  userId,
  data
) => {
  return await Settings.findOneAndUpdate(
    { user: userId },
    {
      emailNotifications: data.emailNotifications,
      pushNotifications: data.pushNotifications,
      marketingEmails: data.marketingEmails,
    },
    {
      // new: true,
       returnDocument: "after",
      upsert: true,
    }
  );
};