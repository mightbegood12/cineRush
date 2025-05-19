import { useState } from "react";
import axios from "axios";
import { backendURL } from "../config/backendConfig";
import crossBtn from "../assets/crossBtn.svg";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

interface Preferences {
  seats: string | null;
  type: string | null;
}
interface MovieData {
  date: string | null;
  location: string | null;
  movie_name: string | null;
  preferences: Preferences;
  time: string | null;
  can_book: boolean;
}

interface MovieDataProps {
  movieData: MovieData;
  chatId: string | undefined;
}

const MovieBooking = ({ movieData, chatId }: MovieDataProps) => {
  const [liveUrl, setLiveUrl] = useState<string | undefined>(undefined);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<string>("");

  const updateChatStatus = async () => {
    try {
      await axios.put(`${backendURL}/api/chat/updateChatStatus`, {
        chatId: chatId,
        chatStatus: "Finished",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const startBookingSession = async () => {
    try {
      const response = await axios.post(
        `${backendURL}/api/bookticket/prepare-session`,
        {
          movieData,
        }
      );
      const { liveUrl, sessionId } = response.data;
      setLiveUrl(liveUrl);
      setSessionId(sessionId);
      subscribeToSession(sessionId);
    } catch (error) {
      console.error("Error starting booking:", error);
    }
    console.log("Started Booking");
  };

  const subscribeToSession = (sessionId: string) => {
    const eventSource = new EventSource(
      `${backendURL}/api/bookticket/subscribe/${sessionId}`
    );

    eventSource.onmessage = (event) => {
      console.log("Message:", event.data);
      setStatus(event.data);
    };

    eventSource.addEventListener("done", (event) => {
      console.log("Task done:", event.data);
      setStatus("✅ Task Completed: " + event.data);
      updateChatStatus();
      eventSource.close();
    });

    eventSource.addEventListener("error", (event) => {
      console.error("Error:", event);
      setStatus("❌ Something went wrong.");
      updateChatStatus();
      eventSource.close();
    });
  };

  const handleBooking = () => {
    startBookingSession();
    toast.info("Booking has started");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex group justify-center items-center p-4 h-max sticky top-32"
      >
        <div className="w-[500px] relative flex flex-col gap-2 h-[400px] hover:blur-sm transition-all duration-200 overflow-hidden rounded-xl shadow-md">
          <iframe
            src={
              liveUrl ||
              "https://www.hyperbrowser.ai/cookbook/browser-use/concert-ticket-searching-browser-use"
            }
            className="w-full text-center animate-pulse font-black text-2xl h-full"
          ></iframe>
        </div>
        {liveUrl && (
          <div
            onClick={() => {
              setExpanded(!expanded);
            }}
            className="group-hover:block absolute hover:bg-white hover:text-black transition-all duration-300 cursor-pointer ease-in-out hidden px-4 py-2 bg-[#212121] rounded-2xl text-white"
          >
            {status ? status : "Click to see Progress"}
          </div>
        )}
        {!liveUrl && (
          <div
            onClick={() => {
              handleBooking();
            }}
            className="group-hover:block absolute hover:bg-white hover:text-black transition-all duration-300 cursor-pointer ease-in-out hidden px-4 py-2 bg-[#212121] rounded-2xl text-white"
          >
            Start Booking
          </div>
        )}
      </motion.div>

      <div
        className={`${
          expanded ? "flex" : "hidden"
        } absolute z-40 top-0 left-0 justify-center items-center w-screen h-screen overflow-hidden bg-black/80`}
      >
        <div className="absolute text-2xl text-white mx-auto">{sessionId}</div>
        <div
          onClick={() => {
            setExpanded(!expanded);
          }}
          className="absolute top-2 right-0 select-none m-12 text-white rounded-full hover:bg-[#313131] z-20"
        >
          <img className="w-12 h-12" src={crossBtn} />
        </div>
        <iframe
          src={
            liveUrl ||
            "https://www.hyperbrowser.ai/cookbook/browser-use/concert-ticket-searching-browser-use"
          }
          className="w-[1000px] h-[600px]"
          loading="lazy"
        ></iframe>
      </div>
    </>
  );
};

export default MovieBooking;
