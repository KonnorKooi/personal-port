import React from "react";
import type { AppProps } from "next/app";
import "../styles/global.css"; // Import global CSS here

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
