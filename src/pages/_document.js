// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const setInitialTheme = `
  (function() {
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      const theme = savedTheme || (prefersLight ? 'light' : 'dark');

      document.documentElement.classList.add('no-transition'); // Disable transitions
      document.documentElement.classList.add(theme);

      document.body.style.backgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
      document.body.style.color = theme === 'dark' ? '#ffffff' : '#000000';

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
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
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
