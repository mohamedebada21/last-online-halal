import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
        onLogin();
        } else {
                alert("Incorrect password!");
                }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Admin Access</h2>
            <p className="text-center text-gray-500 mb-8">Please enter your password to continue.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
                <button type="submit" className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Login
                </button>
            </form>
        </div>
    );
};
export default AdminLogin;