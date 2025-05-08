import { useState } from "react";
import sideBarIconClose from "../assets/sidebarClose.svg";
import sideBarIconOpen from "../assets/sidebarOpen.svg";
import { NavLink } from "react-router-dom";
import newTicketIcon from "../assets/newTicket.svg";
import { useAppContext } from "../context/AppContext";

export default function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const { chatIds, createNewChat } = useAppContext();

  // const updateUser = async (user_id: string | undefined, chatId: string) => {
  //   try {
  //     const response = await axios.put(`${backendURL}/api/user/update`, {
  //       user_id: user_id,
  //       chatId: chatId,
  //     });
  //     if (response.data.success) {
  //       console.log(response.data.success);
  //     }
  //   } catch (error) {
  //     toast.error(`${error}`);
  //   }
  // };

  // const fetchChatIds = async (user_id: string | undefined) => {
  //   if (!user_id) return;
  //   try {
  //     const response = await axios.post(`${backendURL}/api/user/getChatIds`, {
  //       user_id,
  //     });
  //     if (response.data.success) {
  //       setFetchedChatIds(response.data.chatIds);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching chat messages:", error);
  //   }
  // };

  // const createChatMessages = async (
  //   user_id: string | undefined,
  //   chatId: string
  // ) => {
  //   try {
  //     const response = await axios.post(
  //       `${backendURL}/api/chat/createMessages`,
  //       {
  //         user_id: user_id,
  //         chatId: chatId,
  //       }
  //     );
  //     if (response.data.success) {
  //       toast.success("New Chat Created!");
  //     }
  //   } catch (error) {
  //     toast.error(`Error: ${error}`);
  //   }
  // };

  // const createNewChat = () => {
  //   if (!isSignedIn || undefined) {
  //     toast.error("Please Signin to continue!");
  //     return;
  //   } else {
  //     const chatId = uuidv4();
  //     updateUser(user?.id, chatId)
  //       .then(() => {
  //         createChatMessages(user?.id, chatId)
  //           .then(() => {
  //             fetchChatIds(user?.id); // Refresh chat IDs after creating a new chat
  //             navigate(`/chat/${chatId}`);
  //           })
  //           .catch((error) => {
  //             console.error("Failed to create chat messages:", error);
  //           });
  //       })
  //       .catch((error) => {
  //         console.error("Failed to create new chat:", error);
  //       });
  //   }
  // };
  // useEffect(() => {
  //   fetchChatIds(user?.id);
  // }, []);

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

      {chatIds ? (
        chatIds.map((chatId, index) => (
          <NavLink
            key={index}
            to={`/chat/${chatId}`}
            className={`${
              collapsed ? "w-full" : "hidden"
            } hover:bg-[#313131] group relative h-fit px-4 py-2 transition-all duration-300 ease-out rounded-lg`}
          >
            {localStorage.getItem("chatTitle")} {index + 1}
            <div className="group-hover:block absolute px-4 opacity-90 rounded-4xl py-2 w-max text-sm bg-black/[0.5] hidden">
              {chatId}
            </div>
          </NavLink>
        ))
      ) : (
        <div
          onClick={createNewChat}
          className={`${
            collapsed ? "w-full" : "hidden"
          } hover:bg-[#313131] h-fit px-4 py-2 transition-all duration-300 ease-out rounded-lg`}
        >
          Book New Movie
        </div>
      )}
    </div>
  );
}
