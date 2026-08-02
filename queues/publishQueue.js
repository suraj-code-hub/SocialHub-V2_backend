import { publishQueue } from "../config/bullmq.js";

export const addPublishJob = async (
  scheduleId
) => {

  await publishQueue.add(
    "publish",

    {
      scheduleId,
    }
  );

};