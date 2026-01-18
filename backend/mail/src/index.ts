import express from "express";
import dotenv from "dotenv";
import { startSendOtpConsumer } from "./consumer.js";

dotenv.config();

startSendOtpConsumer();

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is Running on PORT ${process.env.PORT}`);
});
