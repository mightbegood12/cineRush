import express from "express";
import {
  createChat,
  deleteChat,
  fetchChat,
  updateChat,
  updateChatStatus,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/createMessages", createChat);
chatRouter.put("/updateMessages", updateChat);
chatRouter.post("/getMessages", fetchChat);
chatRouter.put("/deleteChat", deleteChat);
chatRouter.put("/updateChatStatus", updateChatStatus);

export default chatRouter;
