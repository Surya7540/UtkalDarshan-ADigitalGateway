import React from 'react'
import img from '../assets/image.png'
import { Link } from 'react-router-dom'
import logo from "../assets/image.png"
const Header = () => {



    function openNav() {
        document.getElementById("mySidenav").style.width = "100%";
        document.getElementById("main").style.marginLeft = "250px";
    }

    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    }

    return (
        <div>
            <>
                <div className="container-fluid con">
                    <marquee>UTKALDARSHAN - A DIGITAL GATEWAY TO ODISHA'S HERITAGE</marquee>
                </div>

            </>
            <>
                <section className="nav-bar" id='header'>
                    <div className="logo">
                        <img className="" src={logo} style={{ height: '70px', width: '150px', position: 'relative', bottom: '12px' }} alt='about' />
                    </div>
                    <ul className="menu1">
                        <li><Link className='underline active' to="/UtkalDarshan">home</Link></li>
                        <li><Link className='underline' to="/About">about</Link></li>
                        <li><Link className='underline' to="/Package">Package</Link></li>
                        <li><Link className='underline' to="/Gallery">gallery</Link></li>
                        <li><Link className='underline' to="/Contact">Contact us</Link></li>
                        <li><Link className='underline ' to="/Login">Login/Register</Link></li>
                        {<li><Link className='underline ' to="/Howtoreach">How to reach</Link></li>}

                    </ul>
                </section>
                <div id="header1">
                    <div id="mySidenav" className="sidenav" >
                        <Link
                            // to="javascript:void(0)"
                            className="closebtn"
                            onClick={closeNav}
                        >
                            ×
                        </Link>
                        <ul className="">
                            <li><Link to="/tourism-management-system" onClick={closeNav}>home</Link></li>
                            <li><Link to="/about-us" onClick={closeNav}>about</Link></li>
                            <li><Link to="/Package" onClick={closeNav}>Package</Link></li>
                            <li><Link to="/Gallery" onClick={closeNav}>gallery</Link></li>
                            <li><Link to="/Contact" onClick={closeNav}>Contact us</Link></li>
                        </ul>
                    </div>
                    <div id="main">

                        <span style={{ fontSize: 30, cursor: "pointer", float: 'right' }} onClick={openNav}>
                            <img
                                src={img}
                                style={{ height: '60px', width: '150px', position: 'relative', right: '178px' }}
                                alt="Bootstrap"
                            />
                            ☰
                        </span>
                    </div>
                </div>

            </>
        </div>
    )
}

export default Header