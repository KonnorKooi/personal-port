import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "../components/ThemeProvider";
import "../styles/global.css"; // Import global CSS here

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;