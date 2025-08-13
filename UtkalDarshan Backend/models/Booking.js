const mongoose = require('mongoose');

const travelerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true }
});

const bookingSchema = new mongoose.Schema({
  // Package Details
  packageCode: { type: String, required: true },
  packageTitle: { type: String, required: true },
  packagePrice: { type: Number, required: true },
  packageDuration: { type: Number, required: true },
  
  // Location Details
  city: { type: String, required: true },
  hotel: { type: String, required: true },
  hotelPrice: { type: Number, required: true },
  
  // Dates
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  
  // Transportation
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  pickupCoordinates: {
    lat: Number,
    lng: Number
  },
  dropCoordinates: {
    lat: Number,
    lng: Number
  },
  cabType: { type: String, required: true },
  cabPrice: { type: Number, default: 0 },
  
  // Guest Details
  numberOfGuests: { type: Number, required: true },
  travelers: [travelerSchema],
  
  // Contact Details
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerMobile: { type: String, required: true },
  
  // Special Requests
  specialRequests: String,
  
  // Pricing
  couponCode: String,
  couponDiscount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  
  // Payment
  paymentMethod: { type: String, default: 'Pay at Arrival' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Cancelled'], default: 'Pending' },
  
  // Booking Status
  status: { type: String, enum: ['Confirmed', 'Pending', 'Cancelled'], default: 'Pending' },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
