/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}', // Asegúrate de que Tailwind escanee los archivos dentro de app/
      "./pages/**/*.{js,ts,jsx,tsx}",
      './components/**/*.{js,ts,jsx,tsx}', // Si tienes una carpeta components/
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };