import React, { useState } from "react";
import travelLogo from "../assets/travel-logo.png";
import bgImage from "../assets/travellogo1.png";

function TravelRegistrationForm() {
  const [loginMethod, setLoginMethod] = useState("email");
  const [language, setLanguage] = useState("");

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-200 via-blue-100 to-white p-6 bg-fixed"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-lg">
        {/* Logo Section */}
        <div className="flex flex-col items-center">
          <img src={travelLogo} alt="Travel Logo" className="w-32 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">
            Travel Registration Form
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Please fill out the form below to register for the upcoming travel
            event.
          </p>
        </div>

        {/* Register Form */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
            Register
          </h2>

          {/* Login Method Switch */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              type="button"
              onClick={() => setLoginMethod("email")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                loginMethod === "email"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Email Address
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("userid")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                loginMethod === "userid"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              User ID
            </button>
          </div>

          <form className="space-y-6">
            {/* Conditional Login Field */}
            {loginMethod === "email" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  placeholder="Enter your user ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternative Phone (optional)
              </label>
              <input
                type="tel"
                placeholder="Enter alternative phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                required
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* ID Proofs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driving Licence
                </label>
                <input
                  type="file"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <input
                  type="text"
                  placeholder="Licence Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhaar
                </label>
                <input
                  type="file"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <input
                  type="text"
                  placeholder="Aadhaar Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mt-2"
                />
              </div>
            </div>

            {/* Professional Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional / Activities
              </label>
              <input
                type="text"
                placeholder="Enter your profession or activities"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                placeholder="Enter your skills"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Languages
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="">Select a language</option>
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
                <option>Malayalam</option>
                <option>Kannada</option>
              </select>
            </div>

            {/* Passwords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TravelRegistrationForm;
