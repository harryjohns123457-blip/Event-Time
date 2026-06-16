/**
 * Login Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  
  if (!loginForm) return;

  // Redirect if already logged in
  if (APIUtils.isAuthenticated()) {
    window.location.href = 'event_list.html';
    return;
  }

  loginForm.addEventListener('submit', handleLoginSubmit);
});

/**
 * Handle login form submission
 */
async function handleLoginSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const formErrorEl = document.getElementById('formError');
  const submitButton = form.querySelector('button[type="submit"]');

  // Clear previous errors
  formErrorEl.textContent = '';

  // Validate inputs
  const errors = {};
  if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email';
  }
  if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Object.keys(errors).length > 0) {
    displayFormErrors(errors, form);
    return;
  }

  // Disable button during submission
  submitButton.disabled = true;
  submitButton.textContent = 'Logging in...';

  try {
    const response = await AuthAPI.login(email, password);
    
    showNotification('Login successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'event_list.html';
    }, 1500);
  } catch (error) {
    formErrorEl.textContent = error.message || 'Login failed. Please try again.';
    showNotification(error.message, 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Login';
  }
}
