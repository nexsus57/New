/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'pattern-circles': "url('https://www.transparenttextures.com/patterns/circles-and-roundabouts.png')",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        'brand-blue': '#1A2B3C',
        'brand-blue-dark': '#111D2A',
        'brand-blue-deep': '#003366',
        'brand-yellow': '#F5C518',
        'brand-amber': '#F59E0B',
        'brand-gray': '#F1F5F9',
        'brand-accent': '#2563EB',
        'brand-accent-dark': '#1D4ED8',
        'admin-bg': '#F1F5F9',
        'admin-sidebar': '#1E293B',
        'admin-card': '#FFFFFF',
        'admin-text': '#334155',
        'admin-text-light': '#64748B',
        'admin-accent': '#3B82F6',
        'admin-accent-hover': '#2563EB',
        'admin-border': '#E2E8F0',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.1) rotate(0.5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'slide-down': 'slide-down 0.3s ease-out forwards',
        'ken-burns': 'ken-burns 30s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}