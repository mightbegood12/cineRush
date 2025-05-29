import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import sendbtn from "../assets/send-btn.svg";
import moreBtn from "../assets/moreBtn.svg";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendURL } from "../config/backendConfig";
import { useParams } from "react-router-dom";
import MovieBooking from "./MovieBooking";

export default function ChatInstance() {
  interface Preferences {
    seats: string | null;
    type: string | null;
  }
  interface MovieData {
    date: string | null;
    location: string | null;
    movie_name: string | null;
    preferences: Preferences;
    time: string | null;
    can_book: boolean;
  }

  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const previousChatIdRef = useRef<string | undefined>("");
  const [input, setInput] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [chatStatus, setChatStatus] = useState("Not Finished");
  const [movieData, setmovieData] = useState<MovieData>({
    date: null,
    location: null,
    movie_name: null,
    preferences: { seats: null, type: null },
    time: null,
    can_book: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add a debounce timer ref and a flag for pending updates
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasPendingChanges = useRef(false);

  const { isSignedIn } = useUser();

  const fetchChatMessages = async (chatId: string | undefined) => {
    if (!chatId) return;
    try {
      const response = await axios.post(`${backendURL}/api/chat/getMessages`, {
        chatId,
      });
      if (response.data.success) {
        setMessages(response.data.messages);
        setmovieData(response.data.movieData);
        setChatStatus(response.data.chatStatus);
        localStorage.setItem("chatTitle", response.data.chatTitle);
        const fetchedMessages = response.data.messages;
        if (fetchedMessages.length != 0) {
          setMessageSent(true);
        } else {
          setMessageSent(false);
        }
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  // Function to update chat messages in the backend
  const updateChatMessages = useCallback(
    async (
      chatIdToUse: string,
      messagesToUse: Array<{ role: string; content: string }>,
      movieDataToUse: object
    ) => {
      if (!chatIdToUse || messagesToUse.length === 0) return;

      // Reset the pending changes flag
      hasPendingChanges.current = false;

      try {
        const response = await axios.put(
          `${backendURL}/api/chat/updateMessages`,
          {
            chatId: chatIdToUse,
            messages: messagesToUse,
            movieData: movieDataToUse,
          }
        );
        if (response.data.success) {
          console.log("Messages updated successfully");
        }
      } catch (error) {
        console.error("Error updating chat messages:", error);
        // toast.error("Failed to update chat messages.");
      }
    },
    []
  );

  // New debounced save function
  const debounceSaveMessages = useCallback(() => {
    // Mark that we have pending changes
    hasPendingChanges.current = true;

    // Clear existing timer if any
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      if (chatId && hasPendingChanges.current) {
        updateChatMessages(chatId, messages, movieData);
      }
    }, 2000); // 2 second debounce
  }, [chatId, messages, movieData, updateChatMessages]);

  // Watch for message changes to trigger debounced save
  useEffect(() => {
    if (chatId && messages.length > 0) {
      debounceSaveMessages();
    }
  }, [messages, movieData, chatId, debounceSaveMessages]);

  // Save messages when navigating away from the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (chatId && hasPendingChanges.current) {
        // Synchronous save when leaving the page
        navigator.sendBeacon(
          `${backendURL}/api/chat/updateMessages`,
          JSON.stringify({
            chatId,
            messages,
            movieData,
          })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [chatId, messages, movieData]);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save previous messages before switching chats
  useEffect(() => {
    const prevChatId = previousChatIdRef.current;
    if (prevChatId && prevChatId !== chatId && hasPendingChanges.current) {
      // Immediately save when switching chats
      updateChatMessages(prevChatId, messages, movieData);
    }

    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Set up for next render
    previousChatIdRef.current = chatId;
    // Clear messages so we fetch fresh ones
    setMessages([]);
    setmovieData({
      date: null,
      location: null,
      movie_name: null,
      preferences: { seats: null, type: null },
      time: null,
      can_book: false,
    });
    hasPendingChanges.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      fetchChatMessages(chatId);
    }
  }, [chatId]);

  const defaultResponse = async (input: string) => {
    const systemMessage = {
      role: "system",
      content:
        "You are CineRush AI agent, address yourself as CineRush Guy. You are a Named Entity Recognition (NER) model specialized in movie ticket booking. Your task is to extract key details such as movie name, location, time, preferences (preferences is an object with seats and type value), and date from the user's input and return the information in JSON format. Use the movieData json input as memory and only ask the missing detail. Also when you have every necessary entities, add a boolean entity 'can_book' to the JSON output. If any required details are missing, prompt the user to provide them. Always include a reply_msg field with a natural response guiding the user through the booking process. Do not explicitly mention that you are extracting information. Once all necessary details are gathered, confirm with the user and indicate that you are proceeding with the booking. Keep your responses strictly related to movie ticket booking and do not provide assistance beyond this scope.",
    };
    const userMessage = {
      role: "user",
      content: JSON.stringify(movieData) + " " + input,
    };
    // console.log(userMessage);
    setIsloading(true);
    try {
      const response = await fetch(`${backendURL}/api/chat`, {
        // Replace with your backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [systemMessage, userMessage] }), // Send the messages
      });

      if (!response.ok) {
        console.error("HTTP error:", response.status);
        return; // Or throw an error
      }

      const jsonResponse = await response.json(); // Parse the JSON response
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: jsonResponse.reply_msg || "" },
      ]);
      setmovieData(jsonResponse);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error("Error calling backend API:", error);
      toast.error("Server Error. Please try again.");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error("Please sign in to book tickets");
      return;
    }
    setMessageSent(true);
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: input },
      ]);
      setInput("");
      // Use setTimeout to ensure the user message is added first
      setTimeout(() => defaultResponse(input), 1000);
    }
  };

  return (
    <main className="flex flex-col h-screen justify-between w-[100%] bg-[#212121] overflow-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex flex-col text-white justify-center z-20 ${
          messageSent ? "h-auto sticky top-0 bg-[#212121]" : "h-full"
        } items-center p-4`}
      >
        <div
          className={`font-bold text-center transition-all duration-300 ${
            messageSent ? "text-2xl" : "text-6xl"
          } `}
        >
          CineRush AI Agent
        </div>
        <div
          className={`"text-sm text-center font-light ${
            messageSent ? "hidden" : "block"
          } `}
        >
          Your goto place for booking tickets
        </div>
      </motion.div>
      {/* Chat container + */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-row gap-4 h-auto w-full"
      >
        <div className="flex-1 p-4 ">
          <div
            className={`${
              movieData.can_book ? "max-w-2xl ml-2" : "max-w-3xl mx-auto"
            }`}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex mb-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-lg max-w-[80%] ${
                    message.role === "user"
                      ? "shadow-sm px-4 py-2 rounded-full bg-[#303030]  text-white"
                      : "px-4 py-3 rounded-full bg-[#212121]  text-white"
                  }`}
                >
                  {message.content}
                </motion.div>
              </div>
            ))}
            {isloading && (
              <div className="flex flex-col gap-2 mb-8 justify-start">
                <div className="px-4 py-2 mx-2 h-1 w-42 animate-pulse rounded-full bg-[#8989893d]  text-white"></div>
                <div className="px-4 py-2 mx-2 h-1 w-80 animate-pulse rounded-full bg-[#8989893d]  text-white"></div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
        {movieData.can_book && chatStatus != "Finished" && (
          <>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full w-0.5 bg-[#303030]"
            ></motion.div>
            <MovieBooking chatId={chatId} movieData={movieData} />
          </>
        )}
        {movieData.can_book && chatStatus == "Finished" && (
          <>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full w-0.5 bg-[#303030]"
            ></motion.div>
            <div className="flex group justify-center items-center p-4 h-max sticky top-32">
              <div className="w-[600px] m-4 bg-[#171717] relative text-2xl text-white flex flex-col justify-center items-center gap-2 h-[400px] transition-all duration-200 overflow-hidden rounded-xl shadow-md">
                <div className="p-12 text-center">
                  Booking Already Finished. Start a new chat for booking more
                  tickets.
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
      {/* Chat Input */}
      <div className="border-t sticky bottom-0 w-[100%] z-20 bg-[#212121] border-white/[0.1] px-4 py-2">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-2 text-white mt-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                chatStatus == "Finished"
                  ? "Chat has ended. Start a new chat to book more tickets"
                  : "Book me a ticket for The Batman movie this weekend in PVR, chennai at 10:00 AM tomorrow."
              }
              className={`${
                chatStatus == "Finished" ? "text-red" : "text-gray"
              } flex-1 shadow-md border-[1px] border-white/[0.1] px-4 py-3 rounded-xl bg-[#303030] focus:outline-none`}
              disabled={chatStatus === "Finished"}
            />
            <button
              type="submit"
              className="shadow-md bg-[#303030] text-white border-[1px] border-white/[0.1] rounded-full hover:bg-white"
              disabled={chatStatus === "Finished"}
            >
              <img
                className="w-10 h-10 hover:invert transition-colors p-2"
                src={sendbtn}
                alt="send"
              />
            </button>
          </div>
        </form>
      </div>
      {/* Movie Data */}
      {movieData && (
        <div className="absolute top-8 right-0 m-12 z-20">
          <div className="relative group">
            <button className="w-10 h-10 p-2 rounded-full border border-white/50 text-white bg-transparent hover:bg-[#313131] transition-colors">
              <img
                src={moreBtn}
                alt="More"
                className="w-full h-full object-contain"
              />
            </button>
            <div className="w-max absolute right-12 top-12 hidden group-hover:flex flex-col gap-2 bg-[#313131]/70 text-white text-sm px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md transition-all">
              <div>
                <span className="font-medium">Movie:</span>{" "}
                {movieData.movie_name}
              </div>
              <div>
                <span className="font-medium">Date:</span> {movieData.date}
              </div>
              <div>
                <span className="font-medium">Location:</span>{" "}
                {movieData.location}
              </div>
              <div>
                <span className="font-medium">Preferences:</span>{" "}
                {movieData.preferences?.seats || "N/A"} +{" "}
                {movieData.preferences?.type || "N/A"} seats
              </div>
              <div>
                <span className="font-medium">Time:</span> {movieData.time}
              </div>
              {/* <div>
                <span className="font-medium">Can Book:</span>{" "}
                {movieData.can_book.toString()}
              </div> */}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
