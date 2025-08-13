# 🚨 URGENT: Fix EmailJS Setup to Send Admin Emails

## The Problem
Your emails are not going to admin because the code still has placeholder values instead of your actual EmailJS credentials.

## Quick Fix (5 minutes)

### Step 1: Go to EmailJS
1. Open [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email

### Step 2: Get Your Service ID
1. In EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose "Gmail"
4. Connect your Gmail account (use the same email: utkaldarsan15@gmail.com)
5. **Copy the Service ID** (looks like `service_abc123`)

### Step 3: Create Email Templates
1. Click "Email Templates"
2. Create "Admin Notification" template:
   - Name: "Admin Booking Notification"
   - Subject: "New Booking - {{booking_id}}"
   - Content: Use the template from EMAILJS_SETUP.md
3. **Copy the Template ID** (looks like `template_xyz789`)

4. Create "Customer Confirmation" template:
   - Name: "Customer Booking Confirmation"  
   - Subject: "Booking Confirmed - {{booking_id}}"
   - Content: Use the template from EMAILJS_SETUP.md
5. **Copy the Template ID**

### Step 4: Get Your User ID
1. Click "Account" → "API Keys"
2. **Copy your Public Key** (User ID)

### Step 5: Update Your Code
Open `src/config/emailjs.js` and replace the placeholders:

```javascript
export const EMAILJS_CONFIG = {
    USER_ID: "YOUR_ACTUAL_USER_ID_HERE",           // Replace this
    SERVICE_ID: "YOUR_ACTUAL_SERVICE_ID_HERE",     // Replace this  
    ADMIN_TEMPLATE_ID: "YOUR_ACTUAL_ADMIN_TEMPLATE_ID_HERE",     // Replace this
    CUSTOMER_TEMPLATE_ID: "YOUR_ACTUAL_CUSTOMER_TEMPLATE_ID_HERE", // Replace this
    ADMIN_EMAIL: "utkaldarsan15@gmail.com"
};
```

### Step 6: Test
1. Save the file
2. Restart your React app
3. Make a test booking
4. Check if admin email is received

## Example of What Your Config Should Look Like:
```javascript
export const EMAILJS_CONFIG = {
    USER_ID: "user_abc123xyz789",
    SERVICE_ID: "service_utkaldarshan",
    ADMIN_TEMPLATE_ID: "template_admin_notification", 
    CUSTOMER_TEMPLATE_ID: "template_customer_confirmation",
    ADMIN_EMAIL: "utkaldarsan15@gmail.com"
};
```

## Need Help?
- Check browser console for errors
- Verify all IDs are correct
- Make sure Gmail service is connected
- Check if you're using the right email account

## Why This Happened
The code was using placeholder values like `"YOUR_EMAILJS_SERVICE_ID"` instead of real credentials. Now it's organized in a config file for easy management.
