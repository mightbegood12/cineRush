import { UserButton, useUser } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const { isSignedIn } = useUser();
  return isSignedIn ? (
    <div className="absolute z-50 right-4 p-4 text-white text-md">
      <UserButton />
    </div>
  ) : (
    <NavLink
      to="/login"
      className="absolute right-4 px-4 py-2 m-2 hover:bg-[#171717] transition-all duration-300 ease-out rounded-3xl text-white text-md"
    >
      Sign In
    </NavLink>
  );
}
