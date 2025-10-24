// TermsAndConditions.js
import React from "react";
import { Link } from "react-router-dom";
import { 
  FaFileContract, 
  FaUsers, 
  FaUserShield, 
  FaHiking, 
  FaSchool,
  FaCreditCard,
  FaTimesCircle,
  FaHandshake,
  FaExclamationTriangle,
  FaBalanceScale,
  FaGavel,
  FaLock,
  FaLandmark,
  FaEdit,
  FaShieldAlt,
  FaClock,
  FaFileAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaUserLock,
  FaDatabase,
  FaRegChartBar,
  FaRegEye,
  FaGlobe,
  FaSyncAlt
} from 'react-icons/fa';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-red-900 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 md:py-12 sm:px-6 lg:px-8 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <div className="flex flex-col sm:flex-row items-center mb-4">
                <div className="bg-white p-2 sm:p-3 rounded-full mr-0 sm:mr-4 mb-3 sm:mb-0">
                  <FaFileContract className="h-6 w-6 sm:h-8 sm:w-8 text-red-700" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Terms & Conditions</h1>
                  <p className="text-red-100 mt-1">Wandergoo</p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start text-red-100">
                <FaClock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <p className="text-sm sm:text-base">Effective Date: 03-10-2025</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 max-w-md w-full">
              <p className="text-white text-sm sm:text-base">
                Welcome to Wandergoo, a platform that connects travelers with hosts, adventure schools, academies, and event organizers. By using our services, you agree to these Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaFileAlt className="mr-2 text-red-600" />
                Table of Contents
              </h2>
              <nav className="space-y-1 sm:space-y-2">
                <a href="#definitions" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">1. Definitions</a>
                <a href="#platform-use" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">2. Platform Use & Services</a>
                <a href="#host-responsibilities" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">3. Host Responsibilities</a>
                <a href="#traveler-responsibilities" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">4. Traveler Responsibilities</a>
                <a href="#adventure-schools" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">5. Adventure Schools & Academies</a>
                <a href="#payments-fees" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">6. Payments & Fees</a>
                <a href="#cancellations-refunds" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">7. Cancellations & Refunds</a>
                <a href="#disputes" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">8. Disputes</a>
                <a href="#risk-liability" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">9. Risk & Liability</a>
                <a href="#intellectual-property" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">10. Intellectual Property</a>
                <a href="#privacy-data" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">11. Privacy & Data Handling</a>
                <a href="#governing-law" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">12. Governing Law</a>
                <a href="#modifications" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">13. Modifications</a>
                <a href="#contact" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">14. Contact Us</a>
              </nav>
            </div>
          </div>

          {/* Content Sections */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Section 1 */}
            <section id="definitions" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaFileContract className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">1. Definitions</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaFileAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Platform</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Wandergoo's website/application.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaUsers className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Host</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Individual/travel organizer who lists and manages trips/events.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaHiking className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Traveler</h3>
                      <p className="text-gray-600 text-sm sm:text-base">A user who books trips, events, or packages.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaSchool className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Adventure School/Academy</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Registered institutes or trainers hosting events/packages.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Service Fee/Platform Fee</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Non-refundable Facilitation Fee charged by Wandergoo.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaRegChartBar className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">PG (Payment Gateway) Charges</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Fees charged by third-party payment providers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="platform-use" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaUsers className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">2. Platform Use & Services</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaUserShield className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Users must be at least 18 years of age.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">You agree to provide accurate and complete information.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaExclamationTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Wandergoo is not a travel agent/agency, hotel, or adventure operator; it acts as a facilitator between hosts, travelers, and schools/academics.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaFileAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Services</h3>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 text-sm sm:text-base">
                        <li>Provide platform access, booking system, and secure payments.</li>
                        <li>May assist with dispute resolution and refunds.</li>
                        <li>In cases of inappropriate behavior or suspicious activity, Wandergoo may remove or suspend the respective user profile.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="host-responsibilities" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaUserShield className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">3. Host Responsibilities</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Hosts must provide accurate trip details, itinerary, inclusions, and exclusions.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaShieldAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Hosts are responsible for safety, necessary permits, and legal compliance.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaClock className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Hosts must manage cancellations or changes promptly.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="traveler-responsibilities" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaHiking className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">4. Traveler Responsibilities</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaRegEye className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Travelers must review trip details before booking.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaMapMarkerAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Travelers are responsible for arranging their own travel to/from the pick-up point unless otherwise mentioned.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaUserLock className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Travelers must comply with host/school rules during trips or events.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaFileAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Carry valid ID, permits, and insurance where required.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaShieldAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Be fit for the activities you book (trekking, rafting, climbing, etc.).</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="adventure-schools" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaSchool className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">5. Adventure Schools & Academies</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaShieldAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Schools are responsible for safety standards, equipment, and certified instructors.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaExclamationTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Wandergoo does not provide insurance and is not liable for accidents, injuries, or damages during activities.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaFileAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Schools must clearly list cancellation/refund policies.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="payments-fees" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaCreditCard className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">6. Payments & Fees</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaLock className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">All payments must be made through the Wandergoo platform. Wandergoo is not responsible for any transactions conducted outside the platform.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Travelers pay through Wandergoo's payment system.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaRegChartBar className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Wandergoo charges a non-refundable Facilitation Fee (commission).</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaDatabase className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">PG charges are deducted by third-party providers and are non-refundable.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaClock className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Settlement of funds to hosts/schools occurs within the proposed timeline or 7–14 days post event completion (after deducting platform fee & PG charges).</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="cancellations-refunds" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaTimesCircle className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">7. Cancellations & Refunds</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaFileAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Cancellation policies are provided by service providers during every trip/event creation.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaExclamationTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Platform Fee is non-refundable under all circumstances except in cases where the cancellation is due to platform error.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Trip/Event Amount</h3>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 text-sm sm:text-base">
                        <li>If traveler cancels before host's cutoff date → Refund eligible based on the policy given (minus platform fee & PG charges).</li>
                        <li>If a traveler cancels after a cutoff date or no-show → No refund.</li>
                        <li>If host cancels trip → Either trip will be rescheduled or Full refund (trip cost - minus platform fee & PG charges).</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaClock className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Refunds shall process between 7 - 14 business days to the original payment method used during booking.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaSyncAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Slot Transfer</h3>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 text-sm sm:text-base">
                        <li>Travelers may transfer booking to another person before cutoff date (subject to host approval).</li>
                        <li>This slot transfer will be applicable only to trips/events mentioned by the host.</li>
                        <li>In the event of a last-minute cancellation or slot transfer, a full refund will only be processed if another participant takes your place. This applies only when all slots for the trip or event are completely filled.</li>
                        <li>If funds have already been utilized under your name for registration, and your slot is later replaced but cannot be used by the new participant, refunds will be processed only if they are eligible; otherwise, no refund will be provided.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaExclamationTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Exceptional Circumstances</h3>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 text-sm sm:text-base">
                        <li>In case of force majeure events (e.g., natural disasters, government restrictions etc), refunds will be handled on a case-by-case basis, at the discretion of Wandergoo and the organizer.</li>
                        <li>Refunds will be processed only if they are eligible; otherwise, no refund will be provided.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="disputes" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaHandshake className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">8. Disputes</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaUsers className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">In case of disagreements regarding refunds, Travellers, Hosts, and Schools must first attempt to resolve the issue directly.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaGavel className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">If unresolved, Wandergoo may step in for dispute resolution.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaBalanceScale className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Wandergoo's decision will be final.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section id="risk-liability" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaExclamationTriangle className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">9. Risk & Liability</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaExclamationTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Adventure travel, sports, and events involve risks (injury, illness, accidents).</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaUserShield className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">By booking, travelers acknowledge these risks and agree that Wandergoo is not liable.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaShieldAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Wandergoo does not provide insurance. Travelers are encouraged to arrange their own coverage.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaGavel className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Hosts are liable for disputes with Travellers unless due to Wandergoo's technical error.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section id="intellectual-property" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaBalanceScale className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">10. Intellectual Property</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaFileAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">All content, design, and logos of Wandergoo are owned by Wandergoo.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaLock className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Users may not use Wandergoo branding without permission.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 11 */}
            <section id="privacy-data" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaLock className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">11. Privacy & Data Handling</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaUserShield className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Wandergoo collects and processes personal data as per our Privacy Policy.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Payment details are processed securely via third-party providers.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 12 */}
            <section id="governing-law" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaGavel className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">12. Governing Law</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaLandmark className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">These Terms shall be governed by the laws of India.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaGavel className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Disputes shall be subject to the jurisdiction of [Tirupur] Courts.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 13 */}
            <section id="modifications" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaEdit className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">13. Modifications</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                  <FaSyncAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-700 text-sm sm:text-base">Wandergoo reserves the right to update these Terms at any time. Users will be notified of significant changes.</p>
                </div>
              </div>
            </section>

            {/* Section 14 */}
            <section id="contact" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaEnvelope className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">14. Contact Us</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-gray-700 mb-6 text-base sm:text-lg">
                  For questions or concerns about these Terms & Conditions, contact us at:
                </p>
                <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 sm:p-6 rounded-lg border border-red-200">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-gray-700 mb-4">
                    <div className="bg-white p-2 sm:p-3 rounded-full mr-0 sm:mr-4 mb-3 sm:mb-0">
                      <FaEnvelope className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                    </div>
                    <p className="text-base sm:text-lg font-medium">support@wandergoo.com</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start text-gray-700">
                    <div className="bg-white p-2 sm:p-3 rounded-full mr-0 sm:mr-4 mb-3 sm:mb-0">
                      <FaMapMarkerAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-base sm:text-lg font-medium mb-2">Wandergoo Headquarters</p>
                      <p className="text-sm sm:text-base">1, Kongu Nagar Extension 2nd street</p>
                      <p className="text-sm sm:text-base">Tirupur - 641607</p>
                      <p className="text-sm sm:text-base">Tamil Nadu</p>
                      <p className="text-sm sm:text-base">India</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;