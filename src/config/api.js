import axios from 'axios';

// Create base URL API
export const API = () => {
  const baseUrl =
    process.env.SERVER_URL ||
    'https://b34-backend.herokuapp.com/api/v1' ||
    'https://localhost:5000/api/v1';

  const executeAPI = async (endpoint, config) => {
    const response = await fetch(baseUrl + endpoint, config);
    const data = await response.json();
    return data;
  };

  return {
    get: executeAPI,
    post: executeAPI,
    patch: executeAPI,
    delete: executeAPI,
  };
};

// Set Authorization Token Header
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.commin['Authorization'];
  }
};