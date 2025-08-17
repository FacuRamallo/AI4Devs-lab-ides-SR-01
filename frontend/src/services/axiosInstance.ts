import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3010/', // Base URL for the backend API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
