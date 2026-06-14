// ============================================================
// Git-graph timeline — data & configuration
//
// The model works like real git:
//   CATEGORIES — color families (school, work, projects, …)
//   BRANCHES   — one branch per engagement (a degree, a job, a
//                project). A branch starts at its first event,
//                and closes either via an event with
//                `merge: { from, closes: true }` (a merge commit
//                with its own card) or via `Branch.mergeInto`
//                (a compact merge row, no card). Branches that
//                never close render as ongoing (dashed).
//   EVENTS     — the commits on those branches
//   CONTACT    — header + footer info
//
// Columns in the rail are allocated like a real git graph
// renderer: a branch takes the lowest free column when it starts
// and frees it when it merges, so columns get reused.
// ============================================================

export type TimelineConfig = {
  /** "oldest-first" reads like a story (born → now). "newest-first" reads like `git log`. */
  order: "oldest-first" | "newest-first";
  /** Insert a year divider whenever the year changes. */
  yearMarkers: boolean;
  /** Fade/slide rows in as they scroll into view (auto-disabled for prefers-reduced-motion). */
  animations: boolean;
  /** Show the category/shape legend above the graph. */
  showLegend: boolean;
  /** Continue never-closed branches past their last event as a faded dashed line ("still going"). */
  ongoingDashed: boolean;
  /** Horizontal pixels per graph column in the rail. */
  laneWidth: number;
  /** Cards indent by this many px per column, echoing `git log --graph` message alignment. */
  indentPerColumn: number;
};

export const TIMELINE_CONFIG: TimelineConfig = {
  order: "newest-first",
  yearMarkers: true,
  animations: true,
  showLegend: true,
  ongoingDashed: true,
  laneWidth: 56,
  indentPerColumn: 24,
};

export type Category = {
  id: string;
  label: string;
  color: string;
};

export const CATEGORIES: Category[] = [
  { id: "main",     label: "main",     color: "oklch(0.62 0.17 145)" },
  { id: "school",   label: "school",   color: "oklch(0.65 0.17 60)"  },
  { id: "work",     label: "work",     color: "oklch(0.58 0.18 300)" },
  { id: "projects", label: "projects", color: "oklch(0.60 0.18 260)" },
  { id: "personal", label: "personal", color: "oklch(0.58 0.16 20)"  },
];

export type Branch = {
  /** Branch name, e.g. "proj/gaussian-viewer". Shown on cards and merge rows. */
  id: string;
  /** Color family. Must match a CATEGORIES id. */
  category: string;
  /** Parent branch — draws the branch-off curve at this branch's first event. Omit for main. */
  from?: string;
  /**
   * Close this branch with a compact merge row (curve back into the target,
   * no card) at the given point in time. For a merge that deserves its own
   * card, use an event with `merge: { from, closes: true }` instead.
   */
  mergeInto?: { branch: string; year: number; month: number };
};

export const BRANCHES: Branch[] = [
  { id: "main", category: "main" },

  { id: "school/bs-cs", category: "school", from: "main" },
  // closed by the "bs-degree" merge commit on main

  { id: "school/ms-cs", category: "school", from: "main" },
  // ongoing

  { id: "school/research", category: "school", from: "main" },
  // ongoing

  { id: "work/idds", category: "work", from: "main",
    mergeInto: { branch: "main", year: 2026, month: 6 } },

  { id: "work/the-standard", category: "work", from: "main" },
  // ongoing

  { id: "proj/schedule-optimizer", category: "projects", from: "main" },
  // closed by the "schedule-opt-ship" merge commit on main

  { id: "proj/gaussian-viewer", category: "projects", from: "main",
    mergeInto: { branch: "main", year: 2024, month: 12 } },

  { id: "proj/json-quiz", category: "projects", from: "main",
    mergeInto: { branch: "main", year: 2024, month: 12 } },

  { id: "personal/ref", category: "personal", from: "main" },
  // ongoing
];

export type EventImage = {
  src: string;
  caption?: string;
  /** "cover" (default) crops to fill — good for photos. "contain" letterboxes — good for logos/screenshots. */
  fit?: "cover" | "contain";
};

export type EventLink = {
  label: string;
  href: string;
};

