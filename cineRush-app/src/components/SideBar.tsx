import { useState } from "react";
import sideBarIconClose from "../assets/sidebarClose.svg";
import sideBarIconOpen from "../assets/sidebarOpen.svg";
import { NavLink } from "react-router-dom";
import newTicketIcon from "../assets/newTicket.svg";
import newTicketIcon2 from "../assets/newTicket2.svg";
import deleteBtn from "../assets/deleteBtn.svg";
import { useAppContext } from "../context/AppContext";

export default function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const { chatIds, createNewChat, deleteChat } = useAppContext();

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
          <div className="group-hover:block absolute px-4 mt-6 opacity-90 rounded-4xl py-2 w-max text-sm bg-black/[0.5] hidden">
            Book New Movie
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
          <div className="group-hover:block absolute px-4 mt-6 opacity-90 rounded-4xl py-2 w-max text-sm bg-black/[0.5] hidden">
            {collapsed ? "Close Sidebar" : "Open Sidebar"}
          </div>
        </div>
      </div>

      {chatIds ? (
        <>
          {chatIds.map((chatId, index) => (
            <div
              key={index}
              className={`${
                collapsed ? "w-full" : "hidden"
              }  group flex hover:bg-[#313131] flex-row justify-between px-2 relative h-fit transition-all duration-300 ease-out rounded-lg`}
            >
              <NavLink to={`/chat/${chatId}`} className="px-4 py-2">
                {localStorage.getItem("chatTitle")} {index + 1}
              </NavLink>

              <div className="group-hover:block relative opacity-90 cursor-pointer rounded-4xl w-max text-sm hidden">
                <div
                  className="p-2 rounded-full"
                  onClick={() => {
                    deleteChat(chatId);
                  }}
                >
                  <img className="w-6" src={deleteBtn} alt="" />
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div
          onClick={createNewChat}
          className={`${
            collapsed ? "w-full" : "hidden"
          } hover:bg-[#313131] h-fit px-4 py-2 flex flex-row gap-2 items-center justify-center transition-all duration-300 ease-out rounded-lg cursor-pointer`}
        >
          Book New Movie
          <img className="w-6" src={newTicketIcon2} alt="" />
        </div>
      )}
    </div>
  );
}
