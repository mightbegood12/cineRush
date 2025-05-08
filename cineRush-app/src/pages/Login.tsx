import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex flex-col justify-center h-screen items-center bg-linear-to-r from-gray-800 via-blue-700 to-gray-900">
      <SignIn />
    </div>
  );
}
