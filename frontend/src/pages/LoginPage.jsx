// src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ParticleBackground from '../components/ParticleBackground';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      
      {/* 3D Background */}
      <ParticleBackground />

      {/* Content Container */}
      <div className="relative z-10 flex w-full max-w-4xl mx-auto overflow-hidden bg-gray-800/80 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700">
        {/* Left Side: Branding */}
        <div className="hidden md:flex md:w-1/2 bg-indigo-600/90 p-12 flex-col justify-center items-center text-white">
            <h1 className="text-4xl font-bold tracking-wide">ClubSphere</h1>
            <p className="mt-4 text-center text-indigo-100">Your central hub for college club management.</p>
        </div>

        {/* Right Side: Form */}
        <div className="w-full p-8 md:w-1/2">
          <h2 className="text-2xl font-semibold text-center text-white">Welcome Back!</h2>
          <p className="text-sm text-center text-gray-400 mt-1">Sign in to continue</p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email Address</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-white bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 text-white bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            {error && <p className="text-sm text-center text-red-400 bg-red-900/20 p-2 rounded">{error}</p>}
            <div>
              <button 
                type="submit" 
                className="w-full px-4 py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
              >
                Login
              </button>
            </div>
          </form>

          <p className="mt-8 text-sm text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;