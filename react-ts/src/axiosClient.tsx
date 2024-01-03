import axios from 'axios';

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_LARAVEL_REACT_API_BASE_URL}/api`
});

// Add a request interceptor
axios.interceptors.request.use(function (config) {  
    const token = 'token';
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  });

export default axiosClient;