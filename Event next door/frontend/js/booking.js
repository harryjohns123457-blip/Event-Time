// Get event ID from URL
const getEventIdFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('eventId');
};

// Load event details on page load
document.addEventListener('DOMContentLoaded', loadEventDetails);

async function loadEventDetails() {
  const eventId = getEventIdFromURL();
  if (!eventId) {
    showAlert('No event selected', 'error');
    return;
  }

  try {
    showLoading(true);
    const result = await getEventById(eventId);
    
    if (result.success && result.event) {
      displayEventDetails(result.event);
      setupBookingForm(result.event);
    } else {
      showAlert('Event not found', 'error');
    }
  } catch (error) {
    showAlert(error.message, 'error');
  } finally {
    showLoading(false);
  }
}

function displayEventDetails(event) {
  const detailsContainer = document.getElementById('eventDetails');
  if (!detailsContainer) return;

  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  detailsContainer.innerHTML = `
    <div class="event-detail-card">
      <img src="${event.image}" alt="${event.title}" class="event-image">
      <div class="event-info">
        <h1>${event.title}</h1>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Time:</strong> ${event.time}</p>
        <p><strong>Venue:</strong> ${event.venue}</p>
        <p><strong>Available Seats:</strong> ${event.availableSeats}/${event.capacity}</p>
        <p class="event-description">${event.description}</p>
      </div>
    </div>
  `;
}

function setupBookingForm(event) {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  if (!isAuthenticated()) {
    form.innerHTML = `
      <div class="alert-warning" style="padding: 15px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; margin: 10px 0;">
        <p>Please <a href="login.html" style="color: #0066cc; text-decoration: underline;">login</a> or <a href="register.html" style="color: #0066cc; text-decoration: underline;">register</a> to book an event.</p>
      </div>
    `;
    return;
  }

  form.innerHTML = `
    <h2>Book This Event</h2>
    <div class="form-group">
      <label for="ticketType">Ticket Type:</label>
      <select id="ticketType" required>
        <option value="">Select ticket type</option>
        <option value="Regular">Regular - KSH ${event.pricing.regular.discountPrice || event.pricing.regular.price}</option>
        <option value="VIP">VIP - KSH ${event.pricing.vip.discountPrice || event.pricing.vip.price}</option>
        <option value="VVIP">VVIP - KSH ${event.pricing.vvip.discountPrice || event.pricing.vvip.price}</option>
      </select>
    </div>
    <div class="form-group">
      <label for="ticketQuantity">Number of Tickets:</label>
      <input type="number" id="ticketQuantity" min="1" max="10" value="1" required>
    </div>
    <div class="form-group">
      <label for="mpesaTransactionId">M-PESA Transaction ID:</label>
      <input type="text" id="mpesaTransactionId" placeholder="Enter M-PESA transaction ID" required>
    </div>
    <div id="totalPrice" style="font-size: 18px; font-weight: bold; margin: 15px 0; color: #4CAF50;">
      Total: KSH 0
    </div>
    <button type="submit" class="btn-book">Confirm Booking</button>
  `;

  // Calculate total price
  const ticketTypeSelect = form.querySelector('#ticketType');
  const quantityInput = form.querySelector('#ticketQuantity');

  const updateTotalPrice = () => {
    const ticketType = ticketTypeSelect.value;
    const quantity = parseInt(quantityInput.value) || 1;
    if (ticketType) {
      const typeKey = ticketType.toLowerCase();
      const price = event.pricing[typeKey].discountPrice || event.pricing[typeKey].price;
      const total = price * quantity;
      document.getElementById('totalPrice').textContent = `Total: KSH ${total.toLocaleString()}`;
    }
  };

  ticketTypeSelect.addEventListener('change', updateTotalPrice);
  quantityInput.addEventListener('change', updateTotalPrice);

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await submitBooking(event._id);
  });
}

async function submitBooking(eventId) {
  const ticketType = document.getElementById('ticketType').value;
  const ticketQuantity = parseInt(document.getElementById('ticketQuantity').value);
  const mpesaTransactionId = document.getElementById('mpesaTransactionId').value;

  if (!ticketType || !ticketQuantity || !mpesaTransactionId) {
    showAlert('Please fill in all fields', 'error');
    return;
  }

  try {
    showLoading(true);
    const bookingData = {
      eventId,
      ticketType,
      ticketQuantity,
      mpesaTransactionId,
    };

    const result = await createBooking(bookingData);

    if (result.success) {
      showAlert('Booking confirmed! Check your email for details.', 'success');
      setTimeout(() => {
        window.location.href = 'my-bookings.html';
      }, 2000);
    } else {
      showAlert(result.message, 'error');
    }
  } catch (error) {
    showAlert(error.message, 'error');
  } finally {
    showLoading(false);
  }
}