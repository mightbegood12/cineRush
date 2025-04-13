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
  const [canBook, setCanBook] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  })

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  const defaultResponse = async (input: string) => {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      // messages: [{ role: "user", content: input }],
      messages: [
        {
          role: "system",
          content:
            "You are CineRush AI agent, address yourself as CineRush Guy. You are a Named Entity Recognition (NER) model specialized in movie ticket booking. Your task is to extract key details such as movie name, location, time, preferences, and date from the user's input and return the information in JSON format. Also when you have every necessary entities, add a boolean entity 'can_book' to the JSON output. If any required details are missing, prompt the user to provide them. Always include a reply_msg field with a natural response guiding the user through the booking process. Do not explicitly mention that you are extracting information. Once all necessary details are gathered, confirm with the user and indicate that you are proceeding with the booking. Keep your responses strictly related to movie ticket booking and do not provide assistance beyond this scope.",
        },
        {
          role: "user",
          content: messages + input,
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
    setCanBook(jsonResponse.can_book);
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
      {/* Logo Header */}
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
            className={`${canBook ? "max-w-2xl ml-2" : "max-w-3xl mx-auto"}`}
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
        {canBook && (
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
      <div className="border-t absolute bottom-0 w-full z-20 bg-[#212121] border-white/[0.1] p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-2 text-white">
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
