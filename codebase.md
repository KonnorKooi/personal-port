# tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

# tailwind.config.ts

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './appspages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      height: {
        '128': '32rem',
      },
      colors: {
        black: '#000000',
        graywhite: '#F7F9FB',
      },
      transitionProperty: {
        'transform': 'transform',
      },
      transitionDuration: {
        '1000': '1000ms',
      },
      transitionTimingFunction: {
        'ease-out': 'ease-out',
      },
    },
  },
};

export default config;
```

# postcss.config.mjs

```mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;

```

# package.json

```json
{
  "name": "Personal-Portfolio",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "autoprefixer": "^10.4.19",
    "lucide-react": "^0.394.0",
    "next": "^14.2.5",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20.14.15",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "eslint": "^8",
    "eslint-config-next": "14.2.4",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5"
  }
}

```

# next.config.mjs

```mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.icons8.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;

```

# next-env.d.ts

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

```

# components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

# README.md

```md
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

```

# .gitignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

./vscode
```

# .eslintrc.json

```json
{
    "extends": "next/core-web-vitals"
  }

```

# .aidigestignore

```
/.next/_
/node_modules/_
/public/\*

```

# src/utils/constants.ts

```ts
export const largeProjects = [
    {
      title: "Konnor Kooi",
      imageUrl: "/images/wwubg.png",
      buttonText: "Learn More",
      link: "https://example.com/large-project2",
    },
    {
      title: "Computer Science",
      imageUrl: "/images/Taylor+dock.png",
      buttonText: "Learn More",
      link: "https://example.com/large-project1",
    },
    {
      title: "WWU",
      imageUrl: "/images/wwutrees.png",
      buttonText: "Learn More",
      link: "https://example.com/large-project3",
    },
  ];


export const projects = [
  {
    title: "Personal Portfolio",
    date: "2024",
    imageUrl: "/images/wwutrees.png",
    buttonText: "Link",
    link: "#",
  },
  {
    title: "WWU Schedule Optimizer",
    date: "2024",
    imageUrl: "/images/scheduleOpt.png",
    buttonText: "Link",
    link: "https://cwooper.me/schedule-optimizer/",
  },
  {
    title: "WA Care Website",
    date: "2021",
    imageUrl: "/images/WAcare.png",
    buttonText: "Link",
    link: "https://washington-state-hospital-records.vercel.app/",
  },
  {
    title: "Covid Adventures Game",
    date: "2020",
    imageUrl: "/images/CovidAdventures.png",
    buttonText: "Link",
    link: "https://flowlab.io/game/play/1719733",
  },
  {
    title: "Project 4",
    date: "2020",
    imageUrl: "/images/wwutrees.png",
    buttonText: "Link",
    link: "#",
  },
  {
    title: "Project 5",
    date: "2019",
    imageUrl: "/images/wwutrees.png",
    buttonText: "Link",
    link: "#",
  },
];

export const socials = [
    {
      name: "LinkedIn",
      imageUrl: "https://img.icons8.com/color/48/000000/linkedin.png",
      link: "https://www.linkedin.com/in/konnorkooi/",
      backgroundImage: "/images/linkedin.png",
    },
    {
      name: "GitHub",
      imageUrl: "https://img.icons8.com/material-rounded/48/000000/github.png",
      link: "https://github.com/KonnorKooi",
      backgroundImage: "/images/github.png",
    },
    {
      name: "Facebook",
      imageUrl: "https://img.icons8.com/color/48/000000/facebook-new.png",
      link: "https://www.facebook.com/konnor.kooi.731/",
      backgroundImage: "/images/facebook.png",
    },
    {
      name: "Instagram",
      imageUrl: "https://img.icons8.com/color/48/000000/instagram-new.png",
      link: "https://www.instagram.com/konnorkooi/",
      backgroundImage: "/images/instagram.png",
    },
    {
      name: "Tiktok",
      imageUrl: "https://img.icons8.com/color/48/000000/tiktok.png",
      link: "https://www.tiktok.com/@konnorkooi32",
      backgroundImage: "/images/tiktok.png",
    },
  ];
```

# src/styles/global.css

```css
/* Import the Montserrat font */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

/* Apply Tailwind base styles */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Apply custom styles */
body {
  font-family: 'Montserrat', sans-serif;
  background-color: #000000; /* Apply bg-black */
  color: #ffffff; /* Apply text-white */
}

```

# src/pages/index.tsx

```tsx
import {
    Navbar,
    FullPageImages,
    ProjectCarousel,
    SocialCarousel,
    Footer,
} from "../components";

const Home: React.FC = () => {
    return (
        <div className="bg-black text-white">
            <Navbar />
            <main>
                <FullPageImages />
                <ProjectCarousel />
                <SocialCarousel />
            </main>
            <Footer />
        </div>
    );
};

export default Home;

```

# src/pages/_document.js

```js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="icon" href="/images/favicon.ico" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

```

# src/pages/_app.tsx

```tsx
import React from "react";
import type { AppProps } from "next/app";
import "../styles/global.css"; // Import global CSS here

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

