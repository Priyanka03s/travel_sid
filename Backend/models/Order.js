const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'SUCCESS'],
    default: 'PENDING'
  },
  paymentSessionId: {
    type: String,
    required: true
  },
  accommodationType: {
    type: String,
    required: true
  },
  paymentAmount: Number,
  paymentTime: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);