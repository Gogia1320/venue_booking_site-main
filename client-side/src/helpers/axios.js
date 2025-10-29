import axios from 'axios';
import { api } from '../urlConfig';
import store from '../store';
import { authConstants, serverConstants } from '../actions/constants';

const axiosInstance = axios.create({
  baseURL: api,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach token dynamically from Redux
axiosInstance.interceptors.request.use((req) => {
  const { auth } = store.getState();
  if (auth.token) {
    req.headers.Authorization = `Bearer ${auth.token}`;
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: handle errors globally
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      // Server is offline
      store.dispatch({
        type: serverConstants.SERVER_OFFLINE,
        payload: { msg: "Server is not running 😢" }
      });
    } else {
      const { status } = error.response;
      if (status === 401 || status === 403) {
        // Unauthorized or forbidden → logout user
        localStorage.clear();
        store.dispatch({ type: authConstants.LOGOUT_SUCCESS });
      }
      // Optional: handle other errors if needed
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
