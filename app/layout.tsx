"use client";
import React from "react";
import AuthSession from "./AuthSession";
import Top from "../components/Top";
import Footer from "../components/Footer";
import { Provider as ReduxProvider } from "react-redux";

import { store } from "../store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider store={store}>
          <AuthSession>
            <div className="mx-auto max-w-4xl">
              <Top />
              {children}
              <Footer />
            </div>
          </AuthSession>
        </ReduxProvider>
      </body>
    </html>
  );
}
