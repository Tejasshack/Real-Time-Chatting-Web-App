import axios from "axios";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../config/TryCatch.js";
import { Chat } from "../models/Chat.js";
import { Message } from "../models/Messages.js";

export const createNewChat = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      res.status(400).json({
        message: "Other UserId is Required",
      });
      return;
    }
    const existingChat = await Chat.findOne({
      users: { $all: [userId, otherUserId], $size: 2 },
    });

    if (existingChat) {
      res.json({
        message: "Chat Already Exists",
        chat: existingChat,
      });
      return;
    }

    const newChat = await Chat.create({
      users: [userId as string, otherUserId],
    });

    res.status(201).json({
      message: "New Chat Created",
      chatId: newChat._id,
    });
  },
);

export const getAllChats = TryCatch(async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id?.toString();

  if (!userId) {
    return res.status(400).json({
      message: "User ID is Required",
    });
  }

  const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });

  const chatWithUserData = await Promise.all(
    chats.map(async (chat) => {
      const otherUserId = chat.users.find((id: string) => id !== userId);

      const unseenCount = await Message.countDocuments({
        chatId: chat._id,
        seen: false,
        sender: { $ne: userId },
      });

      if (!otherUserId) {
        return {
          user: { id: null, name: "Unknown User" },
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unseenMessages: unseenCount,
          },
        };
      }

      try {
        const { data } = await axios.get(
          `${process.env.USER_SERVICE_URL}/api/v1/users/${otherUserId}`,
        );

        return {
          user: data,
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unseenMessages: unseenCount,
          },
        };
      } catch {
        return {
          user: { id: otherUserId, name: "Unknown User" },
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unseenMessages: unseenCount,
          },
        };
      }
    }),
  );

  res.json({ chats: chatWithUserData });
});

export const sendMessage = TryCatch(async (req: AuthenticatedRequest, res) => {
  const senderId = req.user?.id;
  const chatId = req.body?.chatId;
  const text = req.body?.text;
  console.log(req.body);
  console.log("BODY:", req.body);
  console.log("chatId:", req.body.chatId);
  console.log("headers:", req.headers["content-type"]);
  console.log("body:", req.body);
  console.log("file:", req.file);

  const imageFile = req.file;

  if (!senderId) {
    return res.status(401).json({
      message: "Unauthrized Sender ID is Required",
    });
  }

  if (!chatId) {
    return res.status(400).json({
      message: "Chat ID and Message Text or Image are Required",
    });
  }

  if (!text && !imageFile) {
    return res.status(400).json({
      message: "Either Message Text or Image are Required",
    });
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({
      message: "Chat Not Found",
    });
  }

  const isUserInChat = chat.users.some(
    (userId) => userId.toString() === senderId.toString(),
  );
  if (!isUserInChat) {
    return res.status(403).json({
      message: "You are not a participant of this chat",
    });
  }

  const OtherUserId = chat.users.find(
    (userId) => userId.toString() !== senderId.toString(),
  );

  if (!OtherUserId) {
    return res.status(400).json({
      message: "Cannot send message to self",
    });
  }

  // Create messageData with messageType set IMMEDIATELY
  const messageData: any = {
    text: imageFile ? text || "Image" : text,
    chatId,
    sender: senderId,
    messageType: imageFile ? "image" : "text", // Set this first
  };

  if (imageFile) {
    messageData.image = {
      url: imageFile.path,
      publicId: imageFile.filename,
    };
  }

  const message = new Message(messageData);
  const savedMessage = await message.save();
  const latestMessage = imageFile ? "📸 Image" : text;

  await Chat.findByIdAndUpdate(
    chatId,
    {
      latestMessage: { text: latestMessage, sender: senderId },
      updatedAt: new Date(),
    },
    { new: true },
  );

  res.status(201).json({
    message: savedMessage,
    sender: senderId,
    receiver: OtherUserId,
  });
});

export const getMessagesByChat = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.id;
    const { chatId } = req.params as { chatId?: string };

    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is Required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    const isUserInChat = chat.users.some(
      (id) => id.toString() === userId?.toString(),
    );
    if (!isUserInChat) {
      return res.status(403).json({
        message: "You are not a participant of this chat",
      });
    }

    // Mark messages as seen
    await Message.updateMany(
      {
        chatId,
        seen: false,
        sender: { $ne: userId?.toString() as string },
      },
      { seen: true, seenAt: new Date() },
    );

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    const otherUserId = chat.users.find(
      (id) => id.toString() !== userId?.toString(),
    );

    if (!otherUserId) {
      return res.json({
        messages,
        otherUser: { id: null, name: "Unknown User / No Other User" },
      });
    }

    try {
      const { data } = await axios.get(
        `${process.env.USER_SERVICE_URL}/api/v1/users/${otherUserId}`,
      );

      return res.json({
        messages,
        otherUser: data,
      });
    } catch {
      return res.json({
        messages,
        otherUser: { id: otherUserId, name: "Unknown User" },
      });
    }
  },
);
