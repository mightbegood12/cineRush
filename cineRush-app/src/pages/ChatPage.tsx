import { useParams } from "react-router-dom";
import ChatInstance from "../components/ChatInstance";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";

export default function ChatPage() {
  const { chatId } = useParams();

  return (
    <div className="flex flex-col w-screen h-screen">
      <Navbar />
      <div className="flex flex-row flex-1">
        <Sidebar />
        {/* You can optionally pass chatId to ChatInstance if you want to fetch/store chat-specific data */}
        <ChatInstance chatId={(chatId as string) || "chat2334j2j23jj3j3"} />
      </div>
    </div>
  );
}
