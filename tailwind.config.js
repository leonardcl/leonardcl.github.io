/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

// module.exports = {

// };

// module.exports = {
//     content: ["*"],
//     theme: {
//         extend: {
//             fontFamily: {
//                 quicksand: ["Quicksand", "sans-serif"],
//             },
//         },
//     },
//     plugins: [],
// };

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                quicksand: ["Quicksand", ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                float: {
                    "0%": { transform: "translate(0, 0)" },
                    "25%": { transform: "translate(20px, -30px)" },
                    "50%": { transform: "translate(-15px, 20px)" },
                    "75%": { transform: "translate(30px, 10px)" },
                    "100%": { transform: "translate(0, 0)" },
                },
                moveLeft: {
                    "0%": { transform: "translateX(100vw)", opacity: "1" }, // Fully visible at start
                    "80%": { opacity: "1" }, // Fully visible until 80% of the animation
                    "100%": { transform: "translateX(-100vw)", opacity: "0" }, // Fades out as it leaves
                },
                fade: {
                    "0%, 100%": { opacity: "0" }, // Fully transparent
                    // "10%": { opacity: "1" }, // Fade in during the first 10% of animation
                    "50%": { opacity: "1" }, // Fully visible
                },
            },
            animation: {
                float: "float 5s ease-in-out infinite",
                moveLeft: "moveLeft 10s linear infinite",
                fade: "fade 3s ease-in-out infinite", // Define the animation
            },
        },
    },
    plugins: [],
};
