const express = require('express');
const router = express.Router();
const { Cashfree } = require('cashfree-pg');
const Order = require('../models/Order');
const Trip = require('../models/Trip');
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');

// Initialize Cashfree
const cashfree = new Cashfree(Cashfree.SANDBOX, process.env.CASHFREE_APP_ID, process.env.CASHFREE_SECRET_KEY);

// Create payment order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { tripId, eventId, accommodationType, amount } = req.body;
    const userId = req.user.id;

    // Validate that either tripId or eventId is provided
    if (!tripId && !eventId) {
      return res.status(400).json({ success: false, message: 'Either tripId or eventId is required' });
    }

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get frontend URL from environment variables
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    
    const orderRequest = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: userId,
        customer_email: req.user.email,
        customer_phone: req.user.phone || '9999999999'
      },
      order_meta: {
        return_url: `${frontendUrl}/payment/response?order_id=${orderId}`,
        notify_url: `${backendUrl}/api/payments/webhook`
      },
      order_note: `Booking for ${tripId ? 'trip' : 'event'}: ${tripId || eventId}, Accommodation: ${accommodationType}`
    };

    // Create order with Cashfree
    const response = await cashfree.PGCreateOrder(orderRequest);
    
    // Save order to database
    const newOrder = new Order({
      orderId,
      tripId,
      eventId,
      userId,
      amount,
      currency: 'INR',
      status: 'PENDING',
      paymentSessionId: response.data.payment_session_id,
      accommodationType
    });
    
    await newOrder.save();
    
    res.status(200).json({
      success: true,
      orderId,
      paymentSessionId: response.data.payment_session_id,
      return_url: `${frontendUrl}/payment/response?order_id=${orderId}`
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
});

// Get order status - MAKE THIS ROUTE PUBLIC (NO AUTH MIDDLEWARE)
router.get('/order-status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Get latest status from Cashfree
    const response = await cashfree.PGOrderFetchPayments(orderId);
    
    // The response.data is an array of transactions
    const transactions = response.data || [];
    
    // Update order status if needed
    if (transactions.length > 0) {
      // Determine order status based on transactions (similar to frontend logic)
      let orderStatus;
      if (transactions.filter(t => t.payment_status === "SUCCESS").length > 0) {
        orderStatus = "SUCCESS";
      } else if (transactions.filter(t => t.payment_status === "PENDING").length > 0) {
        orderStatus = "PENDING";
      } else {
        orderStatus = "FAILURE";
      }
      
      order.status = orderStatus;
      await order.save();
    }
    
    res.status(200).json({
      success: true,
      status: order.status,
      amount: order.amount,
      orderId: order.orderId,
      tripId: order.tripId,
      eventId: order.eventId,
      transactions: transactions // Include the transactions array
    });
  } catch (error) {
    console.error('Error fetching order status:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order status' });
  }
});

// Webhook to handle payment status updates
router.post('/webhook', async (req, res) => {
  try {
    const { order_id, order_status, payment_amount, payment_time } = req.body;
    
    // Verify the webhook signature (important for security)
    const signature = req.headers['x-cf-signature'];
    const isValidSignature = cashfree.PGVerifyWebhookSignature(
      JSON.stringify(req.body),
      signature,
      process.env.CASHFREE_WEBHOOK_SECRET
    );
    
    if (!isValidSignature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
    
    // Update order status in database
    const order = await Order.findOne({ orderId: order_id });
    
    if (order) {
      // Map Cashfree status to our internal status
      let status;
      if (order_status === 'PAID') {
        status = 'SUCCESS';
      } else if (order_status === 'PENDING') {
        status = 'PENDING';
      } else {
        status = 'FAILURE';
      }
      
      order.status = status;
      order.paymentAmount = payment_amount;
      order.paymentTime = payment_time ? new Date(payment_time) : null;
      
      if (status === 'SUCCESS') {
        // Create booking in your booking system
        // This is where you would create a booking record
      }
      
      await order.save();
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

// Get user payments
router.get('/user', protect, async (req, res) => {
  try {
    const payments = await Order.find({ userId: req.user._id })
      .populate('tripId', 'tripTitle')
      .populate('eventId', 'eventTitle')
      .sort({ createdAt: -1 });
    
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
});

// Get host payments
router.get('/host', protect, async (req, res) => {
  try {
    // Find all trips/events created by this host
    const trips = await Trip.find({ createdBy: req.user._id });
    const events = await Event.find({ createdBy: req.user._id });
    
    const tripIds = trips.map(trip => trip._id);
    const eventIds = events.map(event => event._id);
    
    // Find all payments for these trips/events
    const payments = await Order.find({
      $or: [
        { tripId: { $in: tripIds } },
        { eventId: { $in: eventIds } }
      ]
    })
      .populate('userId', 'firstName lastName email')
      .populate('tripId', 'tripTitle')
      .populate('eventId', 'eventTitle')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ payments });
  } catch (error) {
    console.error('Error fetching host payments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
});

module.exports = router;