// Show/Hide Auth Forms
const showRegisterForm = () => {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('formTitle').textContent = 'Create Account';
};

const showLoginForm = () => {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('formTitle').textContent = 'Login';
};

// Handle Registration
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fullName = document.getElementById('regFullName').value;
  const email = document.getElementById('regEmail').value;
  const phone = document.getElementById('regPhone').value;
  const password = document.getElementById('regPassword').value;
  const passwordConfirm = document.getElementById('regPasswordConfirm').value;

  if (password !== passwordConfirm) {
    showAlert('Passwords do not match', 'error');
    return;
  }

  try {
    showLoading(true);
    const result = await registerUser(fullName, email, phone, password, passwordConfirm);
    if (result.success) {
      showAlert('Registration successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'event_list.html';
      }, 1500);
    } else {
      showAlert(result.message, 'error');
    }
  } catch (error) {
    showAlert(error.message, 'error');
  } finally {
    showLoading(false);
  }
});

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    showLoading(true);
    const result = await loginUser(email, password);
    if (result.success) {
      showAlert('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'event_list.html';
      }, 1500);
    } else {
      showAlert(result.message, 'error');
    }
  } catch (error) {
    showAlert(error.message, 'error');
  } finally {
    showLoading(false);
  }
});

// Handle Logout
const handleLogout = () => {
  logoutUser();
  showAlert('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
};

// Utility Functions
const showAlert = (message, type = 'info') => {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    border-radius: 4px;
    z-index: 9999;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease-in;
  `;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
};

const showLoading = (show) => {
  let loader = document.getElementById('loader');
  if (!loader && show) {
    loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      z-index: 10000;
    `;
    document.body.appendChild(loader);
  } else if (loader) {
    if (show) loader.style.display = 'block';
    else loader.style.display = 'none';
  }
};

// Check if user is logged in
if (isAuthenticated()) {
  const user = getCurrentUser();
  if (user) {
    const userNav = document.getElementById('userNav');
    if (userNav) {
      userNav.innerHTML = `
        <span>Welcome, ${user.fullName}!</span>
        <button onclick="handleLogout()" style="margin-left: 10px; padding: 8px 15px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer;">Logout</button>
      `;
    }
  }
}