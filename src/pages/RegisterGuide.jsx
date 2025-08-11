import React, { useState } from "react";
import axios from "axios";

export default function RegisterGuide() {
    const [form, setForm] = useState({
        name: "",
        mobile: "",
        language: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/register/guide", form);
            alert("Guide registered successfully!");
            setForm({
                name: "",
                mobile: "",
                language: "",
            });
        } catch {
            alert("Failed to register guide.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register as Guide</h2>
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
                name="language"
                placeholder="Languages Spoken"
                value={form.language}
                onChange={handleChange}
                required
            />
            <button type="submit">Submit Registration</button>
        </form>
    );
}
