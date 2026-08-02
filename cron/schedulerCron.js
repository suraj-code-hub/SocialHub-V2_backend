// import cron from "node-cron";
// import { publishScheduledPostsService } from "../services/schedulerService.js";

// const startScheduler = () => {
//   cron.schedule("* * * * *", async () => {
//     console.log("Scheduler Running...");

//     await publishScheduledPostsService();
//   });
// };

// export default startScheduler;

import cron from "node-cron";
import { processScheduledPosts } from "../services/schedulerService.js";

export default function startScheduler() {
  console.log("Scheduler Started");

  cron.schedule("* * * * *", async () => {
    console.log("Checking scheduled posts...");
    await processScheduledPosts();
  });
}