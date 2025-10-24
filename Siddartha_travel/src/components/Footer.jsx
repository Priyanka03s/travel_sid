// Footer.js
import React from "react";
import { Link } from "react-router-dom";

// Instagram Icon
const InstagramIcon = () => (
  <svg
    className="w-5 h-5 sm:w-6 sm:h-6"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.75-9.25a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"
      clipRule="evenodd"
    />
  </svg>
);

function Footer() {
  return (
    <footer className="bg-[#2a2a2a] pt-8 pb-6 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto text-center text-gray-400">
        {/* Logo */}
        <div className="flex items-center justify-center my-6">
          <div className="hidden sm:block flex-grow border-t border-gray-600"></div>
          <div className="mx-2 sm:mx-4">
            <img
              src="https://placehold.co/200x40/2a2a2a/FFFFFF?text=wandergoo.com"
              alt="Wandergoo Logo"
              className="h-5 sm:h-6"
            />
          </div>
          <div className="hidden sm:block flex-grow border-t border-gray-600"></div>
        </div>

        {/* Social + Support */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 my-6">
          <a
            href="https://www.instagram.com/wandergoo_official?igsh=MTJtNnc5M2owbWty"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors duration-200"
          >
            <InstagramIcon />
          </a>

          <a
            href="mailto:support@wandergoo.com"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            support@wandergoo.com
          </a>
        </div>

        {/* Legal Links */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 my-6">
          <Link
            to="/privacy-policy"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-and-conditions"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            Terms & Conditions
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-xs sm:text-sm my-4">© 2025 Wandergoo.com All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;