import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simple admin authentication (you can change these credentials)
            const ADMIN_EMAIL = "admin@utkaldarshan.com";
            const ADMIN_PASSWORD = "admin123";

            if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
                // Store admin info in localStorage
                localStorage.setItem("adminInfo", JSON.stringify({
                    email: formData.email,
                    name: "Admin",
                    role: "admin"
                }));
                localStorage.setItem("adminToken", "local-admin-token");

                Swal.fire({
                    title: "🎉 Login Successful!",
                    text: "Welcome to UtkalDarshan Admin Dashboard",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });

                setTimeout(() => {
                    navigate("/admin");
                }, 2000);
            } else {
                throw new Error("Invalid email or password");
            }
        } catch (error) {
            Swal.fire({
                title: "❌ Login Failed",
                text: error.message || "Please check your credentials and try again",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card shadow-lg border-0"
                    >
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    🏛️
                                </motion.div>
                                <h2 className="h3 mb-2">Admin Login</h2>
                                <p className="text-muted">UtkalDarshan Tourism</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Logging in...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-4">
                                <small className="text-muted">
                                    Default credentials:<br />
                                    Email: admin@utkaldarshan.com<br />
                                    Password: admin123
                                </small>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
