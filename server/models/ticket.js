const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coupons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  }],
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Boolean,
    default: false
  },
  discountPrice: {
    type: Number,
  },
  quantity: {
    type: Number,
    default: 0
  },
  qrCode: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRCode'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
