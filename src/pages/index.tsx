import React from "react";
import Head from "next/head";
import VerticalTimeline from "../components/scroll/VerticalTimeline";
import { useTheme } from "../components/ThemeProvider";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const color = isDark ? "#f0ede4" : "#1A1A1A";
  const bg = isDark ? "#0f0e0c" : "#FAFAF7";
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 50,
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 11,
        letterSpacing: 1,
        textTransform: "uppercase",
        background: bg,
        border: `1px solid ${color}`,
        padding: "7px 12px",
        borderRadius: 4,
        cursor: "pointer",
        color,
        transition: "background .15s, color .15s, border-color .15s",
      }}>
      {isDark ? "☀ light" : "☾ dark"}
    </button>
  );
};

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Konnor Kooi Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Konnor Kooi, CS master's student at WWU. Computer vision research, web tools, and an internship at The Standard, laid out as a to-scale timeline."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Konnor Kooi Portfolio" />
        <meta
          property="og:description"
          content="CS master's student at WWU. Computer vision research, web tools, and an internship at The Standard, laid out as a to-scale timeline."
        />
        <meta property="og:url" content="https://konnorkooi.com/" />
        <meta property="og:image" content="https://konnorkooi.com/images/scheduleOpt_optimized.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Konnor Kooi Portfolio" />
        <meta
          name="twitter:description"
          content="CS master's student at WWU. Computer vision research, web tools, and an internship at The Standard."
        />
        <meta name="twitter:image" content="https://konnorkooi.com/images/scheduleOpt_optimized.jpg" />
      </Head>
      <ThemeToggle />
      <VerticalTimeline />
    </>
  );
};

export default Home;
