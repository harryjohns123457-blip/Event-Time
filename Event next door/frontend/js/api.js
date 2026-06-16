// API Configuration
const API_BASE_URL = 'https://event-time-1.onrender.com';

// Store token in localStorage
const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

const getToken = () => {
  return localStorage.getItem('authToken');
};

const removeToken = () => {
  localStorage.removeItem('authToken');
};

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// AUTH API CALLS
const registerUser = async (fullName, email, phone, password, passwordConfirm) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ fullName, email, phone, password, passwordConfirm }),
    });
    const data = await response.json();
    if (data.success) {
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success) {
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const logoutUser = () => {
  removeToken();
  localStorage.removeItem('user');
  return { success: true, message: 'Logged out successfully' };
};

const getProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// EVENT API CALLS
const getAllEvents = async (category = '', search = '') => {
  try {
    let url = `${API_BASE_URL}/events`;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (params.toString()) url += '?' + params.toString();

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getEventById = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const createEvent = async (eventData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const updateEvent = async (eventId, eventData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// BOOKING API CALLS
const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getMyBookings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getBookingById = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const cancelBooking = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getAllBookings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// AUTH CHECK
const isAuthenticated = () => {
  return !!getToken();
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};