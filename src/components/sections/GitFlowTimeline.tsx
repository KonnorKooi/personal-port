import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useTheme } from "../ThemeProvider";
import {
  BRANCHES, CATEGORIES, EVENTS, CONTACT, TIMELINE_CONFIG,
  Branch, Event,
} from "../../utils/gitflowData";

// Vertical geometry of the rail: each event row places its node NODE_Y px
// from the row's top edge; branch/merge curves live in the top CURVE_H px.
const NODE_Y = 26;
const CURVE_H = 52;
const MERGE_ROW_H = 44;
const MERGE_NODE_Y = 22;
const RAIL_PAD = 10;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Tokens = {
  bg: string; fg: string; muted: string; dim: string; hair: string;
  laneBg: string; cardBg: string; cardBorder: string; tagBg: string;
};

type RowDef =
  | { kind: "event"; e: Event }
  | { kind: "year"; year: number }
  | { kind: "merge"; b: Branch; year: number; month: number };

type BranchBounds = { startIdx: number; lastIdx: number; closeIdx: number | null };
// "tail" continues a just-merged branch's line from the end of the merge
// curve (which only spans the row's top CURVE_H px) down to the row bottom.
type Seg = "solid" | "dashed" | "tail" | null;

const cfg = TIMELINE_CONFIG;
const newestFirst = cfg.order === "newest-first";

const categoryColor: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.color]));
const branchById: Record<string, Branch> = Object.fromEntries(BRANCHES.map((b) => [b.id, b]));
const branchColor = (branchId: string) => categoryColor[branchById[branchId].category];

const hasModal = (e: Event) =>
  e.modal === true || e.type === "project" || (e.images?.length ?? 0) > 0;

const fmtMonth = (y: number, m: number) => `${MONTHS[m - 1]} ${y}`;
const fmtDate = (e: Event) => e.dateRange || fmtMonth(e.year, e.month);

// ---- static graph layout (data never changes at runtime) ----
// Chronological sort: within a month, commits come first, then compact
// merge rows, then HEAD — so a branch never closes before its work exists.
const keyOf = (r: RowDef) => {
  if (r.kind === "year") return 0; // year rows are inserted later
  const t = r.kind === "event" ? r.e.year * 12 + r.e.month : r.year * 12 + r.month;
  const sub = r.kind === "merge" ? 2 : r.kind === "event" && r.e.id === "head" ? 3 : 1;
  return t * 4 + sub;
};

const chrono: RowDef[] = [
  ...EVENTS.map((e): RowDef => ({ kind: "event", e })),
  ...BRANCHES.filter((b) => b.mergeInto).map(
    (b): RowDef => ({ kind: "merge", b, year: b.mergeInto!.year, month: b.mergeInto!.month })
  ),
].sort((a, b) => keyOf(a) - keyOf(b));

// Column allocation, the way git graph renderers do it: a branch takes the
// lowest free column when it starts and releases it when it merges closed.
const colOf: Record<string, number> = { main: 0 };
{
  let nextCol = 1;
  const freeCols: number[] = [];
  const alloc = () => (freeCols.length ? freeCols.shift()! : nextCol++);
  const release = (c: number) => { freeCols.push(c); freeCols.sort((a, b) => a - b); };
  for (const row of chrono) {
    if (row.kind === "event") {
      if (colOf[row.e.branch] === undefined) colOf[row.e.branch] = alloc();
      if (row.e.merge?.closes) release(colOf[row.e.merge.from]);
    } else if (row.kind === "merge") {
      release(colOf[row.b.id]);
    }
  }
}
const MAX_COLS = Math.max(...Object.values(colOf)) + 1;

