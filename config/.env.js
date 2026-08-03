import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
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