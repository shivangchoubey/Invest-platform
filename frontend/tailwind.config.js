export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F7A63",     // deep green
        secondary: "#1A1A1A",   // charcoal
        background: "#F8F9FA",  // off-white
        text: "#333333",
        muted: "#6B7280",       // subtle text
        input: "#F1F3F5",       // soft input bg (IMPORTANT)
        border: "#E5E7EB",
      },
    },
  },
  plugins: [],
};