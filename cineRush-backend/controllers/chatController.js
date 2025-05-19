import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";

const createChat = async (req, res) => {
  try {
    const { user_id, chatId } = req.body;
    const isExist = await chatModel.findOne({ chatId });
    if (isExist) {
      return res
        .status(201)
        .json({ success: false, message: "Chat already exist" });
    }
    const newChat = new chatModel({
      user_id,
      chatId,
    });
    const chat = await newChat.save();
    res.status(201).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateChat = async (req, res) => {
  const { chatId, messages, movieData } = req.body;
  try {
    const updatedChat = await chatModel.findOneAndUpdate(
      { chatId: chatId }, // Find chat by chatId
      {
        $set: {
          messages: messages,
          movieData: movieData,
        },
      } // Updates
    );
    if (!updatedChat) {
      return res.status(404).json({ success: false, error: "Chat not found" });
    }
    res.status(201).json({
      success: true,
      message: "ChatStatus updated",
    });
  } catch (error) {
    console.error("Error updating chat", error);
    res
      .status(500)
      .json({ success: false, error: "Error Updating Chat Messages" });
  }
};

const updateChatStatus = async (req, res) => {
  const { chatId, chatStatus } = req.body;
  try {
    await chatModel.findOneAndUpdate(
      { chatId: chatId }, // Find chat by chatId
      {
        $set: {
          chatStatus: chatStatus,
        },
      } // Updates
    );
    res.status(201).json({
      success: true,
      message: "Chat updated",
    });
  } catch (error) {
    console.error("Error updating chat", error);
    res
      .status(500)
      .json({ success: false, error: "Error Updating Chat Status" });
  }
};

const fetchChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    const chat = await chatModel.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found" });
    }
    res.status(201).json({
      success: true,
      messages: chat.messages,
      chatTitle: chat.chatTitle,
      movieData: chat.movieData,
      chatStatus: chat.chatStatus,
    });
  } catch (error) {
    console.error("Error fetching chat", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chatId, user_id } = req.body;
    const chat = await chatModel.findOneAndDelete({ chatId });
    const user = await userModel.findOneAndUpdate(
      { user_id: user_id }, // Find user by user_id
      { $pull: { chatIds: chatId } } // Updates existing array
    );
    if (!chat && !user) {
      return res.status(404).json({ success: false, error: "Chat not found" });
    }
    res.status(201).json({
      success: true,
      message: "Chat Deleted Successfully!",
    });
  } catch (error) {
    console.error("Error Deleting chat", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export { createChat, updateChat, fetchChat, deleteChat, updateChatStatus };
