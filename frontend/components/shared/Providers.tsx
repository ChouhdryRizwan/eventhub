"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: "12px", fontSize: "14px" } }} />
    </AuthProvider>
  );
}
