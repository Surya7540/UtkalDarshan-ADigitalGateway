# UtkalDarshan Backend

Backend server for the UtkalDarshan tourism website with booking management and email notifications.

## Features

- **Tour Package Bookings**: Complete booking system with package selection, hotel booking, and transportation
- **Email Notifications**: Automatic email notifications to admin (utkaldarsan15@gmail.com) and customers
- **Admin Dashboard**: Comprehensive admin panel for managing bookings and viewing statistics
- **Database Integration**: MongoDB with Mongoose for data persistence
- **JWT Authentication**: Secure admin authentication system
- **RESTful API**: Clean and organized API endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Gmail account for sending emails

## Installation

1. **Clone the repository and navigate to backend folder:**
   ```bash
   cd "UtkalDarshan Backend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `env.example` to `.env`
   - Fill in your configuration values

4. **Set up MongoDB:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in your `.env` file

5. **Configure Gmail for email notifications:**
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password
   - Update `EMAIL_PASS` in your `.env` file

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/utkaldarshan

# Frontend URL
FRONTEND_URL=http://localhost:5173

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=utkaldarsan15@gmail.com
EMAIL_PASS=your-app-password-here

# Admin Email
ADMIN_EMAIL=utkaldarsan15@gmail.com
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PATCH /api/bookings/:id/status` - Update booking status
- `PATCH /api/bookings/:id/payment` - Update payment status
- `DELETE /api/bookings/:id` - Delete booking

### Admin Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/bookings` - Get admin bookings with pagination
- `POST /api/admin/setup` - Create initial admin (first time only)

### Health Check
- `GET /api/health` - Server health status

## Database Models

### Booking
- Package details (code, title, price, duration)
- Location details (city, hotel, check-in/out dates)
- Transportation (pickup/drop locations, cab type)
- Guest information (travelers list)
- Contact details (name, email, mobile)
- Pricing and payment information

### Admin
- Authentication credentials
- Role-based access control
- Activity tracking

## Email Notifications

The system automatically sends emails for:

1. **Admin Notifications**: When a new booking is made
   - Sent to: utkaldarsan15@gmail.com
   - Includes: Complete booking details, customer information, pricing

2. **Customer Confirmations**: When a booking is confirmed
   - Sent to: Customer's email
   - Includes: Booking confirmation, package details, contact information

## First Time Setup

1. **Start the server**
2. **Create initial admin account:**
   ```bash
   POST /api/admin/setup
   {
     "name": "Admin Name",
     "email": "utkaldarsan15@gmail.com",
     "password": "your-password"
   }
   ```

3. **Login to admin panel:**
   ```bash
   POST /api/admin/login
   {
     "email": "utkaldarsan15@gmail.com",
     "password": "your-password"
   }
   ```

## Frontend Integration

The frontend should make API calls to these endpoints. Update your frontend API configuration to point to:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Security Features

- **JWT Authentication**: Secure admin access
- **Rate Limiting**: API request throttling
- **Input Validation**: Request data validation
- **CORS Configuration**: Cross-origin resource sharing
- **Helmet**: Security headers

## Troubleshooting

### Email Issues
- Ensure Gmail 2FA is enabled
- Use App Password, not regular password
- Check firewall/antivirus settings

### Database Issues
- Verify MongoDB is running
- Check connection string format
- Ensure database exists

### Port Issues
- Change PORT in .env if 5000 is occupied
- Update frontend API URL accordingly

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Test API endpoints
5. Update documentation

## License

This project is part of UtkalDarshan Tourism System.
