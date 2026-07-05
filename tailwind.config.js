/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                bone: "#FAF9F5",
                ink: "#191918",
                inkmuted: "#6B6A64",
                line: "#E6E4DC",
                accent: "#3538CD",
                accentdim: "#8A8CE0",
            },
            fontFamily: {
                display: ["Fraunces", ...defaultTheme.fontFamily.serif],
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
                mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
                quicksand: ["Quicksand", ...defaultTheme.fontFamily.sans], // legacy pages
            },
            maxWidth: {
                site: "72rem",
            },
            keyframes: {
                // --- new (redesign) ---
                riseIn: {
                    from: { opacity: "0", transform: "translateY(24px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                // --- legacy (Blessed / tools) ---
                float: {
                    "0%": { transform: "translate(0, 0)" },
                    "25%": { transform: "translate(20px, -30px)" },
                    "50%": { transform: "translate(-15px, 20px)" },
                    "75%": { transform: "translate(30px, 10px)" },
                    "100%": { transform: "translate(0, 0)" },
                },
                moveLeft: {
                    "0%": { transform: "translateX(100vw)", opacity: "1" },
                    "80%": { opacity: "1" },
                    "100%": { transform: "translateX(-100vw)", opacity: "0" },
                },
                fade: {
                    "0%, 100%": { opacity: "0" },
                    "50%": { opacity: "1" },
                },
            },
            animation: {
                riseIn: "riseIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
                float: "float 5s ease-in-out infinite",
                moveLeft: "moveLeft 10s linear infinite",
                fade: "fade 3s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
