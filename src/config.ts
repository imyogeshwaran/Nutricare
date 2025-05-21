const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://your-render-api-url.com/api'  // Replace with your Render URL
    : 'http://localhost:5000/api',
};

export default config;