// Geometry comes in two flavors so the graph compresses on phones instead
// of pushing the cards off screen.
type Geom = {
  railW: number; indentPer: number;
  commitR: number; headR: number; projectS: number; diamondR: number; mergeDotR: number;
  colX: (col: number) => number; xOf: (branchId: string) => number;
};
const makeGeom = (compact: boolean): Geom => {
  const colW = compact ? 20 : cfg.laneWidth;
  const pad = compact ? 6 : RAIL_PAD;
  const colX = (col: number) => pad + col * colW + colW / 2;
  return {
    railW: pad * 2 + MAX_COLS * colW,
    indentPer: compact ? 0 : cfg.indentPerColumn,
    commitR: compact ? 5 : 6.5,
    headR: compact ? 6.5 : 8,
    projectS: compact ? 12 : 16,
    diamondR: compact ? 6 : 8,
    mergeDotR: compact ? 3.5 : 4.5,
    colX,
    xOf: (branchId: string) => colX(colOf[branchId]),
  };
};
const GEOMS = { desktop: makeGeom(false), compact: makeGeom(true) };

const useCompact = () => {
  // Default to the compact layout so the static export's first paint (and any
  // no-JS / slow-hydration visitor) gets the narrow rail that fits a phone,
  // rather than the 356px desktop rail that shoves cards off a 390px screen.
  // Wide screens correct to desktop geometry once this effect runs.
  const [compact, setCompact] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return compact;
};

const display = newestFirst ? [...chrono].reverse() : chrono;
const rows: RowDef[] = [];
{
  let lastYear: number | null = null;
  for (const r of display) {
    const y = r.kind === "event" ? r.e.year : r.kind === "merge" ? r.year : null;
    if (cfg.yearMarkers && y !== null && y !== lastYear) {
      rows.push({ kind: "year", year: y });
      lastYear = y;
    }
    rows.push(r);
  }
}

const bounds: Record<string, BranchBounds> = {};
rows.forEach((row, i) => {
  if (row.kind !== "event") return;
  const b = row.e.branch;
  if (!bounds[b]) bounds[b] = { startIdx: i, lastIdx: i, closeIdx: null };
  if (newestFirst) bounds[b].startIdx = i;
  else bounds[b].lastIdx = i;
});
rows.forEach((row, i) => {
  if (row.kind === "event" && row.e.merge?.closes) bounds[row.e.merge.from].closeIdx = i;
  if (row.kind === "merge") bounds[row.b.id].closeIdx = i;
});

// r strictly after s in time, in display-row indices
const after = (r: number, s: number) => (newestFirst ? r < s : r > s);
const before = (r: number, s: number) => after(s, r);

const segmentsFor = (rowIdx: number, bb: BranchBounds | undefined): { past: Seg; future: Seg } => {
  if (!bb) return { past: null, future: null };
  const { startIdx, lastIdx, closeIdx } = bb;
  // At the row where the branch merges closed, the curve replaces the line —
  // but in newest-first order the row continues below the curve toward the
  // branch's earlier commits, so a tail segment must bridge that stretch.
  if (closeIdx !== null && rowIdx === closeIdx) {
    return { past: newestFirst ? "tail" : null, future: null };
  }
  const open = closeIdx === null || before(rowIdx, closeIdx);
  // Past a branch's newest commit: solid if it's heading into a merge,
  // dashed ("still going") if the branch never closes.
  const style = (pastLast: boolean): Seg => {
    if (!pastLast || closeIdx !== null) return "solid";
    return cfg.ongoingDashed ? "dashed" : null;
  };
  const past: Seg = open && after(rowIdx, startIdx) ? style(after(rowIdx, lastIdx)) : null;
  const future: Seg = open && (rowIdx === startIdx || after(rowIdx, startIdx))
    ? style(rowIdx === lastIdx || after(rowIdx, lastIdx))
    : null;
  return { past, future };
};

const curvePath = (fromX: number, toX: number, nodeY: number) => {
  const edge = newestFirst ? nodeY * 2 : 0;
  const mid = (edge + nodeY) / 2;
  return `M ${fromX} ${edge} C ${fromX} ${mid}, ${toX} ${mid}, ${toX} ${nodeY}`;
};

// ---- components ----

