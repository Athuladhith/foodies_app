import axios from 'axios';

// Create an instance of axios
const Api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include token in headers if it exists
Api.interceptors.request.use((config) => {
  const token = localStorage.getItem('restaurantToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
// Api.interceptors.response.use(
//   (response) => response, // Pass through successful responses
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Token is expired or unauthorized
//       localStorage.removeItem('tokenss'); // Remove the token
//       window.location.href = '/login';
//     }
//     return Promise.reject(error); // Reject the promise to propagate the error
//   }
// );

export default Api;
