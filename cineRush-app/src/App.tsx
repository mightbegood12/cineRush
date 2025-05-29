import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import ChatPage from "./pages/ChatPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RedirectToSignIn, useAuth, useUser } from "@clerk/clerk-react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { backendURL } from "./config/backendConfig";
import { AppProvider } from "./context/AppContext";

function App() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [userCreated, setUserCreated] = useState(false);

  // Memoize the createUser function
  const createUser = useCallback(async () => {
    try {
      const response = await axios.post(`${backendURL}/api/user/create`, {
        user_id: user?.id,
        email: user?.emailAddresses[0].emailAddress,
      });
      if (response.data.success) {
        toast.success("Login Successful!");
        setUserCreated(true);
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  }, [user]);

  useEffect(() => {
    if (!userCreated && user) {
      createUser();
    }
  }, [userCreated, user, createUser]);

  return (
    <Router>
      <AppProvider>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/chat/:chatId"
            element={isSignedIn ? <ChatPage /> : <RedirectToSignIn />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
