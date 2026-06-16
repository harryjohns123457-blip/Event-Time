/**
 * API Configuration and Request Handler
 * Handles all communication with the backend server
 */

const API_CONFIG = {
  BASE_URL: localStorage.getItem('apiUrl') || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json'
  }
};

/**
 * Get authorization token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Make API request with proper error handling
 */
async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body = null,
    headers = {},
    requiresAuth = false
  } = options;

  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const requestHeaders = { ...API_CONFIG.HEADERS, ...headers };

  // Add auth token if required
  if (requiresAuth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found. Please login.');
    }
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : null,
      timeout: API_CONFIG.TIMEOUT
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

/**
 * Authentication API Calls
 */
const AuthAPI = {
  register: async (email, password, first_name, last_name, phone_number) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: { email, password, first_name, last_name, phone_number }
    });
  },

  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    
    // Store token and user info
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  logout: async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return apiRequest('/auth/logout', { method: 'POST', requiresAuth: true });
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me', { requiresAuth: true });
  }
};

/**
 * Events API Calls
 */
const EventsAPI = {
  getAll: async (category = null, page = 1, limit = 10) => {
    let endpoint = `/events?page=${page}&limit=${limit}`;
    if (category && category !== 'all') {
      endpoint += `&category=${category}`;
    }
    return apiRequest(endpoint);
  },

  getById: async (id) => {
    return apiRequest(`/events/${id}`);
  },

  create: async (eventData) => {
    return apiRequest('/events', {
      method: 'POST',
      body: eventData,
      requiresAuth: true
    });
  },

  update: async (id, eventData) => {
    return apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: eventData,
      requiresAuth: true
    });
  },

  delete: async (id) => {
    return apiRequest(`/events/${id}`, {
      method: 'DELETE',
      requiresAuth: true
    });
  },

  search: async (query) => {
    return apiRequest(`/events?search=${encodeURIComponent(query)}`);
  }
};

/**
 * Bookings API Calls
 */
const BookingsAPI = {
  getUserBookings: async () => {
    return apiRequest('/bookings', { requiresAuth: true });
  },

  create: async (event_id, number_of_attendees = 1) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: { event_id, number_of_attendees },
      requiresAuth: true
    });
  },

  cancel: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      requiresAuth: true
    });
  },

  getEventAttendees: async (eventId) => {
    return apiRequest(`/bookings/event/${eventId}/attendees`, {
      requiresAuth: true
    });
  }
};

/**
 * Utility Functions
 */
const APIUtils = {
  setApiUrl: (url) => {
    localStorage.setItem('apiUrl', url);
    API_CONFIG.BASE_URL = url;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  getCurrentUserData: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  clearAuth: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};
