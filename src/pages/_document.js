// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const setInitialTheme = `
  (function() {
    try {
      // Mark that JS is running so CSS can scope the scroll-in animation's
      // hidden initial state to JS-enabled visitors only (no-JS sees content).
      document.documentElement.classList.add('js');

      const savedTheme = localStorage.getItem('theme');
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      const theme = savedTheme || (prefersLight ? 'light' : 'dark');

      document.documentElement.classList.add('no-transition'); // Disable transitions
      document.documentElement.classList.add(theme);

      document.body.style.backgroundColor = theme === 'dark' ? '#0f0e0c' : '#FFFFFF';
      document.body.style.color = theme === 'dark' ? '#f0ede4' : '#1A1A1A';

      // Remove the no-transition class after a short delay
      setTimeout(() => {
        document.documentElement.classList.remove('no-transition');
      }, 100);
    } catch(e) {}
  })();
`;

  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        {/* Set theme instantly before app renders */}
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
