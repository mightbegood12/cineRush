import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  chatTitle: {
    type: String,
    required: true,
    default: "Booking Chat",
  },
  messages: {
    type: Array,
    required: false,
    default: [],
  },
});

const chatModel = mongoose.model("Chat", chatSchema);
export default chatModel;
