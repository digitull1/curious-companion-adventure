
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      scale: {
        '98': '0.98',
        '102': '1.02',
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        display: ["'Montserrat'", ...fontFamily.sans],
        rounded: ["'Varela Round'", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            opacity: "0.6", 
            boxShadow: "0 0 5px rgba(124, 58, 237, 0.3), 0 0 10px rgba(124, 58, 237, 0.2)" 
          },
          "50%": { 
            opacity: "1", 
            boxShadow: "0 0 15px rgba(124, 58, 237, 0.6), 0 0 20px rgba(124, 58, 237, 0.4)" 
          },
        },
        "sparkle": {
          "0%, 100%": { 
            opacity: "0.5",
            transform: "scale(1)" 
          },
          "50%": { 
            opacity: "1",
            transform: "scale(1.2) rotate(20deg)" 
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "sparkle": "sparkle 2s ease-in-out infinite",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "wonder-purple": "#7c3aed",
        "wonder-purple-light": "#9d74f8",
        "wonder-purple-dark": "#6025c9",
        "wonder-teal": "#14B8A6",
        "wonder-teal-light": "#4fe0cf",
        "wonder-teal-dark": "#0d8f82",
        "wonder-coral": "#F43F5E",
        "wonder-coral-light": "#ff7792",
        "wonder-coral-dark": "#d01a38",
        "wonder-yellow": "#F59E0B",
        "wonder-yellow-light": "#fbb943",
        "wonder-yellow-dark": "#c67c08",
        "wonder-green": "#10B981",
        "wonder-green-light": "#3dd6a3",
        "wonder-green-dark": "#0b8760",
        "wonder-background": "#F9F7FF",
        "wonder-blue": "#0EA5E9",
        "wonder-blue-light": "#5eceff",
        "wonder-blue-dark": "#0982ba",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'magical': '0 0 10px rgba(124, 58, 237, 0.3), 0 0 20px rgba(124, 58, 237, 0.2)',
        'magical-hover': '0 0 15px rgba(124, 58, 237, 0.5), 0 0 30px rgba(124, 58, 237, 0.3)',
        'pixar': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'candy': '0 10px 25px -5px rgba(124, 58, 237, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-candy': 'linear-gradient(135deg, #ff61d2, #fe9090, #fbd4a4, #ddfc9b)',
        'gradient-pixar': 'linear-gradient(135deg, #4158D0, #C850C0, #FFCC70)',
        'gradient-disney': 'linear-gradient(135deg, #0b63f6, #003cc5)',
        'gradient-sports': 'linear-gradient(135deg, #00c6fb, #005bea)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
