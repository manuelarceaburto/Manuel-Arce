"use client";

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/msalConfig";

export default function SignInButton() {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
    >
      Sign in with Microsoft
    </button>
  );
}
