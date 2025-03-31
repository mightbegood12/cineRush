import { useState, useRef, useEffect, FormEvent } from "react";
import Groq from "groq-sdk";
import sendbtn from "../assets/send-btn.svg";
import { motion } from "framer-motion";

export default function Home() {
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [input, setInput] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const defaultResponse = async (input: string) => {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      // messages: [{ role: "user", content: input }],
      messages: [
        {
          role: "system",
          content:
            "You are CineRush AI agent, a Named Entity Recognition (NER) model specialized in movie ticket booking. Your task is to extract key details such as movie name, location, time, preferences, and date from the user's input and return the information in JSON format. If any required details are missing, prompt the user to provide them. Always include a reply_msg field with a natural response guiding the user through the booking process. Do not explicitly mention that you are extracting information. Once all necessary details are gathered, confirm with the user and indicate that you are proceeding with the booking. Keep your responses strictly related to movie ticket booking and do not provide assistance beyond this scope.",
        },
        {
          role: "user",
          content: input,
        },
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: {
        type: "json_object",
      },
      stop: null,
    });
    const jsonResponse = JSON.parse(response.choices[0].message.content || "");
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: jsonResponse.reply_msg || "" },
    ]);
    console.log(response.choices[0].message.content);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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
    <main className="flex flex-col h-screen bg-[#212121]">
      {/* Landing Page */}
      {!messageSent && (
        <div className="flex flex-col text-white justify-center h-full items-center p-4">
          <div className="font-bold text-4xl">CineRush AI Agent</div>
          <div className="text-sm font-light">
            Your goto place for booking tickets
          </div>
        </div>
      )}
      {/* Chat container + */}
      {messageSent && (
        <div className="flex-1 overflow-y-auto p-4 mt-12">
          <div
            // className={`${
            //   messageSent ? "max-w-2xl ml-2" : "max-w-3xl mx-auto"
            // }`}
            className="max-w-3xl mx-auto"
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
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input form */}
      <div className="border-t border-white/[0.1] p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-2 text-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Book me a ticket for The Batman movie this weekend in PVR, chennai at 10:00 AM"
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
