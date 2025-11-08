"use client";

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/lib/msalConfig";
import { ReactNode, useState, useEffect } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);

  useEffect(() => {
    const initializeMsal = async () => {
      const instance = new PublicClientApplication(msalConfig);
      await instance.initialize();
      setMsalInstance(instance);
    };

    initializeMsal();
  }, []);

  if (!msalInstance) {
    return <div>Loading authentication...</div>;
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
