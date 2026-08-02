import { Worker } from "bullmq";

import {
  publishScheduledPostService,
} from "../services/socialService.js";

new Worker(
  "publish",

  async job => {

    await publishScheduledPostService(

      job.data.scheduleId

    );

  }
);