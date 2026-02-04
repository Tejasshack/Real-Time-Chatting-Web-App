import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// import { startSendOtpConsumer } from "./consumer.js";
import chatRoutes from "./routes/chat.routes.js";
import bodyParser from "body-parser";
dotenv.config();

connectDB();

const app = express();

// Add middleware FIRST, before routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Then register routes
app.use("/api/v1", chatRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is Running on PORT ${process.env.PORT}`);
});
