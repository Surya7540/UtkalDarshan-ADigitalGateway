import React from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

export default function EmailTest() {
    const testEmail = async () => {
        try {
            console.log('🧪 Testing EmailJS...');
            console.log('🧪 Config:', EMAILJS_CONFIG);
            
            // Initialize EmailJS
            emailjs.init(EMAILJS_CONFIG.USER_ID);
            
            // Test parameters
            const testParams = {
                to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
                to_name: 'Admin',
                from_name: 'Test User',
                from_email: 'test@example.com',
                booking_id: 'TEST123',
                package_title: 'Test Package',
                customer_name: 'Test Customer',
                customer_email: 'test@example.com',
                customer_mobile: '1234567890',
                total_amount: '₹5000',
                check_in: '2024-01-01',
                check_out: '2024-01-03',
                hotel: 'Test Hotel',
                city: 'Test City',
                guests: 2,
                special_requests: 'Test request'
            };
            
            console.log('🧪 Sending test email...');
            
            const result = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.ADMIN_TEMPLATE_ID,
                testParams,
                EMAILJS_CONFIG.USER_ID
            );
            
            console.log('✅ Test email sent successfully:', result);
            alert('Test email sent successfully! Check console for details.');
            
        } catch (error) {
            console.error('❌ Test email failed:', error);
            alert('Test email failed! Check console for error details.');
        }
    };

    return (
        <div className="p-4 border rounded">
            <h3>🧪 EmailJS Test</h3>
            <p>Click the button below to test EmailJS functionality:</p>
            <button 
                onClick={testEmail}
                className="btn btn-primary"
            >
                Test EmailJS
            </button>
            <div className="mt-3">
                <small className="text-muted">
                    Check browser console for detailed logs
                </small>
            </div>
        </div>
    );
}
