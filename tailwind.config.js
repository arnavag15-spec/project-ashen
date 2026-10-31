/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0c0c0e',
          900: '#121215',
          850: '#16161a',
          800: '#1b1b22',
          700: '#262631',
          600: '#383848',
        },
        parchment: {
          50: '#faf7f2',
          100: '#f4ede2',
          200: '#e8dbca',
          300: '#d7c4ab',
          400: '#beaa8e',
          800: '#3a3328',
          900: '#231e17',
        },
        bronze: {
          300: '#e2c582',
          400: '#cfa957',
          500: '#b88d36',
          600: '#946f25',
          700: '#73541b',
        },
        vermilion: {
          400: '#ef4444',
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
        },
        moss: {
          500: '#4d7c0f',
          600: '#3f6212',
          700: '#365314',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
