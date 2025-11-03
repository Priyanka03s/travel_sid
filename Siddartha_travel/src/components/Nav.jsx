// Nav.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiUser, FiLogOut, FiMenu, FiX, FiPlus, FiMap, FiInfo, FiDollarSign, FiCreditCard, FiBell } from "react-icons/fi";
import logo from '../assets/logo.png'; // Update path to your logo

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadNotifications, ] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const name = localStorage.getItem("userName");
      const role = localStorage.getItem("userRole");
      const token = localStorage.getItem("token");
      
      if (name && role && token) {
        setUserName(name);
        setUserRole(role);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Window resize handler
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile menu when resizing to desktop
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    localStorage.removeItem("userApproved");
    
    setUserName("");
    setUserRole("");
    setIsAuthenticated(false);
    
    navigate("/");
    setIsMenuOpen(false);
  };

  // Dynamic classes based on scroll state
  const navClasses = `sticky top-0 z-50 transition-all duration-300 ${
    isScrolled 
      ? 'bg-red-600 text-white shadow-lg' 
      : 'bg-white text-black shadow-md'
  }`;

  const linkClasses = (path) => `px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-300 ${
    isActive(path) 
      ? (isScrolled ? 'bg-red-700 text-white' : 'bg-gray-200 text-black')
      : (isScrolled ? 'hover:bg-red-500 text-white' : 'hover:bg-gray-100 text-black')
  }`;

  const buttonClasses = `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:shadow-md flex items-center ${
    isScrolled 
      ? 'bg-white text-red-600 hover:bg-gray-100' 
      : 'bg-red-600 text-white hover:bg-red-700'
  }`;

  const secondaryButtonClasses = `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:shadow-md ${
    isScrolled 
      ? 'bg-transparent border border-white text-white hover:bg-white hover:text-red-600' 
      : 'bg-transparent border border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
  }`;

  // Determine logo size based on screen width
  const logoSizeClass = windowWidth < 640 ? 'h-12' : windowWidth < 768 ? 'h-16' : 'h-20';

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Trip Booking Logo" className={`${logoSizeClass} w-auto transition-all duration-300`} />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* About Page Link */}
            <Link to="/about" className={linkClasses("/about")}>
              <FiInfo className="mr-1" />
              <span className="hidden xl:inline">About</span>
            </Link>
            <Link to="/alltrips" className={linkClasses("/trips")}>
              <span className="hidden xl:inline">All Trips</span>
              <span className="xl:hidden">Trips</span>
            </Link>
            
            {isAuthenticated && (
              <>
                {/* Dashboard Link - Only for hosts */}
                {userRole === 'host' && (
                  <Link to="/dashboard" className={linkClasses("/dashboard")}>
                    <FiHome className="mr-1" />
                    <span className="hidden xl:inline">Dashboard</span>
                  </Link>
                )}
                
                {/* Payment Links for both users and hosts */}
                {userRole === 'user' && (
                  <Link to="/user/payments" className={linkClasses("/user/payments")}>
                    <FiCreditCard className="mr-1" />
                    <span className="hidden xl:inline">My Payments</span>
                  </Link>
                )}

                {userRole === 'host' && (
                  <>
                    <Link to="/host/payments" className={linkClasses("/host/payments")}>
                      <FiDollarSign className="mr-1" />
                      <span className="hidden xl:inline">Payment Management</span>
                    </Link>
                    <Link to="/create-trip" className={linkClasses("/create-trip")}>
                      <FiPlus className="mr-1" />
                      <span className="hidden xl:inline">Create Trip</span>
                    </Link>
                    <Link to="/event-form" className={linkClasses("/event-form")}>
                      <FiPlus className="mr-1" />
                      <span className="hidden xl:inline">Event</span>
                    </Link>
                    <Link to="adventure-form" className={linkClasses("/adventure-form")}>
                      <FiPlus className="mr-1" />
                      <span className="hidden xl:inline">Adventure</span>
                    </Link>
                  </>
                )}
              </>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 xl:space-x-4">
                {/* Notification Bell */}
                <div className="relative">
                  <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                    <FiBell className="h-5 w-5 xl:h-6 xl:w-6" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                  </button>
                </div>
                
                <div className={`flex items-center px-2 xl:px-3 py-2 rounded-md ${
                  isScrolled ? 'bg-red-700' : 'bg-gray-200'
                }`}>
                  <FiUser className="mr-1 xl:mr-2" />
                  <span className="text-xs xl:text-sm font-medium truncate max-w-20 xl:max-w-none">{userName}</span>
                  <span className={`ml-1 xl:ml-2 text-xs px-1 xl:px-2 py-1 rounded-full ${
                    isScrolled ? 'bg-red-500' : 'bg-gray-300'
                  }`}>
                    {userRole}
                  </span>
                </div>
                <button onClick={handleLogout} className={`${buttonClasses} px-2 xl:px-4`}>
                  <FiLogOut className="mr-1" />
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className={`${secondaryButtonClasses} px-2 xl:px-4`}>
                  <FiUser className="mr-1" />
                  <span className="hidden xl:inline">Login</span>
                </Link>
                <Link to="/register" className={`${buttonClasses} px-2 xl:px-4`}>
                  <span className="hidden xl:inline">Register</span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden items-center space-x-2">
            <Link to="/about" className={linkClasses("/about")}>
              <FiInfo className="h-5 w-5" />
            </Link>
            <Link to="/trips" className={linkClasses("/trips")}>
              <FiMap className="h-5 w-5" />
            </Link>
            
            {isAuthenticated && (
              <>
                {userRole === 'host' && (
                  <Link to="/dashboard" className={linkClasses("/dashboard")}>
                    <FiHome className="h-5 w-5" />
                  </Link>
                )}
                
                {userRole === 'user' && (
                  <Link to="/user/payments" className={linkClasses("/user/payments")}>
                    <FiCreditCard className="h-5 w-5" />
                  </Link>
                )}

                {userRole === 'host' && (
                  <>
                    <Link to="/host/payments" className={linkClasses("/host/payments")}>
                      <FiDollarSign className="h-5 w-5" />
                    </Link>
                    <Link to="/create-trip" className={linkClasses("/create-trip")}>
                      <FiPlus className="h-5 w-5" />
                    </Link>
                  </>
                )}
                
                <div className="relative">
                  <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                    <FiBell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                  </button>
                </div>
                
                <button onClick={handleLogout} className={buttonClasses}>
                  <FiLogOut className="h-5 w-5" />
                </button>
              </>
            )}
            
            {/* {!isAuthenticated && (
              <>
                <Link to="/login" className={secondaryButtonClasses}>
                  <FiUser className="h-5 w-5" />
                </Link>
                <Link to="/register" className={buttonClasses}>
                  <FiPlus className="h-5 w-5" />
                </Link>
              </>
            )} */}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      } ${isScrolled ? 'bg-red-700' : 'bg-gray-100'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* About Page Link for Mobile */}
          <Link
            to="/about"
            className={`px-3 py-2 rounded-md text-base font-medium flex items-center ${
              isActive("/about") 
                ? (isScrolled ? 'bg-red-800 text-white' : 'bg-gray-300 text-black')
                : (isScrolled ? 'text-white hover:bg-red-600' : 'text-black hover:bg-gray-200')
            }`}
            onClick={toggleMenu}
          >
            <FiInfo className="mr-2" />
            About
          </Link>
          
          <Link
            to="/trips"
            className={`px-3 py-2 rounded-md text-base font-medium flex items-center ${
              isActive("/trips") 
                ? (isScrolled ? 'bg-red-800 text-white' : 'bg-gray-300 text-black')
                : (isScrolled ? 'text-white hover:bg-red-600' : 'text-black hover:bg-gray-200')
            }`}
            onClick={toggleMenu}
          >
            <FiMap className="mr-2" />
            All Trips
          </Link>
          
          {isAuthenticated && (
            <>
              {/* Dashboard Link for Mobile - Only for hosts */}
              {userRole === 'host' && (
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium items-center ${
                    isActive("/dashboard") 
                      ? (isScrolled ? 'bg-red-800 text-white' : 'bg-gray-300 text-black')
                      : (isScrolled ? 'text-white hover:bg-red-600' : 'text-black hover:bg-gray-200')
                  }`}
                  onClick={toggleMenu}
                >
                  <FiHome className="mr-2" />
                  Dashboard
                </Link>
              )}
              
              {/* Payment Links for Mobile */}
              <Link
                to="/user/payments"
                className={`block px-3 py-2 rounded-md text-base font-medium items-center ${
                  isActive("/user/payments") 
                    ? (isScrolled ? 'bg-red-800 text-white' : 'bg-gray-300 text-black')
                    : (isScrolled ? 'text-white hover:bg-red-600' : 'text-black hover:bg-gray-200')
                }`}
                onClick={toggleMenu}
              >
                <FiCreditCard className="mr-2" />
                My Payments
              </Link>
              
              {userRole === 'host' && (
                <>
                  <Link
                    to="/host/payments"
                    className={`block px-3 py-2 rounded-md text-base font-medium items-center ${
                      isActive("/host/payments") 
                        ? (isScrolled ? 'bg-red-800 text-white' : 'bg-gray-300 text-black')
                        : (isScrolled ? 'text-white hover:bg-red-600' : 'text-black hover:bg-gray-200')
                    }`}
                    onClick={toggleMenu}
                  >
                    <FiDollarSign className="mr-2" />
                    Payment Management
                  </Link>
                  <Link
                    to="/create-trip"
                    className={`block px-3 py-2 rounded-md text-base font-medium items-center ${
                      isActive("/create-trip") 
                        ? (isScrolled ? 'bg-red-800 text-white' : 'bg-gray-300 text-black')
                        : (isScrolled ? 'text-white hover:bg-red-600' : 'text-black hover:bg-gray-200')
                    }`}
                    onClick={toggleMenu}
                  >
                    <FiPlus className="mr-2" />
                    Create Trip
                  </Link>
                  <Link
                    to="/event-form"
                    className={`block px-3 py-2 rounded-md text-base font-medium items-center ${
                      isActive("/event-form") 
                        ? (isScrolled ? 'bg-red-800 text-white' : 'bg-gray-300 text-black')
                        : (isScrolled ? 'text-white hover:bg-red-600' : 'text-black hover:bg-gray-200')
                    }`}
                    onClick={toggleMenu}
                  >
                    <FiPlus className="mr-2" />
                    Event
                  </Link>
                  <Link
                    to="/adventure-form"
                    className={`block px-3 py-2 rounded-md text-base font-medium items-center ${
                      isActive("/adventure-form") 
                        ? (isScrolled ? 'bg-red-800 text-white' : 'bg-gray-300 text-black')
                        : (isScrolled ? 'text-white hover:bg-red-600' : 'text-black hover:bg-gray-200')
                    }`}
                    onClick={toggleMenu}
                  >
                    <FiPlus className="mr-2" />
                    Adventure
                  </Link>
                </>
              )}
            </>
          )}
          
          {isAuthenticated ? (
            <>
              <div className={`px-3 py-2 mt-4 mb-2 border-t ${
                isScrolled ? 'border-red-600' : 'border-gray-300'
              }`}>
                <div className="flex items-center">
                  <FiUser className="mr-2" />
                  <span className="font-medium truncate">{userName}</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    isScrolled ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'
                  }`}>
                    {userRole}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  isScrolled 
                    ? 'bg-white text-red-600 hover:bg-gray-100' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </>
          ) : (
            <div className="mt-4 space-y-2">
              <Link
                to="/login"
                className={`block px-3 py-2 rounded-md text-base font-medium items-center ${
                  isScrolled 
                    ? 'text-white hover:bg-red-600' 
                    : 'text-black hover:bg-gray-200'
                }`}
                onClick={toggleMenu}
              >
                <FiUser className="mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                className={`w-full px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  isScrolled 
                    ? 'bg-white text-red-600 hover:bg-gray-100' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
                onClick={toggleMenu}
              >
                <FiPlus className="mr-2" />
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;