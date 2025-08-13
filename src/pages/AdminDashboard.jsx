import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [itemsPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, [currentPage, statusFilter, searchTerm]);

    function fetchDashboardData() {
        try {
            setLoading(true);
            
            // Get bookings from local storage
            const storedBookings = JSON.parse(localStorage.getItem('utkaldarsan_bookings') || '[]');
            
            // Filter bookings based on search and status
            let filteredBookings = storedBookings;
            
            if (searchTerm) {
                filteredBookings = filteredBookings.filter(booking => 
                    booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    booking.packageTitle.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            if (statusFilter !== 'all') {
                filteredBookings = filteredBookings.filter(booking => 
                    statusFilter === 'status' ? booking.status === statusFilter : 
                    statusFilter === 'payment' ? booking.paymentStatus === statusFilter : true
                );
            }
            
            // Calculate pagination
            const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);
            
            // Calculate statistics
            const totalBookings = storedBookings.length;
            const confirmedBookings = storedBookings.filter(b => b.status === 'confirmed').length;
            const pendingBookings = storedBookings.filter(b => b.status === 'pending').length;
            const totalRevenue = storedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
            const pendingPayments = storedBookings.filter(b => b.paymentStatus === 'pending').length;
            const completedPayments = storedBookings.filter(b => b.paymentStatus === 'completed').length;
            
            setStats({
                totalBookings,
                confirmedBookings,
                pendingBookings,
                totalRevenue,
                pendingPayments,
                completedPayments,
                totalPages
            });
            
            setBookings(paginatedBookings);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }

    function updateBookingStatus(bookingId, newStatus) {
        try {
            const storedBookings = JSON.parse(localStorage.getItem('utkaldarsan_bookings') || '[]');
            const updatedBookings = storedBookings.map(booking => 
                booking.id === bookingId ? { ...booking, status: newStatus } : booking
            );
            
            localStorage.setItem('utkaldarsan_bookings', JSON.stringify(updatedBookings));
            
            Swal.fire("Success", "Booking status updated!", "success");
            fetchDashboardData(); // Refresh data
        } catch (err) {
            Swal.fire("Error", `Update failed: ${err.message}`, "error");
        }
    }

    function updatePaymentStatus(bookingId, newPaymentStatus) {
        try {
            const storedBookings = JSON.parse(localStorage.getItem('utkaldarsan_bookings') || '[]');
            const updatedBookings = storedBookings.map(booking => 
                booking.id === bookingId ? { ...booking, paymentStatus: newPaymentStatus } : booking
            );
            
            localStorage.setItem('utkaldarsan_bookings', JSON.stringify(updatedBookings));
            
            Swal.fire("Success", "Payment status updated!", "success");
            fetchDashboardData(); // Refresh data
        } catch (err) {
            Swal.fire("Error", `Update failed: ${err.message}`, "error");
        }
    }

    function deleteBooking(bookingId) {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const storedBookings = JSON.parse(localStorage.getItem('utkaldarsan_bookings') || '[]');
                    const updatedBookings = storedBookings.filter(booking => booking.id !== bookingId);
                    
                    localStorage.setItem('utkaldarsan_bookings', JSON.stringify(updatedBookings));
                    
                    Swal.fire("Deleted!", "Booking has been deleted.", "success");
                    fetchDashboardData(); // Refresh data
                } catch (err) {
                    Swal.fire("Error", `Delete failed: ${err.message}`, "error");
                }
            }
        });
    }

    function exportBookings() {
        try {
            const storedBookings = JSON.parse(localStorage.getItem('utkaldarsan_bookings') || '[]');
            const csvContent = [
                ['Booking ID', 'Customer Name', 'Email', 'Package', 'Total Amount', 'Status', 'Payment Status', 'Check In', 'Check Out', 'Hotel', 'City', 'Guests', 'Booking Date'].join(','),
                ...storedBookings.map(booking => [
                    booking.id,
                    `"${booking.customerName}"`,
                    `"${booking.customerEmail}"`,
                    `"${booking.packageTitle}"`,
                    booking.totalPrice,
                    booking.status,
                    booking.paymentStatus,
                    booking.checkIn,
                    booking.checkOut,
                    `"${booking.hotel}"`,
                    `"${booking.city}"`,
                    booking.numberOfGuests,
                    new Date(booking.bookingDate).toLocaleDateString()
                ].join(','))
            ].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `utkaldarshan_bookings_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            Swal.fire("Success", "Bookings exported to CSV!", "success");
        } catch (err) {
            Swal.fire("Error", `Export failed: ${err.message}`, "error");
        }
    }

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
            >
                <h1 className="h2 mb-3">📊 Admin Dashboard</h1>
                <p className="text-muted">Manage bookings and view statistics</p>
            </motion.div>

            {/* Statistics Cards */}
            {stats && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="row mb-4"
                >
                    <div className="col-md-2 col-sm-6 mb-3">
                        <div className="card bg-primary text-white h-100">
                            <div className="card-body text-center">
                                <h3 className="h4">{stats.totalBookings}</h3>
                                <p className="mb-0">Total Bookings</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 col-sm-6 mb-3">
                        <div className="card bg-success text-white h-100">
                            <div className="card-body text-center">
                                <h3 className="h4">{stats.confirmedBookings}</h3>
                                <p className="mb-0">Confirmed</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 col-sm-6 mb-3">
                        <div className="card bg-warning text-white h-100">
                            <div className="card-body text-center">
                                <h3 className="h4">{stats.pendingBookings}</h3>
                                <p className="mb-0">Pending</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 col-sm-6 mb-3">
                        <div className="card bg-info text-white h-100">
                            <div className="card-body text-center">
                                <h3 className="h4">₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
                                <p className="mb-0">Total Revenue</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 col-sm-6 mb-3">
                        <div className="card bg-danger text-white h-100">
                            <div className="card-body text-center">
                                <h3 className="h4">{stats.pendingPayments}</h3>
                                <p className="mb-0">Pending Payments</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 col-sm-6 mb-3">
                        <div className="card bg-secondary text-white h-100">
                            <div className="card-body text-center">
                                <h3 className="h4">{stats.completedPayments}</h3>
                                <p className="mb-0">Completed</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="row mb-4"
            >
                <div className="col-md-4 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-3 mb-3">
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div className="col-md-3 mb-3">
                    <button
                        className="btn btn-success me-2"
                        onClick={exportBookings}
                    >
                        📊 Export CSV
                    </button>
                </div>
            </motion.div>

            {/* Bookings Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
            >
                <div className="card-header">
                    <h5 className="mb-0">Bookings ({bookings.length})</h5>
                </div>
                <div className="card-body">
                    {bookings.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-muted">No bookings found</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Package</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Payment</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => (
                                        <tr key={booking.id}>
                                            <td>
                                                <small className="text-muted">{booking.id}</small>
                                            </td>
                                            <td>
                                                <div>
                                                    <strong>{booking.customerName}</strong>
                                                    <br />
                                                    <small className="text-muted">{booking.customerEmail}</small>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <strong>{booking.packageTitle}</strong>
                                                    <br />
                                                    <small className="text-muted">
                                                        {booking.checkIn} to {booking.checkOut}
                                                    </small>
                                                </div>
                                            </td>
                                            <td>
                                                <strong>₹{booking.totalPrice?.toLocaleString('en-IN')}</strong>
                                            </td>
                                            <td>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={booking.status || 'pending'}
                                                    onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={booking.paymentStatus || 'pending'}
                                                    onChange={(e) => updatePaymentStatus(booking.id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="failed">Failed</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => deleteBooking(booking.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Pagination */}
            {stats && stats.totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="d-flex justify-content-center mt-4"
                >
                    <nav>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>
                            {Array.from({ length: stats.totalPages }, (_, i) => i + 1).map(page => (
                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === stats.totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === stats.totalPages}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </motion.div>
            )}
        </div>
    );
}
