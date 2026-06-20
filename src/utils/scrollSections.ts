// ============================================================
// Timeline duration spans
//
// A bar is drawn for any event id with a span here, positioned on a
// shared time axis (built in VerticalTimeline) so durations and overlap
// are comparable across bars. `end` omitted = ongoing (runs to now).
// Point-in-time milestones get no span.
// ============================================================

export type YM = [number, number]; // [year, month] 1-12
export type Span = { start: YM; end?: YM };

export const SPANS: Record<string, Span> = {
  "wwu-start":          { start: [2022, 9], end: [2026, 3] },
  "ref":                { start: [2024, 3], end: [2027, 6] },   // WWU Campus Rec
  "schedule-opt-start": { start: [2024, 2], end: [2024, 5] },
  "research-wehrwein":  { start: [2024, 9], end: [2027, 6] },  // through MS graduation
  "gaussian":           { start: [2024, 10], end: [2024, 12] },
  "quiz-app":           { start: [2024, 12], end: [2025, 12] },
  "autonomous-drone":   { start: [2026, 1], end: [2026, 3] },
  "conflict-forecast":  { start: [2026, 4], end: [2026, 6] },
  "qidds":              { start: [2025, 4], end: [2026, 6] },
  "masters-start":      { start: [2026, 4], end: [2027, 6] },  // MS graduation
  "the-standard":       { start: [2026, 6], end: [2026, 9] },  // internship end
};

const _now = new Date();
export const NOW: YM = [_now.getFullYear(), _now.getMonth() + 1];
