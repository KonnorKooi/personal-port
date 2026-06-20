import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../ThemeProvider";
import { CONTACT, EVENTS, BRANCHES, Event } from "../../utils/gitflowData";
import { SPANS, NOW, Span, YM } from "../../utils/scrollSections";

// ── Vertical to-scale Gantt ────────────────────────────────────────────────
// Time runs top (now) → bottom (earliest). Engagements are vertical bars
// placed in lanes across the page width: duration ≈ bar height, overlap shows
// as side-by-side bars. Bars get a minimum height (with collision-safe
// packing) so even one-month projects can show their label + dates.

// Per-engagement colors (override the category default).
const WWU_BLUE = "#00549F";   // BS + MS
const QIDDS_BLUE = "#1C9BD1"; // QIDDS
const CV_GREEN = "#2F9E5F";   // computer-vision research
const PROJECTS = "#E8833A";   // small projects
const STANDARD = "#8B5CD6";   // The Standard
const PERSONAL = "#d05a4f";   // personal / Campus Rec
const TODAY = "#e8546b";

const COLORS: Record<string, string> = {
  "wwu-start": WWU_BLUE,
  "masters-start": WWU_BLUE,
  "research-wehrwein": CV_GREEN,
  "qidds": QIDDS_BLUE,
  "the-standard": STANDARD,
  "schedule-opt-start": PROJECTS,
  "gaussian": PROJECTS,
  "quiz-app": PROJECTS,
  "autonomous-drone": PROJECTS,
  "conflict-forecast": PROJECTS,
};

// Inline logos shown on the bar + as the detail header.
const LOGOS: Record<string, string> = {
  "wwu-start": "/images/WWUlogo.png",
  "masters-start": "/images/WWUlogo.png",
  "qidds": "/images/qidds.jpeg",
  "the-standard": "/images/TheStandard.png",
  "ref": "/images/reclogo.png",
};

// Per-logo render height in the detail panel (px). WWU is wide, so it needs
// more height to read at the same visual weight as the squarer marks.
const LOGO_H: Record<string, number> = {
  "wwu-start": 150,
  "masters-start": 150,
  "qidds": 124,
  "the-standard": 132,
  "ref": 128,
};
const DEFAULT_LOGO_H = 124;

const FALLBACK: Record<string, string> = {
  main: "#34a866", school: WWU_BLUE, work: STANDARD, projects: PROJECTS, personal: PERSONAL,
};

const byId: Record<string, Event> = Object.fromEntries(EVENTS.map((e) => [e.id, e]));
const branchCategory: Record<string, string> = Object.fromEntries(BRANCHES.map((b) => [b.id, b.category]));

const LABELS: Record<string, string> = {
  "wwu-start": "BS Computer Science",
  "schedule-opt-start": "Schedule Optimizer",
  "research-wehrwein": "Computer Vision Research",
  "gaussian": "Gaussian Viewer",
  "quiz-app": "JSON Quiz App",
  "autonomous-drone": "Autonomous Drone",
  "conflict-forecast": "Conflict Forecasting",
  "qidds": "QIDDS - Full-Stack Intern",
  "masters-start": "MS Computer Science",
  "the-standard": "The Standard - Intern",
  "ref": "WWU Campus Rec",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthsOf = (ym: YM) => ym[0] * 12 + (ym[1] - 1);
const fmtYM = (ym: YM) => `${MONTHS[ym[1] - 1]} ${ym[0]}`;
const fmtRange = (s: Span) => `${fmtYM(s.start)} – ${s.end ? fmtYM(s.end) : "now"}`;

const PAD = 2;
const AXIS_MIN = Math.min(...Object.values(SPANS).map((s) => monthsOf(s.start)));
const AXIS_MAX = Math.max(monthsOf(NOW), ...Object.values(SPANS).map((s) => monthsOf(s.end ?? NOW))) + PAD;
const RANGE = Math.max(1, AXIS_MAX - AXIS_MIN);

type Bar = { id: string; span: Span; label: string; accent: string; logo?: string; e: Event; lane: number };

// Each engagement belongs to a category, and each category gets its own fixed
// column (left → right in GROUP_ORDER). Bars within a category stack vertically
// by time. Columns are not labelled — color + logo carry the meaning.
const GROUP: Record<string, string> = {
  "wwu-start": "school", "masters-start": "school",
  "research-wehrwein": "research",
  "qidds": "internship", "the-standard": "internship",
  "schedule-opt-start": "project", "gaussian": "project", "quiz-app": "project",
  "autonomous-drone": "project", "conflict-forecast": "project",
  "ref": "personal",
};
const GROUP_ORDER = ["school", "research", "internship", "project", "personal"];

const { BARS, LANES } = (() => {
  const list = Object.entries(SPANS).map(([id, span]) => {
    const e = byId[id];
    return {
      id, span, e,
      label: LABELS[id] ?? e?.subtitle ?? e?.title ?? id,
      accent: COLORS[id] ?? FALLBACK[branchCategory[e?.branch] ?? "main"] ?? FALLBACK.main,
      logo: LOGOS[id],
      lane: 0,
    } as Bar;
  });
  // One column per category that actually has bars, preserving GROUP_ORDER.
  const groupOf = (id: string) => GROUP[id] ?? branchCategory[byId[id]?.branch] ?? "school";
  const present = GROUP_ORDER.filter((g) => list.some((b) => groupOf(b.id) === g));
  for (const bar of list) bar.lane = Math.max(0, present.indexOf(groupOf(bar.id)));
  return { BARS: list, LANES: present.length };
})();

const YEARS = (() => {
  const out: number[] = [];
  for (let y = Math.ceil(AXIS_MIN / 12); y * 12 <= AXIS_MAX; y++) out.push(y);
  return out;
})();

type Tokens = { bg: string; fg: string; muted: string; hair: string; grid: string; laneBg: string; cardBg: string; cardBorder: string; imgFrame: string };

const useMobile = () => {
  const [m, setM] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const u = () => setM(mq.matches);
    u(); mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);
  return m;
};

