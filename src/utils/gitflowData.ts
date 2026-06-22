// ============================================================
// Timeline — data
//
//   BRANCHES — one branch per engagement (a degree, a job, a
//              project). Each event names the branch it sits on;
//              a branch's `category` drives its color family.
//   EVENTS   — the events/commits on those branches. The ones with
//              a span in scrollSections.ts get drawn as bars.
//   CONTACT  — header + footer info
// ============================================================

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

  { id: "work/qidds", category: "work", from: "main",
    mergeInto: { branch: "main", year: 2026, month: 6 } },

  { id: "work/the-standard", category: "work", from: "main" },
  // ongoing

  { id: "proj/schedule-optimizer", category: "projects", from: "main" },
  // closed by the "schedule-opt-ship" merge commit on main

  { id: "proj/gaussian-viewer", category: "projects", from: "main",
    mergeInto: { branch: "main", year: 2024, month: 12 } },

  { id: "proj/json-quiz", category: "projects", from: "main",
    mergeInto: { branch: "main", year: 2024, month: 12 } },

  { id: "proj/autonomous-drone", category: "projects", from: "main",
    mergeInto: { branch: "main", year: 2026, month: 3 } },

  { id: "proj/conflict-forecast", category: "projects", from: "main",
    mergeInto: { branch: "main", year: 2026, month: 6 } },

  { id: "personal/ref", category: "personal", from: "main" },
  // ongoing
];

