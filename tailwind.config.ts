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