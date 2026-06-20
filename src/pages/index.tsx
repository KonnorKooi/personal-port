import React, { useEffect, useState } from "react";
import Head from "next/head";
import VerticalTimeline from "../components/scroll/VerticalTimeline";
import { useTheme } from "../components/ThemeProvider";
import { CONTACT } from "../utils/gitflowData";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const useMobile = () => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const u = () => setM(mq.matches);
    u();
    mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);
  return m;
};

// Scroll progress 0 → 1 over the first `threshold` px of scroll, throttled to
// one update per animation frame.
const useScrollProgress = (threshold: number) => {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setP(Math.min(window.scrollY / threshold, 1));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [threshold]);
  return p;
};

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const color = isDark ? "#f0ede4" : "#1A1A1A";
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      style={{
        flexShrink: 0,
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 15,
        lineHeight: 1,
        background: "transparent",
        border: `1px solid ${color}`,
        borderRadius: 9,
        cursor: "pointer",
        color,
        transition: "color .15s, border-color .15s",
      }}>
      {isDark ? "☀" : "☾"}
    </button>
  );
};

const NavBar: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const mobile = useMobile();
  const p = useScrollProgress(mobile ? 70 : 90);

  const fg = isDark ? "#f0ede4" : "#1A1A1A";
  const padV = lerp(mobile ? 18 : 26, 10, p);
  const nameSize = lerp(mobile ? 28 : 42, mobile ? 21 : 26, p);
  const bg = isDark
    ? `rgba(15,14,12,${0.85 * p})`
    : `rgba(255,255,255,${0.85 * p})`;
  const hair = isDark
    ? `rgba(255,255,255,${0.08 * p})`
    : `rgba(0,0,0,${0.10 * p})`;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: bg,
        backdropFilter: `blur(${8 * p}px)`,
        WebkitBackdropFilter: `blur(${8 * p}px)`,
        borderBottom: `1px solid ${hair}`,
        paddingTop: padV,
        paddingBottom: padV,
        paddingLeft: mobile ? 6 : 24,
        paddingRight: mobile ? 14 : 24,
      }}>
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
        <span
          style={{
            fontFamily: '"Work Sans", -apple-system, sans-serif',
            fontSize: nameSize,
            fontWeight: 500,
            letterSpacing: lerp(-1.1, -0.3, p),
            lineHeight: 1.05,
            color: fg,
            transition: "color .15s",
          }}>
          {CONTACT.name}
        </span>
        <ThemeToggle />
      </div>
    </nav>
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
      <NavBar />
      <VerticalTimeline />
    </>
  );
};

export default Home;
