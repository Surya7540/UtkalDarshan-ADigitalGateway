# 🚀 UtkalDarshan Setup Guide

Follow this step-by-step guide to get your UtkalDarshan tourism website up and running.

## 📋 Prerequisites Checklist

- [ ] Node.js (v14 or higher) installed
- [ ] MongoDB installed and running
- [ ] Gmail account with 2FA enabled
- [ ] Git repository cloned

## 🔧 Step 1: Frontend Setup

```bash
# Navigate to project root
cd UtkalDarshan

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

✅ Frontend should now be running on `http://localhost:5173`

## 🔧 Step 2: Backend Setup

```bash
# Open a new terminal and navigate to backend
cd "UtkalDarshan Backend"

# Install dependencies
npm install

# Create environment file
cp env.example .env
```

## 🔧 Step 3: Configure Environment Variables

Edit the `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/utkaldarshan

# Frontend URL
FRONTEND_URL=http://localhost:5173

# JWT Secret (generate a random string)
JWT_SECRET=utkaldarshan-secret-key-2024

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=utkaldarsan15@gmail.com
EMAIL_PASS=your-gmail-app-password

# Admin Email
ADMIN_EMAIL=utkaldarsan15@gmail.com
```

## 🔧 Step 4: Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "UtkalDarshan"
   - Copy the generated password
4. Paste it in your `.env` file as `EMAIL_PASS`

## 🔧 Step 5: Start Backend Server

```bash
# In the backend directory
npm run dev
```

✅ Backend should now be running on `http://localhost:5000`

## 🔧 Step 6: Create Initial Admin Account

Use Postman, curl, or any API client to create the first admin:

```bash
curl -X POST http://localhost:5000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "utkaldarsan15@gmail.com",
    "password": "your-secure-password"
  }'
```

Or use this JavaScript code in browser console:

```javascript
fetch('http://localhost:5000/api/admin/setup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Admin User",
    email: "utkaldarsan15@gmail.com",
    password: "your-secure-password"
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## 🔧 Step 7: Test the System

1. **Frontend**: Visit `http://localhost:5173`
2. **Admin Login**: Go to `/adminlogin` and login with your credentials
3. **Make a Test Booking**: Go to `/Package` and complete a test booking
4. **Check Emails**: Verify emails are sent to admin and customer

## 🧪 Testing Checklist

- [ ] Frontend loads without errors
- [ ] Backend API responds to health check
- [ ] Admin can login successfully
- [ ] Tour package booking works
- [ ] Emails are sent to admin (utkaldarsan15@gmail.com)
- [ ] Emails are sent to customer
- [ ] Admin dashboard shows bookings
- [ ] Admin can update booking status

## 🐛 Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution**: 
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify database exists

### Issue: "Email sending failed"
**Solution**:
- Verify Gmail 2FA is enabled
- Use App Password, not regular password
- Check `.env` file configuration

### Issue: "Frontend can't connect to backend"
**Solution**:
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API endpoints

### Issue: "JWT token invalid"
**Solution**:
- Check JWT_SECRET in `.env`
- Ensure admin account exists
- Verify login credentials

## 📱 Access Points

- **Main Website**: `http://localhost:5173`
- **Tour Booking**: `http://localhost:5173/Package`
- **Admin Login**: `http://localhost:5173/adminlogin`
- **Admin Dashboard**: `http://localhost:5173/admin`
- **Backend API**: `http://localhost:5000/api`

## 🔒 Security Notes

- Keep your `.env` file secure and never commit it
- Use strong passwords for admin accounts
- Regularly update dependencies
- Monitor API usage and implement rate limiting in production

## 🚀 Production Deployment

When ready for production:

1. Update environment variables for production
2. Set `NODE_ENV=production`
3. Use PM2 or similar for process management
4. Set up proper SSL certificates
5. Configure production MongoDB instance
6. Set up monitoring and logging

## 📞 Need Help?

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all services are running
4. Check the backend logs
5. Contact: utkaldarsan15@gmail.com

---

**🎉 Congratulations! Your UtkalDarshan tourism website is now running!**
