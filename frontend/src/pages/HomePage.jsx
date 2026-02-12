// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';

const HomePage = () => {
  return (
    // 'relative' allows us to position content over the absolute background
    <div className="relative min-h-screen w-full overflow-hidden">
      
      {/* The 3D Background */}
      <ParticleBackground />

      {/* The Content Overlay */}
      {/* z-10 ensures this sits ON TOP of the particles */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        
        {/* Glassmorphism effect for better readability */}
        <div className="bg-gray-900/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-2xl max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient bg-300%">
            Welcome to ClubSphere
            </h1>
            
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
            Your one-stop solution for seamless college club management. 
            Propose events, get approvals, and manage resources all in one place.
            </p>
            
            <div className="mt-10">
            <Link
                to="/login"
                className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500"
            >
                Get Started
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div className="absolute -inset-3 rounded-full bg-indigo-400 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
            </Link>
            </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;