export type EventImage = {
  src: string;
  caption?: string;
  /** "cover" (default) crops to fill — good for photos. "contain" letterboxes — good for logos/screenshots. */
  fit?: "cover" | "contain";
  /** Render in a fixed-height scrollable window (full width, scrolls vertically) — good for tall posters. */
  scroll?: boolean;
  /** Wrap in a faux browser window (chrome + URL bar), top-anchored — good for webpage screenshots. */
  frame?: "browser";
  /** URL/text shown in the browser chrome when frame is "browser". */
  frameLabel?: string;
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

/** One row in the Contact popup (header → "Contact" button). */
export type ContactMethod = {
  /** Row label, e.g. "Personal email". */
  label: string;
  /** Display value, e.g. "konnorjkooi@gmail.com" or "in/konnorkooi". */
  value: string;
  /** mailto: or external URL. */
  href: string;
};

export type Contact = {
  name: string;
  bio: string;
  /** A few sentences under the bio line. */
  about?: string;
  email: string;
  links: { label: string; href: string }[];
  /** Full contact list shown in the header popup. */
  contacts: ContactMethod[];
};

export const EVENTS: Event[] = [
  { id: "init", branch: "main", year: 2003, month: 6,
    type: "milestone",
    title: "init",
    subtitle: "Born in Olympia, WA",
    detail: "Started here. Pacific Northwest native.",
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
    subtitle: "Enrolled at WWU for a BS in Computer Science",
    detail: "Started at Western Washington University studying software development, algorithm design, ML and DL principles.",
    location: "Bellingham, WA" },

  { id: "ref", branch: "personal/ref", year: 2024, month: 3,
    title: "branch: personal/ref",
    subtitle: "WWU Campus Rec Referee & Supervisor",
    dateRange: "Mar 2024 – Jun 2027",
    location: "Bellingham, WA",
    role: "Intramural Referee, Supervisor & Tournament Lead",
    detail: "A long-standing role at WWU Campus Rec, officiating intramural basketball and volleyball and growing into program leadership. Worked each academic year (Sep–Jun), continuing through June 2027.",
    modal: true,
    highlights: [
      "Started as an intramural basketball & volleyball referee (Mar 2024).",
      "Staffed the WWU Rec Kids Camp over summer 2024 (Jul–Sep).",
      "Promoted to referee supervisor (Sep 2024), while continuing to officiate.",
      "Became tournament lead (Jan 2026), still in the role.",
      "Taking on volleyball lead for the 2026–27 school year, on top of supervisor and tournament lead.",
    ],
    links: [
      { label: "Campus Rec", href: "https://campusrec.wwu.edu/intramural-sports" },
      { label: "Kids Camp", href: "https://campusrec.wwu.edu/kids-camp" },
    ] },

  { id: "schedule-opt-start", branch: "proj/schedule-optimizer", year: 2024, month: 3,
    type: "project",
    title: "branch: proj/schedule-optimizer",
    subtitle: "WWU Schedule Optimizer",
    dateRange: "Feb – May 2024",
    detail: "A tool that helps WWU students build valid class schedules around real-world constraints like average GPA, optimal class times, when you are available. Co-created and now maintained fully by cwooper.",
    tech: ["React", "TypeScript", "Python"],
    role: "Co-creator, front-end",
    images: [
      { src: "/images/scheduleOpt_optimized.jpg", caption: "Schedule Optimizer, schedule view.", frame: "browser", frameLabel: "schedule-optimizer.cwooper.dev" },
    ],
    links: [
      { label: "Open schedule-optimizer", href: "https://schedule-optimizer.cwooper.dev/" },
      { label: "GitHub", href: "https://github.com/Cwooper/schedule-optimizer" },
    ] },

  // { id: "schedule-npm", branch: "proj/schedule-optimizer", year: 2024, month: 8,
  //   type: "project",
  //   title: "ship: schedule-glance",
  //   subtitle: "@konnorkooi/schedule-glance (NPM)",
  //   dateRange: "Jul – Sep 2024",
  //   detail: "Published an open-source React component for rendering weekly schedules — extracted from the schedule-optimizer work. Packaged, versioned, and documented for public reuse. Now not in use",
  //   tech: ["React", "TypeScript", "NPM"],
  //   role: "Author",
  //   images: [
  //     { src: "/images/schedulenpm_optimized.jpg", caption: "schedule-glance on NPM." },
  //   ],
  //   links: [
  //     { label: "View on NPM", href: "https://www.npmjs.com/package/@konnorkooi/schedule-glance" },
  //   ],
  //   tag: "npm" },

  { id: "research-wehrwein", branch: "school/research", year: 2024, month: 9,
    title: "branch: school/research",
    subtitle: "Computer Vision Research in Scott Wehrwein's lab, WWU",
    dateRange: "Sep 2024 – Present",
    location: "Bellingham, WA",
    role: "Researcher",
    detail: "Ongoing computer vision research under Scott Wehrwein at WWU. Interested in any of my research? Email me or message me on LinkedIn. I'm always happy to talk about it.",
    modal: true,
    highlights: [
      "Contributed to computer vision research, developing data processing tools for multi-timescale scene dynamics representations for analyzing long-term webcam video streams with VQ-VAE and TLGAN models",
      "Started new Computer Vision project with the Woodland Park Zoo to use their camera data to visualize animal enclosures using and comparing frameworks like MAStR (SFM), Colmap, nerf-studio, InstaSplat (Gaussian Splatting), and 3DGS",
      "Attended and discussed weekly papers covering topics such as Flow Matching, Gaussian Splatting, Diffusion models",
      "Contributed to advancing the field of Learned NN Compression techniques, focusing on stationary long-term webcam data",
    ],
    images: [
      { src: "/images/rhino-zoo-reconstruction_optimized.jpg", caption: "Woodland Park Zoo 3D rhino enclosure reconstruction.", fit: "cover" },
      { src: "/images/cv-research-poster_optimized.jpg", caption: "Research poster: Compressing Fixed-Camera Video with Learned Frame Prediction.", scroll: true },
    ],
    links: [
      { label: "Wehrwein Lab", href: "https://fw.cs.wwu.edu/~wehrwes/#research" },
      { label: "Email me", href: "mailto:konnorjkooi@gmail.com" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/konnorkooi/" },
    ] },

  { id: "schedule-opt-ship", branch: "main", year: 2024, month: 11,
    title: "merge: proj/schedule-optimizer → main",
    subtitle: "Shipped Schedule Optimizer to WWU students",
    detail: "Shipped the schedule optimizer publicly. Built in collaboration with cwooper.",
    links: [
      { label: "Open schedule-optimizer", href: "https://schedule-optimizer.cwooper.dev/" },
    ],
    merge: { from: "proj/schedule-optimizer", closes: true },
    tag: "v1.0" },

  { id: "gaussian", branch: "proj/gaussian-viewer", year: 2024, month: 12,
    type: "project",
    title: "branch: proj/gaussian-viewer",
    subtitle: "Gaussian Viewer",
    dateRange: "Oct – Dec 2024",
    detail: "An interactive browser-based viewer for Gaussian splatting scenes. Upload a splat, explore it in 3D, tweak render settings.",
    tech: ["WebGL", "JavaScript", "gl-matrix"],
    role: "Solo",
    images: [
      { src: "/images/gausian-vango_optimized.jpg", caption: "Van Gogh splat in the viewer.", frame: "browser", frameLabel: "konnorkooi.com/gaussian-viewer" },
    ],
    links: [
      { label: "Open gaussian-viewer", href: "https://konnorkooi.com/gaussian-viewer/" },
      { label: "GitHub", href: "https://github.com/csci480-24f/fp-eitreif_kernsc_kooik2" },
    ] },

  { id: "quiz-app", branch: "proj/json-quiz", year: 2024, month: 12,
    type: "project",
    title: "branch: proj/json-quiz",
    subtitle: "JSON Quiz App",
    dateRange: "Dec 2024 – Dec 2025",
    detail: "A quiz app that takes any JSON question set as input. It's flexible, lightweight, and easy to fork for your own study material.",
    tech: ["JavaScript", "HTML/CSS", "PHP"],
    role: "Solo",
    images: [
      { src: "/images/quiz-app_optimized.jpg", caption: "JSON Quiz App.", frame: "browser", frameLabel: "konnorkooi.com/quiz-app" },
    ],
    links: [
      { label: "Open json-quiz", href: "https://konnorkooi.com/quiz-app/" },
      { label: "GitHub", href: "https://github.com/KonnorKooi/quiz-app" },
    ] },

  { id: "qidds", branch: "work/qidds", year: 2025, month: 4,
    title: "branch: work/qidds",
    subtitle: "Full-Stack Developer Intern at QIDDS",
    dateRange: "Apr 2025 – Jun 2026",
    location: "Fremont, CA · Remote",
    role: "Full-Stack Developer Intern",
    detail: "Remote full-stack internship at QIDDS in Fremont, CA, working across the stack and building AI agents to find and validate content.",
    tech: ["React", "TypeScript", "Java", "Python", "Next.js", "Cypress", "n8n", "AWS"] },

  { id: "autonomous-drone", branch: "proj/autonomous-drone", year: 2026, month: 1,
    type: "project",
    title: "branch: proj/autonomous-drone",
    subtitle: "Autonomous Drone — Deep RL Light-Source Seeking",
    dateRange: "Jan – Mar 2026",
    location: "Bellingham, WA",
    role: "Solo",
    detail: "A reinforcement learning agent trained in simulation to seek out light sources, then deployed on a real Crazyflie drone.",
    tech: ["Python", "Webots", "Reinforcement Learning", "Computer Vision", "Crazyflie"],
    images: [
      { src: "/images/autonomous_drone_slide.png", caption: "Autonomous drone light-source seeking.", fit: "contain" },
    ] },

  { id: "conflict-forecast", branch: "proj/conflict-forecast", year: 2026, month: 4,
    type: "project",
    title: "branch: proj/conflict-forecast",
    subtitle: "Conflict Forecasting Classifier",
    dateRange: "Apr – Jun 2026",
    location: "Bellingham, WA",
    role: "Solo",
    detail: "Built a model that predicts armed conflict from public data instead of news text. It comes with a Streamlit app for predictions, SHAP feature importance, and backtests.",
    tech: ["Python", "XGBoost", "ExtraTrees", "SHAP", "Streamlit"],
    images: [
      { src: "/images/conflict_forcasting.png", caption: "Conflict Forecasting Classifier web app.", frame: "browser", frameLabel: "konnorkooi.com/conflict-forecast" },
    ],
    links: [
      { label: "Open conflict-forecast", href: "https://konnorkooi.com/conflict-forecast/" },
    ] },

  { id: "bs-degree", branch: "main", year: 2026, month: 3,
    type: "milestone",
    title: "merge: school/bs-cs → main",
    subtitle: "BS in Computer Science at WWU",
    detail: "Graduated from Western Washington University with a Bachelor of Science in Computer Science.",
    location: "Bellingham, WA",
    merge: { from: "school/bs-cs", closes: true },
    tag: "BS" },

  { id: "masters-start", branch: "school/ms-cs", year: 2026, month: 4,
    title: "branch: school/ms-cs",
    subtitle: "Started MS in Computer Science at WWU",
    detail: "Continuing at WWU for a master's in computer science.",
    location: "Bellingham, WA" },

  { id: "the-standard", branch: "work/the-standard", year: 2026, month: 6,
    title: "branch: work/the-standard",
    subtitle: "Data Science Intern at The Standard",
    dateRange: "Jun 2026 – Present",
    role: "Data Science Intern, AI Delivery team",
    detail: "Data Science Intern on the AI Delivery team, supporting the development and evaluation of AI-powered workflow products. Partners with data scientists, ML engineers, and product owners across model development, experimentation, and data analysis.",
    tech: ["Python", "pandas", "scikit-learn", "SQL", "Git"] },

  { id: "head", branch: "main", year: 2026, month: 6,
    title: "HEAD",
    subtitle: "MS student at WWU · intern at The Standard",
    detail: "Pursuing a master's in CS at WWU while interning at The Standard. Open to collaboration.",
    tag: "HEAD" },
];

export const CONTACT: Contact = {
  name: "Konnor Kooi",
  bio: "Computer science master's student at WWU. From Olympia, WA.",
  about: "Hi, I'm Konnor Kooi, a Computer Science student at Western Washington University focused on software development and computer vision research. I work under Dr. Scott Wehrwein on video compression research, and I'm gaining industry experience as a Full-stack Developer Intern at Qidds and on the AI Delivery team at The Standard. Feel free to connect if you're interested in software development or research.",
  email: "konnorjkooi@gmail.com",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/konnorkooi/" },
    { label: "GitHub",   href: "https://github.com/KonnorKooi" },
  ],
  contacts: [
    { label: "Personal email", value: "konnorjkooi@gmail.com", href: "mailto:konnorjkooi@gmail.com" },
    { label: "School email",   value: "kooik2@wwu.edu",        href: "mailto:kooik2@wwu.edu" },
    { label: "LinkedIn",       value: "in/konnorkooi",         href: "https://www.linkedin.com/in/konnorkooi/" },
    { label: "GitHub",         value: "KonnorKooi",            href: "https://github.com/KonnorKooi" },
    // { label: "Resume",      value: "Download PDF",          href: "/Konnor_Kooi_Resume.pdf" },
  ],
};
