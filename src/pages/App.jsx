import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import RegisterDriver from "./pages/RegisterDriver";
import RegisterHotel from "./pages/RegisterHotel";
import RegisterGuide from "./pages/RegisterGuide";
import AdminDashboard from "./AdminDashboard";


import ProtectedRoute from "./components/ProtectedRoute";
import { isAdminAuthenticated, logoutAdmin } from "./utils/auth";
import AdminLogin from "./AdminLogin.jsx";

function App() {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(isAdminAuthenticated());

    const handleAdminLogin = () => {
        setIsAdminLoggedIn(true);
    };

    const handleAdminLogout = () => {
        logoutAdmin();
        setIsAdminLoggedIn(false);
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/register-driver" element={<RegisterDriver />} />
                <Route path="/register-hotel" element={<RegisterHotel />} />
                <Route path="/register-guide" element={<RegisterGuide />} />
                <Route path="/adminlogin" element={<AdminLogin />} />

                {/* Admin Routes */}
                {/* <Route
                    path="/register-guide"
                    element={
                        isAdminLoggedIn ? (
                            <Navigate to="/admin/dashboard" />
                        ) : (
                            <AdminLogin onSuccess={handleAdminLogin} />
                        )
                    }
                /> */}


                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard onLogout={handleAdminLogout} />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-All */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
