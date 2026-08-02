// import Post from "../models/Post.js";
// import Schedule from "../models/Schedule.js";

// import { publishInstagramPostService } from "./instagramService.js";

// export const publishPost = async (schedule) => {
//   try {
//     console.log("Publishing:", schedule.caption);

//     // ===========================
//     // Instagram Publish
//     // ===========================

//     if (schedule.platform === "Instagram") {
//   console.log(schedule);
//   console.log("Image:", schedule.image);

//   if (!schedule.image) {
//     console.log("No image found. Skipping publish.");

//     await Schedule.findByIdAndUpdate(schedule._id, {
//       status: "Failed",
//     });

//     return;
//   }

//   await publishInstagramPostService(
//     schedule.image,
//     schedule.caption
//   );
// }

//     // ===========================
//     // Save in Post Collection
//     // ===========================

//     await Post.create({
//       caption: schedule.caption,
//       platform: schedule.platform,
//       image: schedule.image,
//       status: "Published",
//       publishedAt: new Date(),
//     });

//     // ===========================
//     // Update Schedule Status
//     // ===========================

//     await Schedule.findByIdAndUpdate(schedule._id, {
//       status: "Published",
//     });

//     console.log("Published Successfully");
//   } catch (error) {
//     console.log("Publish Error:", error.response?.data || error.message);
//   }
// };


import {
  publishScheduledPostService,
} from "./socialService.js";

export const publishPost = async (
  schedule
) => {

  return await publishScheduledPostService(
    schedule._id
  );

};