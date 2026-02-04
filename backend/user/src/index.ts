import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { createClient } from "redis";
import userRoutes from "./routes/user.routes.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import cors from "cors";
dotenv.config();

connectDB();

connectRabbitMQ();

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL not defined");
}

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected To REDIS");
  })
  .catch(console.error);

const app = express();
app.use(express.json());
app.use(cors());

// app.use((req, _res, next) => {
//   console.log("HEADERS:", req.headers["content-type"]);
//   console.log("BODY:", req.body);
//   next();
// });

app.use("/api/v1", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`User service is running on port ${PORT}`);
});
