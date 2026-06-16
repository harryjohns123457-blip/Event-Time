/**
 * Main Page Script
 * Handles home page interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initializeHomePage();
});

/**
 * Initialize home page
 */
function initializeHomePage() {
  // Update user nav
  updateUserNav();

  // Setup button interactions
  setupButtons();
}

/**
 * Setup button click handlers
 */
function setupButtons() {
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      if (APIUtils.isAuthenticated()) {
        window.location.href = 'event_list.html';
      } else {
        window.location.href = 'login.html';
      }
    });
  }
}
