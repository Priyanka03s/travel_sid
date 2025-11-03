// src/pages/Login.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff, FiLogOut } from 'react-icons/fi';
import { useAuth } from "../context/AuthContext";
import bgImage from "../assets/travel.jpg";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const auth = useAuth();
  const { currentUser, login, logout } = auth;
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Save user data to localStorage for Nav component
        const user = result.data.user;
        localStorage.setItem("userName", `${user.firstName} ${user.lastName}`);
        localStorage.setItem("userRole", user.role);
        
        // Redirect based on role
        if (user.role === 'host') {
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Login error details:", err);
      setError("❌ Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="relative z-10 bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-2xl p-8 w-full max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="text-indigo-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">
              Welcome, {currentUser.firstName} {currentUser.lastName}
            </h2>
            <p className="text-gray-700 mb-6">
              You are logged in as {currentUser.role}
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 shadow-md flex items-center justify-center"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
            <div className="mt-4 text-center">
              <Link to="/dashboard" className="text-blue-600 hover:underline font-medium">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    ); 
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-4xl font-bold mb-6 text-center text-black">
          Login
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block mb-1 font-medium text-black">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-500" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-white/40 bg-white/10 text-black p-3 pl-10 rounded mb-4"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-1 font-medium text-black">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-500" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-white/40 bg-white/10 text-black p-3 pl-10 rounded"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FiEyeOff className="text-gray-500" />
              ) : (
                <FiEye className="text-gray-500" />
              )}
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 shadow-md disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register here
            </Link>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            New host? Your account will need admin approval before you can login.
          </p>
        </div>
      </form>
    </div>
  );
} 