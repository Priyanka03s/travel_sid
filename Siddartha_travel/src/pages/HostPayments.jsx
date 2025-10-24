import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiDollarSign, FiCalendar, FiCheck, FiX, FiClock, FiEye, FiRefreshCw, FiFilter, FiDownload, FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiInfo } from 'react-icons/fi';
import api from '../services/api';

const HostPayments = () => {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loadingCustomerDetails, setLoadingCustomerDetails] = useState(false);

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

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data || []);
      console.log("Fetched bookings:", response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookings([]);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/payments/host');
      setPayments(response.data.payments || []);
      console.log("Fetched payments:", response.data.payments);
      await fetchBookings();
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payment history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch complete user details
  const fetchCompleteUserDetails = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (err) {
      console.error("Error fetching user details:", err);
      return null;
    }
  };

  const fetchCustomerDetails = async (payment) => {
    setLoadingCustomerDetails(true);
    try {
      // Try to get the user ID from the payment
      let userId = null;

      if (payment.userId && payment.userId._id) {
        userId = payment.userId._id;
      } else if (payment.user && payment.user._id) {
        userId = payment.user._id;
      } else if (payment.booking && payment.booking.user && payment.booking.user._id) {
        userId = payment.booking.user._id;
      } else {
        // Try to find a matching booking to get the user ID
        if (payment.orderId && bookings.length > 0) {
          let matchingBooking = bookings.find(booking => 
            booking.payment && booking.payment.orderId === payment.orderId
          );
          if (!matchingBooking) {
            matchingBooking = bookings.find(booking => 
              booking.orderId === payment.orderId
            );
          }
          if (!matchingBooking && payment.bookingId) {
            matchingBooking = bookings.find(booking => 
              booking._id === payment.bookingId
            );
          }
          if (matchingBooking && matchingBooking.user && matchingBooking.user._id) {
            userId = matchingBooking.user._id;
          }
        }
      }

      if (userId) {
        const completeUser = await fetchCompleteUserDetails(userId);
        if (completeUser) {
          setCustomerDetails({
            name: `${completeUser.firstName || ''} ${completeUser.lastName || ''}`.trim() || completeUser.email || 'Unknown Customer',
            email: completeUser.email || 'N/A',
            phone: completeUser.phone || 'N/A',
            profession: completeUser.profession || 'N/A',
            location: completeUser.location || 'N/A',
            gender: completeUser.gender || 'N/A',
            dob: completeUser.dob ? formatDate(completeUser.dob) : 'N/A',
            age: completeUser.age || 'N/A',
            bloodGroup: completeUser.bloodGroup || 'N/A',
            emergencyContact: completeUser.emergencyContact || 'N/A',
            skills: completeUser.skills || 'N/A',
            currentCompany: completeUser.currentCompany || 'N/A',
            aadhar: completeUser.aadhar || 'N/A',
            drivingLicense: completeUser.drivingLicense || 'N/A',
            passportId: completeUser.passportId || 'N/A',
            language: completeUser.language || 'N/A'
          });
          return;
        }
      }

      // If we don't have a user ID or couldn't fetch complete details, use basic info
      const basicInfo = getCustomerInfo(payment);
      setCustomerDetails({
        name: basicInfo.name,
        email: basicInfo.email,
        phone: 'N/A',
        profession: 'N/A',
        location: 'N/A',
        gender: 'N/A',
        dob: 'N/A',
        age: 'N/A',
        bloodGroup: 'N/A',
        emergencyContact: 'N/A',
        skills: 'N/A',
        currentCompany: 'N/A',
        aadhar: 'N/A',
        drivingLicense: 'N/A',
        passportId: 'N/A',
        language: 'N/A'
      });
    } catch (err) {
      console.error('Error fetching customer details:', err);
      // Set the basic info we have
      const basicInfo = getCustomerInfo(payment);
      setCustomerDetails({
        name: basicInfo.name,
        email: basicInfo.email,
        phone: 'N/A',
        profession: 'N/A',
        location: 'N/A',
        gender: 'N/A',
        dob: 'N/A',
        age: 'N/A',
        bloodGroup: 'N/A',
        emergencyContact: 'N/A',
        skills: 'N/A',
        currentCompany: 'N/A',
        aadhar: 'N/A',
        drivingLicense: 'N/A',
        passportId: 'N/A',
        language: 'N/A'
      });
    } finally {
      setLoadingCustomerDetails(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredPayments(payments);
    } else {
      setFilteredPayments(payments.filter(payment => payment.status === filter));
    }
  }, [payments, filter]);

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    fetchCustomerDetails(payment);
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

  // Helper function to get customer information from a payment
  const getCustomerInfo = (payment) => {
    console.log("Getting customer info for payment:", payment);
    
    // 1. Check if payment has userId object (this is the main fix)
    if (payment.userId && (payment.userId.firstName || payment.userId.lastName || payment.userId.email)) {
      const name = `${payment.userId.firstName || ''} ${payment.userId.lastName || ''}`.trim();
      console.log("Found userId in payment:", name);
      return {
        name: name || payment.userId.email || 'Unknown Customer',
        email: payment.userId.email || 'N/A'
      };
    }
    
    // 2. Check if payment has user object
    if (payment.user && (payment.user.firstName || payment.user.lastName || payment.user.email)) {
      const name = `${payment.user.firstName || ''} ${payment.user.lastName || ''}`.trim();
      console.log("Found user in payment:", name);
      return {
        name: name || payment.user.email || 'Unknown Customer',
        email: payment.user.email || 'N/A'
      };
    }
    
    // 3. Check for direct payer/customer fields
    if (payment.payerName) {
      console.log("Found payerName:", payment.payerName);
      return {
        name: payment.payerName,
        email: payment.payerEmail || 'N/A'
      };
    }
    
    if (payment.customerName) {
      console.log("Found customerName:", payment.customerName);
      return {
        name: payment.customerName,
        email: payment.customerEmail || 'N/A'
      };
    }
    
    // 4. Check in transactions array if it exists
    if (payment.transactions && payment.transactions.length > 0) {
      const transaction = payment.transactions[0];
      if (transaction.customerName || transaction.payerName) {
        const name = transaction.customerName || transaction.payerName || 'Unknown Customer';
        console.log("Found name in transaction:", name);
        return {
          name: name,
          email: transaction.customerEmail || transaction.payerEmail || 'N/A'
        };
      }
    }
    
    // 5. Check if payment has booking object with user info
    if (payment.booking && payment.booking.user) {
      const name = `${payment.booking.user.firstName || ''} ${payment.booking.user.lastName || ''}`.trim();
      console.log("Found user in booking:", name);
      return {
        name: name || payment.booking.user.email || 'Unknown Customer',
        email: payment.booking.user.email || 'N/A'
      };
    }
    
    // 6. Check if we can find matching booking in bookings by orderId
    if (payment.orderId && bookings.length > 0) {
      console.log("Looking for booking with orderId:", payment.orderId);
      
      // First try to match by booking.payment.orderId
      let matchingBooking = bookings.find(booking => 
        booking.payment && booking.payment.orderId === payment.orderId
      );
      
      // If not found, try matching by booking.orderId (if it exists at the top level)
      if (!matchingBooking) {
        matchingBooking = bookings.find(booking => 
          booking.orderId === payment.orderId
        );
      }
      
      // If still not found, try matching by booking._id if payment has bookingId
      if (!matchingBooking && payment.bookingId) {
        matchingBooking = bookings.find(booking => 
          booking._id === payment.bookingId
        );
      }
      
      if (matchingBooking) {
        console.log("Found matching booking:", matchingBooking);
        if (matchingBooking.user) {
          const name = `${matchingBooking.user.firstName || ''} ${matchingBooking.user.lastName || ''}`.trim();
          return {
            name: name || matchingBooking.user.email || 'Unknown Customer',
            email: matchingBooking.user.email || 'N/A'
          };
        }
      }
    }
    
    // 7. Try matching by tripId and amount (if orderId matching fails)
    if (payment.tripId && payment.amount && bookings.length > 0) {
      console.log("Looking for booking with tripId and amount");
      const matchingBooking = bookings.find(booking => 
        booking.trip?._id === payment.tripId && 
        booking.totalPrice === payment.amount
      );
      if (matchingBooking && matchingBooking.user) {
        const name = `${matchingBooking.user.firstName || ''} ${matchingBooking.user.lastName || ''}`.trim();
        console.log("Found booking by tripId and amount:", name);
        return {
          name: name || matchingBooking.user.email || 'Unknown Customer',
          email: matchingBooking.user.email || 'N/A'
        };
      }
    }
    
    // 8. Last resort - use part of the order ID as identifier
    if (payment.orderId) {
      // Extract a portion of the order ID to use as identifier
      const orderIdParts = payment.orderId.split('_');
      if (orderIdParts.length > 1) {
        const name = `Customer #${orderIdParts[1].substring(0, 6)}`;
        console.log("Using orderId as name:", name);
        return {
          name: name,
          email: 'N/A'
        };
      }
      const name = `Customer #${payment.orderId.substring(0, 8)}`;
      console.log("Using orderId as name:", name);
      return {
        name: name,
        email: 'N/A'
      };
    }
    
    console.log("No customer info found");
    return {
      name: 'Unknown Customer',
      email: 'N/A'
    };
  };

  const totalRevenue = payments
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  const monthlyRevenue = payments
    .filter(p => {
      const paymentDate = new Date(p.createdAt);
      const currentDate = new Date();
      return p.status === 'SUCCESS' && 
             paymentDate.getMonth() === currentDate.getMonth() && 
             paymentDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer', 'Email', 'Trip/Event', 'Date', 'Amount', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(payment => {
        const customerInfo = getCustomerInfo(payment);
        return [
          payment.orderId,
          customerInfo.name,
          customerInfo.email,
          payment.tripId?.tripTitle || payment.eventId?.eventTitle || 'N/A',
          formatDate(payment.createdAt),
          payment.amount,
          payment.status
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600 mt-1">
              View and manage all your payments and transactions
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg transition-colors"
            >
              <FiDownload className="h-5 w-5" />
              Export
            </button>
            <button
              onClick={fetchPayments}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Revenue Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <FiDollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <FiCalendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(monthlyRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                <FiCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Completed Payments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {payments.filter(p => p.status === 'SUCCESS').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'SUCCESS', 'PENDING', 'FAILURE'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    filter === status
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : getStatusText(status)}
                </button>
              ))}
            </div>
            <div className="ml-auto text-sm text-gray-500">
              Showing {filteredPayments.length} of {payments.length} payments
            </div>
          </div>
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
        ) : filteredPayments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <FiDollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? "You haven't received any payments yet." 
                : `No payments with status "${getStatusText(filter)}" found.`}
            </p>
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
                  {filteredPayments.map((payment) => {
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
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-4 text-blue-700 flex items-center">
                    <FiDollarSign className="h-5 w-5 mr-2" />
                    Payment Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="font-medium w-32">Order ID:</span>
                      <span>{selectedPayment.orderId}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Amount:</span>
                      <span className="font-semibold">{formatCurrency(selectedPayment.amount)}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}>
                        {getStatusText(selectedPayment.status)}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Payment Date:</span>
                      <span>{formatDate(selectedPayment.createdAt)}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Payment Method:</span>
                      <span>Online Payment</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Trip/Event:</span>
                      <span>{selectedPayment.tripId?.tripTitle || selectedPayment.eventId?.eventTitle || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Customer Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-4 text-blue-700 flex items-center">
                    <FiUser className="h-5 w-5 mr-2" />
                    Customer Information
                  </h4>
                  {loadingCustomerDetails ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                    </div>
                  ) : customerDetails ? (
                    <div className="space-y-3">
                      <div className="flex">
                        <span className="font-medium w-32">Name:</span>
                        <span>{customerDetails.name}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Email:</span>
                        <span>{customerDetails.email}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Phone:</span>
                        <span>{customerDetails.phone}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Profession:</span>
                        <span>{customerDetails.profession}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Location:</span>
                        <span>{customerDetails.location}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Gender:</span>
                        <span>{customerDetails.gender}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Date of Birth:</span>
                        <span>{customerDetails.dob}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Age:</span>
                        <span>{customerDetails.age}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Blood Group:</span>
                        <span>{customerDetails.bloodGroup}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Emergency Contact:</span>
                        <span>{customerDetails.emergencyContact}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Skills:</span>
                        <span>{customerDetails.skills}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Current Company:</span>
                        <span>{customerDetails.currentCompany}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Aadhar:</span>
                        <span>{customerDetails.aadhar}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Driving License:</span>
                        <span>{customerDetails.drivingLicense}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Passport ID:</span>
                        <span>{customerDetails.passportId}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Language:</span>
                        <span>{customerDetails.language}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Customer information not available</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Transaction Details */}
              {selectedPayment.transactions && selectedPayment.transactions.length > 0 && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-4 text-blue-700 flex items-center">
                    <FiInfo className="h-5 w-5 mr-2" />
                    Transaction Details
                  </h4>
                  <div className="space-y-4">
                    {selectedPayment.transactions.map((transaction, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                            <p className="text-sm text-gray-900">{transaction.cf_payment_id || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <p className={`text-sm ${getStatusColor(transaction.payment_status)} inline-flex items-center px-2 py-1 rounded-full`}>
                              {getStatusIcon(transaction.payment_status)}
                              <span className="ml-1">{getStatusText(transaction.payment_status)}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Amount</p>
                            <p className="text-sm text-gray-900">{formatCurrency(transaction.payment_amount || selectedPayment.amount)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Date</p>
                            <p className="text-sm text-gray-900">{formatDate(transaction.payment_time)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostPayments;