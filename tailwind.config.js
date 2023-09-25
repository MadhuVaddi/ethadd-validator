/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Configure the dark mode colors
      darkSelector: '.dark-mode',
      colors: {
        // Add your dark mode color palette here
        darkGray: '#333333',
        // Add more colors as needed
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
      // Add more variants as needed
    },
  },
  plugins: [],
}