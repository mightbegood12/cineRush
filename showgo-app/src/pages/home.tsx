import { useState, useRef, useEffect, FormEvent } from "react";
import sendbtn from "../assets/send-btn.svg";

export default function Home() {
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const defaultResponse = (input: string) => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Hello, how can I help you today?" },
      ]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: input },
      ]);
      setInput("");
      // Use setTimeout to ensure the user message is added first
      setTimeout(() => defaultResponse(input), 2000);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-[#212121]">
      {/* Chat container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-4 rounded-lg max-w-[80%] ${
                  message.role === "user"
                    ? "shadow-sm px-4 py-3 rounded-xl bg-[#303030]  text-white"
                    : "shadow-sm px-4 py-3 rounded-xl bg-[#303030]  text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

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
