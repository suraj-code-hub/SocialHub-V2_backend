import cron from "node-cron";

import {
  backgroundSyncService,
} from "../services/socialService.js";

cron.schedule(
  "*/30 * * * *",

  async () => {

    await backgroundSyncService();

  }
);