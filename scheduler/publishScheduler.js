// import cron from "node-cron";
// import Schedule from "../models/Schedule.js";
// import { publishPost } from "../services/publishService.js";

// export const startScheduler = () => {
//   cron.schedule("* * * * *", async () => {
//     console.log("Checking scheduled posts...");

//     const posts = await Schedule.find({
//       status: "Scheduled",
//     });

//     console.log("Scheduled Posts:", posts.length);

//     const now = new Date();

//     for (const post of posts) {
//       const scheduleTime = new Date(
//         `${post.date}T${post.time}:00`
//       );

//       if (scheduleTime <= now) {
//         await publishPost(post);
//       }
//     }
//   });

//   console.log("Scheduler Started");
// };

import cron from "node-cron";
import {

  publishDuePostsService,

  backgroundSyncService,

} from "../services/socialService.js";


export const startScheduler = () => {

  cron.schedule("* * * * *", async () => {

    console.log(
      "Checking Scheduled Posts..."
    );

    await publishDuePostsService();
    await backgroundSyncService();
  });

  console.log(
    "Scheduler Started"
  );

};