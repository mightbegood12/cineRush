import express from "express";
import {
  createChat,
  fetchChat,
  updateChat,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/createMessages", createChat);
chatRouter.put("/updateMessages", updateChat);
chatRouter.post("/getMessages", fetchChat);

export default chatRouter;
