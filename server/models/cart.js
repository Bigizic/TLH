const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Cart Item Schema
const CartItemSchema = new Schema({
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  coupon: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  eventName: {
    type: String,
    required: true
  },
  ticketType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  ticketQuantity: {
    type: Number,
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Boolean,
    default: false
  },
  discountPrice: {
    type: Number
  }
});

// Cart Schema
const CartSchema = new Schema({
  tickets: [CartItemSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  total: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days from now
  }
});

// Calculate total before saving
CartSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate total
  let total = 0;
  if (this.tickets && this.tickets.length > 0) {
    total = this.tickets.reduce((sum, item) => {
      const itemPrice = item.discount && item.discountPrice ? item.discountPrice : item.price;
      return sum + (itemPrice * item.quantity);
    }, 0);
  }
  
  this.total = total;
  next();
});

module.exports = mongoose.model('Cart', CartSchema);