// Routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Trip = require('../models/Trip');
const Event = require('../models/Event');
const auth = require('../middleware/authMiddleware');

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { tripId, eventId, numberOfPeople } = req.body;
    
    if (!tripId && !eventId) {
      return res.status(400).json({ message: 'Trip ID or Event ID is required' });
    }

    let item;
    let itemType;
    if (tripId) {
      item = await Trip.findById(tripId);
      itemType = 'trip';
    } else {
      item = await Event.findById(eventId);
      itemType = 'event';
    }

    if (!item) {
      return res.status(404).json({ message: 'Trip or Event not found' });
    }

    // Calculate total price
    const pricePerPerson = itemType === 'trip' ? item.basePrice : item.pricing.totalPrice;
    const totalPrice = pricePerPerson * numberOfPeople;

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      trip: tripId,
      event: eventId,
      numberOfPeople,
      totalPrice
    });

    await booking.save();

    // If the booking process is 'approval', create a notification for the host
    if (item.bookingProcess === 'approval') {
      const notification = new Notification({
        user: item.host, // Assuming the trip/event has a host field
        type: 'booking_approval',
        relatedBooking: booking._id,
        message: `New booking request for ${itemType === 'trip' ? item.tripTitle : item.eventTitle}`
      });
      await notification.save();
    }

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings for a user
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('trip')
      .populate('event');
    
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings that need approval (for host)
router.get('/pending-approvals', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate('trip')
      .populate('event');
    
    // Filter bookings that belong to the current user's trips/events
    const filteredBookings = bookings.filter(booking => {
      if (booking.trip && booking.trip.host.toString() === req.user.id) {
        return true;
      }
      if (booking.event && booking.event.host.toString() === req.user.id) {
        return true;
      }
      return false;
    });

    res.json(filteredBookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all pending bookings (same as pending-approvals but different path)
router.get('/pending', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate('trip')
      .populate('event');
    
    // Filter bookings that belong to the current user's trips/events
    const filteredBookings = bookings.filter(booking => {
      if (booking.trip && booking.trip.host.toString() === req.user.id) {
        return true;
      }
      if (booking.event && booking.event.host.toString() === req.user.id) {
        return true;
      }
      return false;
    });

    res.json(filteredBookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings for a specific trip
router.get('/trip/:tripId', auth, async (req, res) => {
  try {
    const { tripId } = req.params;
    
    // Find all bookings for this trip and populate user details
    const bookings = await Booking.find({ trip: tripId })
      .populate('user', 'firstName lastName email profileImage')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve a booking
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the current user is the host of the trip/event
    let item;
    if (booking.trip) {
      item = await Trip.findById(booking.trip);
    } else {
      item = await Event.findById(booking.event);
    }

    if (!item || item.host.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'approved';
    await booking.save();

    // Create notification for the user who made the booking
    const notification = new Notification({
      user: booking.user,
      type: 'booking_approved',
      relatedBooking: booking._id,
      message: `Your booking for ${item.tripTitle || item.eventTitle} has been approved`
    });
    await notification.save();

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject a booking
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the current user is the host of the trip/event
    let item;
    if (booking.trip) {
      item = await Trip.findById(booking.trip);
    } else {
      item = await Event.findById(booking.event);
    }

    if (!item || item.host.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'rejected';
    await booking.save();

    // Create notification for the user who made the booking
    const notification = new Notification({
      user: booking.user,
      type: 'booking_rejected',
      relatedBooking: booking._id,
      message: `Your booking for ${item.tripTitle || item.eventTitle} has been rejected`
    });
    await notification.save();

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;