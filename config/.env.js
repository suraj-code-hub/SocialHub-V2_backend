# import dotenv from "dotenv";

# dotenv.config();

# const requiredEnv = [
#   "PORT",
#   "MONGO_URI",
#   "REDIS_URL",
#   "JWT_SECRET",
#   "CLOUDINARY_CLOUD_NAME",
#   "CLOUDINARY_API_KEY",
#   "CLOUDINARY_API_SECRET",
#   "FB_PAGE_ID",
#   "FB_PAGE_ACCESS_TOKEN",
#   "IG_USER_ID",
#   "IG_ACCESS_TOKEN",
# ];

# const missing = requiredEnv.filter(
#   (key) => !process.env[key]
# );

# if (missing.length > 0) {
#   console.error("❌ Missing Environment Variables:");
#   missing.forEach((key) => console.error(`- ${key}`));
#   process.exit(1);
# }

# console.log("✅ Environment Variables Loaded");

import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "PORT",
  "MONGO_URI",
  "REDIS_URL",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "FB_PAGE_ID",
  "FB_PAGE_ACCESS_TOKEN",
  "IG_USER_ID",
  "IG_ACCESS_TOKEN",
];

const missing = requiredEnv.filter(
  (key) => !process.env[key]
);

if (missing.length > 0) {
  console.error("❌ Missing Environment Variables:");
  missing.forEach((key) => console.error(`- ${key}`));
  process.exit(1);
}

console.log("✅ Environment Variables Loaded");