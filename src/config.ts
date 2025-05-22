const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://nutricare-api.onrender.com/api' // or your production backend URL
    : '/api', // use Vite proxy in development
};

export default config;
