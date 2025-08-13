const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'utkaldarsan15@gmail.com',
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendBookingNotification(bookingData) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'utkaldarsan15@gmail.com';
      
      const mailOptions = {
        from: `"UtkalDarshan" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `🎉 New Booking Confirmed - ${bookingData.packageTitle}`,
        html: this.generateBookingEmailHTML(bookingData)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Booking notification email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending booking notification email:', error);
      return { success: false, error: error.message };
    }
  }

  generateBookingEmailHTML(booking) {
    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN');
    const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .section { margin: 20px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #ff6b35; }
          .highlight { background: #fff3cd; padding: 10px; border-radius: 5px; border: 1px solid #ffeaa7; }
          .price { font-size: 24px; font-weight: bold; color: #27ae60; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Booking Confirmed!</h1>
            <p>UtkalDarshan Tourism Package</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h2>📦 Package Details</h2>
              <p><strong>Package:</strong> ${booking.packageTitle}</p>
              <p><strong>Code:</strong> ${booking.packageCode}</p>
              <p><strong>Duration:</strong> ${booking.packageDuration} Days</p>
              <p><strong>Base Price:</strong> ${formatPrice(booking.packagePrice)}</p>
            </div>

            <div class="section">
              <h2>🏨 Accommodation</h2>
              <p><strong>City:</strong> ${booking.city}</p>
              <p><strong>Hotel:</strong> ${booking.hotel}</p>
              <p><strong>Check-in:</strong> ${formatDate(booking.checkIn)}</p>
              <p><strong>Check-out:</strong> ${formatDate(booking.checkOut)}</p>
              <p><strong>Hotel Cost:</strong> ${formatPrice(booking.hotelPrice)} per night</p>
            </div>

            <div class="section">
              <h2>🚗 Transportation</h2>
              <p><strong>Pickup:</strong> ${booking.pickupLocation}</p>
              <p><strong>Drop:</strong> ${booking.dropLocation}</p>
              <p><strong>Cab Type:</strong> ${booking.cabType}</p>
              <p><strong>Cab Cost:</strong> ${formatPrice(booking.cabPrice)}</p>
            </div>

            <div class="section">
              <h2>👥 Guest Information</h2>
              <p><strong>Number of Guests:</strong> ${booking.numberOfGuests}</p>
              <p><strong>Customer Name:</strong> ${booking.customerName}</p>
              <p><strong>Email:</strong> ${booking.customerEmail}</p>
              <p><strong>Mobile:</strong> ${booking.customerMobile}</p>
            </div>

            ${booking.specialRequests ? `
            <div class="section">
              <h2>📝 Special Requests</h2>
              <p>${booking.specialRequests}</p>
            </div>
            ` : ''}

            <div class="highlight">
              <h2>💰 Pricing Summary</h2>
              <p><strong>Package Total:</strong> ${formatPrice(booking.packagePrice * booking.numberOfGuests)}</p>
              <p><strong>Hotel Total:</strong> ${formatPrice(booking.hotelPrice * (booking.packageDuration - 1))}</p>
              <p><strong>Cab Cost:</strong> ${formatPrice(booking.cabPrice)}</p>
              ${booking.couponDiscount > 0 ? `<p><strong>Coupon Discount:</strong> -${formatPrice(booking.couponDiscount)}</p>` : ''}
              <p class="price"><strong>Total Amount:</strong> ${formatPrice(booking.totalPrice)}</p>
            </div>

            <div class="section">
              <h2>📅 Booking Timeline</h2>
              <p><strong>Booking Date:</strong> ${formatDate(booking.createdAt)}</p>
              <p><strong>Status:</strong> <span style="color: #27ae60; font-weight: bold;">${booking.status}</span></p>
              <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
            </div>
          </div>

          <div class="footer">
            <p>This is an automated notification from UtkalDarshan Tourism System</p>
            <p>Booking ID: ${booking._id}</p>
            <p>© ${new Date().getFullYear()} UtkalDarshan. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendCustomerConfirmation(bookingData) {
    try {
      const mailOptions = {
        from: `"UtkalDarshan" <${process.env.EMAIL_USER}>`,
        to: bookingData.customerEmail,
        subject: `✅ Your Odisha Tour Booking is Confirmed!`,
        html: this.generateCustomerEmailHTML(bookingData)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Customer confirmation email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending customer confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  generateCustomerEmailHTML(booking) {
    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN');
    const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .section { margin: 20px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #ff6b35; }
          .highlight { background: #d4edda; padding: 15px; border-radius: 5px; border: 1px solid #c3e6cb; }
          .price { font-size: 24px; font-weight: bold; color: #27ae60; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Your Odisha Tour is Confirmed!</h1>
            <p>Welcome to UtkalDarshan Tourism</p>
          </div>
          
          <div class="content">
            <div class="highlight">
              <h2>✅ Booking Confirmed</h2>
              <p>Dear <strong>${booking.customerName}</strong>,</p>
              <p>Your tour package has been successfully booked! We're excited to welcome you to the beautiful state of Odisha.</p>
            </div>

            <div class="section">
              <h2>📦 Your Package</h2>
              <p><strong>${booking.packageTitle}</strong></p>
              <p><strong>Duration:</strong> ${booking.packageDuration} Days</p>
              <p><strong>Check-in:</strong> ${formatDate(booking.checkIn)}</p>
              <p><strong>Check-out:</strong> ${formatDate(booking.checkOut)}</p>
            </div>

            <div class="section">
              <h2>🏨 Accommodation</h2>
              <p><strong>Hotel:</strong> ${booking.hotel}</p>
              <p><strong>City:</strong> ${booking.city}</p>
            </div>

            <div class="section">
              <h2>🚗 Transportation</h2>
              <p><strong>Pickup:</strong> ${booking.pickupLocation}</p>
              <p><strong>Drop:</strong> ${booking.dropLocation}</p>
              <p><strong>Vehicle:</strong> ${booking.cabType}</p>
            </div>

            <div class="section">
              <h2>💰 Payment Details</h2>
              <p><strong>Total Amount:</strong> <span class="price">${formatPrice(booking.totalPrice)}</span></p>
              <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
              <p><strong>Status:</strong> <span style="color: #27ae60; font-weight: bold;">Confirmed</span></p>
            </div>

            <div class="highlight">
              <h2>📞 Contact Information</h2>
              <p><strong>UtkalDarshan Tourism</strong></p>
              <p>Email: utkaldarsan15@gmail.com</p>
              <p>For any queries, please contact us at the above email.</p>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for choosing UtkalDarshan!</p>
            <p>Booking ID: ${booking._id}</p>
            <p>© ${new Date().getFullYear()} UtkalDarshan. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
