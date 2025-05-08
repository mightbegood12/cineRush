import { FormEvent, useEffect, useRef, useState } from "react";
import sendbtn from "../assets/send-btn.svg";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendURL } from "../config/backendConfig";

type ChatInstanceProps = {
  chatId: string | undefined;
};

export default function ChatInstance({ chatId }: ChatInstanceProps) {
  // const [fetchedMessages, setfetchedMessages] = useState<
  //   Array<{ role: string; content: string }>
  // >([]);
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [input, setInput] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [movieData, setmovieData] = useState({
    date: null,
    location: null,
    movie_name: null,
    preferences: { seats: null, quantity: null },
    time: null,
    can_book: false,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isSignedIn } = useUser();

  const fetchChatMessages = async (chatId: string | undefined) => {
    if (!chatId) return;
    try {
      const response = await axios.post(`${backendURL}/api/chat/getMessages`, {
        chatId,
      });
      if (response.data.success) {
        setMessages(response.data.messages);
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
  const updateChatMessages = async () => {
    if (!chatId || messages.length === 0) return; // Ensure chatId and messages exist
    try {
      const response = await axios.put(
        `${backendURL}/api/chat/updateMessages`,
        {
          chatId: chatId,
          messages: messages,
        }
      );
      if (response.data.success) {
        console.log("Messages updated successfully");
      }
    } catch (error) {
      console.error("Error updating chat messages:", error);
      toast.error("Failed to update chat messages.");
    }
  };

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchChatMessages(chatId);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle browser tab close or refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      updateChatMessages(); // Save messages before the user leaves
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [messages, chatId]);

  const defaultResponse = async (input: string) => {
    const systemMessage = {
      role: "system",
      content:
        "You are CineRush AI agent, address yourself as CineRush Guy. You are a Named Entity Recognition (NER) model specialized in movie ticket booking. Your task is to extract key details such as movie name, location, time, preferences, and date from the user's input and return the information in JSON format. Use the movieData json input as memory and only ask the missing detail. Also when you have every necessary entities, add a boolean entity 'can_book' to the JSON output. If any required details are missing, prompt the user to provide them. Always include a reply_msg field with a natural response guiding the user through the booking process. Do not explicitly mention that you are extracting information. Once all necessary details are gathered, confirm with the user and indicate that you are proceeding with the booking. Keep your responses strictly related to movie ticket booking and do not provide assistance beyond this scope.",
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
    <main className="flex flex-col h-screen w-[100%] bg-[#212121]">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex flex-col text-white justify-center ${
          messageSent ? "h-auto" : "h-[80%]"
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
        className="flex flex-row gap-4 h-[80%] w-full"
      >
        <div className="flex-1 overflow-y-auto p-4 ">
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
            <div ref={messagesEndRef} />
          </div>
        </div>
        {movieData.can_book && (
          <>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full w-0.5 bg-[#303030]"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 overflow-y-auto p-4"
            >
              <iframe
                src="https://app.hyperbrowser.ai"
                height="500"
                width="700"
                title="Iframe Example"
              ></iframe>
            </motion.div>
          </>
        )}
      </motion.div>
      {/* Input form */}
      <div className="border-t bottom-0 w-[100%] z-20 bg-[#212121] border-white/[0.1] px-4 py-2">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-2 text-white mt-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Book me a ticket for The Batman movie this weekend in PVR, chennai at 10:00 AM tomorrow."
              className="flex-1 shadow-md border-[1px] border-white/[0.1] px-4 py-3 rounded-xl bg-[#303030] focus:outline-none"
            />
            <button
              type="submit"
              className="shadow-md bg-[#303030] text-white border-[1px] border-white/[0.1] rounded-full hover:bg-white"
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
    </main>
  );
}
