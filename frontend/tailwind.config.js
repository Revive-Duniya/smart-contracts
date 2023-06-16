/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontSize: {
      sm: '0.8rem',
      normal: '1rem',
      md: '1.2rem',
      lg: '1.8rem',
      xl: '2.4rem',
      xxl: '3.6rem',
      xxxl: '5rem'
    },
    colors: {
      primary: "#460b3e",
      yellow: "#fcb70c",
      white: "#FFFFFF",
      black: '#000000',
      error: '#DA0060',
    },
    extend: {
      backgroundImage: {
        'gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
        'walletGradient': 'linear-gradient(147.75deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      backdropBlur: {
        '20': '20.8px',
      },
      screens: {
        'sm': '200px',    // Small screens and up
        'md': '768px',    // Medium screens and up
        'lg': '1024px',   // Large screens and up
        'xl': '1280px',   // Extra large screens and up
        '2xl': '1536px',  // 2X extra large screens and up
      },
    },
  },
  plugins: [],
}