// src/pages/UserPayments.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiDollarSign, FiCalendar, FiCheck, FiX, FiClock, FiEye, FiRefreshCw, FiUser, FiMail } from 'react-icons/fi';
import api from '../services/api';

const UserPayments = () => {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount || 0).replace('₹', '₹ ');
    } catch (err) {
      console.error("Error formatting currency:", err);
      return "₹ 0";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid date";
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/payments/user');
      setPayments(response.data || []);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payment history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <FiCheck className="text-green-500" />;
      case 'FAILURE':
        return <FiX className="text-red-500" />;
      case 'PENDING':
        return <FiClock className="text-yellow-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'Completed';
      case 'FAILURE':
        return 'Failed';
      case 'PENDING':
        return 'Pending';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'FAILURE':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerInfo = (payment) => {
    // Try to get customer info from payment object
    if (payment.user) {
      return {
        name: `${payment.user.firstName || ''} ${payment.user.lastName || ''}`.trim() || 
              payment.user.email || 
              'Unknown Customer',
        email: payment.user.email || 'N/A'
      };
    }
    
    // If not available, use current user's info
    if (currentUser) {
      return {
        name: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 
               currentUser.email || 
               'Unknown Customer',
        email: currentUser.email || 'N/A'
      };
    }
    
    // Fallback to other possible fields
    return {
      name: payment.customerName || 
            payment.payerName || 
            payment.payerEmail || 
            'Unknown Customer',
      email: payment.payerEmail || 
             payment.customerEmail || 
             'N/A'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
            <p className="text-gray-600 mt-1">
              View all your payments and transactions
            </p>
          </div>
          <button
            onClick={fetchPayments}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiX className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <FiDollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't made any payments yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trip/Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => {
                    const customerInfo = getCustomerInfo(payment);
                    return (
                      <tr key={payment._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customerInfo.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customerInfo.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.tripId?.tripTitle || payment.eventId?.eventTitle || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(payment.status)}
                              {getStatusText(payment.status)}
                            </div>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(payment)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FiEye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                  <p className="mt-1 text-sm text-gray-500">Order ID: {selectedPayment.orderId}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer</p>
                    <div className="flex items-center mt-1">
                      <FiUser className="text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">{getCustomerInfo(selectedPayment).name}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <div className="flex items-center mt-1">
                      <FiMail className="text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">{getCustomerInfo(selectedPayment).email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Date</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedPayment.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedPayment.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className={`text-sm ${getStatusColor(selectedPayment.status)} inline-flex items-center px-2 py-1 rounded-full`}>
                      {getStatusIcon(selectedPayment.status)}
                      <span className="ml-1">{getStatusText(selectedPayment.status)}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                    <p className="text-sm text-gray-900">Online Payment</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Trip/Event</p>
                  <p className="text-sm text-gray-900">
                    {selectedPayment.tripId?.tripTitle || selectedPayment.eventId?.eventTitle || 'N/A'}
                  </p>
                </div>
                
                {selectedPayment.transactions && selectedPayment.transactions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Transactions</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {selectedPayment.transactions.map((transaction, index) => (
                        <div key={index} className="mb-3 last:mb-0 pb-3 last:pb-0 border-b border-gray-200 last:border-0">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Transaction ID</span>
                            <span className="text-sm">{transaction.cf_payment_id || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm font-medium">Status</span>
                            <span className={`text-sm ${getStatusColor(transaction.payment_status)} inline-flex items-center px-2 py-1 rounded-full`}>
                              {getStatusIcon(transaction.payment_status)}
                              <span className="ml-1">{getStatusText(transaction.payment_status)}</span>
                            </span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm font-medium">Amount</span>
                            <span className="text-sm">{formatCurrency(transaction.payment_amount || selectedPayment.amount)}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm font-medium">Date</span>
                            <span className="text-sm">{formatDate(transaction.payment_time)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPayments;