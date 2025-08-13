import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { PulseLoader } from "react-spinners";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';


// --- Dummy Data ---
const CITIES = ["Bhubaneswar", "Puri", "Konark", "Cuttack", "Chilika", "Gopalpur"];
const HOTELS = [
    { name: "Mayfair Lagoon", city: "Bhubaneswar", price: 5000 },
    { name: "Swosti Premium", city: "Bhubaneswar", price: 4500 },
    { name: "Hotel Holiday Inn", city: "Bhubaneswar", price: 3500 },
    { name: "Ginger Bhubaneshwar", city: "Bhubaneswar", price: 2500 },
    { name: "Vivanta Bhubaneswar", city: "Bhubaneswar", price: 6500 },
    { name: "Welcomhotel ITC", city: "Bhubaneswar", price: 3500 },
    { name: "Lyfe Hotels", city: "Bhubaneswar", price: 6000 },
    { name: "Hotel Crown", city: "Bhubaneswar", price: 4000 },
    { name: "Trident", city: "Bhubaneswar", price: 7000 },
    { name: "Padmaja Premium", city: "Bhubaneswar", price: 3200 },

    { name: "Hotel Holiday Resort", city: "Puri", price: 2000 },
    { name: "Toshali Sands", city: "Puri", price: 3500 },
    { name: "Hotel Sonar Bangla", city: "Puri", price: 1800 },
    { name: "Hotel Kalinga", city: "Puri", price: 1600 },
    { name: "Sterling Puri", city: "Puri", price: 4500 },
    { name: "Hotel Golden Palace", city: "Puri", price: 3800 },
    { name: "Reba Beach Resort", city: "Puri", price: 2800 },
    { name: "Hotel Durene Beach Resort", city: "Puri", price: 3200 },
    { name: "Hotel Sonargaon", city: "Puri", price: 1000 },
    { name: "Seven Hills Hotel", city: "Puri", price: 3000 },

    { name: "Eco Retreat", city: "Konark", price: 3500 },
    { name: "Lotus Eco Resort", city: "Konark", price: 2500 },
    { name: "Hotel Surya Inn", city: "Konark", price: 1500 },
    { name: "OTDC Yatrinivas", city: "Konark", price: 1800 },
    { name: "Nature Camp", city: "Konark", price: 1700 },
    { name: "Hotel Golden Palace", city: "Konark", price: 3200 },
    { name: "Ranihat Palace", city: "Konark", price: 2800 },
    { name: "Labanya Guest House", city: "Konark", price: 1400 },
    { name: "Holiday Inn Guest House", city: "Konark", price: 1200 },
    { name: "Sai Padma Guest House", city: "Konark", price: 1300 },

    { name: "Hotel Akbari Continental", city: "Cuttack", price: 2500 },
    { name: "Hotel Dwaraka", city: "Cuttack", price: 1500 },
    { name: "Hotel Blue Lagoon", city: "Cuttack", price: 2000 },
    { name: "Hotel Sagarshree", city: "Cuttack", price: 2200 },
    { name: "Panthanivas", city: "Cuttack", price: 1800 },
    { name: "Hotel Bombay Inn", city: "Cuttack", price: 1700 },
    { name: "Hotel Ashoka", city: "Cuttack", price: 1900 },
    { name: "Hotel Shree Jagannath", city: "Cuttack", price: 2100 },
    { name: "Hotel Monalisa", city: "Cuttack", price: 1600 },
    { name: "Roxy Resort", city: "Cuttack", price: 2300 },

    { name: "Swosti Chilika Resort", city: "Chilika", price: 3800 },
    { name: "Vikash Eco Resort", city: "Chilika", price: 3200 },
    { name: "Bluebay 015 Chilika Berhampura", city: "Chilika", price: 2800 },
    { name: "Pipul Odi Museum Resort", city: "Chilika", price: 3000 },
    { name: "Om Leisure Chilika Resort", city: "Chilika", price: 3500 },
    { name: "Chilika Heritage Resort", city: "Chilika", price: 2200 },
    { name: "Garuda Luxury Houseboat", city: "Chilika", price: 6000 },
    { name: "Eco Cottage Chilika Island Resort", city: "Chilika", price: 3400 },
    { name: "Swosti Chilika Resort", city: "Chilika", price: 3600 },
    { name: "Blue Bay Resort", city: "Chilika", price: 3100 },

    { name: "Gopalpur Palm Resort", city: "Gopalpur", price: 4000 },
    { name: "Mayfair Gopalpur", city: "Gopalpur", price: 6000 },
    { name: "Hotel Swosti", city: "Gopalpur", price: 3500 },
    { name: "Hotel Sea Pearl", city: "Gopalpur", price: 3000 },
    { name: "Hotel Swagatika", city: "Gopalpur", price: 2500 },
    { name: "Hotel Gopalpur Palm Resort", city: "Gopalpur", price: 4500 },
    { name: "Hotel Blue Bay Beach Resort", city: "Gopalpur", price: 5000 },
];


const PACKAGE_DATA = [
    {
        code: "1N2D",
        title: "1 Night / 2 Days - Puri & Konark",
        description: "Jagannath Temple, Sun Temple, and Puri Beach in a comfortable whirlwind!",
        price: 3999,
        duration: 2,
    },
    {
        code: "2N3D",
        title: "2 Nights / 3 Days - Bhubaneswar & Chilika",
        description: "Bhubaneswar temples and Udayagiri caves. Day trip to Chilika Lake for dolphin watching.",
        price: 6499,
        duration: 3,
    },
    {
        code: "4N5D",
        title: "4 Nights / 5 Days - Complete Coastal Odisha",
        description:
            "Puri, Konark, Bhubaneswar, Chilika & Gopalpur with beaches, wildlife, culture and more.",
        price: 11499,
        duration: 5,
    },
];

const CAB_OPTIONS = [
    { type: "Standard Sedan", price: 0, desc: "Best for 3-4 people, AC sedan" },
    { type: "Premium / SUV", price: 1200, desc: "Spacious, best for family or lots of luggage" },
    { type: "Tempo Traveller", price: 2500, desc: "For groups up to 9, super comfortable" },
];

const COUPONS = { ODISHA500: 500, FESTIVE1000: 1000 };

const DEFAULT_MAP_CENTER = [20.2961, 85.8245]; // Bhubaneswar

const initialFormData = {
    name: "",
    checkIn: "",
    noGuest: 1,
    mobileNumber: "",
    email: "",
    pickup: "",
    pickupCustom: "",
    drop: "",
    dropCustom: "",
    cabType: CAB_OPTIONS[0].type,
    specialRequests: "",
    city: "",
    hotel: "",
    coupon: "",
    payMethod: "Pay at Arrival",
    pickupLoc: DEFAULT_MAP_CENTER,
    dropLoc: DEFAULT_MAP_CENTER,
};
const initialTraveler = { name: "", age: "", gender: "" };

// --- Custom Marker Icon ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// --- Map Pick Component ---
function LocationPicker({ label, position, setPosition }) {
    function MapClicker() {
        useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
            },
        });
        return null;
    }
    return (
        <div>
            <div className="mb-2 fw-bold" style={{ fontSize: "1.05em" }}>
                <span role="img" aria-label="map">📌</span> {label} (click map to select)
            </div>
            <div className="mb-2" style={{ height: 180, borderRadius: 9, overflow: "hidden" }}>
                <MapContainer
                    center={position}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClicker />
                    <Marker position={position}>
                        <Popup>
                            {label} Location Picked! <br />
                            Lat: {position[0].toFixed(4)}<br />
                            Lng: {position[1].toFixed(4)}
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
}

function AnimatedFade({ children, visible, keyName }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key={keyName}
                    initial={{ opacity: 0, scale: 0.98, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: -40 }}
                    transition={{ duration: 0.33 }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function getEndDate(start, nights) {
    if (!start) return "";
    const date = new Date(start);
    date.setDate(date.getDate() + nights);
    return date.toISOString().split("T")[0];
}

export default function PackageBook() {
    const [selectedPackage, setSelectedPackage] = useState(PACKAGE_DATA[0]);
    const [formData, setFormData] = useState(initialFormData);
    const [travelers, setTravelers] = useState([{ ...initialTraveler }]);
    const [dayPlan, setDayPlan] = useState(["Day 1: Arrival & Sightseeing", "Day 2: Temple Tour"]);
    const [step, setStep] = useState(0);
    const [loaderStatus, setLoaderStatus] = useState(true);
    const [suggestedCities, setSuggestedCities] = useState([]);
    const [suggestedHotels, setSuggestedHotels] = useState([]);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [pMarker, setpMarker] = useState(DEFAULT_MAP_CENTER);
    const [dMarker, setdMarker] = useState(DEFAULT_MAP_CENTER);
    //-- ADDED: State to store the per-night price of the selected hotel.
    const [hotelFare, setHotelFare] = useState(0);


    // --- Price Logic ---
    const cabAddon = CAB_OPTIONS.find((c) => c.type === formData.cabType)?.price || 0;
    const nGuests = Math.max(1, parseInt(formData.noGuest) || 1);
    //-- ADDED: Calculate the number of nights for the hotel stay.
    const nights = selectedPackage.duration > 0 ? selectedPackage.duration - 1 : 0;
    //-- MODIFIED: Total price now includes the hotel fare for the entire stay.
    const totalPrice = (selectedPackage.price * nGuests) + (hotelFare * nights) + cabAddon - (couponDiscount || 0);

    //-- ADDED: This logic finds the hotel's price whenever the user makes a selection.
    useEffect(() => {
        const selectedHotel = HOTELS.find(h => h.name === formData.hotel);
        setHotelFare(selectedHotel ? selectedHotel.price : 0);
    }, [formData.hotel]);

    useEffect(() => {
        setTimeout(() => setLoaderStatus(false), 900);
    }, []);

    useEffect(() => {
        // Set plan by package duration
        let plan = [];
        for (let i = 0; i < selectedPackage.duration; i++)
            plan.push(`Day ${i + 1}: Your Plan Here`);
        setDayPlan(plan);
        setFormData((f) => ({
            ...f,
            checkOut: getEndDate(f.checkIn, nights),
        }));
    }, [selectedPackage, formData.checkIn, nights]);

    useEffect(() => {
        // City autocomplete
        setSuggestedCities(
            formData.city.length >= 2
                ? CITIES.filter((c) => c.toLowerCase().includes(formData.city.toLowerCase())).slice(0, 3)
                : []
        );
    }, [formData.city]);

    useEffect(() => {
        // Hotel autocomplete
        if (formData.city) {
            const hotelsInCity = HOTELS.filter(
                (h) => h.city.toLowerCase() === formData.city.toLowerCase()
            );
            const filteredByName = hotelsInCity.filter((h) =>
                h.name.toLowerCase().includes(formData.hotel.toLowerCase())
            );
            setSuggestedHotels(filteredByName);
        } else {
            setSuggestedHotels([]);
        }
    }, [formData.hotel, formData.city]);

    useEffect(() => {
        setFormData((f) => ({
            ...f,
            pickupLoc: pMarker,
            dropLoc: dMarker,
        }));
    }, [pMarker, dMarker]);

    // --- Handlers ---
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === "mobileNumber")
            setFormData({ ...formData, [name]: value.replace(/\D/g, "") });
        else setFormData({ ...formData, [name]: value });
    };
    const handlePackageChange = (e) => {
        const pkg = PACKAGE_DATA.find((p) => p.code === e.target.value);
        setSelectedPackage(pkg);
    };
    const handleDayChange = (idx, newVal) => {
        setDayPlan((plan) => plan.map((val, i) => (i === idx ? newVal : val)));
    };
    const handleTraveler = (idx, prop, val) => {
        setTravelers((trs) =>
            trs.map((t, i) => (i === idx ? { ...t, [prop]: val } : t))
        );
    };

    const addTraveler = () =>
        setTravelers((trs) => [...trs, { ...initialTraveler }]);
    const removeTraveler = (idx) =>
        setTravelers((trs) => (trs.length <= 1 ? trs : trs.filter((_, i) => i !== idx)));
    // --- Coupon
    const handleCoupon = () => {
        if (COUPONS[formData.coupon.toUpperCase()]) {
            setCouponDiscount(COUPONS[formData.coupon.toUpperCase()]);
            Swal.fire("Coupon applied!", `₹${COUPONS[formData.coupon.toUpperCase()]} off 🎉`, "success");
        } else {
            setCouponDiscount(0);
            Swal.fire("Invalid coupon", "Try: ODISHA500 or FESTIVE1000", "error");
        }
    };
    // --- Step navigation animations
    const prevStep = () => setStep((s) => Math.max(0, s - 1));
    const nextStep = () => setStep((s) => Math.min(4, s + 1));

    // --- Submission
    function validateStep() {
        if (step === 0 && !(formData.city && formData.hotel && formData.checkIn)) {
            Swal.fire("Please select city, hotel & date!", "", "error");
            return false;
        }
        if (step === 1 && !(formData.pickup && formData.drop)) {
            Swal.fire("Set pickup/drop point!", "", "error");
            return false;
        }
        if (step === 2 && travelers.some((t) => !(t.name && t.age && t.gender))) {
            Swal.fire("Enter all traveler details!", "", "error");
            return false;
        }
        if (step === 3 && !(formData.name && /^[0-9]{10}$/.test(formData.mobileNumber) && /\S+@\S+\.\S+/.test(formData.email))) {
            Swal.fire("Fill your contact details!", "", "error");
            return false;
        }
        return true;
    }
    async function handleSubmit(e) {
        e.preventDefault();
        if (!validateStep()) return;
        if (step < 4) return nextStep();

        // Show loading state
        Swal.fire({
            title: "Processing Booking...",
            text: "Please wait while we confirm your tour package",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Generate unique booking ID
            const bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

            // Prepare booking data
            const bookingData = {
                id: bookingId,
                packageCode: selectedPackage.code,
                packageTitle: selectedPackage.title,
                packagePrice: selectedPackage.price,
                packageDuration: selectedPackage.duration,
                city: formData.city,
                hotel: formData.hotel,
                hotelPrice: hotelFare,
                checkIn: formData.checkIn,
                checkOut: getEndDate(formData.checkIn, nights),
                pickupLocation: formData.pickup === "MapSelect" ? `Map Location (${pMarker[0].toFixed(4)}, ${pMarker[1].toFixed(4)})` : formData.pickup,
                dropLocation: formData.drop === "MapSelect" ? `Map Location (${dMarker[0].toFixed(4)}, ${dMarker[1].toFixed(4)})` : formData.drop,
                pickupCoordinates: formData.pickup === "MapSelect" ? { lat: pMarker[0], lng: pMarker[1] } : null,
                dropCoordinates: formData.drop === "MapSelect" ? { lat: dMarker[0], lng: dMarker[1] } : null,
                cabType: formData.cabType,
                cabPrice: cabAddon,
                numberOfGuests: nGuests,
                travelers: travelers,
                customerName: formData.name,
                customerEmail: formData.email,
                customerMobile: formData.mobileNumber,
                specialRequests: formData.specialRequests,
                couponCode: formData.coupon || null,
                couponDiscount: couponDiscount,
                totalPrice: totalPrice,
                paymentMethod: formData.payMethod,
                bookingDate: new Date().toISOString(),
                status: 'confirmed',
                paymentStatus: 'pending'
            };

            // Save to local storage
            const existingBookings = JSON.parse(localStorage.getItem('utkaldarshan_bookings') || '[]');
            existingBookings.push(bookingData);
            localStorage.setItem('utkaldarshan_bookings', JSON.stringify(existingBookings));

            // Send email to admin using EmailJS
            const adminEmailParams = {
                to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
                to_name: 'Admin',
                from_name: formData.name,
                from_email: formData.email,
                subject: `New Booking - ${bookingId}`,
                message: `New booking received:
                
Booking ID: ${bookingId}
Customer: ${formData.name}
Email: ${formData.email}
Mobile: ${formData.mobileNumber}
Package: ${selectedPackage.title}
Total Amount: ₹${totalPrice.toLocaleString('en-IN')}
Check-in: ${formData.checkIn}
Check-out: ${getEndDate(formData.checkIn, nights)}
Hotel: ${formData.hotel}
City: ${formData.city}
Guests: ${nGuests}
Special Requests: ${formData.specialRequests || 'None'}`
            };

            // Send email to customer
            const customerEmailParams = {
                to_email: formData.email,
                to_name: formData.name,
                from_name: 'UtkalDarshan',
                from_email: 'noreply@utkaldarshan.com',
                subject: `Booking Confirmed - ${bookingId}`,
                message: `Your booking has been confirmed!
                
Booking ID: ${bookingId}
Package: ${selectedPackage.title}
Total Amount: ₹${totalPrice.toLocaleString('en-IN')}
Check-in: ${formData.checkIn}
Check-out: ${getEndDate(formData.checkIn, nights)}
Hotel: ${formData.hotel}
City: ${formData.city}
Guests: ${nGuests}

Thank you for choosing UtkalDarshan!`
            };

            // Send emails using EmailJS
            console.log('📧 Attempting to send emails...');
            console.log('📧 Config:', {
                SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID,
                ADMIN_TEMPLATE_ID: EMAILJS_CONFIG.ADMIN_TEMPLATE_ID,
                CUSTOMER_TEMPLATE_ID: EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID,
                USER_ID: EMAILJS_CONFIG.USER_ID
            });

            try {
                // Send to admin
                console.log('📧 Sending admin email to:', EMAILJS_CONFIG.ADMIN_EMAIL);
                const adminResult = await emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.ADMIN_TEMPLATE_ID,
                    adminEmailParams,
                    EMAILJS_CONFIG.USER_ID
                );
                console.log('✅ Admin email sent successfully:', adminResult);

                // Send to customer
                console.log('📧 Sending customer email to:', formData.email);
                const customerResult = await emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID,
                    customerEmailParams,
                    EMAILJS_CONFIG.USER_ID
                );
                console.log('✅ Customer email sent successfully:', customerResult);

            } catch (emailError) {
                console.error('❌ Email sending failed:', emailError);
                console.error('❌ Error details:', {
                    message: emailError.message,
                    stack: emailError.stack,
                    status: emailError.status,
                    text: emailError.text
                });

                // Show more detailed error information
                if (emailError.status === 422) {
                    console.error('❌ 422 Error - Template parameter mismatch. Check your EmailJS template variables.');
                    console.error('❌ Parameters sent:', adminEmailParams);
                }

                // Continue with booking even if email fails
            }

            // Show success message
            Swal.fire({
                title: "🎉 Booking Confirmed!",
                html: `
                    <div style="text-align: left;">
                        <p><strong>Customer:</strong> ${formData.name}</p>
                        <p><strong>Package:</strong> ${selectedPackage.title}</p>
                        <p><strong>Total Amount:</strong> ₹${totalPrice.toLocaleString('en-IN')}</p>
                        <p><strong>Booking ID:</strong> ${bookingId}</p>
                        <hr>
                        <p style="font-size: 0.9em; color: #666;">
                            ✅ Confirmation sent to: <strong>${formData.email}</strong><br>
                            📧 Admin notification sent to: <strong>${EMAILJS_CONFIG.ADMIN_EMAIL}</strong><br>
                            
                        </p>
                    </div>
                `,
                icon: "success",
                confirmButtonText: "Print Receipt",
                showCancelButton: true,
                cancelButtonText: "Close"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.print();
                }
            });

            // Reset form and go to first step
            setStep(0);
            setFormData(initialFormData);
            setTravelers([{ ...initialTraveler }]);
            setCouponDiscount(0);

        } catch (error) {
            console.error('Booking error:', error);
            Swal.fire({
                title: "❌ Booking Failed",
                html: `
                    <p>Sorry, we couldn't process your booking at the moment.</p>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <p>Please try again or contact support.</p>
                `,
                icon: "error",
                confirmButtonText: "Try Again"
            });
        }
    }

    // Initialize EmailJS
    useEffect(() => {
        try {
            emailjs.init(EMAILJS_CONFIG.USER_ID);
            console.log('✅ EmailJS initialized with User ID:', EMAILJS_CONFIG.USER_ID);
        } catch (error) {
            console.error('❌ EmailJS initialization failed:', error);
        }
    }, []);
    const handleRazorpayPayment = async () => {
        try {
            // Create order in backend
            const response = await fetch("http://localhost:4000/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: totalPrice }), // ₹2499
            });

            const data = await response.json();
            const order = data.order;

            const options = {
                key: "rzp_test_Sb027JS0JFaihL", // your Razorpay key_id
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                handler: async function (response) {
                    const verifyRes = await fetch(
                        "http://localhost:4000/api/verify-payment",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(response),
                        }
                    );
                    const verifyData = await verifyRes.json();
                    alert(verifyData.success ? "Payment successful!" : "Payment failed!");
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: { color: "#3399cc" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
        }
    };

    // --- UI Render ---
    return (
        <div
            className="container py-4"
            style={{ minHeight: 620, background: "linear-gradient(90deg,#fffbe0 60%,#fff)" }}
        >
            {loaderStatus ? (
                <div className="loader-container text-center py-5">
                    <PulseLoader loading={loaderStatus} size={50} color="#fde02f" />
                </div>
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="shadow bg-gradient-to-r from-orange-50 to-yellow-100 rounded-lg p-4 mb-3 text-center"
                    >
                        {/* Header Bar */}
                        <h1 className="text-2xl font-extrabold mb-1 text-orange-700 tracking-tight">
                            <motion.span
                                animate={{ rotate: [0, 30, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                style={{ display: "inline-block" }}
                            >🚗</motion.span>{" "}
                            Odisha Journey Booking
                        </h1>
                        <div className="mt-2 text-slate-800">
                            <b className="text-orange-600">Plan, Customize, Enjoy – with live maps, animated steps!</b>
                        </div>
                        <div className="mt-3 text-center">
                            <div
                                className="progress mx-auto"
                                style={{ height: 9, width: "80%", background: "#ffe4b3" }}
                            >
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                        width: `${(step / 4) * 100}%`,
                                        background: "linear-gradient(90deg,#f59e42,#ffbb67)",
                                        transition: "width 0.5s",
                                    }}
                                    aria-valuenow={step}
                                    aria-valuemin="0"
                                    aria-valuemax="4"
                                ></div>
                            </div>
                            {/* Step hint */}
                            <div className="text-muted small mt-1">
                                Step {step + 1} / 5
                            </div>


                        </div>


                    </motion.div>
                    <form onSubmit={handleSubmit} style={{ position: "relative" }} autoComplete="off">
                        {/* --- STEP 0 --- */}
                        <AnimatedFade keyName="step0" visible={step === 0}>
                            <motion.div className="card p-3 mb-3 mx-auto" style={{ maxWidth: 690 }}>
                                <h4 className="mb-2">Start Your Journey</h4>
                                <div className="mb-3">
                                    <label><b>Destination City</b></label>
                                    <input className="form-control" name="city" value={formData.city} onChange={handleFormChange}
                                        placeholder="Type Bhubaneswar, Puri, ..." autoFocus
                                    />
                                    <AnimatePresence>
                                        {suggestedCities.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                className="dropdown-menu show mt-0"
                                                style={{ position: "static" }}
                                            >
                                                {suggestedCities.map((s) => (
                                                    <div
                                                        key={s}
                                                        className="dropdown-item"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() =>
                                                            setFormData({ ...formData, city: s, hotel: "" })
                                                        }
                                                    >
                                                        {s}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="mb-3">
                                    <label><b> Hotel</b> <span className="text-muted"></span></label>
                                    <input className="form-control" name="hotel" value={formData.hotel}
                                        onChange={handleFormChange}
                                        placeholder="Type hotel name..."
                                    />
                                    <AnimatePresence>
                                        {suggestedHotels.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 16 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                className="dropdown-menu show mt-0"
                                                style={{ position: "static", maxHeight: "200px", overflowY: "auto" }}
                                            >
                                                {suggestedHotels.map((h) => (
                                                    <div
                                                        key={h.name}
                                                        className="dropdown-item"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() =>
                                                            setFormData({
                                                                ...formData,
                                                                hotel: h.name,
                                                                city: h.city,
                                                            })
                                                        }
                                                    >
                                                        {h.name} <span className="text-secondary small">({h.city}) {h.price}</span>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="mb-3 row">
                                    <div className="col-md-6">
                                        <label><b>Check-in Date</b></label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            name="checkIn"
                                            value={formData.checkIn}
                                            onChange={handleFormChange}
                                            min={new Date().toISOString().split("T")[0]}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label><b>Check-out</b></label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            value={getEndDate(formData.checkIn, nights)}
                                            disabled readOnly
                                        />
                                        <span className="small text-muted">(Auto)</span>
                                    </div>
                                </div>
                                <div>
                                    <label><b>Select Package</b></label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {PACKAGE_DATA.map((pkg) => (
                                            <motion.label
                                                whileHover={{ scale: 1.06, borderColor: "#f59e42" }}
                                                key={pkg.code}
                                                className={`card p-2 px-3 me-2 ${selectedPackage.code === pkg.code
                                                    ? "border-warning bg-warning-subtle"
                                                    : ""
                                                    }`}
                                                style={{ cursor: "pointer", minWidth: 190 }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="pkg"
                                                    value={pkg.code}
                                                    checked={selectedPackage.code === pkg.code}
                                                    onChange={handlePackageChange}
                                                    style={{ marginRight: 8 }}
                                                />
                                                <b>{pkg.title}</b><br />
                                                <span className="text-muted small">{pkg.description}</span>
                                                <span className="fw-bold text-orange-800 ms-2">
                                                    ₹{pkg.price}
                                                </span>
                                            </motion.label>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-3 mb-2 text-end">
                                    <button
                                        className="btn btn-warning fw-bold px-5"
                                        type="button"
                                        onClick={() => { if (validateStep()) nextStep(); }}
                                    >
                                        Next <span role="img" aria-label="next">⏭️</span>
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatedFade>
                        {/* --- STEP 1: Pickup/Drop/Map --- */}
                        <AnimatedFade keyName="step1" visible={step === 1}>
                            <motion.div className="card p-3 mb-3 mx-auto" style={{ maxWidth: 690 }}>
                                <h4>Pickup & Drop Details</h4>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label><b>Pickup Point Type</b></label>
                                        <select
                                            className="form-select"
                                            name="pickup"
                                            value={formData.pickup}
                                            onChange={handleFormChange}
                                            required
                                        >
                                            <option value="">Select...</option>
                                            <option value="Baramunda Bus Stand">Baramunda Bus Stand</option>
                                            <option value="Railway Station">Railway Station</option>
                                            <option value="Airport">Airport</option>
                                            <option value="MapSelect">Choose on Map</option>
                                        </select>
                                        {formData.pickup === "MapSelect" && (
                                            <LocationPicker
                                                label="Pickup"
                                                position={pMarker}
                                                setPosition={setpMarker}
                                            />
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <label><b>Drop Point Type</b></label>
                                        <select
                                            className="form-select"
                                            name="drop"
                                            value={formData.drop}
                                            onChange={handleFormChange}
                                            required
                                        >
                                            <option value="">Select...</option>
                                            <option value="Baramunda Bus Stand">Baramunda Bus Stand</option>
                                            <option value="Railway Station">Railway Station</option>
                                            <option value="Airport">Airport</option>
                                            <option value="MapSelect">Choose on Map</option>
                                        </select>
                                        {formData.drop === "MapSelect" && (
                                            <LocationPicker label="Drop" position={dMarker} setPosition={setdMarker} />
                                        )}
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <label><b>Select Cab Type</b></label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {CAB_OPTIONS.map((cab) => (
                                                <motion.label
                                                    whileHover={{ scale: 1.09 }}
                                                    key={cab.type}
                                                    className={`card px-2 py-1 me-2 ${formData.cabType === cab.type
                                                        ? "border-success bg-warning-subtle"
                                                        : ""
                                                        }`}
                                                    style={{ minWidth: 125, cursor: "pointer" }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="cabType"
                                                        value={cab.type}
                                                        onChange={handleFormChange}
                                                        checked={formData.cabType === cab.type}
                                                        style={{ marginRight: 7 }}
                                                    />
                                                    {cab.type} {cab.price > 0 && <b>(+₹{cab.price})</b>}
                                                    <div className="small text-muted">{cab.desc}</div>
                                                </motion.label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label><b>Special Requests</b></label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="specialRequests"
                                            value={formData.specialRequests}
                                            onChange={handleFormChange}
                                            placeholder="Any specific requirement?"
                                        />
                                    </div>
                                </div>
                                <div className="mt-3 mb-2 text-end">
                                    <button className="btn btn-outline-dark mx-1" type="button" onClick={prevStep}>Back</button>
                                    <button
                                        className="btn btn-warning fw-bold px-5"
                                        type="button"
                                        onClick={() => { if (validateStep()) nextStep(); }}
                                    >
                                        Next <span role="img" aria-label="next">⏭️</span>
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatedFade>
                        {/* --- STEP 2: Travelers --- */}
                        <AnimatedFade keyName="step2" visible={step === 2}>
                            <motion.div className="card p-3 mb-3 mx-auto" style={{ maxWidth: 690 }}>
                                <h4>Traveler Details</h4>
                                <div>
                                    {travelers.map((tr, idx) => (
                                        <motion.div
                                            layout
                                            transition={{ type: "spring", stiffness: 230, damping: 19 }}
                                            key={idx}
                                            className="mb-2 d-flex gap-2 align-items-center"
                                        >
                                            <input
                                                className="form-control"
                                                style={{ maxWidth: 120 }}
                                                placeholder="Name"
                                                value={tr.name}
                                                onChange={(e) => handleTraveler(idx, "name", e.target.value)}
                                                required
                                            />
                                            <input
                                                className="form-control"
                                                style={{ maxWidth: 60 }}
                                                placeholder="Age"
                                                value={tr.age}
                                                onChange={(e) =>
                                                    handleTraveler(idx, "age", e.target.value.replace(/\D/, ""))
                                                }
                                                required
                                            />
                                            <select
                                                className="form-select"
                                                style={{ maxWidth: 105 }}
                                                value={tr.gender}
                                                onChange={(e) => handleTraveler(idx, "gender", e.target.value)}
                                                required
                                            >
                                                <option value="">Gender</option>
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                            </select>
                                            {travelers.length > 1 && (
                                                <button className="btn btn-danger btn-sm" type="button" onClick={() => removeTraveler(idx)}>
                                                    &times;
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                    <button className="btn btn-sm btn-link px-1" type="button" onClick={addTraveler}>
                                        + Add Guest
                                    </button>
                                </div>
                                <div className="mt-3 mb-2 text-end">
                                    <button className="btn btn-outline-dark mx-1" type="button" onClick={prevStep}>Back</button>
                                    <button
                                        className="btn btn-warning fw-bold px-5"
                                        type="button"
                                        onClick={() => { if (validateStep()) nextStep(); }}
                                    >
                                        Next <span role="img" aria-label="next">⏭️</span>
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatedFade>
                        {/* --- STEP 3: Contact Details & Coupon --- */}
                        <AnimatedFade keyName="step3" visible={step === 3}>
                            <motion.div className="card p-3 mb-3 mx-auto" style={{ maxWidth: 690 }}>
                                <h4>Contact & Offers</h4>
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <label><b>Your Name</b></label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label><b>Mobile Number</b></label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="mobileNumber"
                                            value={formData.mobileNumber}
                                            maxLength={10}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label><b>Email</b></label>
                                        <input
                                            className="form-control"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label><b>Coupon</b></label>
                                        <div className="input-group">
                                            <input
                                                className="form-control"
                                                name="coupon"
                                                value={formData.coupon}
                                                onChange={handleFormChange}
                                                placeholder="Try ODISHA500"
                                            />
                                            <button type="button" className="btn btn-outline-primary" onClick={handleCoupon}>
                                                Apply
                                            </button>
                                        </div>
                                        {couponDiscount > 0 && (
                                            <span className="fw-bold text-success">- ₹{couponDiscount} Applied!</span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-3 mb-2 text-end">
                                    <button className="btn btn-outline-dark mx-1" type="button" onClick={prevStep}>Back</button>
                                    <button
                                        className="btn btn-warning fw-bold px-5"
                                        type="button"
                                        onClick={() => { if (validateStep()) nextStep(); }}
                                    >
                                        Next <span role="img" aria-label="next">⏭️</span>
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatedFade>
                        {/* --- STEP 4: Summary/Payment/PDF --- */}
                        <AnimatedFade keyName="step4" visible={step === 4}>
                            <motion.div className="card p-3 mb-3 mx-auto" style={{ maxWidth: 720 }}>
                                <h4>Summary & Pay</h4>
                                <div className="row">
                                    <div className="col-md-7">
                                        <b className="mb-1">Trip Summary</b>
                                        <div className="ms-2">
                                            <div><b>Package:</b> {selectedPackage.title}</div>
                                            <div><b>City/Hotel:</b> {formData.city}, {formData.hotel}</div>
                                            <div><b>Date:</b> {formData.checkIn} to {getEndDate(formData.checkIn, nights)}</div>
                                            <div><b>Pickup/Drop:</b>
                                                {formData.pickup === "MapSelect"
                                                    ? `📍Map (Lat:${pMarker[0].toFixed(3)} ...)`
                                                    : formData.pickup}{" "}
                                                →{" "}
                                                {formData.drop === "MapSelect"
                                                    ? `📍Map (Lat:${dMarker[0].toFixed(3)} ...)`
                                                    : formData.drop}
                                            </div>
                                            <div>
                                                <b>Guests:</b> {nGuests}
                                                <br />
                                                {travelers.map((tr, i) => (
                                                    <div className="small text-muted" key={i}>
                                                        {tr.name} ({tr.gender}, {tr.age} yrs)
                                                    </div>
                                                ))}
                                            </div>
                                            <div><b>Cab:</b> {formData.cabType}</div>
                                            <div><b>Special Req:</b> {formData.specialRequests || "-"}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <b>Fare Breakdown</b>
                                        <ul className="list-group mb-2">
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Base Tour (for {nGuests} Guest{nGuests > 1 ? 's' : ''})</span>
                                                <span>₹{selectedPackage.price * nGuests}</span>
                                            </li>

                                            {/*-- MODIFIED: This section now correctly displays the hotel fare --*/}
                                            {hotelFare > 0 && (
                                                <li className="list-group-item d-flex justify-content-between">
                                                    <span>Hotel ({nights} night{nights > 1 ? 's' : ''})</span>
                                                    <span>₹{hotelFare * nights}</span>
                                                </li>
                                            )}

                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Cab ({formData.cabType})</span>
                                                <span>₹{cabAddon}</span>
                                            </li>
                                            {couponDiscount > 0 && (
                                                <li className="list-group-item d-flex justify-content-between text-success">
                                                    <span>Coupon</span>
                                                    <span>-₹{couponDiscount}</span>
                                                </li>
                                            )}
                                            <li className="list-group-item d-flex justify-content-between fw-bold text-orange-700">
                                                <span>Total</span>
                                                <span>₹{totalPrice}</span>
                                            </li>
                                        </ul>
                                        <div className="mb-2">
                                            <b>Payment:</b>
                                            <select
                                                className="form-select"
                                                name="payMethod"
                                                value={formData.payMethod}
                                                onChange={handleFormChange}
                                            >
                                                <option>Pay at Arrival</option>
                                                <option>Pay Online </option>
                                            </select>
                                        </div>
                                        {formData.payMethod === "Pay Online" && (
                                            <button
                                                type="button" // ✅ prevents form submit
                                                onClick={handleRazorpayPayment}
                                                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full mt-3"
                                            >
                                                Pay ₹{totalPrice} Now
                                            </button>
                                        )}

                                    </div>
                                    <div className="mt-3 text-end">
                                        <button className="btn btn-outline-dark mx-1" type="button" onClick={prevStep}>Back</button>
                                        <button className="btn btn-success fw-bold px-5" type="submit">
                                            Confirm & Print <span role="img" aria-label="print">🖨️</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatedFade>
                    </form>
                </>
            )}
        </div>
    );
}