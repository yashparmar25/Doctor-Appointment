import axios from 'axios';

// Get the backend URL from environment variables
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Add user token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    
    // Add doctor token if available
    const dToken = localStorage.getItem('dToken');
    if (dToken) {
      // Send doctor token in Authorization header with Bearer prefix
      config.headers.Authorization = `Bearer ${dToken}`;
    }
    
    // Add admin token if available
    const aToken = localStorage.getItem('aToken');
    if (aToken) {
      config.headers.aToken = aToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear all tokens
      localStorage.removeItem('token');
      localStorage.removeItem('dToken');
      localStorage.removeItem('aToken');
      
      // Redirect to login page
      window.location.href = '/';
    }
    
    // Handle other errors
    if (error.response?.data?.message) {
      console.error('API Error:', error.response.data.message);
    } else {
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Doctor API functions
export const getDoctorAppointments = async () => {
  try {
    const response = await apiClient.get('/doctor/appointments');
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    throw error.response?.data || error.message;
  }
};

export const completeAppointment = async (appointmentId) => {
  try {
    const response = await apiClient.post('/doctor/complete-appointment', { appointmentId });
    return response.data;
  } catch (error) {
    console.error('Error completing appointment:', error);
    throw error.response?.data || error.message;
  }
};

export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await apiClient.post('/doctor/cancel-appointment', { appointmentId });
    return response.data;
  } catch (error) {
    console.error('Error canceling appointment:', error);
    throw error.response?.data || error.message;
  }
};

export const getDoctorProfile = async () => {
  try {
    const response = await apiClient.get('/doctor/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    throw error.response?.data || error.message;
  }
};

export const updateDoctorProfile = async (payload) => {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'address') {
          formData.append('address', JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    const response = await apiClient.post('/doctor/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    throw error.response?.data || error.message;
  }
};

// User API functions
export const cancelUserAppointment = async (appointmentId) => {
  try {
    const response = await apiClient.post(`/user/cancel-appointment/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error canceling user appointment:', error);
    throw error.response?.data || error.message;
  }
};

export default apiClient; 