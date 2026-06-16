const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

// Protected routes (all booking routes require authentication)
router.get('/', authMiddleware, bookingController.getUserBookings);
router.post('/', authMiddleware, bookingController.createBooking);
router.put('/:id/cancel', authMiddleware, bookingController.cancelBooking);
router.get('/event/:eventId/attendees', authMiddleware, bookingController.getEventAttendees);

module.exports = router;
