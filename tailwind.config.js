module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,js,jsx,tsx,xml}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        compassion: '#005eb8',

        // white-10, white-20...
        ...[...Array(10).keys()].reduce((acc, it) => {
          acc[`white-${it*10}`] = `rgba(255,255,255,0.${it})`;
          return acc;
        }, {}),

        // black-10, black-20...
        ...[...Array(10).keys()].reduce((acc, it) => {
          acc[`black-${it*10}`] = `rgba(0,0,0,0.${it})`;
          return acc;
        }, {}),
      },
      spacing: {
        '128': '32rem',
        '160': '40rem',        
        '192': '48rem',
        '224': '56rem',
        '256': '64rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

