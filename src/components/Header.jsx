import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import img from '../assets/image.png';
import logo from "../assets/image.png";

const Header = () => {
    const navigate = useNavigate();
    const isAdmin = !!localStorage.getItem("adminToken");

    function openNav() {
        document.getElementById("mySidenav").style.width = "100%";
        document.getElementById("main").style.marginLeft = "250px";
    }

    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    }

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    return (
        <div>
            {/* Marquee banner */}
            <div className="container-fluid con">
                <marquee>UTKALDARSHAN - A DIGITAL GATEWAY TO ODISHA'S HERITAGE.     <a href="https://warehouse.appilix.com/uploads/app-apk-689af01273dfb-1754984466.apk" style={{ textDecoration: "none" }}>Download our app and get 25% off on your first booking</a></marquee>
            </div>

            {/* Main Navbar */}
            <section className="nav-bar" id='header'>
                <div className="logo">
                    <img
                        src={logo}
                        style={{ height: '70px', width: '150px', position: 'relative', bottom: '12px' }}
                        alt='logo'
                    />
                </div>
                <ul className="menu1">
                    <li><Link className='underline active' to="/UtkalDarshan">home</Link></li>
                    <li><Link className='underline' to="/About">about</Link></li>
                    <li><Link className='underline' to="/Package">Package</Link></li>
                    <li><Link className='underline' to="/Gallery">gallery</Link></li>
                    <li><Link className='underline' to="/Contact">Contact us</Link></li>
                    <li><Link className='underline' to="/Howtoreach">How to reach</Link></li>

                    {!isAdmin ? (
                        <li><Link className='underline' to="/login">Login/Register</Link></li>
                    ) : (
                        <>
                            <li><Link className='underline' to="/admin/dashboard">Admin Dashboard</Link></li>
                            <li>
                                <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </section>

            {/* Side Navigation Menu */}
            <div id="header1">
                <div id="mySidenav" className="sidenav">
                    <Link className="closebtn" onClick={closeNav}>×</Link>
                    <ul>
                        <li><Link to="/UtkalDarshan" onClick={closeNav}>home</Link></li>
                        <li><Link to="/About" onClick={closeNav}>about</Link></li>
                        <li><Link to="/Package" onClick={closeNav}>Package</Link></li>
                        <li><Link to="/Gallery" onClick={closeNav}>gallery</Link></li>
                        <li><Link to="/Contact" onClick={closeNav}>Contact us</Link></li>
                        <li><Link to="/Howtoreach" onClick={closeNav}>How to reach</Link></li>

                        {!isAdmin ? (
                            <li><Link to="/Login" onClick={closeNav}>Login/Register</Link></li>
                        ) : (
                            <>
                                <li><Link to="/admin/dashboard" onClick={closeNav}>Admin Dashboard</Link></li>
                                <li>
                                    <button className="btn btn-outline-danger m-2" onClick={() => { handleLogout(); closeNav(); }}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Hamburger icon */}
                <div id="main">
                    <span
                        style={{ fontSize: 30, cursor: "pointer", float: 'right' }}
                        onClick={openNav}
                    >
                        <img
                            src={img}
                            style={{ height: '60px', width: '150px', position: 'relative', right: '178px' }}
                            alt="menu"
                        />
                        ☰
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Header;
