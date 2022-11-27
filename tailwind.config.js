/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts}"],
  theme: {
    extend: {
      fontFamily:{
        'open-sans':["Open Sans"],
        'mukta':["Mukta"]
      }
    },
    screens:{
      "lg":{'max':'1140px'},
      "md":{'max':'788px'},
      "sm":{'max':'450px'}
    }
  },
  plugins: [],
}
