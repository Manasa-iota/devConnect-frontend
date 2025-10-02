/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { primary: "#a4f839" },
        surface: {
          50: "#0b0b0c",
          100: "#121214",
          200: "#18181b",
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.25)",
        glass: "inset 0 1px 0 rgba(255,255,255,.06), 0 8px 30px rgba(0,0,0,.20)"
      },
      borderRadius: { xl2: "1.25rem" },
      fontFamily: { sans: ["Inter","ui-sans-serif","system-ui"] }
    }
  },
  plugins: [],
}
