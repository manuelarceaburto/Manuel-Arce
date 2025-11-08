"use client";

import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";

export default function UserProfile() {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-600">Please sign in to access your account</p>
        <SignInButton />
      </div>
    );
  }

  const account = accounts[0];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Name:</span> {account.name || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {account.username || "N/A"}
          </p>
        </div>
      </div>
      <SignOutButton />
    </div>
  );
}
