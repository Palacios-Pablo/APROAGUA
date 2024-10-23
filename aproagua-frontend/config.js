// config.js
const config = {
    API_BASE_URL: process.env.NODE_ENV === 'production'
      ? 'https://aproagua-5f38a1d007ce.herokuapp.com'  // URL en producción
      : 'http://localhost:3000',  // URL en desarrollo local
  };
  
  export default config;
  