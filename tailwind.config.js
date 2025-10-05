/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wechat-green': '#07C160',
        'wechat-dark': '#181818',
        'editor-bg': '#1e1e1e',
        'preview-bg': '#f5f5f5'
      },
      fontFamily: {
        'chinese': ['PingFang SC', 'Microsoft YaHei', 'sans-serif']
      }
    },
  },
  plugins: [],
}