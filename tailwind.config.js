// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     function({addUtilities}){
//       const newUtilities={
//         '.no-swiggy-scrollbar::-webkit-scrollbar ':{
//           display: 'none'/* Hide scrollbar for Chrome, Safari, and Opera */
//         }
//       }
//       addUtilities(newUtilities)
//     }
//   ],
// }

//////////////////////////////////////////////////////////////////////////////
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    // Custom utility for hiding scrollbars
    function({ addUtilities }) {
      const newUtilities = {
        '.no-swiggy-scrollbar::-webkit-scrollbar': {
          display: 'none', // Hide scrollbar for Chrome, Safari, and Opera
        },
        '.no-swiggy-scrollbar': {
          '-ms-overflow-style': 'none', // IE and Edge
          'scrollbar-width': 'none', // Firefox
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
    // Tailwind CSS animate plugin
    require('tailwindcss-animate'),
  ],
}
