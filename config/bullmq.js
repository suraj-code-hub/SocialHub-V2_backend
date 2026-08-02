import { Queue } from "bullmq";

export const publishQueue = new Queue(
  "publish"
);