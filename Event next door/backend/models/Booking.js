import mongoose from 'mongoose';
import crypto from 'crypto';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      default: () => 'BK' + crypto.randomBytes(8).toString('hex').toUpperCase(),
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    ticketType: {
      type: String,
      enum: ['Regular', 'VIP', 'VVIP'],
      required: true,
    },
    ticketQuantity: {
      type: Number,
      required: [true, 'Please provide ticket quantity'],
      min: 1,
      max: 10,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    mpesaTransactionId: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, eventId: 1, ticketType: 1 }, { unique: false });

bookingSchema.pre(/^find/, function (next) {
  this.populate('userId', 'fullName email phone').populate('eventId', 'title date venue');
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;