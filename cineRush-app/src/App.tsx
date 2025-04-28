import "./App.css";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound.tsx";
import { useAuth } from "@clerk/clerk-react";
import { Bounce, ToastContainer } from "react-toastify";
import ChatPage from "./pages/ChatPage.tsx";
function App() {
  const { userId, sessionId, getToken, isSignedIn } = useAuth();
  // console.log("User ID:", userId);
  return (
    <Router>
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
        <Route path="/chat/:chatId" element={<ChatPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
