// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{ts,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         casho: {
//           blue: "#0459AA",
//           "blue-dark": "#023A7A",
//           yellow: "#FFD21F",
//           ink: "#062038",
//         },
//       },
//       fontFamily: {
//         arabic: ["'Cairo'", "system-ui", "sans-serif"],
//       },
//       keyframes: {
//         "fade-in": {
//           "0%": { opacity: "0", transform: "translateY(10px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//       },
//       animation: {
//         "fade-in": "fade-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
//       },
//     },
//   },
//   plugins: [],
// };



// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx}"],
//   theme: {
//     extend: {
//       colors: {
//         // ── ألوان السيستم (Light) ────────────────────────────
//         // استخدم دول في كل شاشات الداشبورد/العمليات/إلخ
//         bg: {
//           DEFAULT: "#F8FAFC",
//           surface: "#FFFFFF",
//           raised: "#F1F5F9",
//         },
//         border: {
//           DEFAULT: "#E2E8F0",
//         },
//         text: {
//           primary: "#0F172A",
//           secondary: "#64748B",
//           muted: "#94A3B8",
//         },
//         accent: {
//           DEFAULT: "#0459AA", // نفس أزرق كاشو بلس — بيربط هوية السيستم بهوية اللاندنج
//           hover: "#023A7A",
//           soft: "#E6F0FA",
//         },
//         danger: {
//           DEFAULT: "#DC2626",
//           soft: "#FEE2E2",
//         },

//         // ── ألوان براند كاشو بلس ─────────────────────────────
//         // مخصوصة لصفحات Home/About/Contact بس — الأصفر بالذات ميتستخدمش
//         // جوه السيستم (الداشبورد/العمليات) خالص
//         casho: {
//           blue: "#0459AA",
//           "blue-dark": "#023A7A",
//           yellow: "#FFD21F",
//           ink: "#062038",
//         },
//       },
//       fontFamily: {
//         sans: ["Tajawal", "sans-serif"], // خط السيستم
//         arabic: ["Cairo", "system-ui", "sans-serif"], // خط صفحات اللاندنج
//       },
//       keyframes: {
//         "fade-in": {
//           "0%": { opacity: "0", transform: "translateY(10px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//       },
//       animation: {
//         "fade-in": "fade-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
//       },
//     },
//   },
//   plugins: [],
// };





/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ── ألوان السيستم (Light) ────────────────────────────
        // استخدم دول في كل شاشات الداشبورد/العمليات/إلخ
        bg: {
          DEFAULT: "#F8FAFC",
          surface: "#FFFFFF",
          raised: "#F1F5F9",
        },
        border: {
          DEFAULT: "#E2E8F0",
        },
        text: {
          primary: "#0F172A",
          secondary: "#64748B",
          muted: "#94A3B8",
        },
        accent: {
          DEFAULT: "#0459AA", // نفس أزرق كاشو بلس — بيربط هوية السيستم بهوية اللاندنج
          hover: "#023A7A",
          soft: "#E6F0FA",
        },
        danger: {
          DEFAULT: "#DC2626",
          soft: "#FEE2E2",
        },

        // ── ألوان براند كاشو بلس ─────────────────────────────
        // مخصوصة لصفحات Home/About/Contact بس — الأصفر بالذات ميتستخدمش
        // جوه السيستم (الداشبورد/العمليات) خالص
        casho: {
          blue: "#0459AA",
          "blue-dark": "#023A7A",
          yellow: "#FFD21F",
          ink: "#062038",
        },
      },
      fontFamily: {
        sans: ["Tajawal", "sans-serif"], // خط السيستم
        arabic: ["Cairo", "system-ui", "sans-serif"], // خط صفحات اللاندنج
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};