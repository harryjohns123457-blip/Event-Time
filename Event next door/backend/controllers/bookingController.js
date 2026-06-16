import Booking from '../models/Booking.js';
import Event from '../models/Event.js';

export const createBooking = async (req, res, next) => {
  try {
    const { eventId, ticketType, ticketQuantity, mpesaTransactionId } = req.body;

    // Validation
    if (!eventId || !ticketType || !ticketQuantity || !mpesaTransactionId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Get event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check available seats
    if (event.availableSeats < ticketQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${event.availableSeats} seats available`,
      });
    }

    // Get pricing
    const ticketTypeKey = ticketType.toLowerCase();
    const pricing = event.pricing[ticketTypeKey];
    if (!pricing) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket type',
      });
    }

    // Calculate total price (use discount if available)
    const pricePerTicket = pricing.discountPrice || pricing.price;
    const totalPrice = pricePerTicket * ticketQuantity;

    // Check for duplicate booking
    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      eventId,
      ticketType,
      bookingStatus: { $in: ['pending', 'confirmed'] },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a booking for this event and ticket type',
      });
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      eventId,
      ticketType,
      ticketQuantity,
      totalPrice,
      mpesaTransactionId,
    });

    // Update available seats
    event.availableSeats -= ticketQuantity;
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('eventId')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check ownership
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check ownership
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';
    await booking.save();

    // Restore available seats
    const event = await Event.findById(booking.eventId);
    event.availableSeats += booking.ticketQuantity;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'fullName email phone')
      .populate('eventId', 'title date')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};