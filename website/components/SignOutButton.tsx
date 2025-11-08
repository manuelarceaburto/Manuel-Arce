"use client";

import { useMsal } from "@azure/msal-react";

export default function SignOutButton() {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
    >
      Sign Out
    </button>
  );
}
