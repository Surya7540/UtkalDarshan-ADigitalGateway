// Create a new file named AdminDashboard.js

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

// Helper function to format currency
const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

export default function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState('All');

    // Load bookings from localStorage when the component mounts
    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = () => {
        const storedBookings = JSON.parse(localStorage.getItem('allBookings')) || [];
        setBookings(storedBookings.sort((a, b) => b.id - a.id)); // Show newest first
    };

    const handleStatusChange = (bookingId, newStatus) => {
        const updatedBookings = bookings.map(b =>
            b.id === bookingId ? { ...b, status: newStatus } : b
        );
        setBookings(updatedBookings);
        localStorage.setItem('allBookings', JSON.stringify(updatedBookings));
        Swal.fire('Updated!', `Booking status changed to ${newStatus}.`, 'success');
    };

    // Calculate summary data
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
    const totalRevenue = bookings
        .filter(b => b.status === 'Confirmed') // Only count revenue from confirmed bookings
        .reduce((sum, b) => sum + b.totalPrice, 0);

    // Filter bookings for display
    const filteredBookings = bookings.filter(b => {
        if (filter === 'All') return true;
        return b.status === filter;
    });

    return (
        <div className="container py-4" style={{ backgroundColor: '#f8f9fa' }}>
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold">Admin Dashboard</h2>
                        <p className="text-muted">Manage bookings and monitor notifications</p>
                    </div>
                    <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={loadBookings}>
                        <i className="bi bi-arrow-clockwise"></i> Refresh
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="row g-3 mb-4">
                    {[
                        { title: 'Total Bookings', value: totalBookings, icon: 'bi-journal-text', color: '#0d6efd' },
                        { title: 'Pending', value: pendingBookings, icon: 'bi-hourglass-split', color: '#ffc107' },
                        { title: 'Confirmed', value: confirmedBookings, icon: 'bi-check-circle-fill', color: '#198754' },
                        { title: 'Total Revenue', value: formatCurrency(totalRevenue), icon: 'bi-currency-rupee', color: '#dc3545' }
                    ].map(card => (
                        <div className="col-md-3" key={card.title}>
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body text-center">
                                    <i className={`bi ${card.icon}`} style={{ fontSize: '2rem', color: card.color }}></i>
                                    <h3 className="card-title my-2">{card.value}</h3>
                                    <p className="card-text text-muted">{card.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Bookings Table */}
                <div className="card shadow-sm border-0">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Recent Bookings</h4>
                        <div className="btn-group">
                            {['All', 'Pending', 'Confirmed'].map(status => (
                                <button
                                    key={status}
                                    type="button"
                                    className={`btn ${filter === status ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setFilter(status)}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Package</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.length > 0 ? filteredBookings.map(b => (
                                        <tr key={b.id}>
                                            <td>#{b.id.toString().slice(-6)}</td>
                                            <td>{b.formData.name}</td>
                                            <td>{b.selectedPackage.title}</td>
                                            <td>{new Date(b.formData.checkIn).toLocaleDateString()}</td>
                                            <td>{formatCurrency(b.totalPrice)}</td>
                                            <td>
                                                <span className={`badge ${b.status === 'Confirmed' ? 'bg-success' : 'bg-warning'}`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td>
                                                {b.status === 'Pending' && (
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleStatusChange(b.id, 'Confirmed')}
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted py-4">No bookings found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}