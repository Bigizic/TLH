const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  checkedIn: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically update `updatedAt` on save
guestSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Guest', guestSchema);
