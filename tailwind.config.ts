import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        codGray50: '#f6f6f6',
        codGray100: '#e7e7e7',
        codGray200: '#d1d1d1',
        codGray300: '#b0b0b0',
        codGray400: '#888888',
        codGray500: '#6d6d6d',
        codGray600: '#5d5d5d',
        codGray700: '#4f4f4f',
        codGray800: '#454545',
        codGray900: '#3d3d3d',
        codGray950: '#080808',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
