/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          pri: '#055e35',
          sec: '#002A3A'
        },
      },
    },
    plugins: [],
  }