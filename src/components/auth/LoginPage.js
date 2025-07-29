import React, { useState } from 'react';

const LoginPage = ({ onLogin, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const success = onLogin({ email, password });
        if (!success) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-center text-gray-500 mb-8">Sign in to continue.</p>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                />
                <button type="submit" className="w-full mt-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Login
                </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account?{' '}
                <button onClick={() => onNavigate('register')} className="font-semibold text-green-600 hover:underline">
                    Register here
                </button>
            </p>
        </div>
    );
};
export default LoginPage;