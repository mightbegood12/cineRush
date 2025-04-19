import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex flex-col justify-center h-screen items-center bg-[#171717]">
      <SignIn />
    </div>
  );
}
