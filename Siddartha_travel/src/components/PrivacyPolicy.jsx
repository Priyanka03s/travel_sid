// PrivacyPolicy.js
import React from "react";
import { Link } from "react-router-dom";
import { 
  FaShieldAlt, 
  FaUsers, 
  FaCreditCard, 
  FaServer, 
  FaCookie,
  FaLock,
  FaClock,
  FaExclamationTriangle,
  FaGlobe,
  FaFileAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaUserShield,
  FaDatabase,
  FaRegChartBar,
  FaRegEye,
  FaUserLock,
  FaGavel,
  FaChild,
  FaPlane,
  FaSyncAlt
} from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 ">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-red-900 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 md:py-12 sm:px-6 lg:px-8 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <div className="flex flex-col sm:flex-row items-center mb-4">
                <div className="bg-white p-2 sm:p-3 rounded-full mr-0 sm:mr-4 mb-3 sm:mb-0">
                  <FaShieldAlt className="h-6 w-6 sm:h-8 sm:w-8 text-red-700" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Privacy Policy</h1>
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
                Wandergoo ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal data when you use our website, mobile app, or services.
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
                <a href="#information-collect" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">1. Information We Collect</a>
                <a href="#how-use" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">2. How We Use Your Information</a>
                <a href="#sharing" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">3. Sharing of Information</a>
                <a href="#storage" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">4. Data Storage & Security</a>
                <a href="#cookies" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">5. Cookies & Tracking</a>
                <a href="#rights" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">6. Your Rights</a>
                <a href="#retention" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">7. Data Retention</a>
                <a href="#children" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">8. Children's Privacy</a>
                <a href="#international" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">9. International Users</a>
                <a href="#updates" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">10. Updates to This Policy</a>
                <a href="#contact" className="block py-2 px-3 text-sm sm:text-base text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">11. Contact Us</a>
              </nav>
            </div>
          </div>

          {/* Content Sections */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Section 1 */}
            <section id="information-collect" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaUsers className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">1. Information We Collect</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-gray-700 mb-6 text-base sm:text-lg">
                  We may collect the following information when you use our platform:
                </p>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaUserShield className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Personal Information</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Name, email address, phone number, date of birth, gender.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Government ID</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Passport, Aadhar, Pan, Driving License.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaPlane className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Booking Information</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Trip details, payment information, preferences, special requirements.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaServer className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Host/School Information</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Organization details, licenses, certifications, payment details.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaLock className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Payment Data</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Processed securely by third-party Payment Gateways (PG); Wandergoo does not store full card details.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaRegChartBar className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Usage Data</h3>
                      <p className="text-gray-600 text-sm sm:text-base">IP address, browser type, device details, cookies, and analytics data.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="how-use" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaFileAlt className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">2. How We Use Your Information</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-gray-700 mb-6 text-base sm:text-lg">
                  We use your data for the following purposes:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">To process bookings, payments, and refunds.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">To communicate booking confirmations, updates, and reminders.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">To allow hosts/schools to manage trips, events, and packages.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">To improve platform experience, features, and security.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">To comply with legal, tax, and regulatory requirements.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">To send promotional offers, newsletters, or updates (only if you opt-in).</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="sharing" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaUsers className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">3. Sharing of Information</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-gray-700 mb-6 text-base sm:text-lg">
                  We do not sell your data. However, we may share your information with:
                </p>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaUsers className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Hosts & Schools</h3>
                      <p className="text-gray-600 text-sm sm:text-base">To confirm bookings and provide necessary details.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Payment Gateways & Banks</h3>
                      <p className="text-gray-600 text-sm sm:text-base">To process secure payments.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaServer className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Service Providers</h3>
                      <p className="text-gray-600 text-sm sm:text-base">For analytics, support, or marketing tools.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaGavel className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Legal Authorities</h3>
                      <p className="text-gray-600 text-sm sm:text-base">If required by law or to prevent fraud.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="storage" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaServer className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">4. Data Storage & Security</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaDatabase className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Your personal data is stored securely on our servers with encryption.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaLock className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Payment transactions are handled via PCI-DSS compliant third-party providers.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaUserLock className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">We limit access to personal data to authorized employees and partners only.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaExclamationTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">While we take strong security measures, no online system is 100% secure.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="cookies" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaCookie className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">5. Cookies & Tracking</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaCookie className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">We use cookies and similar technologies to improve user experience.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaRegEye className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Cookies may track browsing preferences, device type, and activity.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaUserLock className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">You can disable cookies in your browser, but some features may not work properly.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="rights" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaLock className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">6. Your Rights</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-gray-700 mb-6 text-base sm:text-lg">
                  You have the right to:
                </p>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaRegEye className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Access and update your personal data.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaDatabase className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Request deletion of your data (subject to booking/financial record obligations). Note: The history data will be retained to have a track on the users bookings and activities within the platform.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaEnvelope className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Opt-out of marketing communications at any time.</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaUserLock className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Withdraw consent for data processing where applicable.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="retention" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaClock className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">7. Data Retention</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaClock className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Booking and payment records are kept for 7 years (as per tax/compliance requirements).</p>
                  </div>
                  <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                    <FaDatabase className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 text-sm sm:text-base">Other personal data is retained only as long as necessary to provide services.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="children" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaChild className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">8. Children's Privacy</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                  <FaExclamationTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-700 text-sm sm:text-base">Wandergoo is not directed at children under 18. If we become aware of data collected from a minor, we will delete it immediately.</p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section id="international" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaGlobe className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">9. International Users</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                  <FaGlobe className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-700 text-sm sm:text-base">If you access Wandergoo outside India, your data may be transferred and stored in servers located in India or other countries.</p>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section id="updates" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaSyncAlt className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">10. Updates to This Policy</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-start p-3 sm:p-4 bg-red-50 rounded-lg">
                  <FaFileAlt className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-700 text-sm sm:text-base">We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated "Effective Date."</p>
                </div>
              </div>
            </section>

            {/* Section 11 */}
            <section id="contact" className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6">
                <div className="flex items-center text-white">
                  <FaEnvelope className="h-6 w-6 sm:h-8 sm:w-8 mr-3" />
                  <h2 className="text-xl sm:text-2xl font-bold">11. Contact Us</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-gray-700 mb-6 text-base sm:text-lg">
                  For questions or concerns about this Privacy Policy, contact us at:
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

export default PrivacyPolicy;