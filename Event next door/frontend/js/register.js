/**
 * Register Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  
  if (!registerForm) return;

  // Redirect if already logged in
  if (APIUtils.isAuthenticated()) {
    window.location.href = 'event_list.html';
    return;
  }

  registerForm.addEventListener('submit', handleRegisterSubmit);
});

/**
 * Handle registration form submission
 */
async function handleRegisterSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const formErrorEl = document.getElementById('formError');
  const submitButton = form.querySelector('button[type="submit"]');

  // Clear previous errors
  formErrorEl.textContent = '';
  form.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
  });

  // Get form values
  const firstName = formData.get('firstName')?.trim();
  const lastName = formData.get('lastName')?.trim();
  const email = formData.get('email')?.trim();
  const phone = formData.get('phone')?.trim();
  const password = formData.get('password');
  const passwordConfirm = formData.get('passwordConfirm');

  // Validate inputs
  const errors = {};
  if (!firstName) {
    errors.firstName = 'First name is required';
  }
  if (!lastName) {
    errors.lastName = 'Last name is required';
  }
  if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email';
  }
  if (!phone) {
    errors.phone = 'Phone number is required';
  }
  if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (password !== passwordConfirm) {
    errors.passwordConfirm = 'Passwords do not match';
  }

  if (Object.keys(errors).length > 0) {
    displayFormErrors(errors, form);
    return;
  }

  // Disable button during submission
  submitButton.disabled = true;
  submitButton.textContent = 'Creating Account...';

  try {
    const response = await AuthAPI.register(
      email,
      password,
      firstName,
      lastName,
      phone
    );
    
    showNotification('Registration successful! Please check your email to verify your account.', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  } catch (error) {
    formErrorEl.textContent = error.message || 'Registration failed. Please try again.';
    showNotification(error.message, 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Register';
  }
}
