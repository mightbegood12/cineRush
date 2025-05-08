import express from "express";
import {
  createUser,
  fetchChatIds,
  updateUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.put("/update", updateUser);
userRouter.post("/getChatIds", fetchChatIds);

export default userRouter;
