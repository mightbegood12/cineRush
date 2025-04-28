import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
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
  timestamps: true,
});

const chatModel = mongoose.model("Chat", chatSchema);
export default chatModel;
