/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2196f3',
          dark: '#1976d2',
        },
        success: {
          DEFAULT: '#4caf50',
          dark: '#3d8b40',
        },
        danger: {
          DEFAULT: '#f44336',
          dark: '#d32f2f',
        },
        warn: '#f39c12',
      },
      boxShadow: {
        card: '0 8px 32px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}

