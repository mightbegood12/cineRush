import { useState } from "react";
import sideBarIconClose from "../assets/sidebarClose.svg";
import sideBarIconOpen from "../assets/sidebarOpen.svg";
export default function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      className={`${
        collapsed ? "w-64" : "w-18"
      } flex flex-row text-center transition-width duration-400 justify-around h-screen text-md border-r-[1px] text-white border-white/[0.1] bg-[#171717] z-20`}
    >
      <div className="flex flex-row h-full transition-all duration-400 ease-out justify-around">
        <div
          className={!collapsed ? "hidden opacity-0" : "w-48 opacity-100 p-4"}
        >
          Recent Bookings
        </div>
        <div
          className="cursor-pointer p-2 m-2 rounded-full hover:bg-[#313131] h-fit transition-all duration-300 ease-out"
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          {collapsed ? (
            <img className="w-8" src={sideBarIconClose}></img>
          ) : (
            <img className="w-8" src={sideBarIconOpen}></img>
          )}
        </div>
      </div>
    </div>
  );
}
