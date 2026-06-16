const supabase = require('../config/supabase');

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        events(title, start_date, end_date, location)
      `)
      .eq('user_id', req.user.id)
      .order('booking_date', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch bookings',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: err.message
    });
  }
};

// Create booking
const createBooking = async (req, res) => {
  try {
    const { event_id, number_of_attendees } = req.body;

    if (!event_id) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }

    // Get event details for pricing
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('price, max_attendees')
      .eq('id', event_id)
      .single();

    if (eventError) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: eventError.message
      });
    }

    // Calculate total price
    const total_price = event.price * (number_of_attendees || 1);

    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([{
        user_id: req.user.id,
        event_id,
        number_of_attendees: number_of_attendees || 1,
        total_price,
        booking_status: 'confirmed'
      }])
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create booking',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: err.message
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify user owns this booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || booking.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Update booking status
    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({ booking_status: 'cancelled' })
      .eq('id', id)
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to cancel booking',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: updatedBooking[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: err.message
    });
  }
};

// Get event attendees
const getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        users(first_name, last_name, email)
      `)
      .eq('event_id', eventId)
      .eq('booking_status', 'confirmed');

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch attendees',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendees',
      error: err.message
    });
  }
};

module.exports = {
  getUserBookings,
  createBooking,
  cancelBooking,
  getEventAttendees
};