const RailLines: React.FC<{ rowIdx: number; nodeY: number; g: Geom }> = ({ rowIdx, nodeY, g }) => (
  <>
    {BRANCHES.map((b) => {
      if (colOf[b.id] === undefined) return null;
      const { past, future } = segmentsFor(rowIdx, bounds[b.id]);
      const top = newestFirst ? future : past;
      const bottom = newestFirst ? past : future;
      const x = g.xOf(b.id);
      const color = categoryColor[b.category];
      const line = (seg: Seg, pos: "top" | "bottom"): React.CSSProperties => ({
        position: "absolute",
        left: x - 1,
        width: 2,
        ...(seg === "tail"
          ? { top: nodeY * 2, bottom: 0 }
          : pos === "top" ? { top: 0, height: nodeY } : { top: nodeY, bottom: 0 }),
        ...(seg === "dashed"
          ? { background: `repeating-linear-gradient(180deg, ${color} 0 4px, transparent 4px 9px)`, opacity: 0.45 }
          : { background: color }),
      });
      return (
        <React.Fragment key={b.id}>
          {top && <div style={line(top, "top")} />}
          {bottom && <div style={line(bottom, "bottom")} />}
        </React.Fragment>
      );
    })}
  </>
);

const Node: React.FC<{ e: Event; T: Tokens; g: Geom }> = ({ e, T, g }) => {
  const x = g.xOf(e.branch);
  const c = branchColor(e.branch);
  if (e.type === "project") {
    const s = g.projectS;
    return (
      <g>
        <rect x={x - s / 2} y={NODE_Y - s / 2} width={s} height={s} rx={3}
          fill={T.bg} stroke={c} strokeWidth={2.5} />
        <rect x={x - s / 2 + 4} y={NODE_Y - s / 2 + 4} width={s - 8} height={s - 8} rx={1}
          fill={c} opacity={0.25} />
      </g>
    );
  }
  if (e.type === "milestone") {
    const d = g.diamondR;
    return (
      <path d={`M ${x} ${NODE_Y - d} L ${x + d} ${NODE_Y} L ${x} ${NODE_Y + d} L ${x - d} ${NODE_Y} Z`}
        fill={T.bg} stroke={c} strokeWidth={2.5} strokeLinejoin="round" />
    );
  }
  const isHead = e.id === "head";
  return (
    <g>
      <circle cx={x} cy={NODE_Y} r={isHead ? g.headR : g.commitR} fill={T.bg} stroke={c} strokeWidth={2.5} />
      {isHead && <circle cx={x} cy={NODE_Y} r={3} fill={c} />}
    </g>
  );
};

const YearRow: React.FC<{ year: number; rowIdx: number; T: Tokens; g: Geom }> = ({ year, rowIdx, T, g }) => (
  <div style={{ display: "flex", minHeight: 56 }}>
    <div style={{ width: g.railW, position: "relative", flexShrink: 0 }}>
      <RailLines rowIdx={rowIdx} nodeY={NODE_Y} g={g} />
    </div>
    <div style={{
      flex: 1, display: "flex", alignItems: "center", gap: 14,
      fontFamily: '"IBM Plex Mono", monospace', fontSize: 12,
      color: T.muted, letterSpacing: 1.5, paddingLeft: 8,
    }}>
      {year}
      <div style={{ flex: 1, height: 1, background: T.hair }} />
    </div>
  </div>
);

