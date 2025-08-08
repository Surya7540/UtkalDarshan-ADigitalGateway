import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { PulseLoader } from "react-spinners";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Dummy Data ---
const CITIES = ["Bhubaneswar", "Puri", "Konark", "Cuttack", "Chilika", "Gopalpur"];
const HOTELS = [
    { name: "Mayfair Lagoon", city: "Bhubaneswar", price: 5000 },
    { name: "Hotel Holiday Resort", city: "Puri", price: 2000 },
    { name: "Eco Retreat", city: "Konark", price: 300 },
    { name: "Swosti Premium", city: "Bhubaneswar", price: 4500 },
    { name: "Toshali Sands", city: "Puri", price: 3500 },
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

    // --- Price Logic
    const cabAddon = CAB_OPTIONS.find((c) => c.type === formData.cabType)?.price || 0;
    const nGuests = Math.max(1, parseInt(formData.noGuest) || 1);
    const totalPrice = nGuests * (selectedPackage.price + cabAddon) - (couponDiscount || 0);

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
            checkOut: getEndDate(f.checkIn, selectedPackage.duration - 1),
        }));
    }, [selectedPackage]);
    useEffect(() => {
        // City/hotel autocomplete
        setSuggestedCities(
            formData.city.length >= 2
                ? CITIES.filter((c) => c.toLowerCase().includes(formData.city.toLowerCase())).slice(0, 3)
                : []
        );
    }, [formData.city]);
    useEffect(() => {
        setSuggestedHotels(
            formData.hotel.length >= 2
                ? HOTELS.filter(
                    (h) =>
                        h.name.toLowerCase().includes(formData.hotel.toLowerCase()) &&
                        (!formData.city ||
                            h.city.toLowerCase() === formData.city.toLowerCase())
                ).slice(0, 3)
                : []
        );
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
    function handleSubmit(e) {
        e.preventDefault();
        if (!validateStep()) return;
        if (step < 4) return nextStep();
        // Final submit logic
        Swal.fire({
            title: "Booking Confirmed!",
            html:
                `<b>${formData.name}</b> - <b>₹${totalPrice}</b><br>` +
                `<span style="font-size:0.91em"> Confirmation sent to: <b>${formData.email}</b></span>`,
            icon: "success",
        });
        setTimeout(() => window.print(), 1100); // Prompt printout
        setStep(0);
    }

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
                                                            setFormData({ ...formData, city: s })
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
                                    <label><b>Preferred Hotel</b> <span className="text-muted"></span></label>
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
                                                style={{ position: "static" }}
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
                                            value={getEndDate(formData.checkIn, selectedPackage.duration - 1)}
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
                                            <div><b>Date:</b> {formData.checkIn} to {getEndDate(formData.checkIn, selectedPackage.duration - 1)}</div>
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
                                                <span>Base Tour ({selectedPackage.title})</span> <span>₹{selectedPackage.price}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Cab ({formData.cabType})</span> <span>₹{cabAddon}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Guests</span> <span>x{nGuests}</span>
                                            </li>
                                            {couponDiscount > 0 && (
                                                <li className="list-group-item d-flex justify-content-between text-success">
                                                    <span>Coupon</span> <span>-₹{couponDiscount}</span>
                                                </li>
                                            )}
                                            <li className="list-group-item d-flex justify-content-between fw-bold text-orange-700">
                                                <span>Total</span> <span>₹{totalPrice}</span>
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
                                                <option>Pay Online (DEMO)</option>
                                            </select>
                                        </div>
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
