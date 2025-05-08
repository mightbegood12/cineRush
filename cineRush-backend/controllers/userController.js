import userModel from "../models/userModel.js";

const createUser = async (req, res) => {
  try {
    const { user_id, email } = req.body;
    const isExist = await userModel.findOne({ email });
    if (isExist) {
      return res
        .status(201)
        .json({ success: false, message: "Email already exist" });
    }
    const newUser = new userModel({
      user_id,
      email,
    });
    const user = await newUser.save();
    res.status(201).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { user_id, chatId } = req.body;
  try {
    const updatedUser = await userModel.findOneAndUpdate(
      { user_id: user_id }, // Find user by email
      { $addToSet: { chatIds: chatId } } // Updates existing array
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({
      success: true,
      message: "Chat Id added",
    });
  } catch (error) {
    console.error("Error updating chatId", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const fetchChatIds = async (req, res) => {
  try {
    const { user_id } = req.body;
    const user = await userModel.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(201).json({
      success: true,
      chatIds: user.chatIds,
    });
  } catch (error) {
    console.error("Error fetching chatIds", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export { createUser, updateUser, fetchChatIds };
