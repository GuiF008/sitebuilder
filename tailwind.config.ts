import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './core/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ovh-primary': '#000E9C',
        'ovh-primary-hover': '#000B7A',
        'ovh-secondary': '#4DBBFF',
        'ovh-accent': '#00D4AA',
        'ovh-dark': '#1B1B1B',
        'ovh-gray': {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#121416',
        },
      },
      fontFamily: {
        sans: ['var(--font-source-sans)', 'Source Sans 3', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'ovh': '8px',
        'ovh-lg': '12px',
      },
    },
  },
  plugins: [],
}

export default config
