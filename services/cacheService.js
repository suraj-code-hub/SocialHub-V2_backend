import { redis } from "../config/redis.js";

export const getCache = async (key) => {
  const value = await redis.get(key);

  if (!value) return null;

  return JSON.parse(value);
};

export const setCache = async (
  key,
  value,
  ttl = 300
) => {
  await redis.setEx(
    key,
    ttl,
    JSON.stringify(value)
  );
};

export const deleteCache = async (key) => {
  await redis.del(key);
};