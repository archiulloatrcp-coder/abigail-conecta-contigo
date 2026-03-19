export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50: '#f7f5f2',
          100: '#f0e9e4',
          200: '#e6ded8',
          300: '#d7c7c1',
          400: '#c8a5a5',
          500: '#b78f8f',
          600: '#9f7373',
          700: '#7f5c5c',
          800: '#5f4747',
          900: '#3f3232',
        },
      },
      boxShadow: {
        soft: '0 10px 20px rgba(61, 51, 45, 0.08)',
      },
    },
  },
}
