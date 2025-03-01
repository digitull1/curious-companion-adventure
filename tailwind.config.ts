
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			scale: {
				'102': '1.02',
				'98': '0.98',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				wonder: {
					purple: "#8B5CF6", // Enhanced vibrant purple
					"purple-light": "#C4B5FD",
					"purple-dark": "#6D28D9",
					teal: "#14B8A6", // Enhanced vibrant teal
					coral: "#F87171", // Enhanced vibrant coral
					yellow: "#FBBF24", // Enhanced vibrant yellow
					green: "#34D399", // Enhanced vibrant green
					blue: "#0EA5E9", // New vibrant blue
					orange: "#F97316", // New vibrant orange
					pink: "#EC4899", // New vibrant pink
					background: "#F8F7FF",
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'bounce-in': {
					'0%': { transform: 'scale(0.8)', opacity: '0' },
					'70%': { transform: 'scale(1.05)', opacity: '1' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
					'25%': { transform: 'translateY(-10px) rotate(2deg)' },
					'50%': { transform: 'translateY(0) rotate(0deg)' },
					'75%': { transform: 'translateY(10px) rotate(-2deg)' }
				},
				'pulse-soft': {
					'0%, 100%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(1.05)', opacity: '0.8' }
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'message-appear': {
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'sparkle': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.6', transform: 'scale(0.8)' }
				},
				'slide-right': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'badge-pulse': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' }
				},
				'trophy-shine': {
					'0%': { backgroundPosition: '-100% 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'enter': 'fade-in 0.3s ease-out, scale-in 0.2s ease-out',
				'exit': 'fade-out 0.3s ease-out, scale-out 0.2s ease-out',
				'bounce-in': 'bounce-in 0.5s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'spin-slow': 'spin-slow 8s linear infinite',
				'message-appear': 'message-appear 0.3s forwards',
				'sparkle': 'sparkle 1.5s ease-in-out infinite',
				'slide-right': 'slide-right 3s linear infinite',
				'gradient-shift': 'gradient-shift 15s ease infinite',
				'badge-pulse': 'badge-pulse 1.5s ease-in-out infinite',
				'trophy-shine': 'trophy-shine 2s linear infinite'
			},
			boxShadow: {
				'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
				'wonder': '0 10px 25px -5px rgba(139, 92, 246, 0.2)',
				'wonder-lg': '0 20px 35px -10px rgba(139, 92, 246, 0.3)',
				'wonder-xl': '0 25px 50px -12px rgba(139, 92, 246, 0.4)',
			},
			backgroundImage: {
				'gradient-wonder': 'linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%)',
				'gradient-wonder-alt': 'linear-gradient(135deg, #14B8A6 0%, #8B5CF6 100%)',
				'gradient-wonder-soft': 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(20, 184, 166, 0.15) 100%)',
				'gradient-purple': 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
				'gradient-teal': 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)',
				'gradient-coral': 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)',
				'gradient-yellow': 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
				'gradient-green': 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
				'gradient-blue': 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
				'gradient-orange': 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
				'gradient-pink': 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
				'gradient-fun': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F97316 100%)',
				'gradient-rainbow': 'linear-gradient(135deg, #8B5CF6 0%, #0EA5E9 25%, #34D399 50%, #FBBF24 75%, #F87171 100%)',
			},
			backdropBlur: {
				'xl': '20px',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