// ── detail card (picture + info) ───────────────────────────────────────────
const Detail: React.FC<{ bar: Bar; T: Tokens; dark: boolean; onClose: () => void }> = ({ bar, T, dark, onClose }) => {
  const { e, accent, span, logo } = bar;
  const img = e.images?.[0];
  const extras = e.images?.slice(1) ?? [];
  useEffect(() => {
    const k = (ev: KeyboardEvent) => ev.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: dark ? "rgba(0,0,0,.7)" : "rgba(20,18,14,.35)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={(ev) => ev.stopPropagation()} role="dialog" aria-modal="true" style={{
        position: "relative", background: T.cardBg, color: T.fg, width: "min(560px, 100%)", maxHeight: "86vh",
        overflow: "auto", borderRadius: 8, border: `1px solid ${T.cardBorder}`, boxShadow: "0 24px 80px rgba(0,0,0,.25)",
      }}>
        {img ? (
          img.frame === "browser" ? (
            <div style={{ border: `1px solid ${T.imgFrame}`, borderRadius: 8, overflow: "hidden", margin: 16, marginBottom: 0 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 8px 8px 12px",
                background: dark ? "#26241f" : "#ECE9DF", borderBottom: `1px solid ${T.cardBorder}`,
              }}>
                <div style={{
                  flex: 1, minWidth: 0, background: dark ? "#15130f" : "#fff",
                  borderRadius: 5, padding: "4px 11px", fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 11, color: T.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{img.frameLabel || ""}</div>
                <button onClick={onClose} aria-label="Close" className="vgt-frame-x" style={{
                  flexShrink: 0, width: 26, height: 26, borderRadius: 5, border: "none", cursor: "pointer",
                  background: "transparent", color: T.fg, fontSize: 18, lineHeight: 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>×</button>
              </div>
              <div style={{ height: 230, overflow: "hidden", background: "#fff" }}>
                <img src={img.src} alt={img.caption || bar.label} style={{ width: "100%", display: "block" }} />
              </div>
            </div>
          ) : (
            <img src={img.src} alt={img.caption || bar.label} style={{
              width: img.fit === "contain" ? "calc(100% - 32px)" : "100%",
              height: img.fit === "contain" ? 200 : 220,
              objectFit: img.fit ?? "cover", background: img.fit === "contain" ? "#fff" : T.laneBg,
              ...(img.fit === "contain"
                ? { padding: 16, boxSizing: "border-box", margin: 16, marginBottom: 0, borderRadius: 8, border: `1px solid ${T.imgFrame}` }
                : {}),
            }} />
          )
        ) : logo ? (
          <div style={{
            height: 240, display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20, boxSizing: "border-box", borderBottom: `1px solid ${T.cardBorder}`,
            background: `linear-gradient(155deg, ${accent}, ${accent}d9)`,
          }}>
            <div style={{
              background: "#fff", borderRadius: 18, padding: "24px 34px",
              display: "flex", alignItems: "center", justifyContent: "center",
              maxWidth: "100%", maxHeight: "100%", boxSizing: "border-box",
              boxShadow: "0 10px 34px rgba(0,0,0,.22)",
            }}>
              <img src={logo} alt={bar.label} style={{
                height: LOGO_H[bar.id] ?? DEFAULT_LOGO_H, width: "auto",
                maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 8, display: "block",
              }} />
            </div>
          </div>
        ) : null}
        <div style={{ padding: "20px 24px 26px" }}>
          <div style={{
            fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: accent,
            letterSpacing: 0.6, marginBottom: 8,
          }}>
            {e.branch} · {fmtRange(span)}{e.location ? ` · ${e.location}` : ""}
          </div>
          <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>
            {e.subtitle || bar.label}
          </h2>
          {e.detail && <p style={{ margin: "0 0 16px", fontSize: 14.5, lineHeight: 1.6, opacity: 0.82 }}>{e.detail}</p>}
          {e.highlights && e.highlights.length > 0 && (
            <ul style={{ margin: "0 0 16px", paddingLeft: 18, fontSize: 13.5, lineHeight: 1.65, opacity: 0.85 }}>
              {e.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          )}
          {extras.map((im) => (
            <div key={im.src} style={{ margin: "0 0 16px" }}>
              {im.scroll ? (
                <div style={{
                  maxHeight: 340, overflowY: "auto", borderRadius: 6,
                  border: `1px solid ${T.imgFrame}`, background: "#fff",
                  WebkitOverflowScrolling: "touch",
                }}>
                  <img src={im.src} alt={im.caption || ""} style={{ width: "100%", display: "block" }} />
                </div>
              ) : (
                <img src={im.src} alt={im.caption || ""} style={{
                  width: "100%", maxHeight: 360, borderRadius: 6, border: `1px solid ${T.imgFrame}`,
                  objectFit: im.fit ?? "cover",
                  ...(im.fit === "contain" ? { background: "#fff", padding: 16, boxSizing: "border-box" } : {}),
                }} />
              )}
              {im.caption && (
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: T.muted, marginTop: 6 }}>
                  {im.caption}{im.scroll ? " · scroll to read" : ""}
                </div>
              )}
            </div>
          ))}
          {e.tech && e.tech.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {e.tech.map((t) => (
                <span key={t} style={{ fontSize: 12, padding: "3px 9px", borderRadius: 999, border: `1px solid ${T.hair}` }}>{t}</span>
              ))}
            </div>
          )}
          {e.links && e.links.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {e.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" style={{
                  padding: "9px 15px", borderRadius: 5, background: accent,
                  color: "#fff", textDecoration: "none", fontWeight: 500, fontSize: 13.5,
                }}>{l.label} →</a>
              ))}
            </div>
          )}
        </div>
        {img?.frame !== "browser" && (
          <button onClick={onClose} aria-label="Close" style={{
            position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: 15,
            border: "none", cursor: "pointer", background: T.cardBg, color: T.fg, fontSize: 17,
            boxShadow: "0 2px 8px rgba(0,0,0,.15)",
          }}>×</button>
        )}
      </div>
    </div>
  );
};

