// components/AboutSection.jsx
import React from 'react';
import { FaSuitcaseRolling, FaRegCalendarAlt, FaMountain, FaArrowRight, FaEnvelope } from 'react-icons/fa';
import bg from "../../assets/bg1.jpg";

const AboutSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-red-50 to-white py-20 px-6 md:px-12 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-100 to-transparent rounded-full filter blur-3xl opacity-40 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-100 to-transparent rounded-full filter blur-3xl opacity-40 -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="inline-block px-5 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded-full text-sm font-semibold tracking-wider border border-red-200">
            ABOUT US
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mt-6 mb-6 leading-tight">
            What is <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Wandergoo</span>?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-72 h-72 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl opacity-20 blur-xl"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
              <img 
                src={bg}
                alt="Wandergoo Adventure"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
          
          <div className="space-y-8">
            <p className="text-xl text-gray-700 leading-relaxed">
              Wandergoo is a fresh and exciting tourism platform that connects travelers with unique Trips, Events, and Adventure Schools. Whether you want to explore, learn, or experience adrenaline-filled activities – Wandergoo brings everything together in one place.
            </p>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white mr-4">
                  <FaArrowRight className="text-lg" />
                </span>
                In short:
              </h3>
              <div className="space-y-5">
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <FaSuitcaseRolling className="text-red-600 text-xl" />
                  </div>
                  <div className="pt-1">
                    <span className="font-bold text-gray-800 text-lg">Trips</span>
                    <p className="text-gray-600 mt-1">Join and explore new destinations with like-minded travelers.</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <FaRegCalendarAlt className="text-red-600 text-xl" />
                  </div>
                  <div className="pt-1">
                    <span className="font-bold text-gray-800 text-lg">Events</span>
                    <p className="text-gray-600 mt-1">Experience unique moments and connect with fellow adventurers.</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <FaMountain className="text-red-600 text-xl" />
                  </div>
                  <div className="pt-1">
                    <span className="font-bold text-gray-800 text-lg">Adventure Schools</span>
                    <p className="text-gray-600 mt-1">Learn new skills and master your outdoor passions.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
                Learn More About Us <FaArrowRight className="ml-2" />
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-md border border-gray-200 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
                Contact Us <FaEnvelope className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