```

# src/hooks/useIntersectionObserver.ts

```ts
import { useEffect, useState, useRef } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '0px',
  freezeOnceVisible = false,
}: UseIntersectionObserverProps = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsVisible(inView);
        if (inView || hasIntersected) {
          setHasIntersected(true);
          if (freezeOnceVisible) {
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, freezeOnceVisible, hasIntersected]);

  // Force visibility after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isVisible) {
        setIsVisible(true);
        setHasIntersected(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isVisible]);

  return [ref, isVisible, hasIntersected] as const;
};

export default useIntersectionObserver;
```

# src/components/index.ts

```ts
// Layout
export { default as Navbar } from './layout/Navbar';
export { default as Footer } from './layout/FooterKonnor';

// Carousels
export { default as FullPageImages} from './carousels/FullPageImages';
export { default as ProjectCarousel } from './carousels/ProjectCarousel';
export { default as SocialCarousel } from './carousels/SocialCarousel';
```

# src/components/layout/Navbar.tsx

```tsx
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Navbar: React.FC = () => {
    const [showHelp, setShowHelp] = useState(false);
    const [debounce, setDebounce] = useState(false);
    const lastUpdated = new Date().toLocaleDateString();

    const handleHelpClick = () => {
        if (debounce) return;
        setShowHelp(!showHelp);
        setDebounce(true);
        setTimeout(() => {
            setDebounce(false);
        }, 300);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                showHelp &&
                !document
                    .getElementById("helpBox")
                    ?.contains(event.target as Node) &&
                !document
                    .getElementById("helpButton")
                    ?.contains(event.target as Node)
            ) {
                setShowHelp(false);
            }
        };

        const handleScroll = () => {
            if (showHelp) {
                setShowHelp(false);
            }
        };

        const handleWheel = () => {
            if (showHelp) {
                setShowHelp(false);
            }
        };

        const handleTouchStart = () => {
            if (showHelp) {
                setShowHelp(false);
            }
        };

        const handleResize = () => {
            if (showHelp) {
                setShowHelp(false);
            }
        };

        if (showHelp) {
            document.addEventListener("click", handleClickOutside);
            document.addEventListener("scroll", handleScroll);
            document.addEventListener("wheel", handleWheel);
            document.addEventListener("touchstart", handleTouchStart);
            window.addEventListener("resize", handleResize);
        } else {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("scroll", handleScroll);
            document.removeEventListener("wheel", handleWheel);
            document.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("resize", handleResize);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("scroll", handleScroll);
            document.removeEventListener("wheel", handleWheel);
            document.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("resize", handleResize);
        };
    }, [showHelp]);

    return (
        <nav className="bg-black py-4 px-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={50}
                        height={50}
                        className="h-12 w-12"
                        style={{
                            maxWidth: "100%",
                            height: "auto"
                        }} />
                </div>
                <div>
                    <span className="text-white text-xl font-semibold">
                        Konnor Kooi
                    </span>
                </div>
                <div>
                    <button
                        className={`p-2 rounded-full transition-colors ${
                            showHelp ? "bg-gray-200" : "bg-transparent"
                        }`}
                        onClick={handleHelpClick}
                        id="helpButton">
                        <svg
                            width="24"
                            height="24"
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            className="text-white"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4C9.243 4 7 6.243 7 9h2c0-1.654 1.346-3 3-3s3 1.346 3 3c0 1.069-.454 1.465-1.481 2.255-.382.294-.813.626-1.226 1.038C10.981 13.604 10.995 14.897 11 15v2h2v-2.009c0-.024.023-.601.707-1.284.32-.32.682-.598 1.031-.867C15.798 12.024 17 11.1 17 9c0-2.757-2.243-5-5-5zm-1 14h2v2h-2z" />
                        </svg>
                    </button>
                </div>
            </div>
            {showHelp && (
                <div
                    id="helpBox"
                    className="absolute top-16 right-6 w-64 p-4 bg-white rounded-lg shadow-lg z-50">
                    <h2 className="text-lg font-semibold mb-2 text-white">
                        Project Information
                    </h2>
                    <p className="text-sm mb-1">This project is built using:</p>
                    <ul className="list-disc list-inside text-sm mb-2">
                        <li>React</li>
                        <li>Next.js</li>
                        <li>Tailwind CSS</li>
                    </ul>
                    <p className="text-sm">
                        Last Updated: <strong>{lastUpdated}</strong>
                    </p>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

```

# src/components/layout/FooterKonnor.tsx

```tsx
import React from "react";

const FooterKonnor: React.FC = () => {
    return (
        <footer className="bg-black text-white py-8 px-6">
            <div className="container mx-auto flex flex-wrap justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        className="fill-current mr-3">
                        <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v7A1.5 1.5 0 0 0 1.5 10H6v1H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5v-1h4.5A1.5 1.5 0 0 0 16 8.5v-7A1.5 1.5 0 0 0 14.5 0zm0 1h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5M12 12.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m2 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M1.5 12h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M1 14.25a.25.25 0 0 1 .25-.25h5.5a.25.25 0 1 1 0 .5h-5.5a.25.25 0 0 1-.25-.25" />
                    </svg>
                    <div>
                        <p className="font-bold">Konnor Kooi</p>
                        <p className="text-sm">WWU Computer Science</p>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <a
                        href="https://github.com/KonnorKooi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            width="24"
                            height="24"
                            fill="currentColor">
                            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                        </svg>
                    </a>
                    <a
                        href="https://www.linkedin.com/in/konnorkooi/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 16 16">
                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                        </svg>
                    </a>
                    <a
                        href="https://www.instagram.com/konnorkooi/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 16 16">
                            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default FooterKonnor;

```

# src/components/carousels/SocialCarousel.tsx

```tsx
import React, { useState } from "react";
import Image from "next/image";
import { socials } from "../../utils/constants";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const SocialCard: React.FC<{
    social: (typeof socials)[0];
    index: number;
}> = ({ social, index }) => {
    const [ref, isVisible] = useIntersectionObserver({
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
    });
    const [hasAnimated, setHasAnimated] = useState(false);

    React.useEffect(() => {
        if (isVisible && !hasAnimated) {
            const timer = setTimeout(() => setHasAnimated(true), 100 * index);
            return () => clearTimeout(timer);
        }
    }, [isVisible, hasAnimated, index]);

    return (
        <a
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            ref={ref as React.RefObject<HTMLAnchorElement>}
            className={`block w-80 h-96 bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-1000 ease-in-out transform hover:scale-105 ${
                hasAnimated
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-full"
            }`}>
            <div className="relative w-full h-60">
                <Image
                    src={social.backgroundImage}
                    alt={social.name}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="p-4">
                <div className="flex items-center">
                    <div className="relative w-10 h-10 mr-3">
                        <Image
                            src={social.imageUrl}
                            alt={social.name}
                            className="rounded-full"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                        {social.name}
                    </h3>
                </div>
            </div>
        </a>
    );
};

const SocialCarousel: React.FC = () => {
    return (
        <div className="w-full bg-black py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-semibold text-white mb-12">
                    Socials
                </h2>
                <div className="flex overflow-x-auto space-x-8 pb-8">
                    {socials.map((social, index) => (
                        <SocialCard key={index} social={social} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SocialCarousel;

```

# src/components/carousels/ProjectCarousel.tsx

```tsx
import React, { useState } from "react";
import Image from "next/image";
import { projects } from "../../utils/constants";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const ProjectCard: React.FC<{
    project: (typeof projects)[0];
    index: number;
}> = ({ project, index }) => {
    const [ref, isVisible] = useIntersectionObserver({
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
    });
    const [hasAnimated, setHasAnimated] = useState(false);

    React.useEffect(() => {
        if (isVisible && !hasAnimated) {
            const timer = setTimeout(() => setHasAnimated(true), 100 * index);
            return () => clearTimeout(timer);
        }
    }, [isVisible, hasAnimated, index]);

    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            ref={ref as React.RefObject<HTMLAnchorElement>}
            className={`block w-80 h-96 bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-1000 ease-in-out transform hover:scale-105 ${
                hasAnimated
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-full"
            }`}>
            <div className="relative w-full h-60">
                <Image
                    src={project.imageUrl}
                    alt={project.title}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-xl font-semibold text-white">
                    {project.title}
                </h3>
                <p className="text-sm text-gray-400 mt-2">{project.date}</p>
            </div>
        </a>
    );
};

const ProjectCarousel: React.FC = () => {
    return (
        <div className="w-full bg-black py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-semibold text-white mb-12">
                    Projects
                </h2>
                <div className="flex overflow-x-auto space-x-8 pb-8">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={index}
                            project={project}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectCarousel;

```

# src/components/carousels/FullPageImages.tsx

```tsx
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { largeProjects } from "../../utils/constants";

const FullPageImages: React.FC = () => {
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.1,
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("translate-x-0");
                    entry.target.classList.remove("-translate-x-full");
                }
            });
        };

        const observer = new IntersectionObserver(
            observerCallback,
            observerOptions
        );

        const currentRefs = sectionRefs.current;

        currentRefs.forEach((ref) => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            currentRefs.forEach((ref) => {
                if (ref) {
                    observer.unobserve(ref);
                }
            });
        };
    }, []);

    return (
        <div className="w-full">
            {largeProjects.map((project, index) => (
                <div
                    key={index}
                    ref={(el) => {
                        sectionRefs.current[index] = el;
                    }}
                    className="min-h-screen w-full relative overflow-hidden transform transition-transform duration-1000 ease-out -translate-x-full">
                    <Link href={project.link} passHref>
                        <div className="w-full h-screen relative cursor-pointer">
                            <Image
                                src={project.imageUrl}
                                alt={project.title}
                                fill
                                sizes="100vw"
                                priority={index === 0}
                                className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                <h2 className="text-4xl md:text-6xl text-white p-4 text-center">
                                    {project.title}
                                </h2>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default FullPageImages;

```

