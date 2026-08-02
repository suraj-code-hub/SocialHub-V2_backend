import Schedule from "../models/Schedule.js";
import Post from "../models/Post.js";
import SocialAccount from "../models/SocialAccount.js";

import { publishPlatformPostService } from "./platformService.js";

export const publishScheduledPostsService = async () => {
  try {
    console.log("Checking scheduled posts...");

    const now = new Date();

    const schedules = await Schedule.find({
      status: "Scheduled",
      publishAt: { $lte: now },
    });

    if (!schedules.length) {
      console.log("No scheduled posts.");
      return;
    }

    for (const item of schedules) {
      try {
        const account = await SocialAccount.findOne({
          platform: item.platform.toLowerCase(),
          isActive: true,
        });

        if (!account) {
          console.log("Account not connected:", item.platform);
          continue;
        }

        const result = await publishPlatformPostService(
          item.platform,
          item.platform === "Instagram"
            ? account.socialId
            : account.pageId,
          account.accessToken,
          item.image,
          item.caption
        );

        await Post.create({
          caption: item.caption,
          image: item.image,
          platform: item.platform,
          status: "Published",
          publishedAt: new Date(),
          socialPostId: result.id,
        });

        item.status = "Published";
        item.socialPostId = result.id;
        item.publishedAt = new Date();

        await item.save();

        console.log(item.platform, "Published Successfully");
      } catch (err) {
        console.log("Publish Failed:", err.message);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const processScheduledPosts = async () => {
  try {
    const now = new Date();

    const schedules = await Schedule.find({
      status: "Scheduled",
      publishAt: { $lte: now },
    });

    if (!schedules.length) {
      return;
    }

    console.log(`Found ${schedules.length} scheduled post(s)`);

    for (const item of schedules) {
      try {
        // Connected Account
        const account = await SocialAccount.findOne({
          user: item.user,
          platform: item.platform.toLowerCase(),
          isActive: true,
        });

        if (!account) {
          console.log(`${item.platform} account not connected`);

          item.status = "Failed";
          await item.save();
          continue;
        }

        // Publish
        const result = await publishPlatformPostService(
          item.platform,
          item.platform === "Instagram"
            ? account.socialId
            : account.pageId,
          account.accessToken,
          item.image,
          item.caption
        );

        // Update Schedule
        item.status = "Published";
        item.socialPostId = result.id || "";
        item.publishedAt = new Date();

        await item.save();

        // Save in Posts collection
        await Post.create({
          createdBy: item.user,
          caption: item.caption,
          platform: item.platform,
          image: item.image,

          status: "Published",

          publishedAt: new Date(),

          socialPostId: result.id || "",
        });

        console.log(
          `${item.platform} Scheduled Post Published Successfully`
        );
      } catch (err) {
        console.log(
          "Scheduler Publish Error:",
          err.response?.data || err.message
        );

        item.status = "Failed";
        await item.save();
      }
    }
  } catch (err) {
    console.log("Scheduler Error:", err.message);
  }
};