const VerticalTimeline: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const mobile = useMobile();
  const [openId, setOpenId] = useState<string | null>(null);

  const T: Tokens = dark ? {
    bg: "#0f0e0c", fg: "#f0ede4", muted: "#8a877f", hair: "#2a2822",
    grid: "#211f1a", laneBg: "#151310", cardBg: "#1a1815", cardBorder: "#2a2822", imgFrame: "#3a372f",
  } : {
    bg: "#FFFFFF", fg: "#1A1A1A", muted: "#6b6b6b", hair: "#E5E5E5",
    grid: "#ECECEC", laneBg: "#F4F4F5", cardBg: "#FFFFFF", cardBorder: "#E5E5E5", imgFrame: "#C9C9C9",
  };

  const pxPerMonth = mobile ? 22 : 28;
  const MIN_BAR_H = mobile ? 58 : 66;
  // Logo bars need extra room so the logo banner + label aren't cramped (e.g.
  // short stints like The Standard). Long-duration logo bars already exceed this.
  const LOGO_MIN_BAR_H = mobile ? 96 : 104;
  const GAP = 5;
  const height = RANGE * pxPerMonth;
  const gutter = mobile ? 30 : 48;
  const yTop = (ym: YM) => (AXIS_MAX - monthsOf(ym)) * pxPerMonth;

  // Lay out each bar: start from the to-scale slot, grow to MIN_BAR_H where
  // there's free space in the lane, and clamp so neighbors never overlap.
  const layout = useMemo(() => {
    const map: Record<string, { top: number; height: number }> = {};
    const byLane: Record<number, Bar[]> = {};
    BARS.forEach((b) => (byLane[b.lane] ??= []).push(b));
    Object.values(byLane).forEach((list) => {
      const sorted = [...list].sort((a, b) => yTop(a.span.end ?? NOW) - yTop(b.span.end ?? NOW));
      sorted.forEach((b, i) => {
        const trueTop = yTop(b.span.end ?? NOW);
        const trueBottom = yTop(b.span.start);
        const slotTop = i > 0 ? yTop(sorted[i - 1].span.start) + GAP : 0;
        const slotBottom = i < sorted.length - 1 ? yTop(sorted[i + 1].span.end ?? NOW) - GAP : height;
        const desired = Math.max(trueBottom - trueTop, b.logo ? LOGO_MIN_BAR_H : MIN_BAR_H);
        const h = Math.max(8, Math.min(desired, slotBottom - slotTop));
        let top = trueTop;
        if (top + h > slotBottom) top = slotBottom - h;
        if (top < slotTop) top = slotTop;
        map[b.id] = { top, height: h };
      });
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pxPerMonth, MIN_BAR_H, LOGO_MIN_BAR_H, height]);

  const laneGap = mobile ? 4 : 8;
  const laneStyle = (lane: number): React.CSSProperties => ({
    left: `calc(${(lane / LANES) * 100}% + ${laneGap / 2}px)`,
    width: `calc(${100 / LANES}% - ${laneGap}px)`,
  });

  const openBar = openId ? BARS.find((b) => b.id === openId) ?? null : null;

  const legend: Array<[string, string]> = [
    [WWU_BLUE, "WWU (BS/MS)"], [CV_GREEN, "Research"], [QIDDS_BLUE, "QIDDS"],
    [STANDARD, "The Standard"], [PROJECTS, "Projects"], [PERSONAL, "Campus Rec"],
  ];

  return (
    <div style={{
      fontFamily: '"Work Sans", -apple-system, sans-serif',
      background: T.bg, color: T.fg, minHeight: "100vh",
      padding: mobile ? "0px 14px 56px 6px" : "0px 24px 72px",
      boxSizing: "border-box", transition: "background .2s, color .2s",
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {CONTACT.about && (
          <section style={{ marginBottom: mobile ? 26 : 40, maxWidth: 680 }}>
            <div style={{
              fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: T.muted,
              letterSpacing: 1, textTransform: "uppercase", marginBottom: 10,
            }}>
              About
            </div>
            {CONTACT.about.split("\n\n").map((para, i) => (
              <p key={i} style={{
                fontSize: mobile ? 14.5 : 15.5, color: T.fg, opacity: 0.82,
                margin: i === 0 ? "0 0 12px" : "0 0 12px", lineHeight: 1.65,
              }}>
                {para}
              </p>
            ))}
          </section>
        )}

        <div style={{ display: "flex" }}>
          {/* time gutter */}
          <div style={{ position: "relative", width: gutter, flexShrink: 0, height }}>
            {YEARS.map((y) => (
              <div key={y} style={{ position: "absolute", top: yTop([y, 1]) - 7, right: mobile ? 5 : 8 }}>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: T.muted }}>{y}</span>
              </div>
            ))}
          </div>

          {/* chart */}
          <div style={{ position: "relative", flex: 1, height }}>
            {YEARS.map((y) => (
              <div key={y} style={{ position: "absolute", left: 0, right: 0, top: yTop([y, 1]), height: 1, background: T.grid }} />
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, top: yTop(NOW), height: 2, background: TODAY, zIndex: 4 }} />
            <div style={{
              position: "absolute", left: 0, top: yTop(NOW) - 22, background: TODAY, color: "#fff", zIndex: 5,
              fontFamily: '"IBM Plex Mono", monospace', fontSize: 10.5, letterSpacing: 0.4, padding: "2px 8px", borderRadius: 4,
            }}>Today</div>

            {BARS.map((b) => {
              const { top, height: h } = layout[b.id];
              const img = b.e.images?.[0];
              const showThumb = !!img && !b.logo && h >= 92;
              // Logo banner: tall bars get the full 62px banner + label + date.
              // Shorter bars (e.g. The Standard) get a banner sized to fill the
              // bar, dropping the date since the logo already shows the name.
              const tall = h >= 100;
              const bandH = tall ? 62 : Math.min(64, h - 26);
              const showLogoHeader = !!b.logo && bandH >= 34;
              const ongoing = !b.span.end;
              // Paint the logo band into the bar's own background as a hard-stop
              // gradient (gray top, accent below) so the rounded top corners are a
              // single solid color with no child boundary to antialias against.
              const accentLayer = ongoing ? `linear-gradient(180deg, ${b.accent}, ${b.accent}cc)` : b.accent;
              const bandColor = dark ? "#fff" : "#F8F8F9";
              const barBg = showLogoHeader
                ? `linear-gradient(to bottom, ${bandColor} 0, ${bandColor} ${bandH}px, transparent ${bandH}px), ${accentLayer}`
                : accentLayer;
              return (
                <button key={b.id} onClick={() => setOpenId(b.id)} className="vgt-bar"
                  title={`${b.label} · ${fmtRange(b.span)}`}
                  style={{
                    position: "absolute", top, height: h, ...laneStyle(b.lane),
                    border: "none", padding: 0, textAlign: "left", cursor: "pointer",
                    borderRadius: 7, overflow: "hidden", zIndex: 2, color: "#fff",
                    background: barBg,
                    boxShadow: dark ? "none" : "0 1px 4px rgba(0,0,0,0.10)",
                    transform: "translateZ(0)", WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                    display: "flex", flexDirection: "column",
                  }}>
                  {showThumb && (
                    <img src={img!.src} alt="" style={{
                      width: "100%", height: 58, objectFit: img!.fit ?? "cover", flexShrink: 0,
                      objectPosition: img!.frame === "browser" ? "top" : "center",
                      borderBottom: "1px solid rgba(0,0,0,.12)",
                      ...(img!.fit === "contain" ? { padding: 6, boxSizing: "border-box", background: "#fff" } : {}),
                    }} />
                  )}
                  {showLogoHeader && (
                    <div style={{
                      height: bandH, background: "transparent", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "8px 12px", boxSizing: "border-box",
                    }}>
                      <img src={b.logo} alt="" style={{
                        height: bandH - 16, width: "auto", maxWidth: "100%", objectFit: "contain", borderRadius: 4,
                      }} />
                    </div>
                  )}
                  <div style={{ padding: mobile ? "7px 4px" : "7px 9px", minWidth: 0, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                      {b.logo && !showLogoHeader && (
                        <img src={b.logo} alt="" style={{
                          height: 18, width: "auto", flexShrink: 0,
                          background: "#fff", borderRadius: 3, padding: "2px 3px", boxSizing: "content-box",
                        }} />
                      )}
                      <span style={{
                        fontSize: mobile ? 11.5 : 12.5, fontWeight: 600, lineHeight: 1.22,
                        ...(showLogoHeader && !tall ? { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } : {}),
                      }}>{b.label}</span>
                    </div>
                    {(!showLogoHeader || tall) && (
                      <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, opacity: 0.9, marginTop: 4 }}>
                        {fmtRange(b.span)}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* legend */}
        <div style={{
          display: "flex", gap: 16, flexWrap: "wrap", marginTop: 24,
          fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: T.muted,
        }}>
          {legend.map(([c, label]) => (
            <span key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: c }} />{label}
            </span>
          ))}
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 12, height: 2, background: TODAY }} />Today
          </span>
          <span style={{ opacity: 0.7 }}>· click a bar for details</span>
        </div>

        <footer style={{
          marginTop: 40, paddingTop: 22, borderTop: `1px solid ${T.hair}`,
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          fontSize: 13, color: T.muted, flexWrap: "wrap", gap: 14,
        }}>
          <a href={`mailto:${CONTACT.email}`} style={{ color: T.muted, textDecoration: "none", borderBottom: `1px solid ${T.hair}` }}>
            {CONTACT.email}
          </a>
          <div style={{ display: "flex", gap: 22 }}>
            {CONTACT.links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                style={{ color: T.fg, textDecoration: "none", borderBottom: `1px solid ${T.hair}` }}>
                {l.label}
              </a>
            ))}
          </div>
        </footer>
      </div>

      {openBar && <Detail bar={openBar} T={T} dark={dark} onClose={() => setOpenId(null)} />}

      <style>{`
        .vgt-bar { transition: filter .15s; }
        .vgt-bar:hover { filter: brightness(1.08); }
        .vgt-bar:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
        .vgt-frame-x { transition: background .15s; }
        .vgt-frame-x:hover { background: rgba(128,128,128,.22) !important; }
      `}</style>
    </div>
  );
};

export default VerticalTimeline;
