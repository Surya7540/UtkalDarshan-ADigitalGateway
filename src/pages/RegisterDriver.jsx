import React, { useState } from "react";
import axios from "axios";

export default function RegisterDriver() {
    const [form, setForm] = useState({
        name: "",
        mobile: "",
        cabType: "",
        license: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/register/driver", form);
            alert("Driver registered successfully!");
            setForm({
                name: "",
                mobile: "",
                cabType: "",
                license: "",
            });
        } catch {
            alert("Failed to register driver.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register as Driver</h2>
            <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
            />
            <input
                name="mobile"
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={handleChange}
                required
            />
            <input
                name="cabType"
                placeholder="Cab Type (e.g., Sedan, SUV)"
                value={form.cabType}
                onChange={handleChange}
                required
            />
            <input
                name="license"
                placeholder="License Number"
                value={form.license}
                onChange={handleChange}
                required
            />
            <button type="submit">Submit Registration</button>
        </form>
    );
}
