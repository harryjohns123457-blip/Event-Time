// Check authentication
document.addEventListener('DOMContentLoaded', () => {
  if (!isAuthenticated()) {
    showAlert('Please login to view your bookings', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
    return;
  }
  loadMyBookings();
});

async function loadMyBookings() {
  try {
    showLoading(true);
    const result = await getMyBookings();

    if (result.success && result.bookings) {
      displayBookings(result.bookings);
    } else {
      showAlert('Failed to load bookings', 'error');
    }
  } catch (error) {
    showAlert(error.message, 'error');
  } finally {
    showLoading(false);
  }
}

function displayBookings(bookings) {
  const container = document.getElementById('bookingsContainer');
  if (!container) return;

  if (bookings.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 20px;">No bookings found</p>';
    return;
  }

  container.innerHTML = bookings
    .map(
      (booking) => `
    <div class="booking-card" style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
      <h3>${booking.eventId.title}</h3>
      <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
      <p><strong>Date:</strong> ${new Date(booking.eventId.date).toLocaleDateString()}</p>
      <p><strong>Ticket Type:</strong> ${booking.ticketType}</p>
      <p><strong>Quantity:</strong> ${booking.ticketQuantity}</p>
      <p><strong>Total Price:</strong> KSH ${booking.totalPrice.toLocaleString()}</p>
      <p><strong>Status:</strong> <span style="padding: 5px 10px; border-radius: 4px; background: ${getStatusColor(booking.bookingStatus)};">${booking.bookingStatus.toUpperCase()}</span></p>
      ${booking.bookingStatus !== 'cancelled' ? `<button onclick="cancelBookingHandler('${booking._id}')" style="margin-top: 10px; padding: 8px 15px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel Booking</button>` : ''}
    </div>
  `
    )
    .join('');
}

function getStatusColor(status) {
  switch (status) {
    case 'confirmed':
      return '#4CAF50';
    case 'pending':
      return '#FFC107';
    case 'cancelled':
      return '#f44336';
    default:
      return '#999';
  }
}

async function cancelBookingHandler(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;

  try {
    showLoading(true);
    const result = await cancelBooking(bookingId);

    if (result.success) {
      showAlert('Booking cancelled successfully', 'success');
      loadMyBookings();
    } else {
      showAlert(result.message, 'error');
    }
  } catch (error) {
    showAlert(error.message, 'error');
  } finally {
    showLoading(false);
  }
}