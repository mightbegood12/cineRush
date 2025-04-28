import { useState } from "react";
import sideBarIconClose from "../assets/sidebarClose.svg";
import sideBarIconOpen from "../assets/sidebarOpen.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import newTicketIcon from "../assets/newTicket.svg";
export default function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [chatId, setChatId] = useState<string | null>(
    localStorage.getItem("chatId")
  );
  const navigate = useNavigate();

  const createNewChat = () => {
    const chatId = uuidv4();
    setChatId(chatId);
    localStorage.setItem("chatId", chatId);
    navigate(`/chat/${chatId}`);
  };

  return (
    <div
      className={`${
        collapsed ? "w-56" : "w-18"
      } flex flex-col text-center transition-width duration-400 gap-4 h-screen text-md border-r-[1px] text-white border-white/[0.1] bg-[#171717] z-20`}
    >
      <div className="flex flex-row h-auto transition-all duration-400 ease-out justify-around">
        <div
          className={
            !collapsed
              ? "hidden opacity-0"
              : "w-48 opacity-100 text-center p-2 m-2"
          }
        >
          Recent
        </div>
        <div
          className={`${
            collapsed ? "w-fit" : "hidden"
          } cursor-pointer p-2 m-2 group relative rounded-full hover:bg-[#313131] h-fit transition-all duration-300 ease-out`}
          onClick={createNewChat}
        >
          <img className="w-14" src={newTicketIcon} alt="" />
          <div className="group-hover:block absolute px-4 opacity-90 rounded-4xl py-2 w-max text-sm bg-black/[0.5] hidden">
            Book New Ticket
          </div>
        </div>
        <div
          className="cursor-pointer group relative p-2 m-2 rounded-full hover:bg-[#313131] h-fit transition-all duration-300 ease-out"
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          {collapsed ? (
            <img className="w-14" src={sideBarIconClose}></img>
          ) : (
            <img className="w-8" src={sideBarIconOpen}></img>
          )}
          <div className="group-hover:block absolute px-4 opacity-90 rounded-4xl py-2 w-max text-sm bg-black/[0.5] hidden">
            {collapsed ? "Close Sidebar" : "Open Sidebar"}
          </div>
        </div>
      </div>

      <NavLink
        to={`/chat/${chatId}`}
        className={`${
          collapsed ? "w-full" : "hidden"
        } hover:bg-[#313131] h-fit px-4 py-2 transition-all duration-300 ease-out rounded-lg`}
      >
        Chat 1
      </NavLink>
      <div
        className={`${
          collapsed ? "w-full" : "hidden"
        } hover:bg-[#313131] h-fit px-4 py-2 transition-all duration-300 ease-out rounded-lg`}
      >
        Chat 2
      </div>
    </div>
  );
}
