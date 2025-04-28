import ChatInstance from "../components/ChatInstance";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";

export default function Home() {
  const chatId = localStorage.getItem("chatId") || "defaultChatId"; // Default chat ID if none exists
  return (
    <div className="flex flex-row w-screen h-screen">
      <Navbar />
      <Sidebar />
      <ChatInstance chatId={chatId} />
    </div>
  );
}
