/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Tailwind blue-600
        },
        secondary: {
          DEFAULT: '#22c55e', // Tailwind green-500
        },
      },
    },
  },
  plugins: [],
}

