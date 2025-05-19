import express from "express";
import {
  getBookingDetails,
  prepareSession,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

// Step 1: Client sends movieData, server responds with liveUrl + sessionId
bookingRouter.post("/prepare-session", prepareSession);

// Step 2: Client connects to SSE stream with sessionId
bookingRouter.get("/subscribe/:sessionId", getBookingDetails);

export default bookingRouter;
