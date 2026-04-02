/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#060704",
        "surface": "#0c0e08",
        "surface-container-lowest": "#030402",
        "surface-container-low": "#0f1109",
        "surface-container": "#151809",
        "surface-container-high": "#1c2010",
        "surface-container-highest": "#232916",
        "surface-bright": "#2a3019",
        "on-surface": "#e8f0d0",
        "on-surface-variant": "#a3a899",
        "outline": "#5a6044",
        "outline-variant": "#363d22",
        "primary": "#ccff00",
        "on-primary": "#141a00",
        "primary-container": "#b3e600",
        "primary-fixed": "#d4ff33",
        "primary-fixed-dim": "#a8cc00",
        "secondary": "#67e8f9",
        "on-secondary": "#003d44",
        "secondary-container": "#004f57",
        "on-secondary-container": "#a5f3fc",
        "tertiary": "#c084fc",
        "on-tertiary": "#3b0764",
        "tertiary-container": "#6d28d9",
        "on-tertiary-container": "#ede9fe",
        "tertiary-fixed": "#e9d5ff",
        "error": "#ff6b6b",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
        "inverse-surface": "#e8f0d0",
        "inverse-on-surface": "#1c2010",
        "on-primary-fixed": "#060704",
        "on-primary-fixed-variant": "#2d3800",
      },
      fontFamily: {
        "headline": ["'Space Grotesk'", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "3xl": "1.5rem", "full": "9999px"},
      animation: {
        'fade-up': 'fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(1deg)' },
          '50%': { transform: 'translateY(-20px) rotate(-1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        progress: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        }
      }
    },
  },
  plugins: [],
}
