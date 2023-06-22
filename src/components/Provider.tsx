"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface ProviderProps {
  session: Session; // Replace "YourSessionType" with the actual type of the session object
  children: ReactNode;
}

export const Provider = ({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session;
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
