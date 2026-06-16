/**
 * Events List Page Script
 * Handles event browsing, filtering, searching, and pagination
 */

let currentPage = 1;
let currentCategory = 'all';
let currentSearchQuery = '';
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
  initializeEventListPage();
});

/**
 * Initialize event list page
 */
async function initializeEventListPage() {
  // Update user greeting
  const user = APIUtils.getCurrentUserData();
  const userGreeting = document.getElementById('userGreeting');
  if (userGreeting && user) {
    userGreeting.textContent = `Welcome, ${user.first_name || user.email}`;
  }

  // Setup event listeners
  setupCategoryFilters();
  setupSearchBox();

  // Load initial events
  await loadEvents();
}

/**
 * Setup category filter buttons
 */
function setupCategoryFilters() {
  const categoryNav = document.querySelector('.category-nav');
  if (!categoryNav) return;

  const categoryLinks = categoryNav.querySelectorAll('a[data-category]');
  categoryLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Update active state
      categoryLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      currentCategory = link.dataset.category;
      currentPage = 1;
      await loadEvents();
    });
  });

  // Set first link as active
  categoryLinks[0]?.classList.add('active');
}

/**
 * Setup search box
 */
function setupSearchBox() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  // Debounce search
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      currentSearchQuery = e.target.value.trim();
      currentPage = 1;
      await loadEvents();
    }, 300);
  });
}

/**
 * Load and display events
 */
async function loadEvents() {
  const container = document.getElementById('eventsContainer');
  const spinner = document.getElementById('loadingSpinner');
  const errorBanner = document.getElementById('errorBanner');
  const errorMessage = document.getElementById('errorMessage');

  // Show loading state
  spinner.style.display = 'block';
  errorBanner.style.display = 'none';

  try {
    const response = await EventsAPI.getAll(
      currentCategory === 'all' ? null : currentCategory,
      currentPage,
      itemsPerPage
    );

    if (!response.data || response.data.length === 0) {
      container.innerHTML = '<p class="no-events">No events found. Try searching or changing filters.</p>';
      document.getElementById('pagination').innerHTML = '';
      return;
    }

    // Render events
    container.innerHTML = response.data
      .map(event => createEventCard(event))
      .join('');

    // Setup event card listeners
    setupEventCardListeners();

    // Render pagination
    renderPagination(response.pagination);
  } catch (error) {
    errorMessage.textContent = error.message || 'Failed to load events';
    errorBanner.style.display = 'block';
    container.innerHTML = '';
  } finally {
    spinner.style.display = 'none';
  }
}

/**
 * Create event card HTML
 */
function createEventCard(event) {
  const startDate = formatDate(event.start_date);
  const endDate = formatDate(event.end_date);
  const price = event.price > 0 ? formatCurrency(event.price) : 'Free';

  return `
    <div class="event-card" data-event-id="${event.id}">
      ${event.image_url ? `<img src="${event.image_url}" alt="${event.title}" class="event-image">` : '<div class="event-image-placeholder">No Image</div>'}
      <div class="event-content">
        <h3 class="event-title">${escapeHtml(event.title)}</h3>
        <p class="event-description">${escapeHtml(event.description || 'No description provided')}</p>
        <div class="event-meta">
          <span class="event-date">📅 ${startDate}</span>
          <span class="event-location">📍 ${escapeHtml(event.location || 'TBA')}</span>
        </div>
        <div class="event-footer">
          <span class="event-price">${price}</span>
          <button class="book-btn" onclick="bookEvent('${event.id}')">Book Now</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Setup event card listeners
 */
function setupEventCardListeners() {
  const eventCards = document.querySelectorAll('.event-card');
  eventCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('book-btn')) return;
      const eventId = card.dataset.eventId;
      window.location.href = `event_detail.html?id=${eventId}`;
    });
  });
}

/**
 * Book event
 */
async function bookEvent(eventId) {
  if (!APIUtils.isAuthenticated()) {
    showNotification('Please login to book events', 'warning');
    window.location.href = 'login.html';
    return;
  }

  try {
    await BookingsAPI.create(eventId, 1);
    showNotification('Event booked successfully!', 'success');
    setTimeout(() => {
      window.location.href = 'my-bookings.html';
    }, 1500);
  } catch (error) {
    showNotification('Failed to book event: ' + error.message, 'error');
  }
}

/**
 * Render pagination controls
 */
function renderPagination(pagination) {
  const paginationContainer = document.getElementById('pagination');
  if (!pagination || pagination.total <= itemsPerPage) {
    paginationContainer.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(pagination.total / itemsPerPage);
  let html = '<div class="pagination-buttons">';

  // Previous button
  if (currentPage > 1) {
    html += `<button onclick="changePage(${currentPage - 1})">← Previous</button>`;
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<span class="current-page">${i}</span>`;
    } else if (i <= 5 || i > totalPages - 2) {
      html += `<button onclick="changePage(${i})">${i}</button>`;
    } else if (i === 6) {
      html += '<span>...</span>';
    }
  }

  // Next button
  if (currentPage < totalPages) {
    html += `<button onclick="changePage(${currentPage + 1})">Next →</button>`;
  }

  html += '</div>';
  paginationContainer.innerHTML = html;
}

/**
 * Change page
 */
async function changePage(page) {
  currentPage = page;
  await loadEvents();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
