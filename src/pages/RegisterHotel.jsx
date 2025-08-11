import React, { useState } from "react";
import axios from "axios";

export default function RegisterHotel() {
    const [form, setForm] = useState({
        name: "",
        city: "",
        price: "",
        contact: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/register/hotel", form);
            alert("Hotel registered successfully!");
            setForm({
                name: "",
                city: "",
                price: "",
                contact: "",
            });
        } catch {
            alert("Failed to register hotel.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register as Hotel</h2>
            <input
                name="name"
                placeholder="Hotel Name"
                value={form.name}
                onChange={handleChange}
                required
            />
            <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                required
            />
            <input
                name="price"
                type="number"
                placeholder="Price per Night"
                value={form.price}
                onChange={handleChange}
                required
            />
            <input
                name="contact"
                placeholder="Contact Info"
                value={form.contact}
                onChange={handleChange}
                required
            />
            <button type="submit">Submit Registration</button>
        </form>
    );
}
