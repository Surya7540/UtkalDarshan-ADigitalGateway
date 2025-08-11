// import React, { useState } from "react";
// import axios from "axios";

// export default function AdminLogin({ onSuccess }) {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");

//     async function handleSubmit(e) {
//         e.preventDefault();
//         try {
//             const res = await axios.post("/api/auth/login", { username, password });
//             localStorage.setItem("adminToken", res.data.token);
//             onSuccess();
//         } catch {
//             alert("Invalid credentials");
//         }
//     }

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Admin Login</h2>
//             <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Admin Username" required />
//             <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
//             <button type="submit">Login</button>
//         </form>
//     );
// }
import React, { useState } from 'react';
import axios from "axios";

const AdminLogin = ({ onSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await axios.post("/api/auth/login", { username, password });
            localStorage.setItem("adminToken", res.data.token);
            onSuccess();
        } catch {
            alert("Invalid credentials");
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Admin Login</h2>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Admin Username" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>


        </div>
    );
}

export default AdminLogin;
