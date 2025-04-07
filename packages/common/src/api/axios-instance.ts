// packages/common/src/api/axios-instance.ts
import axios, { AxiosInstance } from 'axios';
import config from '../config/index.js';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.CORE_BANKING_API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    // Add other default headers if necessary
  },
});

// Add request interceptors if needed
axiosInstance.interceptors.request.use(
  (request) => {
    console.log(`Request: ${request.method?.toUpperCase()} ${request.url}`);
    // Modify request if needed (e.g., adding auth tokens)
    return request;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptors if needed
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`Response: ${response.status} ${response.statusText}`);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
