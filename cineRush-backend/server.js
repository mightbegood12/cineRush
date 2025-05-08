// server.js
import express from "express";
import cors from "cors";
import { Groq } from "groq-sdk";
import dotenv from "dotenv";
import connectdatabase from "./config/mongodbconfig.js";
import userRouter from "./routes/userRouter.js";
import chatRouter from "./routes/chatRoute.js";
const app = express();
const port = process.env.PORT || 3001; // Use a port, e.g., 3001

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
connectdatabase(); // Connect to MongoDB
dotenv.config(); // Load environment variables from .env file
// Groq API Key
const groqApiKey = process.env.GROQ_API_KEY;

// Check if API key is available
if (!groqApiKey) {
  console.error(
    "Error: VITE_GROQ_API_KEY is not defined in the environment variables."
  );
  process.exit(1); // Exit the process if the API key is missing
}

// Groq Client
const groq = new Groq({
  apiKey: groqApiKey,
});

// API Endpoint for Chat Completion
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body; // Get the messages from the request body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ error: "Missing or invalid messages in request body" });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages, // Pass the messages from the request
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: {
        type: "json_object",
      },
      stop: null,
    });

    const jsonResponse = JSON.parse(
      response.choices[0].message.content || "{}"
    ); // Handle empty responses

    res.json(jsonResponse); // Send the JSON response back to the client
  } catch (error) {
    console.error("Error during Groq API call:", error);
    res.status(500).json({ error: "Failed to process the request" }); // Send an error response
  }
});

// API Endpoint for User Creation
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
