import ampq from "amqplib";

let channel: ampq.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await ampq.connect({
      protocol: "amqp",
      hostname: process.env.Rabbitmq_Host,
      username: process.env.Rabbitmq_Username,
      password: process.env.Rabbitmq_Password,
    });

    channel = await connection.createChannel();

    console.log("Connected to RabbitMQ ✅☑️");
  } catch (error) {
    console.log("Failed to Connect to RabbitMQ", error);
  }
};

export const publishToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.log("RabbitMQ Channel is not initialized");
    return;
  }

  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  })
};
