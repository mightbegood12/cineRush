import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { backendURL } from "../config/backendConfig";
import { useAuth, useUser } from "@clerk/clerk-react";

interface AppContextProps {
  chatIds: string[];
  createNewChat: () => void;
  fetchChatIds: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chatIds, setChatIds] = useState<string[]>([]);
  const { user } = useUser();
  const { isSignedIn } = useAuth();

  const fetchChatIds = async () => {
    if (!user?.id) return;
    try {
      const response = await axios.post(`${backendURL}/api/user/getChatIds`, {
        user_id: user.id,
      });
      if (response.data.success) {
        setChatIds(response.data.chatIds);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const updateUser = async (user_id: string, chatId: string) => {
    await axios.put(`${backendURL}/api/user/update`, {
      user_id,
      chatId,
    });
  };

  const createChatMessages = async (user_id: string, chatId: string) => {
    await axios.post(`${backendURL}/api/chat/createMessages`, {
      user_id,
      chatId,
    });
  };

  const createNewChat = async () => {
    if (!isSignedIn || !user?.id) {
      toast.error("Please Sign in to continue!");
      return;
    }

    const chatId = uuidv4();
    try {
      await updateUser(user.id, chatId);
      await createChatMessages(user.id, chatId);
      toast.success("New Chat Created!");
      await fetchChatIds(); // refresh chat list
    } catch (error) {
      toast.error("Error creating chat");
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchChatIds();
    }
  }, [user?.id]);

  return (
    <AppContext.Provider value={{ chatIds, createNewChat, fetchChatIds }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
