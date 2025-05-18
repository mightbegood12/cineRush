import ChatInstance from "../components/ChatInstance";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";

export default function ChatPage() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <Navbar />
      <div className="flex flex-row flex-1">
        <Sidebar />
        <ChatInstance />
      </div>
    </div>
  );
}
