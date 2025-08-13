import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import './App.css'
import PackageBook from './pages/Package.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Gallery from './pages/Gallery.jsx';
import Howtoreach from './pages/Howtoreach.jsx';
import AdminDashboard from './pages/AdminDashboard';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ClipLoader } from 'react-spinners';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import RegisterDriver from './pages/RegisterDriver.jsx';
import RegisterHotel from './pages/RegisterHotel.jsx';
import RegisterGuide from './pages/RegisterGuide.jsx';
import AdminLogin from './pages/AdminLogin.jsx';




function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("adminToken");
  return isLoggedIn ? children : <Navigate to="/login" />;
}

const App = () => {



  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/UtkalDarshan" element={<Home />} />
          <Route path="/Package" element={<PackageBook />} />
          <Route path="/About" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Gallery" element={<Gallery />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Howtoreach" element={<Howtoreach />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

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
            path="/admin_dashboard"
            element={

              <AdminDashboard />

            }
          />

          {/* Catch-All */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
