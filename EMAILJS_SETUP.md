# EmailJS Setup Guide for UtkalDarshan

## What is EmailJS?
EmailJS allows you to send emails directly from your frontend JavaScript code without needing a backend server. It's perfect for sending booking confirmations and admin notifications.

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Set Up Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" (or your preferred email provider)
4. Connect your Gmail account
5. Note down your **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Templates

### Admin Notification Template
1. Go to "Email Templates" in EmailJS
2. Click "Create New Template"
3. Name it "Admin Booking Notification"
4. Use this template content:

```html
Subject: New Booking - {{booking_id}}

Hello Admin,

A new booking has been received:

**Booking Details:**
- Booking ID: {{booking_id}}
- Package: {{package_title}}
- Customer: {{customer_name}}
- Email: {{customer_email}}
- Mobile: {{customer_mobile}}
- Total Amount: {{total_amount}}
- Check-in: {{check_in}}
- Check-out: {{check_out}}
- Hotel: {{hotel}}
- City: {{city}}
- Number of Guests: {{guests}}
- Special Requests: {{special_requests}}

**Customer Details:**
- Name: {{customer_name}}
- Email: {{customer_email}}
- Mobile: {{customer_mobile}}

Please review and confirm this booking.

Best regards,
UtkalDarshan Tourism System
```

5. Note down your **Template ID** (e.g., `template_xyz789`)

### Customer Confirmation Template
1. Create another template named "Customer Booking Confirmation"
2. Use this template content:

```html
Subject: Booking Confirmed - {{booking_id}}

Dear {{to_name}},

Your booking has been confirmed! Here are the details:

**Booking Information:**
- Booking ID: {{booking_id}}
- Package: {{package_title}}
- Total Amount: {{total_amount}}
- Check-in Date: {{check_in}}
- Check-out Date: {{check_out}}
- Hotel: {{hotel}}
- City: {{city}}
- Number of Guests: {{guests}}

**Next Steps:**
1. Please arrive at the hotel on your check-in date
2. Bring a valid ID proof
3. Contact us if you have any questions

**Contact Information:**
- Email: utkaldarsan15@gmail.com
- Phone: +91-XXXXXXXXXX

Thank you for choosing UtkalDarshan Tourism!

Best regards,
The UtkalDarshan Team
```

## Step 4: Get Your User ID
1. In EmailJS dashboard, go to "Account" → "API Keys"
2. Copy your **Public Key** (User ID)

## Step 5: Update Your Code
Replace the placeholder values in `src/pages/Package.jsx`:

```javascript
// Initialize EmailJS
useEffect(() => {
    emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your actual User ID
}, []);

// In the handleSubmit function, replace:
await emailjs.send(
    'YOUR_EMAILJS_SERVICE_ID', // Replace with your Service ID
    'YOUR_ADMIN_TEMPLATE_ID',  // Replace with your Admin Template ID
    adminEmailParams,
    'YOUR_EMAILJS_USER_ID'    // Replace with your User ID
);

await emailjs.send(
    'YOUR_EMAILJS_SERVICE_ID', // Replace with your Service ID
    'YOUR_CUSTOMER_TEMPLATE_ID', // Replace with your Customer Template ID
    customerEmailParams,
    'YOUR_EMAILJS_USER_ID'    // Replace with your User ID
);
```

## Step 6: Test Your Setup
1. Make a test booking
2. Check if emails are sent to both admin and customer
3. Verify the email content and formatting

## Troubleshooting

### Emails not sending?
- Check browser console for errors
- Verify all IDs are correct
- Ensure EmailJS service is connected
- Check if your email provider allows API access

### Gmail setup issues?
- Enable 2-factor authentication
- Generate an App Password
- Use the App Password in EmailJS

### Template variables not working?
- Ensure variable names match exactly
- Check for typos in template syntax
- Verify EmailJS template format

## Free Plan Limits
- EmailJS free plan: 200 emails/month
- Consider upgrading for production use

## Security Notes
- User ID is public and safe to expose
- Service ID and Template ID are also public
- EmailJS handles authentication securely
- No sensitive data is stored on EmailJS servers

## Support
- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)
