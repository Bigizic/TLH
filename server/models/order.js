const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    default: null
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  }],
  tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  },
  finalAmount: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  amountBeforeDiscount: {
    type: Number,
    required: true
  },

  paymentStatus: {
    type: String,
    reuqired: true,
  },
  paymentMethod: {
    type: String
  },
  payStackReference: {
    type: String,
  },
  payStackId: {
    type: String,
  },
  paymentFees: {
    type: String,
  },
  
  status: {
    type: String,
    default: false,
  },
  billingEmail: {
    type: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
