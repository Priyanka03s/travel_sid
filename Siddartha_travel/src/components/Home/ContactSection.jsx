// components/ContactSection.jsx
import React from 'react';

const ContactSection = () => {
  return (
    <div className="relative bg-white">
      <div className="section relative flex items-center justify-center p-6 md:p-12 w-full min-h-screen mx-auto">
        <div className="max-w-4xl text-center text-black w-full">
          <div className="inline-block px-4 py-2 text-red-600 border border-red-600 rounded-full text-sm font-medium mb-8">
            GET IN TOUCH
          </div>
          <h2 className="text-3xl md:text-4xl font-light mb-6">Start Your Journey</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-12">
            Tell us about your dream destination and we'll create a personalized travel experience.
          </p>
          
          <div className="bg-white rounded-xl p-6 md:p-8 max-w-2xl mx-auto border border-gray-100 shadow-sm">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-left text-gray-700 mb-3 font-medium">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900 placeholder-gray-500 border border-gray-200 transition-colors" 
                    placeholder="Your name" 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-left text-gray-700 mb-3 font-medium">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900 placeholder-gray-500 border border-gray-200 transition-colors" 
                    placeholder="Your email" 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="destination" className="block text-left text-gray-700 mb-3 font-medium">Dream Destination</label>
                <input 
                  type="text" 
                  id="destination" 
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900 placeholder-gray-500 border border-gray-200 transition-colors" 
                  placeholder="Where would you like to go?" 
                />
              </div>
              
              <div>
                <label htmlFor="travelers" className="block text-left text-gray-700 mb-3 font-medium">Number of Travelers</label>
                <select 
                  id="travelers" 
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900 border border-gray-200 appearance-none"
                >
                  <option>1 Traveler</option>
                  <option>2 Travelers</option>
                  <option>3-4 Travelers</option>
                  <option>5+ Travelers</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-left text-gray-700 mb-3 font-medium">Special Requests</label>
                <textarea 
                  id="message" 
                  rows="4" 
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900 placeholder-gray-500 border border-gray-200 transition-colors resize-none" 
                  placeholder="Tell us about your travel preferences..."
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Request Travel Plan
              </button>
            </form>
          </div>
        </div>
      </div>
      
   
    </div>
  );
};

export default ContactSection;