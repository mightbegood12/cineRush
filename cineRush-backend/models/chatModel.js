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
  movieData: {
    type: Object,
    required: false,
    default: {
      date: null,
      location: null,
      movie_name: null,
      preferences: { seats: null, type: null },
      time: null,
      can_book: false,
    },
  },
  chatStatus: {
    type: String,
    default: "Not Completed",
  },
});

const chatModel = mongoose.model("Chat", chatSchema);
export default chatModel;
