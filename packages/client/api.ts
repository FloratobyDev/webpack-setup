import axios from 'axios';

// Create an Axios instance with configuration
const API = axios.create({
  baseURL: 'https://git-journal-backend.onrender.com', // Your base URL
  withCredentials: true, // Send cookies when making requests
  // You can add more default settings here
});

// Export the instance to be used in your app
export default API;
