/**
 * Authentication Helper Functions
 * Manages user authentication state and UI updates
 */

/**
 * Update navigation based on authentication status
 */
function updateUserNav() {
  const userNav = document.getElementById('userNav');
  const isAuthenticated = APIUtils.isAuthenticated();
  const user = APIUtils.getCurrentUserData();

  if (userNav) {
    if (isAuthenticated && user) {
      userNav.innerHTML = `
        <span id="userGreeting">Welcome, ${user.first_name || user.email}</span>
        <a href="#" class="nav-link" onclick="handleLogout(event)">Logout</a>
      `;
    } else {
      userNav.innerHTML = `
        <a href="login.html" class="nav-link">LogIn</a>
        <a href="register.html" class="nav-link">Register</a>
      `;
    }
  }
}

/**
 * Handle user logout
 */
async function handleLogout(event) {
  event.preventDefault();
  
  try {
    await AuthAPI.logout();
    APIUtils.clearAuth();
    updateUserNav();
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    showNotification('Logout failed: ' + error.message, 'error');
  }
}

/**
 * Show notification banner
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.setAttribute('role', 'alert');
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Format currency for display
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Validate email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
function validatePassword(password) {
  return password && password.length >= 6;
}

/**
 * Display form validation errors
 */
function displayFormErrors(errors, form) {
  // Clear previous errors
  form.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
  });

  // Display new errors
  Object.keys(errors).forEach(field => {
    const errorElement = form.querySelector(`#${field}Error`);
    if (errorElement) {
      errorElement.textContent = errors[field];
    }
  });
}

/**
 * Get form data as object
 */
function getFormData(form) {
  const formData = new FormData(form);
  const data = {};
  
  formData.forEach((value, key) => {
    data[key] = value;
  });
  
  return data;
}

/**
 * Initialize authentication UI on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  updateUserNav();
});
