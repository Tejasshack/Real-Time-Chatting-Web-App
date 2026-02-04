import { Router } from "express";
import { isAuth } from "../middleware/isAuth.js";
import {
  createNewChat,
  getAllChats,
  getMessagesByChat,
  sendMessage,
} from "../controllers/chat.controller.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.post("/chat/new", isAuth, createNewChat);
router.get("/chat/all", isAuth, getAllChats);
router.post("/chat/message/text", isAuth, sendMessage);
router.post("/chat/message/image", isAuth, upload.single("image"), sendMessage);
router.get("/chat/message/:chatId", isAuth, getMessagesByChat);

export default router;
