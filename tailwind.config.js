/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./auth/**/*.html",
    "./post/**/*.html",
    "./profile/**/*.html",
    "./src/**/*.{js, ts}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(50.57deg, #06113e 18.57%, rgba(62, 220, 255, 0.86) 89.63%)",
      },
      colors: {
        "custom-blue": "#3edcffdb",
      },
    },
  },
  plugins: [],
};