const MergeRow: React.FC<{ b: Branch; year: number; month: number; rowIdx: number; T: Tokens; g: Geom; compact: boolean }> =
  ({ b, year, month, rowIdx, T, g, compact }) => {
    const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "0px 0px -40px 0px" });
    const target = b.mergeInto!.branch;
    const c = categoryColor[b.category];
    const xFrom = g.xOf(b.id);
    const xTo = g.xOf(target);
    return (
      <div ref={ref} className={`gft-row${!cfg.animations || inView ? " gft-in" : ""}`}
        style={{ display: "flex", minHeight: MERGE_ROW_H }}>
        <div style={{ width: g.railW, position: "relative", flexShrink: 0 }}>
          <RailLines rowIdx={rowIdx} nodeY={MERGE_NODE_Y} g={g} />
          <svg width={g.railW} height={MERGE_NODE_Y * 2}
            style={{ position: "absolute", top: 0, left: 0, overflow: "visible", pointerEvents: "none" }}>
            <path d={curvePath(xFrom, xTo, MERGE_NODE_Y)} fill="none"
              stroke={c} strokeWidth={2} strokeLinecap="round" />
            <circle cx={xTo} cy={MERGE_NODE_Y} r={g.mergeDotR} fill={T.bg} stroke={c} strokeWidth={2} />
          </svg>
        </div>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 10,
          fontFamily: '"IBM Plex Mono", monospace', fontSize: compact ? 10.5 : 11.5,
          paddingLeft: 8, color: c, whiteSpace: "nowrap", overflow: "hidden",
        }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            merge: {compact ? b.id.split("/").pop() : b.id} → {target}
          </span>
          <span style={{ color: T.muted }}>· {fmtMonth(year, month)}</span>
        </div>
      </div>
    );
  };

