import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const token = localStorage.getItem("adminToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const [drivers, setDrivers] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [guides, setGuides] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [d, h, g, b] = await Promise.all([
                    axios.get("/api/admin/drivers", config),
                    axios.get("/api/admin/hotels", config),
                    axios.get("/api/admin/guides", config),
                    axios.get("/api/admin/bookings", config),
                ]);
                setDrivers(d.data); setHotels(h.data); setGuides(g.data); setBookings(b.data);
            } catch (err) {
                setError(`Failed to fetch admin data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [config]);

    async function approve(type, id, setter, list) {
        try {
            await axios.post(`/api/admin/${type}/${id}/approve`, {}, config);
            setter(list.map(item => item._id === id ? { ...item, approved: true } : item));
            Swal.fire("Success", "Approved!", "success");
        } catch (err) {
            Swal.fire("Error", `Approval failed: ${err.message}`, "error");
        }
    }

    function logout() {
        localStorage.removeItem("adminToken");
        sessionStorage.removeItem("isLoggedIn");
        navigate("/login");
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button onClick={logout}>Logout</button>

            <h2>Cab Drivers</h2>
            <table>
                <thead><tr><th>Name</th><th>Mobile</th><th>Cab Type</th><th>License</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                    {drivers.map(d => (
                        <tr key={d._id}>
                            <td>{d.name}</td><td>{d.mobile}</td><td>{d.cabType}</td><td>{d.license}</td>
                            <td>{d.approved ? "Approved" : "Pending"}</td>
                            <td>{!d.approved && <button onClick={() => approve("drivers", d._id, setDrivers, drivers)}>Approve</button>}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Hotels</h2>
            <table>
                <thead><tr><th>Name</th><th>City</th><th>Price</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                    {hotels.map(h => (
                        <tr key={h._id}>
                            <td>{h.name}</td><td>{h.city}</td><td>{h.price}</td>
                            <td>{h.approved ? "Approved" : "Pending"}</td>
                            <td>{!h.approved && <button onClick={() => approve("hotels", h._id, setHotels, hotels)}>Approve</button>}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Guides</h2>
            <table>
                <thead><tr><th>Name</th><th>Mobile</th><th>Language</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                    {guides.map(g => (
                        <tr key={g._id}>
                            <td>{g.name}</td><td>{g.mobile}</td><td>{g.language}</td>
                            <td>{g.approved ? "Approved" : "Pending"}</td>
                            <td>{!g.approved && <button onClick={() => approve("guides", g._id, setGuides, guides)}>Approve</button>}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Bookings</h2>
            <table>
                <thead><tr><th>User</th><th>Package</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                    {bookings.map(b => (
                        <tr key={b._id}>
                            <td>{b.userName}</td><td>{b.packageName}</td><td>{b.date}</td>
                            <td>{b.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