export type Event = {
  id: string;
  /** Which branch this commit is on. Must match a BRANCHES id. */
  branch: string;
  year: number;
  month: number; // 1–12
  /** Commit-style title, e.g. "feat: schedule-optimizer". */
  title: string;
  /** Human-readable headline shown on the card and in the popup. */
  subtitle?: string;
  /** Longer description — inline expand for simple events, popup body for the rest. */
  detail?: string;
  /**
   * Node shape on the graph:
   *   "commit"    — circle (default)
   *   "milestone" — diamond, for life events
   *   "project"   — square, always opens the popup
   */
  type?: "commit" | "milestone" | "project";
  /** Free-form date range shown instead of the single month, e.g. "Apr 2025 – Jun 2026". */
  dateRange?: string;
  /** Where this happened, e.g. "Olympia, WA". */
  location?: string;
  /** Tech stack chips in the popup. */
  tech?: string[];
  /** Your role, shown in the popup. */
  role?: string;
  /** Bullet points in the popup. */
  highlights?: string[];
  /**
   * Pictures. The first one is the card thumbnail; all of them are browsable
   * in the popup gallery (arrow keys / thumbnails). Any event with images
   * opens the popup when clicked.
   */
  images?: EventImage[];
  /** Buttons in the popup footer. */
  links?: EventLink[];
  /** Small release-tag chip, e.g. "v1.0", "npm", "HEAD". */
  tag?: string;
  /** This commit merges another branch in. `closes: true` ends that branch and frees its column. */
  merge?: { from: string; closes?: boolean };
  /** Force the popup even without images / type "project". */
  modal?: boolean;
};

export type Contact = {
  name: string;
  bio: string;
  /** A few sentences under the bio line. */
  about?: string;
  email: string;
  links: { label: string; href: string }[];
};

