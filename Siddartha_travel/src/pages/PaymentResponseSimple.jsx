// src/pages/PaymentResponseSimple.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheck, FiX, FiHome, FiWifiOff } from 'react-icons/fi';

const PaymentResponseSimple = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Try to get order_id from URL parameters
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('order_id');
    if (id) {
      setOrderId(id);
    }
  }, [location]);

  const handleGoToAllTrips = () => {
    navigate('/alltrips');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiWifiOff className="text-yellow-500 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Status Unknown</h2>
          <p className="text-gray-600 mb-6">
            We're unable to verify your payment status at the moment. This could be due to server maintenance or connectivity issues.
          </p>
          
          {orderId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-600">
                <span className="font-medium">Order ID:</span> {orderId}
              </p>
            </div>
          )}
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-700 text-sm">
              <strong>Note:</strong> Your payment may have been processed successfully. 
              Please check your email for confirmation or try again later.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoToAllTrips}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              View All Trips
            </button>
            <button
              onClick={handleGoToDashboard}
              className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResponseSimple;