import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { load } from '@cashfreepayments/cashfree-js';
import config from '../config';

const PaymentComponent = ({ tripId, eventId, amount, accommodationType, onSuccess, onFailure }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cashfree, setCashfree] = useState(null);

  // Initialize Cashfree SDK when component mounts
  useEffect(() => {
    const initializeCashfree = async () => {
      try {
        const cashfreeInstance = await load({
          mode: config.CASHFREE_ENV === "production" ? "production" : "sandbox"
        });
        setCashfree(cashfreeInstance);
      } catch (err) {
        console.error("Failed to initialize Cashfree:", err);
        setError("Payment service unavailable. Please try again later.");
      }
    };

    initializeCashfree();
  }, []);

  const handlePayment = async () => {
    if (!currentUser) {
      setError('Please login to make a payment');
      return;
    }

    if (!cashfree) {
      setError('Payment service is initializing. Please wait a moment and try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create order on backend
      const response = await api.post('/payments/create-order', {
        tripId,
        eventId,
        amount,
        accommodationType
      });

      if (response.data && response.data.paymentSessionId) {
        const { orderId, paymentSessionId, return_url } = response.data;

        // Store order ID and trip/event ID in session storage for retrieval on payment response page
        sessionStorage.setItem('currentOrderId', orderId);
        sessionStorage.setItem('currentTripId', tripId);
        sessionStorage.setItem('currentEventId', eventId);

        // Open checkout using the initialized SDK
        cashfree.checkout({
          paymentSessionId: paymentSessionId,
          redirectTarget: "_self",
          return_url: return_url // Use the return_url from the server response
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to initiate payment';
      setError(errorMessage);
      setLoading(false);
      if (onFailure) onFailure(err);
    }
  };

  return (
    <div className="payment-component">
      <button
        onClick={handlePayment}
        disabled={loading || !cashfree}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          loading || !cashfree
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {loading ? 'Processing...' : !cashfree ? 'Loading payment...' : `Pay ₹${amount}`}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default PaymentComponent;