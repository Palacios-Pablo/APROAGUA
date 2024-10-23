// config.js
const config = {
    API_BASE_URL: process.env.NODE_ENV === 'production'
      ? 'https://aproagua-backend-6d44ee3f85f0.herokuapp.com/'  // URL en producción
      : 'http://localhost:3000',  // URL en desarrollo local
  };
  
  export default config;
  