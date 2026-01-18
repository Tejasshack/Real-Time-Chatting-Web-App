import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const startSendOtpConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.Rabbitmq_Host,
      username: process.env.Rabbitmq_Username,
      password: process.env.Rabbitmq_Password,
    });
    const channel = await connection.createChannel();
    const queueName = "send-otp";

    await channel.assertQueue(queueName, { durable: true });

    console.log("Mail Service Consumer Started, Litening for otp emails ✅☑️");

    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const { to, subject, body } = JSON.parse(msg.content.toString());
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: { user: process.env.USER, pass: process.env.PASSWORD },
          });

          await transporter.sendMail({
            from: "Chat App",
            to,
            subject,
            html: body,
          });
          console.log(`OTP MAIL SENT TO ${to}`);

          channel.ack(msg);
        } catch (error) {
          console.log("Failed to Send OTP");
        }
      }
    });
  } catch (error) {
    console.log("Failed to start RabbitMQ Consumer");
  }
};
