# UtkalDarshan - Odisha Tourism Booking System

A modern, responsive tourism booking website for Odisha, featuring interactive maps, animated UI, and local storage-based booking management.

## ✨ Features

### 🎯 Core Functionality
- **Interactive Package Selection**: Choose from curated Odisha tour packages
- **Dynamic Hotel Selection**: City-based hotel options with real-time pricing
- **Live Map Integration**: Pickup and drop location selection using Leaflet maps
- **Guest Management**: Add multiple travelers with detailed information
- **Coupon System**: Apply discount codes for special offers
- **Real-time Pricing**: Dynamic calculation including package, hotel, and transportation

### 📧 Email Notifications
- **Admin Notifications**: Instant booking alerts sent to `utkaldarsan15@gmail.com`
- **Customer Confirmations**: Detailed booking confirmations sent to customers
- **EmailJS Integration**: Serverless email sending without backend requirements

### 💾 Data Management
- **Local Storage**: All bookings stored locally in browser storage
- **Admin Dashboard**: Complete booking management and statistics
- **Export Functionality**: Download booking data as CSV files
- **Search & Filter**: Advanced booking search and status filtering

### 🎨 User Experience
- **Responsive Design**: Works perfectly on all devices
- **Animated UI**: Smooth transitions and micro-interactions
- **Step-by-step Booking**: Intuitive 4-step booking process
- **Print Receipts**: Professional booking confirmation printouts

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Modern web browser with local storage support

### Frontend Setup
1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:5173`

### EmailJS Setup (Optional but Recommended)
1. Follow the detailed guide in `EMAILJS_SETUP.md`
2. Set up your EmailJS account and templates
3. Update the configuration in `src/pages/Package.jsx`

## 📱 How to Use

### For Customers
1. **Select Package**: Choose from available tour packages
2. **Choose Hotel**: Pick your preferred accommodation
3. **Set Transportation**: Select pickup/drop locations and cab type
4. **Add Guests**: Enter traveler details
5. **Complete Booking**: Fill contact information and confirm
6. **Receive Confirmation**: Get email confirmation and print receipt

### For Admins
1. **Login**: Use `admin@utkaldarsan.com` / `admin123`
2. **View Dashboard**: See booking statistics and recent bookings
3. **Manage Bookings**: Update status, payment status, and delete bookings
4. **Export Data**: Download booking information as CSV
5. **Monitor Activity**: Track revenue, pending payments, and booking trends

## 🏗️ Project Structure

```
UtkalDarshan/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   │   ├── Home.jsx        # Landing page
│   │   ├── Package.jsx     # Booking form (main component)
│   │   ├── AdminDashboard.jsx  # Admin management interface
│   │   └── AdminLogin.jsx  # Admin authentication
│   ├── assets/             # Images and static files
│   └── App.jsx             # Main application component
├── public/                 # Public assets
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🔧 Configuration

### Local Storage Keys
- `utkaldarsan_bookings`: Stores all booking data
- `adminInfo`: Admin user information
- `adminToken`: Admin authentication token

### EmailJS Configuration
- **Service ID**: Your EmailJS email service
- **Template IDs**: Email templates for admin and customer notifications
- **User ID**: Your EmailJS public key

## 📊 Admin Dashboard Features

### Statistics Overview
- Total bookings count
- Confirmed vs pending bookings
- Total revenue calculation
- Payment status tracking

### Booking Management
- View all bookings with pagination
- Search bookings by customer, email, or package
- Filter by booking status and payment status
- Update booking and payment statuses
- Delete unwanted bookings

### Data Export
- CSV export with all booking details
- Formatted for easy analysis
- Includes customer, package, and financial information

## 🎨 Customization

### Styling
- Bootstrap 5 for responsive layout
- Custom CSS for unique design elements
- Framer Motion for smooth animations

### Content
- Update package data in `Package.jsx`
- Modify hotel options and pricing
- Customize email templates in EmailJS

### Features
- Add new booking steps
- Implement additional payment methods
- Extend guest information fields

## 🐛 Troubleshooting

### Common Issues
1. **Bookings not saving**: Check browser local storage support
2. **Emails not sending**: Verify EmailJS configuration
3. **Admin login issues**: Use default credentials or check localStorage
4. **Map not loading**: Ensure internet connection for map tiles

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design optimized

## 📈 Performance

### Local Storage Benefits
- **Fast**: No server round-trips
- **Offline**: Works without internet (except maps)
- **Scalable**: Handles thousands of bookings locally
- **Secure**: Data stays on user's device

### Optimization
- Efficient data filtering and pagination
- Minimal re-renders with React hooks
- Optimized image loading
- Responsive design for all screen sizes

## 🔒 Security Considerations

### Local Storage
- Data is stored locally (not encrypted)
- Clear data when needed
- Regular backup of important bookings

### Admin Access
- Simple password protection
- Consider implementing stronger authentication for production
- Regular password updates recommended

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Drag and drop `dist` folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Deploy from `gh-pages` branch
- **Any Static Host**: Upload built files

### Environment Variables
- No backend environment setup required
- EmailJS configuration in frontend code
- Local storage works in all environments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

- **Email**: utkaldarsan15@gmail.com
- **Documentation**: See `EMAILJS_SETUP.md` for email configuration
- **Issues**: Report bugs and feature requests via GitHub

## 🎉 Acknowledgments

- **EmailJS**: For serverless email functionality
- **Leaflet**: For interactive maps
- **Bootstrap**: For responsive design framework
- **Framer Motion**: For smooth animations
- **React**: For the amazing frontend framework

---

**Built with ❤️ for Odisha Tourism**
