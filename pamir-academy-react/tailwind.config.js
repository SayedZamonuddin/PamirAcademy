/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#006236',
          dark: '#004d2a',
          light: '#e6f2ec',
          muted: '#4a6b5a',
        },
        surface: {
          DEFAULT: '#F9FAFB',
          card: '#FFFFFF',
          panel: '#F3F4F6',
          sidebar: '#FFFFFF',
        },
        accent: {
          red: '#C5221F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Arial', 'Helvetica', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'button': '25px',
        'modal': '20px',
        'input': '12px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)',
        'modal': '0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
