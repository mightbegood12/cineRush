import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAppContext } from "../context/AppContext";
export default function Home() {
  const { createNewChat } = useAppContext();
  return (
    <>
      <Navbar />
      <main className="flex flex-col justify-center h-screen w-[100%] bg-linear-to-r from-gray-800 via-blue-700 to-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col text-white justify-center h-auto items-center p-4"
        >
          <div className="font-bold text-center transition-all duration-300 text-6xl">
            CineRush AI Agent
          </div>
          <div className="text-sm text-center font-lightblock">
            Your goto place for booking tickets
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col text-white justify-center h-auto items-center p-4"
        >
          <button
            onClick={createNewChat}
            className="bg-slate-800 no-underline group cursor-pointer relative shadow-xl shadow-zinc-900 rounded-full p-px text-md font-normal leading-6 text-white inline-block"
          >
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-4 ring-1 ring-white/10 ">
              <span>Start Booking</span>
              <svg
                fill="none"
                height="16"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.75 8.75L14.25 12L10.75 15.25"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
          </button>
        </motion.div>
      </main>
    </>
  );
}