export const EVENTS: Event[] = [
  { id: "init", branch: "main", year: 2003, month: 6,
    type: "milestone",
    title: "init",
    subtitle: "Born in Olympia, WA",
    detail: "Started here. Pacific Northwest native — grew up around the water and the trees of the south Sound.",
    location: "Olympia, WA",
    tag: "v0.1" },

  { id: "graduate-hs", branch: "main", year: 2022, month: 6,
    type: "milestone",
    title: "High school graduation",
    subtitle: "Olympia High School",
    detail: "Graduated, packed up, headed north to Bellingham.",
    location: "Olympia, WA",
    tag: "v0.5" },

  { id: "wwu-start", branch: "school/bs-cs", year: 2022, month: 9,
    title: "branch: school/bs-cs",
    subtitle: "Enrolled at WWU — BS Computer Science",
    detail: "Started at Western Washington University studying software development and algorithm design.",
    location: "Bellingham, WA" },

  { id: "ref", branch: "personal/ref", year: 2023, month: 10,
    title: "branch: personal/ref",
    subtitle: "Basketball + volleyball referee",
    detail: "Started refereeing. Pays better than you'd think; teaches you to make fast decisions under noise." },

  { id: "schedule-opt-start", branch: "proj/schedule-optimizer", year: 2024, month: 3,
    type: "project",
    title: "branch: proj/schedule-optimizer",
    subtitle: "WWU Schedule Optimizer",
    dateRange: "Mar – Nov 2024",
    detail: "A tool that helps WWU students build valid class schedules around real-world constraints like prereqs, professor preference, and time conflicts. Co-created with cwooper.",
    tech: ["React", "TypeScript", "Python"],
    role: "Co-creator, front-end",
    images: [
      { src: "/images/scheduleOpt_optimized.jpg", caption: "Schedule Optimizer — schedule view." },
    ],
    links: [
      { label: "Open schedule-optimizer", href: "https://cwooper.me/schedule-optimizer/" },
    ] },

  { id: "schedule-npm", branch: "proj/schedule-optimizer", year: 2024, month: 8,
    type: "project",
    title: "ship: schedule-glance",
    subtitle: "@konnorkooi/schedule-glance (NPM)",
    dateRange: "Jul – Sep 2024",
    detail: "Published an open-source React component for rendering weekly schedules — extracted from the schedule-optimizer work. Packaged, versioned, and documented for public reuse.",
    tech: ["React", "TypeScript", "NPM"],
    role: "Author",
    images: [
      { src: "/images/schedulenpm_optimized.jpg", caption: "schedule-glance on NPM." },
    ],
    links: [
      { label: "View on NPM", href: "https://www.npmjs.com/package/@konnorkooi/schedule-glance" },
    ],
    tag: "npm" },

  { id: "research-wehrwein", branch: "school/research", year: 2024, month: 9,
    title: "branch: school/research",
    subtitle: "Computer Vision Research — Scott Wehrwein's lab, WWU",
    dateRange: "Sep 2024 – Present",
    location: "Bellingham, WA",
    role: "Researcher",
    detail: "Ongoing computer vision research under Scott Wehrwein at WWU.",
    modal: true,
    highlights: [
      "Contributed to computer vision research, developing data processing tools for multi-timescale scene dynamics representations for analyzing long-term webcam video streams with VQ-VAE and TLGAN models",
      "Started new Computer Vision project with the Woodland Park Zoo to use their camera data to visualize animal enclosures using and comparing frameworks like MAStR (SFM), Colmap, nerf-studio, InstaSplat (Gaussian Splatting), and 3DGS",
      "Attended and discussed weekly papers covering topics such as Flow Matching, Gaussian Splatting, Diffusion models",
      "Contributed to advancing the field of Learned NN Compression techniques, focusing on stationary long-term webcam data",
    ] },

  { id: "schedule-opt-ship", branch: "main", year: 2024, month: 11,
    title: "merge: proj/schedule-optimizer → main",
    subtitle: "Shipped Schedule Optimizer to WWU students",
    detail: "Shipped the schedule optimizer publicly. Built in collaboration with cwooper.",
    links: [
      { label: "Open schedule-optimizer", href: "https://cwooper.me/schedule-optimizer/" },
    ],
    merge: { from: "proj/schedule-optimizer", closes: true },
    tag: "v1.0" },

  { id: "gaussian", branch: "proj/gaussian-viewer", year: 2024, month: 12,
    type: "project",
    title: "branch: proj/gaussian-viewer",
    subtitle: "Gaussian Viewer",
    dateRange: "Nov – Dec 2024",
    detail: "An interactive browser-based viewer for Gaussian splatting scenes. Upload a splat, explore it in 3D, tweak render settings.",
    tech: ["WebGL", "React", "Three.js"],
    role: "Solo",
    images: [
      { src: "/images/gausian-vango_optimized.jpg", caption: "Van Gogh splat in the viewer." },
    ],
    links: [
      { label: "Open gaussian-viewer", href: "https://konnorkooi.com/gaussian-viewer/" },
    ] },

  { id: "quiz-app", branch: "proj/json-quiz", year: 2024, month: 12,
    type: "project",
    title: "branch: proj/json-quiz",
    subtitle: "JSON Quiz App",
    dateRange: "Nov – Dec 2024",
    detail: "A quiz app that takes any JSON question set as input — flexible, lightweight, and easy to fork for your own study material.",
    tech: ["React", "TypeScript"],
    role: "Solo",
    images: [
      { src: "/images/quiz-app_optimized.jpg", caption: "JSON Quiz App." },
    ],
    links: [
      { label: "Open json-quiz", href: "https://konnorkooi.com/quiz-app/" },
    ] },

  { id: "idds", branch: "work/idds", year: 2025, month: 4,
    title: "branch: work/idds",
    subtitle: "Full-Stack Developer Intern — IDDS",
    dateRange: "Apr 2025 – Jun 2026",
    location: "Fremont, CA · Remote",
    role: "Full-Stack Developer Intern",
    detail: "Remote full-stack development internship with IDDS out of Fremont, CA.",
    tech: ["React", "TypeScript", "Java", "Next.js", "Cypress", "n8n", "AWS"],
    highlights: [
      "Built different AI agents using self-hosted n8n to automatically discover, scrape, and validate over 300 educational resources, streamlining content acquisition for K-12 extracurricular platform and reducing manual curation time by ~80%",
      "Contributed to complete website migration from legacy system to Next.js, improving SEO performance and speed by ~30%",
      "Developed end-to-end testing suite using Cypress to enhance application quality assurance and reduce deployment risks",
      "Implemented full-stack features including blog system, job portal, and admin panels using TypeScript and Java",
      "Contributed across the full technology stack, supporting frontend development with React/TypeScript, backend API development with Java, educational content validation systems, and AWS infrastructure management",
    ],
    images: [
      { src: "/images/qidds.jpeg", caption: "IDDS", fit: "contain" },
    ] },

  { id: "bs-degree", branch: "main", year: 2026, month: 3,
    type: "milestone",
    title: "merge: school/bs-cs → main",
    subtitle: "BS in Computer Science — WWU",
    detail: "Graduated from Western Washington University with a Bachelor of Science in Computer Science.",
    location: "Bellingham, WA",
    merge: { from: "school/bs-cs", closes: true },
    tag: "BS" },

  { id: "masters-start", branch: "school/ms-cs", year: 2026, month: 4,
    title: "branch: school/ms-cs",
    subtitle: "Started MS in Computer Science — WWU",
    detail: "Continuing at WWU for a master's in computer science.",
    location: "Bellingham, WA" },

  { id: "the-standard", branch: "work/the-standard", year: 2026, month: 6,
    title: "branch: work/the-standard",
    subtitle: "Intern — The Standard",
    dateRange: "Jun 2026 – Present",
    role: "Intern",
    detail: "Started an internship with The Standard.",
    images: [
      { src: "/images/TheStandard.png", caption: "The Standard", fit: "contain" },
    ] },

  { id: "head", branch: "main", year: 2026, month: 6,
    title: "HEAD",
    subtitle: "MS student at WWU · intern at The Standard",
    detail: "Pursuing a master's in CS at WWU while interning at The Standard. Open to collaboration.",
    tag: "HEAD" },
];

export const CONTACT: Contact = {
  name: "Konnor Kooi",
  bio: "Computer science master's student at WWU. From Olympia, WA.",
  about: "I grew up in Olympia and now live in Bellingham, working on my master's in computer science at WWU. I do computer vision research in Scott Wehrwein's lab, intern at The Standard, and like building web tools people actually use. Away from the keyboard I referee basketball and volleyball.",
  email: "konnorjkooi@gmail.com",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/konnorkooi/" },
    { label: "GitHub",   href: "https://github.com/KonnorKooi" },
    { label: "Site",     href: "https://konnorkooi.com/" },
  ],
};
