import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

// ── Contact popup (header "Contact" button → centered card) ─────────────────
const ContactPopup: React.FC<{ isDark: boolean; onClose: () => void }> = ({ isDark, onClose }) => {
  const fg = isDark ? "#f0ede4" : "#1A1A1A";
  const muted = isDark ? "#8a877f" : "#6b6b6b";
  // Slightly higher-contrast than `muted` so the contact values stay readable.
  const value = isDark ? "#bdb9ad" : "#454545";
  const hair = isDark ? "#2a2822" : "#E5E5E5";
  const cardBg = isDark ? "#1a1815" : "#FFFFFF";
  const cardBorder = isDark ? "#2a2822" : "#E5E5E5";

  useEffect(() => {
    const k = (ev: KeyboardEvent) => ev.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: isDark ? "rgba(0,0,0,.7)" : "rgba(20,18,14,.35)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}>
      <div
        onClick={(ev) => ev.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Contact"
        style={{
          position: "relative",
          background: cardBg,
          color: fg,
          width: "min(420px, 100%)",
          borderRadius: 8,
          border: `1px solid ${cardBorder}`,
          boxShadow: "0 24px 80px rgba(0,0,0,.25)",
          padding: "22px 24px 24px",
          boxSizing: "border-box",
        }}>
        <div
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 11,
            color: muted,
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 16,
          }}>
          Contact
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {CONTACT.contacts.map((c, i) => {
            const external = !c.href.startsWith("mailto:");
            return (
              <a
                key={c.href}
                href={c.href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="contact-row"
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "12px 4px",
                  textDecoration: "none",
                  color: fg,
                  borderTop: i === 0 ? "none" : `1px solid ${hair}`,
                }}>
                <span style={{ fontSize: 13.5, fontWeight: 500 }}>{c.label}</span>
                <span
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: 12.5,
                    color: value,
                    textAlign: "right",
                    wordBreak: "break-all",
                  }}>
                  {c.value}
                </span>
              </a>
            );
          })}
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 30,
            height: 30,
            borderRadius: 15,
            border: "none",
            cursor: "pointer",
            background: cardBg,
            color: fg,
            fontSize: 17,
            lineHeight: 1,
            boxShadow: "0 2px 8px rgba(0,0,0,.15)",
          }}>
          ×
        </button>
      </div>
      <style>{`
        .contact-row { transition: background .15s; border-radius: 6px; }
        .contact-row:hover { background: ${isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)"}; }
      `}</style>
    </div>,
    document.body,
  );
};

const ContactButton: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const color = isDark ? "#f0ede4" : "#1A1A1A";
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        style={{
          flexShrink: 0,
          height: 32,
          padding: "0 13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Work Sans", -apple-system, sans-serif',
          fontSize: 13.5,
          fontWeight: 500,
          lineHeight: 1,
          background: "transparent",
          border: `1px solid ${color}`,
          borderRadius: 9,
          cursor: "pointer",
          color,
          transition: "color .15s, border-color .15s",
        }}>
        Contact
      </button>
      {open && <ContactPopup isDark={isDark} onClose={() => setOpen(false)} />}
    </>
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
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 8 : 10, flexShrink: 0 }}>
          <ContactButton />
          <ThemeToggle />
        </div>
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
