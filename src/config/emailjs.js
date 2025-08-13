// EmailJS Configuration
// Replace these placeholder values with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
    // Your EmailJS User ID (Public Key)
    USER_ID: "F3w0mmmbzDuzMZksp", // Your actual User ID
    
    // Your EmailJS Service ID
    SERVICE_ID: "service_2arx7wd", // Your actual Service ID
    
    // Your EmailJS Template IDs
    ADMIN_TEMPLATE_ID: "template_vrprzrg", // Your Admin Template ID
    CUSTOMER_TEMPLATE_ID: "template_b4i1mzx", // Your Customer Template ID
    
    // Admin email address
    ADMIN_EMAIL: "utkaldarsan15@gmail.com"
};

// Debug logging
console.log('📧 EmailJS Config loaded:', EMAILJS_CONFIG);

// Instructions:
// 1. Go to https://www.emailjs.com/ and create an account
// 2. Set up Gmail service and get Service ID
// 3. Create email templates and get Template IDs  
// 4. Get your User ID from API Keys
// 5. Replace the placeholder values above with your actual credentials
// 6. Save this file and restart your app
