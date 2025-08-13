import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import odishamap from "../assets/image/map2-min.jpg";
import Swal from "sweetalert2";
import { PulseLoader } from "react-spinners";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    const navigate = useNavigate();
    const [loaderStatus, setLoaderStatus] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoaderStatus(false);
        }, 2000);
    }, []);

    // LOGIN FUNCTION
    const handleLogin = () => {
        const savedUser = JSON.parse(localStorage.getItem("userData"));

        if (savedUser && username === savedUser.username && password === savedUser.password) {
            sessionStorage.setItem("isLoggedIn", "true");
            navigate("/Roombook");
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Logged in successfully",
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter valid username and password!",
            });
        }
    };

    // REGISTER FUNCTION
    const handleRegister = () => {
        if (!username || !password || !confirmPassword) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please fill all the fields",
            });
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Password Mismatch",
                text: "Passwords do not match",
            });
            return;
        }

        // Save to localStorage (simulate database)
        const userData = { username, password };
        localStorage.setItem("userData", JSON.stringify(userData));

        Swal.fire({
            icon: "success",
            title: "Registered Successfully",
            text: "You can now log in",
        });

        // Clear fields and switch to login mode
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setIsRegisterMode(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegisterMode) {
            handleRegister();
        } else {
            handleLogin();
        }
    };

    return (
        <div>
            {loaderStatus ? (
                <div className="loader-container">
                    <PulseLoader loading={loaderStatus} size={50} color="#fde02f" />
                </div>
            ) : (
                <>
                    <div className="container-fluid loginbackground ">
                        <div className="row loginstyle">
                            <div className="col-md-6 ">
                                <img src={odishamap} className="login-image" alt="Login" />
                            </div>

                            <div className="col-md-6 ">
                                <h1>Utkal Darshan</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-labell">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            className="form-controll"
                                            id="username"
                                            placeholder="Enter username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-labell">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-controll"
                                            id="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    {isRegisterMode && (
                                        <div className="mb-3">
                                            <label htmlFor="confirmPassword" className="form-labell">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                className="form-controll"
                                                id="confirmPassword"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <button type="submit" className="btn btn-primary btnstyle">
                                        {isRegisterMode ? "Register" : "Login"}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary ms-2 btnstyle"
                                        onClick={() => setIsRegisterMode(!isRegisterMode)}
                                    >
                                        {isRegisterMode ? "Back to Login" : "Create New Account"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Login;
