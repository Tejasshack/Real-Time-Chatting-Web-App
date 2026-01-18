import { Router } from "express";
import {
  getUsers,
  loginUser,
  verifyUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/login", loginUser);
router.post("/verify", verifyUser);

export default router;
