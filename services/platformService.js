import * as instagram from "./adapters/instagramAdapter.js";
import * as facebook from "./adapters/facebookAdapter.js";
import * as linkedin from "./adapters/linkedinAdapter.js";
import * as twitter from "./adapters/twitterAdapter.js";
import * as youtube from "./adapters/youtubeAdapter.js";

const PLATFORMS = {
  instagram,
  facebook,
  linkedin,
  twitter,
  youtube,
};

// =============================
// Get Adapter
// =============================
export const getPlatformService = (platform) => {
  const adapter = PLATFORMS[platform.toLowerCase()];

  if (!adapter) {
    throw new Error(`Unsupported Platform : ${platform}`);
  }

  return adapter;
};

// =============================
// Publish Post
// =============================
export const publishPlatformPostService = async (
  platform,
  socialId,
  accessToken,
  image,
  caption
) => {
  const adapter = getPlatformService(platform);

  if (!adapter.publish) {
    throw new Error(`${platform} publish not implemented`);
  }

  console.log("==================================");
  console.log("Publishing To :", platform);
  console.log("Social ID :", socialId);
  console.log("==================================");

  return await adapter.publish(
    socialId,
    accessToken,
    image,
    caption
  );
};

// =============================
// Sync Posts
// =============================
export const syncPlatformPostsService = async (
  platform,
  socialId,
  accessToken
) => {
  const adapter = getPlatformService(platform);

  if (!adapter.syncPosts) {
    throw new Error(`${platform} sync not implemented`);
  }

  return await adapter.syncPosts(
    socialId,
    accessToken
  );
};

// =============================
// Sync Profile
// =============================
export const syncPlatformProfileService = async (
  platform,
  socialId,
  accessToken
) => {
  const adapter = getPlatformService(platform);

  if (!adapter.syncProfile) {
    throw new Error(`${platform} profile sync not implemented`);
  }

  return await adapter.syncProfile(
    socialId,
    accessToken
  );
};

export const getSupportedPlatformsService = () =>
  Object.keys(PLATFORMS);

export const getPlatformStatusService = () =>
  Object.entries(PLATFORMS).map(
    ([name, adapter]) => ({
      platform: name,
      publish: !!adapter.publish,
      syncPosts: !!adapter.syncPosts,
      syncProfile: !!adapter.syncProfile,
    })
  );