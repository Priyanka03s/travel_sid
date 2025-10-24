import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheck, FiX, FiRefreshCw, FiHome, FiClock, FiWifiOff } from 'react-icons/fi';
import api from '../services/api';

const PaymentResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isBackendDown, setIsBackendDown] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('order_id');
    
    if (orderId) {
      sessionStorage.setItem('currentOrderId', orderId);
      checkBackendHealth().then(isBackendUp => {
        if (isBackendUp) {
          fetchOrderStatus(orderId);
        } else {
          setIsBackendDown(true);
          setLoading(false);
          setError('Unable to connect to the server. The backend may be down.');
        }
      });
    } else {
      setError('Order ID not found in URL');
      setLoading(false);
    }
  }, [location]);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL.replace('/api', '')}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  };

  const fetchOrderStatus = async (orderId) => {
    try {
      setLoading(true);
      console.log('Fetching order status for:', orderId);
      
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setError('Request timed out. Please try again.');
      }, 10000);
      
      const response = await api.get(`/payments/order-status/${orderId}`);
      clearTimeout(timeoutId);
      
      console.log('Order status response:', response.data);
      
      const orderTransactions = response.data.transactions || [];
      setTransactions(orderTransactions);
      
      // Determine order status based on transactions
      let determinedStatus;
      if (orderTransactions.filter(t => t.payment_status === "SUCCESS").length > 0) {
        determinedStatus = "SUCCESS";
      } else if (orderTransactions.filter(t => t.payment_status === "PENDING").length > 0) {
        determinedStatus = "PENDING";
      } else {
        determinedStatus = "FAILURE";
      }
      
      setOrderStatus({
        ...response.data,
        status: determinedStatus
      });
      
      if (determinedStatus === 'SUCCESS') {
        sessionStorage.removeItem('currentOrderId');
        sessionStorage.removeItem('currentTripId');
        sessionStorage.removeItem('currentEventId');
        
        setTimeout(() => {
          navigate('/alltrips', { 
            state: { 
              paymentSuccess: true,
              message: 'Payment completed successfully!'
            } 
          });
        }, 3000);
      }
      
      setLoading(false);
      setIsBackendDown(false);
    } catch (err) {
      console.error('Error fetching order status:', err);
      
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error') || !err.response) {
        setIsBackendDown(true);
        setError('Unable to connect to the server. The backend may be down.');
      } else {
        setIsBackendDown(false);
        setError('Failed to fetch order status: ' + (err.response?.data?.message || err.message));
      }
      
      setLoading(false);
    }
  };

  const handleRetry = () => {
    const orderId = sessionStorage.getItem('currentOrderId');
    
    if (orderId) {
      setRetryCount(prev => prev + 1);
      fetchOrderStatus(orderId);
    }
  };

  const handleGoToAllTrips = () => {
    navigate('/alltrips');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md w-full p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Checking payment status...</p>
          <p className="text-sm text-gray-500">Please wait while we verify your payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
        {isBackendDown ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiWifiOff className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Server Connection Error</h2>
            <p className="text-gray-600 mb-6">
              {error || "Unable to connect to the server. Please check if the backend is running."}
            </p>
            
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-700 text-sm">
                <strong>Note:</strong> Your payment may have been processed successfully even if we can't verify it right now. 
                Please check your email for confirmation or try again later.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRetry}
                disabled={retryCount >= 3}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <FiRefreshCw className="mr-2" />
                {retryCount >= 3 ? 'Max retries reached' : 'Try Again'}
              </button>
              <button
                onClick={handleGoToAllTrips}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Go to All Trips
              </button>
              <button
                onClick={handleGoToDashboard}
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiX className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRetry}
                disabled={retryCount >= 3}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <FiRefreshCw className="mr-2" />
                {retryCount >= 3 ? 'Max retries reached' : 'Retry'}
              </button>
              <button
                onClick={handleGoToAllTrips}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Go to All Trips
              </button>
              <button
                onClick={handleGoToDashboard}
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : orderStatus ? (
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              orderStatus.status === 'SUCCESS' ? 'bg-green-100' : 
              orderStatus.status === 'PENDING' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              {orderStatus.status === 'SUCCESS' ? (
                <FiCheck className="text-green-500 text-2xl" />
              ) : orderStatus.status === 'PENDING' ? (
                <FiClock className="text-yellow-500 text-2xl" />
              ) : (
                <FiX className="text-red-500 text-2xl" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {orderStatus.status === 'SUCCESS' ? 'Payment Successful!' : 
               orderStatus.status === 'PENDING' ? 'Payment Pending' : 'Payment Failed'}
            </h2>
            
            {orderStatus.status === 'SUCCESS' && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 animate-pulse">
                <p className="text-green-700 font-medium">
                  🎉 Congratulations! Your payment has been successfully processed.
                </p>
                <p className="text-green-600 text-sm mt-2">
                  You will be redirected to your trips page shortly...
                </p>
              </div>
            )}

            {orderStatus.status === 'PENDING' && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-700 font-medium">
                  Your payment is currently being processed.
                </p>
                <p className="text-yellow-600 text-sm mt-2">
                  Please wait while we verify your payment status.
                </p>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Order ID:</span> {orderStatus.orderId}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Amount:</span> ₹{orderStatus.amount}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Status:</span> {orderStatus.status}
              </p>
            </div>

            {transactions.length > 0 && (
              <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Transaction Details</h3>
                <div className="space-y-2 text-sm">
                  {transactions.map((transaction, index) => (
                    <div key={index} className="border-b border-gray-200 pb-2 last:border-0">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-medium">{transaction.cf_payment_id || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${
                          transaction.payment_status === 'SUCCESS' ? 'text-green-600' :
                          transaction.payment_status === 'PENDING' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {transaction.payment_status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">₹{transaction.payment_amount || orderStatus.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formatDate(transaction.payment_time)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-3">
              {orderStatus.status === 'PENDING' && (
                <button
                  onClick={handleRetry}
                  disabled={retryCount >= 3}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <FiRefreshCw className="mr-2" />
                  {retryCount >= 3 ? 'Max retries reached' : 'Check Status Again'}
                </button>
              )}
              {orderStatus.status === 'FAILURE' && (
                <button
                  onClick={handleRetry}
                  disabled={retryCount >= 3}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <FiRefreshCw className="mr-2" />
                  {retryCount >= 3 ? 'Max retries reached' : 'Retry Payment'}
                </button>
              )}
              <button
                onClick={handleGoToAllTrips}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                {orderStatus.status === 'SUCCESS' ? 'View All Trips' : 'Back to Trips'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiX className="text-yellow-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Unknown Status</h2>
            <p className="text-gray-600 mb-6">Unable to determine payment status</p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRetry}
                disabled={retryCount >= 3}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <FiRefreshCw className="mr-2" />
                {retryCount >= 3 ? 'Max retries reached' : 'Check Status Again'}
              </button>
              <button
                onClick={handleGoToAllTrips}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Go to All Trips
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentResponse;