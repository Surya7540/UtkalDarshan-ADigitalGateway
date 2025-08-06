import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { PulseLoader } from "react-spinners";

const PACKAGE_DATA = [
    {
        code: "1N2D",
        title: "1 Night / 2 Days - Puri & Konark",
        description:
            "A whirlwind journey including the Jagannath Temple and the Sun Temple, plus Puri Beach!",
        price: 3999,
    },
    {
        code: "2N3D",
        title: "2 Nights / 3 Days - Bhubaneswar & Chilika",
        description:
            "Explore Bhubaneswar's temples and Udayagiri caves. Day trip to Chilika Lake for dolphin watching.",
        price: 6499,
    },
    {
        code: "4N5D",
        title: "4 Nights / 5 Days - Complete Coastal Odisha",
        description:
            "Puri, Konark, Bhubaneswar, Chilika & Gopalpur - heritage, beach, wildlife, temples, everything!",
        price: 11499,
    },
];

const initialFormData = {
    name: "",
    checkIn: "",
    checkOut: "",
    noGuest: "",
    mobileNumber: "",
    email: ""
};

const PackageBook = () => {
    const [selectedPackage, setSelectedPackage] = useState(PACKAGE_DATA[0]);
    const [formData, setFormData] = useState(initialFormData);
    const [isValidMobile, setIsValidMobile] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [loaderStatus, setLoaderStatus] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoaderStatus(false), 1500);
    }, []);

    const handlePackageChange = (e) => {
        const pkg = PACKAGE_DATA.find((p) => p.code === e.target.value);
        setSelectedPackage(pkg);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "mobileNumber") {
            const numericValue = value.replace(/\D/g, "");
            setFormData({ ...formData, [name]: numericValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const sendEmail = () => {
        const subject = "Tour Booking Confirmation";
        let body = `Package: ${selectedPackage.title}\nPrice: ₹${selectedPackage.price}\n`;
        for (const key in formData) {
            body += `${key}: ${formData[key]}\n`;
        }
        const mailtoLink = `mailto:nigammishra826@gmail.com?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // validation
        const isValidMobileNumber = /^[0-9]{10}$/.test(formData.mobileNumber);
        const isValidEmailAddress = /\S+@\S+\.\S+/.test(formData.email);
        const isCheckInDateValid = formData.checkIn !== "";
        const isCheckOutDateValid = formData.checkOut !== "" && formData.checkOut > formData.checkIn;

        setIsValidMobile(isValidMobileNumber);
        setIsValidEmail(isValidEmailAddress);

        if (isValidMobileNumber && isValidEmailAddress && isCheckInDateValid && isCheckOutDateValid) {
            // Store booking & show alert
            localStorage.setItem("packageBooking", JSON.stringify({ ...formData, selectedPackage }));
            Swal.fire({
                title: 'Success!',
                text: 'Your package is booked successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                sendEmail();
                setFormData(initialFormData);
            });
        } else {
            // validation errors
            if (!isCheckInDateValid) {
                Swal.fire({
                    title: "Error!",
                    text: "Please select a valid check-in date.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            } else if (!isCheckOutDateValid) {
                Swal.fire({
                    title: "Error!",
                    text: "Please select a valid check-out date after the check-in date.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Please enter a valid mobile number and email address.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        }
    };

    return (
        <div className="container mb-4">
            {loaderStatus ? (
                <div className="loader-container">
                    <PulseLoader loading={loaderStatus} size={50} color="#fde02f" />
                </div>
            ) : (
                <>
                    <h1 style={{ marginTop: 30, marginBottom: 35, textAlign: "center" }}>
                        Odisha Tour Packages Booking
                    </h1>
                    <div className="mb-4">
                        <h4>Select Your Package</h4>
                        {PACKAGE_DATA.map((pkg) => (
                            <div key={pkg.code} className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id={pkg.code}
                                    value={pkg.code}
                                    checked={selectedPackage.code === pkg.code}
                                    onChange={handlePackageChange}
                                />
                                <label className="form-check-label" htmlFor={pkg.code}>
                                    <b>{pkg.title}</b> – ₹{pkg.price}
                                    <div style={{ fontSize: "0.95em", color: "#555" }}>{pkg.description}</div>
                                </label>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label><b>Your Name</b></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label><b>Check In</b></label>
                                <input
                                    className="form-control"
                                    type="date"
                                    name="checkIn"
                                    value={formData.checkIn}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label><b>Check Out</b></label>
                                <input
                                    className="form-control"
                                    type="date"
                                    name="checkOut"
                                    value={formData.checkOut}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label><b>No. of Guests</b></label>
                                <input
                                    className="form-control"
                                    type="number"
                                    min={1}
                                    name="noGuest"
                                    value={formData.noGuest}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-5">
                                <label><b>Mobile Number</b></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    maxLength={10}
                                    onChange={handleChange}
                                />
                                {!isValidMobile &&
                                    <div style={{ color: "red" }}>Enter a valid 10-digit mobile number</div>}
                            </div>
                            <div className="col-md-4">
                                <label><b>Email</b></label>
                                <input
                                    placeholder="xyz@gmail.com"
                                    className="form-control"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {!isValidEmail &&
                                    <div style={{ color: "red" }}>Enter a valid email address</div>}
                            </div>
                        </div>
                        <div className="text-center mt-4">
                            <button type="submit" className="btn btn-primary btn-lg">
                                Book This Package
                            </button>
                        </div>
                        <div className="mt-3" style={{ textAlign: "center" }}>
                            <b>Selected Package: </b>
                            <span>{selectedPackage.title} – ₹{selectedPackage.price}</span>
                        </div>
                        <div className="mb-4" style={{ textAlign: "center", color: "#777" }}>
                            {selectedPackage.description}
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default PackageBook;
