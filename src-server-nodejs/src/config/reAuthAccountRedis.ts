import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";

dotenv.config();

// Create Redis client
const reAuthAccountRedis: RedisClientType = createClient({
  // url: `redis://${process.env.RD_SERVER}:${process.env.RD_PORT}`,
  socket: {
    port: Number(process.env.RD_PORT) || 6379,
    host: process.env.RD_SERVER || '127.0.0.1',
    connectTimeout: 10000,
  }
});

// Connect Redis
reAuthAccountRedis.connect().catch(console.error);

reAuthAccountRedis.on("connect", () => {
  console.log("Connected reAuthAccountRedis to Redis successfully!");
});

export default reAuthAccountRedis;