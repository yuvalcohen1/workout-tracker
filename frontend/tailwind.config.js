/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        },
        colors: {
          primary: {
            50: '#fff7ed',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
          },
          gray: {
            800: '#1f2937',
            900: '#111827',
          },
        },
        animation: {
          'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
          'bounce-slow': 'bounce 3s ease-in-out infinite',
        },
        keyframes: {
          'pulse-glow': {
            '0%, 100%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)' },
            '50%': { boxShadow: '0 0 40px rgba(249, 115, 22, 0.6)' },
          },
        },
        backdropBlur: {
          xs: '2px',
        },
      },
    },
    plugins: [],
  }