const EventRow: React.FC<{
  e: Event; rowIdx: number; T: Tokens; g: Geom; compact: boolean;
  expanded: boolean; onClick: () => void;
}> = ({ e, rowIdx, T, g, compact, expanded, onClick }) => {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "0px 0px -60px 0px" });
  const c = branchColor(e.branch);
  const modal = hasModal(e);
  const imgCount = e.images?.length ?? 0;
  const col = colOf[e.branch];
  const indent = col * g.indentPer;
  const nodeX = g.colX(col);
  const nodeGap = compact ? 9 : 12;
  // The mono commit-title line under the headline is noise when it just
  // restates the branch (the meta line already shows it) or the tag chip.
  const titleRedundant = e.title === `branch: ${e.branch}` || e.title === e.tag;
  const headline = e.subtitle || e.title;
  return (
    <div ref={ref} className={`gft-row${!cfg.animations || inView ? " gft-in" : ""}`}
      style={{ display: "flex", position: "relative" }}>
      {/* connector from node to card */}
      <div style={{
        position: "absolute", top: NODE_Y, left: nodeX + nodeGap,
        width: g.railW - nodeX - nodeGap + indent + 2, height: 1,
        background: c, opacity: 0.22, pointerEvents: "none",
      }} />
      <div style={{ width: g.railW, position: "relative", flexShrink: 0 }}>
        <RailLines rowIdx={rowIdx} nodeY={NODE_Y} g={g} />
        <svg width={g.railW} height={CURVE_H}
          style={{ position: "absolute", top: 0, left: 0, overflow: "visible", pointerEvents: "none" }}>
          {rowIdx === bounds[e.branch].startIdx && branchById[e.branch].from && (
            <path d={curvePath(g.xOf(branchById[e.branch].from!), nodeX, NODE_Y)} fill="none"
              stroke={c} strokeWidth={2} strokeLinecap="round" />
          )}
          {e.merge && (
            <path d={curvePath(g.xOf(e.merge.from), nodeX, NODE_Y)} fill="none"
              stroke={branchColor(e.merge.from)} strokeWidth={2} strokeLinecap="round" opacity={0.85} />
          )}
          <Node e={e} T={T} g={g} />
        </svg>
      </div>

      <div className="gft-card" onClick={onClick}
        role="button" tabIndex={0}
        aria-haspopup={modal ? "dialog" : undefined}
        aria-expanded={!modal && e.detail ? expanded : undefined}
        aria-label={`${headline}${modal ? " — open details" : e.detail ? " — expand details" : ""}`}
        onKeyDown={(ev) => {
          if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); onClick(); }
        }}
        style={{
          flex: 1, minWidth: 0, cursor: "pointer",
          padding: `10px 14px 26px ${8 + indent}px`, borderRadius: 6,
          ["--gft-hover" as string]: T.laneBg,
        }}>
        <div style={{
          fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
          letterSpacing: 0.4, color: T.muted, marginBottom: 4,
        }}>
          <span style={{ color: c }}>{e.branch}</span>
          {" · "}{fmtDate(e)}
          {e.location && <span> · {e.location}</span>}
        </div>

        <h3 style={{
          margin: 0, fontSize: compact ? 15.5 : 16.5, fontWeight: 500,
          letterSpacing: -0.2, lineHeight: 1.3,
        }}>
          {headline}
          {e.tag && (
            <span style={{
              marginLeft: 10, fontSize: 10.5,
              fontFamily: '"IBM Plex Mono", monospace',
              padding: "2px 7px", borderRadius: 3,
              border: `1px solid ${c}`, color: c,
              verticalAlign: 2, whiteSpace: "nowrap",
            }}>{e.tag}</span>
          )}
        </h3>

        {e.subtitle && !titleRedundant && (
          <div style={{
            fontFamily: '"IBM Plex Mono", monospace', fontSize: 11.5,
            color: c, opacity: 0.85, marginTop: 3,
          }}>
            {e.title}
          </div>
        )}

        {imgCount > 0 && (
          <div style={{ position: "relative", width: compact ? "100%" : "fit-content", maxWidth: compact ? 300 : undefined, marginTop: 12 }}>
            <img src={e.images![0].src} alt={e.images![0].caption || e.subtitle || e.title}
              loading="lazy"
              style={{
                display: "block", width: compact ? "100%" : 220, height: 120,
                objectFit: e.images![0].fit ?? "cover",
                background: T.laneBg,
                ...(e.images![0].fit === "contain" ? { padding: 10, boxSizing: "border-box" } : {}),
                borderRadius: 4, border: `1px solid ${T.cardBorder}`,
              }} />
            {imgCount > 1 && (
              <span style={{
                position: "absolute", bottom: 6, right: 6,
                fontFamily: '"IBM Plex Mono", monospace', fontSize: 10,
                padding: "2px 6px", borderRadius: 3,
                background: "rgba(0,0,0,.55)", color: "#fff",
              }}>+{imgCount - 1}</span>
            )}
          </div>
        )}

        {modal ? (
          <div className={`gft-open-hint${compact ? " gft-open-hint-static" : ""}`} style={{
            marginTop: 10, fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 11, color: c,
          }}>
            open →
          </div>
        ) : (
          expanded && e.detail && (
            <div style={{
              marginTop: 10, padding: "12px 14px",
              background: T.laneBg, borderLeft: `2px solid ${c}`,
              fontSize: 13.5, lineHeight: 1.55, color: T.fg, opacity: 0.85,
              maxWidth: 560,
            }}>
              {e.detail}
              {e.links?.map((l) => (
                <div key={l.href} style={{ marginTop: 8 }}>
                  <a href={l.href} target="_blank" rel="noreferrer"
                    onClick={(ev) => ev.stopPropagation()}
                    style={{ color: c, textDecoration: "none", borderBottom: `1px solid ${c}` }}>
                    {l.label} →
                  </a>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

const Modal: React.FC<{
  e: Event; T: Tokens; dark: boolean; compact: boolean;
  imgIdx: number; setImgIdx: (i: number) => void; onClose: () => void;
}> = ({ e, T, dark, compact, imgIdx, setImgIdx, onClose }) => {
  const c = branchColor(e.branch);
  const imgs = e.images ?? [];
  const img = imgs[imgIdx];
  const padX = compact ? 20 : 32;
  const dialogRef = useRef<HTMLDivElement>(null);

  // Move focus into the popup on open and restore it to the trigger on close,
  // so keyboard and screen-reader users aren't left behind the dialog.
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => prevFocus?.focus?.();
  }, []);

  return (
    <div onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: dark ? "rgba(0,0,0,0.7)" : "rgba(20,18,14,0.35)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: compact ? 12 : 24,
        animation: "gftFadeIn .18s ease-out",
      }}>
      <div ref={dialogRef} onClick={(ev) => ev.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={e.subtitle || e.title} tabIndex={-1}
        style={{
          background: T.cardBg, color: T.fg,
          width: "min(720px, 100%)", maxHeight: "88vh", overflow: "auto",
          borderRadius: 6, border: `1px solid ${T.cardBorder}`,
          boxShadow: "0 24px 80px rgba(0,0,0,.25), 0 4px 14px rgba(0,0,0,.08)",
          animation: "gftRiseIn .22s ease-out",
        }}>
        <div style={{
          background: T.laneBg, borderBottom: `1px solid ${T.cardBorder}`,
          position: "relative",
        }}>
          {img ? (
            <img src={img.src} alt={img.caption || e.subtitle || e.title}
              style={{
                width: "100%",
                height: img.fit === "contain" ? (compact ? 170 : 220) : (compact ? 200 : 300),
                objectFit: img.fit ?? "cover", display: "block",
                ...(img.fit === "contain" ? { padding: compact ? 16 : 28, boxSizing: "border-box" } : {}),
              }} />
          ) : (
            <div style={{
              height: 160,
              background: `repeating-linear-gradient(45deg, transparent 0 10px, ${T.hair} 10px 11px)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, color: T.muted,
              letterSpacing: 1, textTransform: "uppercase",
            }}>
              no image yet
            </div>
          )}
          {imgs.length > 1 && (
            <>
              {(["prev", "next"] as const).map((dir) => (
                <button key={dir}
                  aria-label={dir === "prev" ? "Previous image" : "Next image"}
                  onClick={() => setImgIdx((imgIdx + (dir === "prev" ? imgs.length - 1 : 1)) % imgs.length)}
                  style={{
                    position: "absolute", top: "50%", transform: "translateY(-50%)",
                    [dir === "prev" ? "left" : "right"]: 12,
                    width: 32, height: 32, borderRadius: 16,
                    border: "none", cursor: "pointer",
                    background: T.cardBg, color: T.fg, fontSize: 15, lineHeight: 1,
                    boxShadow: "0 2px 8px rgba(0,0,0,.12)",
                  }}>{dir === "prev" ? "‹" : "›"}</button>
              ))}
              <span style={{
                position: "absolute", bottom: 10, right: 12,
                fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
                padding: "2px 8px", borderRadius: 3,
                background: "rgba(0,0,0,.55)", color: "#fff",
              }}>{imgIdx + 1} / {imgs.length}</span>
            </>
          )}
          <button onClick={onClose} aria-label="Close"
            style={{
              position: "absolute", top: 12, right: 12,
              width: 32, height: 32, borderRadius: 16,
              border: "none", cursor: "pointer",
              background: T.cardBg, color: T.fg, fontSize: 18, lineHeight: 1,
              boxShadow: "0 2px 8px rgba(0,0,0,.12)",
            }}>×</button>
        </div>

        {img?.caption && (
          <div style={{
            padding: `10px ${padX}px 0`, fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 11.5, color: T.muted,
          }}>{img.caption}</div>
        )}

        {imgs.length > 1 && (
          <div style={{ display: "flex", gap: 8, padding: `12px ${padX}px 0`, flexWrap: "wrap" }}>
            {imgs.map((im, i) => (
              <img key={im.src} src={im.src} alt=""
                onClick={() => setImgIdx(i)}
                style={{
                  width: 56, height: 40, objectFit: im.fit ?? "cover", borderRadius: 3,
                  background: T.laneBg,
                  cursor: "pointer",
                  border: i === imgIdx ? `2px solid ${c}` : `1px solid ${T.cardBorder}`,
                  opacity: i === imgIdx ? 1 : 0.65,
                }} />
            ))}
          </div>
        )}

        <div style={{ padding: compact ? "18px 20px 26px" : "22px 32px 32px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
            fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
            color: c, letterSpacing: 1, textTransform: "uppercase",
            marginBottom: 10,
          }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: c }} />
            {e.branch} · {fmtDate(e)}
            {e.location && <span style={{ color: T.muted }}>· {e.location}</span>}
            {e.tag && <span style={{
              marginLeft: 4, padding: "2px 7px", borderRadius: 3,
              border: `1px solid ${c}`, textTransform: "none", letterSpacing: 0.3,
            }}>{e.tag}</span>}
          </div>

          <h2 style={{
            fontSize: compact ? 21 : 26, fontWeight: 500, letterSpacing: -0.5,
            margin: "0 0 10px", lineHeight: 1.15,
          }}>{e.subtitle || e.title}</h2>

          {e.detail && (
            <p style={{
              fontSize: 15, lineHeight: 1.6, color: T.fg, opacity: 0.82,
              margin: "0 0 20px", textWrap: "pretty" as const,
            }}>{e.detail}</p>
          )}

          {e.highlights && e.highlights.length > 0 && (
            <ul style={{
              margin: "0 0 20px", paddingLeft: 18, listStyle: "disc",
              fontSize: 14, lineHeight: 1.7, color: T.fg, opacity: 0.85,
            }}>
              {e.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          )}

          {(e.tech || e.role) && (
            <div style={{
              display: "grid", gridTemplateColumns: "auto 1fr",
              gap: "10px 18px", marginBottom: 22, fontSize: 13,
            }}>
              {e.role && (<>
                <div style={{ color: T.muted, fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", paddingTop: 2 }}>role</div>
                <div>{e.role}</div>
              </>)}
              {e.tech && (<>
                <div style={{ color: T.muted, fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", paddingTop: 2 }}>stack</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {e.tech.map((t) => (
                    <span key={t} style={{
                      fontSize: 12, padding: "3px 9px", borderRadius: 999,
                      border: `1px solid ${T.hair}`, color: T.fg,
                    }}>{t}</span>
                  ))}
                </div>
              </>)}
            </div>
          )}

          {e.links && e.links.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {e.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "10px 16px", borderRadius: 4,
                    background: c, color: dark ? "#0f0e0c" : "#FAFAF7",
                    textDecoration: "none", fontWeight: 500, fontSize: 14,
                  }}>
                  {l.label}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9L9 3M5 3h4v4" strokeLinecap="round" /></svg>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GitFlowTimeline: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const compact = useCompact();
  const g = compact ? GEOMS.compact : GEOMS.desktop;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ id: string; img: number } | null>(null);

  const T: Tokens = dark ? {
    bg: "#0f0e0c", fg: "#f0ede4", muted: "#8a877f", dim: "#6a675c",
    hair: "#2a2822", laneBg: "#151310", cardBg: "#1a1815",
    cardBorder: "#2a2822", tagBg: "#1a1815",
  } : {
    bg: "#FAFAF7", fg: "#1A1A1A", muted: "#6e6b62", dim: "#b8b5a8",
    hair: "#E5E2D8", laneBg: "#F3F1EA", cardBg: "#FFFFFF",
    cardBorder: "#E5E2D8", tagBg: "#FFFFFF",
  };

  // Keyboard: Escape closes the popup, arrows page through its gallery
  useEffect(() => {
    if (!modal) return;
    const e = EVENTS.find((x) => x.id === modal.id);
    const n = e?.images?.length ?? 0;
    const k = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setModal(null);
      else if (n > 1 && ev.key === "ArrowRight") setModal({ id: modal.id, img: (modal.img + 1) % n });
      else if (n > 1 && ev.key === "ArrowLeft") setModal({ id: modal.id, img: (modal.img + n - 1) % n });
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [modal]);

  // Lock background scroll while the popup is open.
  useEffect(() => {
    if (!modal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [modal]);

  const onEventClick = (e: Event) => {
    if (hasModal(e)) setModal({ id: e.id, img: 0 });
    else setExpandedId(expandedId === e.id ? null : e.id);
  };

  const modalEvent = modal ? EVENTS.find((x) => x.id === modal.id) : null;

  return (
    <div style={{
      fontFamily: '"Work Sans", -apple-system, sans-serif',
      background: T.bg, color: T.fg,
      minHeight: "100vh",
      padding: compact ? "36px 12px 56px" : "56px 24px 80px",
      boxSizing: "border-box",
      transition: "background .2s, color .2s",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ marginBottom: compact ? 28 : 40, maxWidth: 640 }}>
          <div style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase",
            color: T.muted, marginBottom: 14,
          }}>
            $ git log --graph --all
          </div>
          <h1 style={{ fontSize: compact ? 32 : 44, fontWeight: 500, letterSpacing: -1.1, margin: "0 0 12px", lineHeight: 1.05 }}>
            {CONTACT.name}
          </h1>
          <p style={{ fontSize: compact ? 15 : 17, color: T.fg, opacity: 0.75, margin: 0, lineHeight: 1.5, textWrap: "pretty" as const }}>
            {CONTACT.bio}
          </p>
          {CONTACT.about && (
            <p style={{
              fontSize: compact ? 13.5 : 15, color: T.fg, opacity: 0.6,
              margin: "10px 0 0", lineHeight: 1.6, textWrap: "pretty" as const,
            }}>
              {CONTACT.about}
            </p>
          )}
        </header>

        {cfg.showLegend && (
          <div style={{
            display: "flex", alignItems: "center", gap: compact ? 12 : 18, flexWrap: "wrap",
            marginBottom: 12, paddingBottom: 16,
            borderBottom: `1px solid ${T.hair}`,
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: compact ? 10.5 : 11, letterSpacing: 0.3, color: T.muted,
          }}>
            {CATEGORIES.map((cat) => (
              <span key={cat.id} style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                <span style={{ width: 10, height: 2, background: cat.color, display: "inline-block" }} />
                {cat.label}
              </span>
            ))}
            <span style={{ width: 1, height: 14, background: T.hair }} />
            <span style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
              commit
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1L11 6L6 11L1 6Z" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
              milestone
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="2" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
              project
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              <svg width="14" height="12" viewBox="0 0 14 12"><line x1="1" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2.5" /></svg>
              ongoing
            </span>
            <span style={{ marginLeft: "auto", whiteSpace: "nowrap" }}>click a commit for more</span>
          </div>
        )}

        <div>
          {rows.map((row, i) => {
            if (row.kind === "year") {
              return <YearRow key={`y-${row.year}-${i}`} year={row.year} rowIdx={i} T={T} g={g} />;
            }
            if (row.kind === "merge") {
              return <MergeRow key={`m-${row.b.id}`} b={row.b} year={row.year} month={row.month} rowIdx={i} T={T} g={g} compact={compact} />;
            }
            return (
              <EventRow key={row.e.id} e={row.e} rowIdx={i} T={T} g={g} compact={compact}
                expanded={expandedId === row.e.id}
                onClick={() => onEventClick(row.e)} />
            );
          })}
        </div>

        <footer style={{
          marginTop: 56, paddingTop: 24, borderTop: `1px solid ${T.hair}`,
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          fontSize: 13, color: T.muted, flexWrap: "wrap", gap: 14,
        }}>
          <div>
            <a href={`mailto:${CONTACT.email}`}
              style={{ color: T.muted, textDecoration: "none", borderBottom: `1px solid ${T.hair}` }}>
              {CONTACT.email}
            </a>
          </div>
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

      {modalEvent && modal && (
        <Modal e={modalEvent} T={T} dark={dark} compact={compact}
          imgIdx={modal.img}
          setImgIdx={(i) => setModal({ id: modal.id, img: i })}
          onClose={() => setModal(null)} />
      )}

      <style>{`
        @keyframes gftFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes gftRiseIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
        /* Scoped to .js so no-JS visitors (and the static export at first
           paint, before hydration) see the rows instead of a blank rail. */
        .js .gft-row { opacity: 0; transform: translateY(16px); transition: opacity .55s ease, transform .55s ease; }
        .js .gft-row.gft-in { opacity: 1; transform: none; }
        .gft-card { transition: background .15s; }
        .gft-card:hover { background: var(--gft-hover); }
        .gft-card:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
        .gft-open-hint { opacity: 0; transition: opacity .15s; }
        .gft-card:hover .gft-open-hint { opacity: 1; }
        /* Touch devices have no hover, so keep the affordance visible in compact. */
        .gft-open-hint-static { opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          .js .gft-row { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
    </div>
  );
};

export default GitFlowTimeline;
