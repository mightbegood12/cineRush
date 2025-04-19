import { UserButton } from "@clerk/clerk-react";
import ChatInstance from "../components/ChatInstance";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-row w-screen h-screen">
      <Navbar />
      <Sidebar />
      <ChatInstance />
    </div>
  );
}
