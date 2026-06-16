import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
    },
    category: {
      type: String,
      enum: ['Trending', 'Music, Social & Cultural', 'Adventures, Tour & Photography'],
      required: [true, 'Please provide event category'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide event date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide event time'],
    },
    venue: {
      type: String,
      required: [true, 'Please provide event venue'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide event capacity'],
      min: 1,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide event image URL'],
    },
    pricing: {
      regular: {
        price: Number,
        discountPrice: Number,
      },
      vip: {
        price: Number,
        discountPrice: Number,
      },
      vvip: {
        price: Number,
        discountPrice: Number,
      },
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Update available seats when event is created
eventSchema.pre('save', function (next) {
  if (this.isNew) {
    this.availableSeats = this.capacity;
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;