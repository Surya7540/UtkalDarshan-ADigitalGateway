const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const emailService = require('../services/emailService');

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const {
      packageCode,
      packageTitle,
      packagePrice,
      packageDuration,
      city,
      hotel,
      hotelPrice,
      checkIn,
      checkOut,
      pickupLocation,
      dropLocation,
      pickupCoordinates,
      dropCoordinates,
      cabType,
      cabPrice,
      numberOfGuests,
      travelers,
      customerName,
      customerEmail,
      customerMobile,
      specialRequests,
      couponCode,
      couponDiscount,
      totalPrice,
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!packageCode || !customerName || !customerEmail || !customerMobile) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new booking
    const booking = new Booking({
      packageCode,
      packageTitle,
      packagePrice,
      packageDuration,
      city,
      hotel,
      hotelPrice,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      pickupLocation,
      dropLocation,
      pickupCoordinates,
      dropCoordinates,
      cabType,
      cabPrice,
      numberOfGuests,
      travelers,
      customerName,
      customerEmail,
      customerMobile,
      specialRequests,
      couponCode,
      couponDiscount,
      totalPrice,
      paymentMethod,
      status: 'Confirmed',
      paymentStatus: 'Pending'
    });

    // Save booking to database
    const savedBooking = await booking.save();

    // Send email notifications
    try {
      // Send notification to admin
      await emailService.sendBookingNotification(savedBooking);
      
      // Send confirmation to customer
      await emailService.sendCustomerConfirmation(savedBooking);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: savedBooking,
      bookingId: savedBooking._id
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      error: 'Failed to create booking',
      message: error.message 
    });
  }
});

// Get all bookings (admin only)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ 
      error: 'Failed to fetch bookings',
      message: error.message 
    });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ 
      error: 'Failed to fetch booking',
      message: error.message 
    });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Confirmed', 'Pending', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({
      success: true,
      message: 'Booking status updated',
      booking
    });
    
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ 
      error: 'Failed to update booking status',
      message: error.message 
    });
  }
});

// Update payment status
router.patch('/:id/payment', async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    if (!['Pending', 'Paid', 'Cancelled'].includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({
      success: true,
      message: 'Payment status updated',
      booking
    });
    
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ 
      error: 'Failed to update payment status',
      message: error.message 
    });
  }
});

// Delete booking (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ 
      error: 'Failed to delete booking',
      message: error.message 
    });
  }
});

// Get booking statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'Confirmed'] }, 1, 0] }
          },
          pendingBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const monthlyStats = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    res.json({
      overview: stats[0] || {
        totalBookings: 0,
        totalRevenue: 0,
        confirmedBookings: 0,
        pendingBookings: 0,
        cancelledBookings: 0
      },
      monthlyStats
    });
    
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch booking statistics',
      message: error.message 
    });
  }
});

module.exports = router;
