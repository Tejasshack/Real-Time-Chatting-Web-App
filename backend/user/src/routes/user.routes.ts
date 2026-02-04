import { Router } from "express";
import {
  getAllUsers,
  getUser,
  getUsers,
  loginUser,
  myProfile,
  updateName,
  verifyUser,
} from "../controllers/user.controller.js";
import { isAuth } from "../middleware/isAuth.js";

const router = Router();

router.get("/", getUsers);
router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.get("/me", isAuth, myProfile);
router.get("/user/all", isAuth, getAllUsers);
router.get("/user/:id", isAuth, myProfile, getUser);
router.post("/update/user", isAuth, updateName);

export default router;
