// src/pages/Dashboard.jsx

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FiCalendar, FiDollarSign, FiUsers, FiMapPin, FiPlus, FiEye, FiTag, FiCheck, FiAlertCircle,
  FiEdit, FiTrash2, FiMap, FiSend, FiClock, FiUserCheck, FiCreditCard, FiTrendingUp, FiChevronDown, FiChevronUp,
  FiUser, FiFileText, FiPhone, FiMail, FiGlobe, FiBriefcase, FiInfo, FiDownload,
  FiHome, FiSettings, FiLogOut, FiBarChart2, FiActivity, FiGrid, FiMenu, FiX
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalBookings: 0,
    upcomingTrips: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0,
    pendingApprovals: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripBookings, setTripBookings] = useState({});
  const [expandedTripId, setExpandedTripId] = useState(null);
  const [bookingError, setBookingError] = useState({});
  
  // New state for user bookings section
  const [userBookings, setUserBookings] = useState([]);
  const [selectedUserBooking, setSelectedUserBooking] = useState(null);
  const [showUserBookingModal, setShowUserBookingModal] = useState(false);
  const [userBookingsLoading, setUserBookingsLoading] = useState(true);
  const [userBookingsError, setUserBookingsError] = useState(null);
  
  // Payment details modal state
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);
  const [paymentDetailsLoading, setPaymentDetailsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [documentUrls, setDocumentUrls] = useState({
    aadharDoc: null,
    drivingLicenseDoc: null,
    passportDoc: null
  });

  // Sidebar navigation state
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const dataFetchedRef = useRef(false);

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
    if (!dateString) return "No date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid date";
    }
  };

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccess]);

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

  // Function to fetch document URLs
  const fetchDocumentUrls = async (userId) => {
    try {
      console.log("Fetching documents for user:", userId);
      
      // First try the API endpoint
      const response = await api.get(`/users/${userId}/documents`);
      console.log("Document response:", response.data);
      
      const docs = response.data;
      
      // Format the document URLs to include the full server path
      const formattedDocs = {
        aadharDoc: docs.aadharDoc ? `http://localhost:5000${docs.aadharDoc}` : null,
        drivingLicenseDoc: docs.drivingLicenseDoc ? `http://localhost:5000${docs.drivingLicenseDoc}` : null,
        passportDoc: docs.passportDoc ? `http://localhost:5000${docs.passportDoc}` : null
      };
      
      console.log("Formatted document URLs:", formattedDocs);
      return formattedDocs;
    } catch (err) {
      console.error("Error fetching document URLs:", err);
      
      // If the API endpoint doesn't exist, construct URLs based on user ID
      // This assumes documents are stored in a predictable pattern
      console.log("Constructing document URLs based on user ID");
      return {
        aadharDoc: `http://localhost:5000/uploads/aadhar/aadharDoc-${userId}.png`,
        drivingLicenseDoc: `http://localhost:5000/uploads/drivingLicense/drivingLicenseDoc-${userId}.png`,
        passportDoc: `http://localhost:5000/uploads/passport/passportDoc-${userId}.png`
      };
    }
  };

  const fetchPendingBookings = async () => {
    try {
      const response = await api.get("/bookings/pending");
      setPendingBookings(response.data || []);
      
      // Update stats with pending approvals count
      setStats(prev => ({
        ...prev,
        pendingApprovals: response.data?.length || 0
      }));
    } catch (err) {
      console.error("Error fetching pending bookings:", err);
    }
  };

  const fetchTripBookings = async (tripId) => {
    try {
      // First try the dedicated endpoint
      const response = await api.get(`/bookings/trip/${tripId}`);
      setTripBookings(prev => ({
        ...prev,
        [tripId]: response.data || []
      }));
      setBookingError(prev => ({
        ...prev,
        [tripId]: null
      }));
    } catch (err) {
      console.error("Error fetching trip bookings:", err);
      
      // If the endpoint doesn't exist (404 error), try to get bookings from pending bookings
      if (err.response && err.response.status === 404) {
        try {
          const pendingBookingsForTrip = pendingBookings.filter(
            booking => booking.trip && booking.trip._id === tripId
          );
          
          setTripBookings(prev => ({
            ...prev,
            [tripId]: pendingBookingsForTrip || []
          }));
          
          setBookingError(prev => ({
            ...prev,
            [tripId]: "Limited booking data available (only pending bookings)"
          }));
        } catch (filterErr) {
          console.error("Error filtering pending bookings:", filterErr);
          setTripBookings(prev => ({
            ...prev,
            [tripId]: []
          }));
          setBookingError(prev => ({
            ...prev,
            [tripId]: "Could not load booking data"
          }));
        }
      } else {
        // For other errors, just set empty bookings
        setTripBookings(prev => ({
          ...prev,
          [tripId]: []
        }));
        setBookingError(prev => ({
          ...prev,
          [tripId]: "Error loading booking data"
        }));
      }
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/host');
      const tripPayments = (response.data.payments || []).filter(payment => payment.tripId);
      setPayments(tripPayments);
      
      // Update revenue stats
      const totalRevenue = tripPayments
        .filter(p => p.status === 'SUCCESS')
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = tripPayments
        .filter(p => {
          const paymentDate = new Date(p.createdAt);
          return p.status === 'SUCCESS' && 
                 paymentDate.getMonth() === currentMonth && 
                 paymentDate.getFullYear() === currentYear;
        })
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);
      
      const pendingPayments = tripPayments.filter(p => p.status === 'PENDING').length;
      const completedPayments = tripPayments.filter(p => p.status === 'SUCCESS').length;
      
      setStats(prev => ({
        ...prev,
        totalRevenue,
        monthlyRevenue,
        pendingPayments,
        completedPayments
      }));
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  // New function to fetch user bookings
  const fetchUserBookings = async () => {
    try {
      setUserBookingsLoading(true);
      setUserBookingsError(null);
      
      // Try different endpoints since the original one is returning 404
      let response;
      try {
        // First try the dedicated endpoint
        response = await api.get('/bookings/my-bookings');
      } catch (err) {
        console.log("Primary endpoint failed, trying alternatives");
        // If that fails, try to get bookings from pending bookings
        try {
          response = { data: pendingBookings };
        } catch (filterErr) {
          console.error("Error filtering pending bookings:", filterErr);
          response = { data: [] };
        }
      }
      
      setUserBookings(response.data || []);
    } catch (err) {
      console.error('Error fetching user bookings:', err);
      setUserBookingsError('Failed to load user bookings. Please try again.');
      // Set empty array to prevent rendering errors
      setUserBookings([]);
    } finally {
      setUserBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (dataFetchedRef.current && !location.state) {
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch trips
        try {
          const tripsResponse = await api.get("/trips/user");
          const sortedTrips = (tripsResponse.data || []).sort((a, b) => 
            new Date(b.publishedDate || 0) - new Date(a.publishedDate || 0)
          );
          setTrips(sortedTrips);
        } catch (err) {
          console.error("Error fetching trips:", err);
          setTrips([]);
        }
        
        // Fetch pending bookings
        await fetchPendingBookings();
        
        // Fetch payments
        await fetchPayments();
        
        // Fetch user bookings
        await fetchUserBookings();
        
        // Check for success messages from location state
        if (location.state?.tripPublished) {
          setShowSuccess(true);
          setSuccessMessage(`Your trip "${location.state.tripTitle || 'Untitled'}" has been published successfully.`);
          window.history.replaceState({}, document.title);
        } else if (location.state?.tripUpdated) {
          setShowSuccess(true);
          setSuccessMessage(`Your trip "${location.state.tripTitle || 'Untitled'}" has been updated successfully.`);
          window.history.replaceState({}, document.title);
        } else if (location.state?.bookingProcessSet) {
          setShowSuccess(true);
          setSuccessMessage(`Booking process set to "${location.state.bookingProcess}" for your trip.`);
          window.history.replaceState({}, document.title);
        }
        
        dataFetchedRef.current = true;
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

  useEffect(() => {
    const now = new Date();
    const newStats = {
      totalTrips: trips.length,
      totalBookings: trips.reduce((sum, trip) => sum + (trip.bookings || 0), 0),
      upcomingTrips: trips.filter(trip => trip.tripStartDate && new Date(trip.tripStartDate) > now).length,
      totalRevenue: stats.totalRevenue,
      monthlyRevenue: stats.monthlyRevenue,
      pendingPayments: stats.pendingPayments,
      completedPayments: stats.completedPayments,
      pendingApprovals: pendingBookings.length
    };
    setStats(newStats);
  }, [trips, pendingBookings, stats.totalRevenue, stats.monthlyRevenue, stats.pendingPayments, stats.completedPayments]);

  // Handler functions
  const handleApproveBooking = async (bookingId) => {
    try {
      setActionLoading(true);
      await api.put(`/bookings/${bookingId}/approve`);
      
      // Refresh pending bookings
      await fetchPendingBookings();
      
      // Refresh trip bookings if modal is open
      if (showBookingModal && selectedTrip) {
        await fetchTripBookings(selectedTrip._id);
      }
      
      // Refresh expanded trip bookings
      if (expandedTripId) {
        await fetchTripBookings(expandedTripId);
      }
      
      // Refresh user bookings
      await fetchUserBookings();
      
      // Show success message
      setShowSuccess(true);
      setSuccessMessage('Booking approved successfully!');
    } catch (err) {
      console.error('Error approving booking:', err);
      setError('Failed to approve booking. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      setActionLoading(true);
      await api.put(`/bookings/${bookingId}/reject`);
      
      // Refresh pending bookings
      await fetchPendingBookings();
      
      // Refresh trip bookings if modal is open
      if (showBookingModal && selectedTrip) {
        await fetchTripBookings(selectedTrip._id);
      }
      
      // Refresh expanded trip bookings
      if (expandedTripId) {
        await fetchTripBookings(expandedTripId);
      }
      
      // Refresh user bookings
      await fetchUserBookings();
      
      // Show success message
      setShowSuccess(true);
      setSuccessMessage('Booking rejected successfully!');
    } catch (err) {
      console.error('Error rejecting booking:', err);
      setError('Failed to reject booking. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewTrip = (trip) => {
    navigate(`/trip/${trip._id}`);
  };

  const handleEditTrip = (tripId) => {
    navigate(`/edit-trip/${tripId}`);
  };

  const handlePublish = async (item) => {
    try {
      setActionLoading(true);
      await api.put(`/trips/${item._id}/publish`);
      
      // Refresh data
      await fetchData();
      
      // Show success message
      setShowSuccess(true);
      setSuccessMessage('Trip published successfully!');
    } catch (err) {
      console.error('Error publishing trip:', err);
      setError('Failed to publish trip. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      await api.delete(`/trips/${itemToDelete._id}`);
      
      // Refresh data
      await fetchData();
      
      // Close modal and show success
      setShowDeleteModal(false);
      setShowSuccess(true);
      setSuccessMessage('Trip deleted successfully!');
    } catch (err) {
      console.error('Error deleting trip:', err);
      setError('Failed to delete trip. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleManageBookings = async (trip) => {
    setSelectedTrip(trip);
    await fetchTripBookings(trip._id);
    setShowBookingModal(true);
  };

  const toggleBookings = async (tripId) => {
    if (expandedTripId === tripId) {
      setExpandedTripId(null);
    } else {
      setExpandedTripId(tripId);
      await fetchTripBookings(tripId);
    }
  };

  // New handler for viewing user booking details
  const handleViewUserBookingDetails = (booking) => {
    setSelectedUserBooking(booking);
    setShowUserBookingModal(true);
  };

  const closeUserBookingModal = () => {
    setShowUserBookingModal(false);
    setSelectedUserBooking(null);
  };

  // Handler for viewing payment details
  const handleViewPaymentDetails = async (payment) => {
    setSelectedPayment(payment);
    setPaymentDetailsLoading(true);
    setShowPaymentDetailsModal(true);
    
    // Fetch customer info and document URLs when modal opens
    try {
      const info = await getCustomerInfo(payment);
      setCustomerInfo(info);
      
      // If we have a userId, fetch document URLs
      if (payment.userId && payment.userId._id) {
        const docs = await fetchDocumentUrls(payment.userId._id);
        setDocumentUrls(docs);
      } else if (payment.user && payment.user._id) {
        const docs = await fetchDocumentUrls(payment.user._id);
        setDocumentUrls(docs);
      }
    } catch (err) {
      console.error("Error fetching customer info:", err);
      setCustomerInfo(null);
    } finally {
      setPaymentDetailsLoading(false);
    }
  };

  const closePaymentDetailsModal = () => {
    setShowPaymentDetailsModal(false);
    setSelectedPayment(null);
    setCustomerInfo(null);
    setDocumentUrls({
      aadharDoc: null,
      drivingLicenseDoc: null,
      passportDoc: null
    });
  };

  // Helper function to get complete customer information
  const getCustomerInfo = async (payment) => {
    console.log("Getting customer info for payment:", payment);
    
    // 1. Check if payment has userId object with full details
    if (payment.userId && (payment.userId.firstName || payment.userId.lastName || payment.userId.email)) {
      const name = `${payment.userId.firstName || ''} ${payment.userId.lastName || ''}`.trim();
      console.log("Found userId in payment:", name);
      
      // Check if we have complete user details
      if (payment.userId.phone || payment.userId.profession) {
        // We have additional details, return them
        return {
          name: name || payment.userId.email || 'Unknown Customer',
          email: payment.userId.email || 'N/A',
          phone: payment.userId.phone || 'N/A',
          profession: payment.userId.profession || 'N/A',
          location: payment.userId.location || 'N/A',
          gender: payment.userId.gender || 'N/A',
          dob: payment.userId.dob ? formatDate(payment.userId.dob) : 'N/A',
          age: payment.userId.age || 'N/A',
          bloodGroup: payment.userId.bloodGroup || 'N/A',
          emergencyContact: payment.userId.emergencyContact || 'N/A',
          skills: payment.userId.skills || 'N/A',
          currentCompany: payment.userId.currentCompany || 'N/A',
          aadhar: payment.userId.aadhar || 'N/A',
          drivingLicense: payment.userId.drivingLicense || 'N/A',
          passportId: payment.userId.passportId || 'N/A',
          language: payment.userId.language || 'N/A'
        };
      } else {
        // We only have basic info, fetch complete details
        if (payment.userId._id) {
          const completeUser = await fetchCompleteUserDetails(payment.userId._id);
          if (completeUser) {
            return {
              name: name || completeUser.email || 'Unknown Customer',
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
            };
          }
        }
      }
    }
    
    // 2. Check if payment has user object
    if (payment.user && (payment.user.firstName || payment.user.lastName || payment.user.email)) {
      const name = `${payment.user.firstName || ''} ${payment.user.lastName || ''}`.trim();
      console.log("Found user in payment:", name);
      
      // Check if we have complete user details
      if (payment.user.phone || payment.user.profession) {
        // We have additional details, return them
        return {
          name: name || payment.user.email || 'Unknown Customer',
          email: payment.user.email || 'N/A',
          phone: payment.user.phone || 'N/A',
          profession: payment.user.profession || 'N/A',
          location: payment.user.location || 'N/A',
          gender: payment.user.gender || 'N/A',
          dob: payment.user.dob ? formatDate(payment.user.dob) : 'N/A',
          age: payment.user.age || 'N/A',
          bloodGroup: payment.user.bloodGroup || 'N/A',
          emergencyContact: payment.user.emergencyContact || 'N/A',
          skills: payment.user.skills || 'N/A',
          currentCompany: payment.user.currentCompany || 'N/A',
          aadhar: payment.user.aadhar || 'N/A',
          drivingLicense: payment.user.drivingLicense || 'N/A',
          passportId: payment.user.passportId || 'N/A',
          language: payment.user.language || 'N/A'
        };
      } else {
        // We only have basic info, fetch complete details
        if (payment.user._id) {
          const completeUser = await fetchCompleteUserDetails(payment.user._id);
          if (completeUser) {
            return {
              name: name || completeUser.email || 'Unknown Customer',
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
            };
          }
        }
      }
    }
    
    // 3. Check for direct payer/customer fields
    if (payment.payerName) {
      console.log("Found payerName:", payment.payerName);
      return {
        name: payment.payerName,
        email: payment.payerEmail || 'N/A',
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
      };
    }
    
    if (payment.customerName) {
      console.log("Found customerName:", payment.customerName);
      return {
        name: payment.customerName,
        email: payment.customerEmail || 'N/A',
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
          email: transaction.customerEmail || transaction.payerEmail || 'N/A',
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
        };
      }
    }
    
    // 5. Check if payment has booking object with user info
    if (payment.booking && payment.booking.user) {
      const name = `${payment.booking.user.firstName || ''} ${payment.booking.user.lastName || ''}`.trim();
      console.log("Found user in booking:", name);
      
      // Check if we have complete user details
      if (payment.booking.user.phone || payment.booking.user.profession) {
        // We have additional details, return them
        return {
          name: name || payment.booking.user.email || 'Unknown Customer',
          email: payment.booking.user.email || 'N/A',
          phone: payment.booking.user.phone || 'N/A',
          profession: payment.booking.user.profession || 'N/A',
          location: payment.booking.user.location || 'N/A',
          gender: payment.booking.user.gender || 'N/A',
          dob: payment.booking.user.dob ? formatDate(payment.booking.user.dob) : 'N/A',
          age: payment.booking.user.age || 'N/A',
          bloodGroup: payment.booking.user.bloodGroup || 'N/A',
          emergencyContact: payment.booking.user.emergencyContact || 'N/A',
          skills: payment.booking.user.skills || 'N/A',
          currentCompany: payment.booking.user.currentCompany || 'N/A',
          aadhar: payment.booking.user.aadhar || 'N/A',
          drivingLicense: payment.booking.user.drivingLicense || 'N/A',
          passportId: payment.booking.user.passportId || 'N/A',
          language: payment.booking.user.language || 'N/A'
        };
      } else {
        // We only have basic info, fetch complete details
        if (payment.booking.user._id) {
          const completeUser = await fetchCompleteUserDetails(payment.booking.user._id);
          if (completeUser) {
            return {
              name: name || completeUser.email || 'Unknown Customer',
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
            };
          }
        }
      }
    }
    
    // 6. Check if we can find matching booking in userBookings by orderId
    if (payment.orderId && userBookings.length > 0) {
      console.log("Looking for booking with orderId:", payment.orderId);
      
      // First try to match by booking.payment.orderId
      let matchingBooking = userBookings.find(booking => 
        booking.payment && booking.payment.orderId === payment.orderId
      );
      
      // If not found, try matching by booking.orderId (if it exists at the top level)
      if (!matchingBooking) {
        matchingBooking = userBookings.find(booking => 
          booking.orderId === payment.orderId
        );
      }
      
      // If still not found, try matching by booking._id if payment has bookingId
      if (!matchingBooking && payment.bookingId) {
        matchingBooking = userBookings.find(booking => 
          booking._id === payment.bookingId
        );
      }
      
      if (matchingBooking) {
        console.log("Found matching booking:", matchingBooking);
        if (matchingBooking.user) {
          const name = `${matchingBooking.user.firstName || ''} ${matchingBooking.user.lastName || ''}`.trim();
          
          // Check if we have complete user details
          if (matchingBooking.user.phone || matchingBooking.user.profession) {
            // We have additional details, return them
            return {
              name: name || matchingBooking.user.email || 'Unknown Customer',
              email: matchingBooking.user.email || 'N/A',
              phone: matchingBooking.user.phone || 'N/A',
              profession: matchingBooking.user.profession || 'N/A',
              location: matchingBooking.user.location || 'N/A',
              gender: matchingBooking.user.gender || 'N/A',
              dob: matchingBooking.user.dob ? formatDate(matchingBooking.user.dob) : 'N/A',
              age: matchingBooking.user.age || 'N/A',
              bloodGroup: matchingBooking.user.bloodGroup || 'N/A',
              emergencyContact: matchingBooking.user.emergencyContact || 'N/A',
              skills: matchingBooking.user.skills || 'N/A',
              currentCompany: matchingBooking.user.currentCompany || 'N/A',
              aadhar: matchingBooking.user.aadhar || 'N/A',
              drivingLicense: matchingBooking.user.drivingLicense || 'N/A',
              passportId: matchingBooking.user.passportId || 'N/A',
              language: matchingBooking.user.language || 'N/A'
            };
          } else {
            // We only have basic info, fetch complete details
            if (matchingBooking.user._id) {
              const completeUser = await fetchCompleteUserDetails(matchingBooking.user._id);
              if (completeUser) {
                return {
                  name: name || completeUser.email || 'Unknown Customer',
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
                };
              }
            }
          }
        }
      }
    }
    
    // 7. Try matching by tripId and amount (if orderId matching fails)
    if (payment.tripId && payment.amount && userBookings.length > 0) {
      console.log("Looking for booking with tripId and amount");
      const matchingBooking = userBookings.find(booking => 
        booking.trip?._id === payment.tripId && 
        booking.totalPrice === payment.amount
      );
      if (matchingBooking && matchingBooking.user) {
        const name = `${matchingBooking.user.firstName || ''} ${matchingBooking.user.lastName || ''}`.trim();
        console.log("Found booking by tripId and amount:", name);
        
        // Check if we have complete user details
        if (matchingBooking.user.phone || matchingBooking.user.profession) {
          // We have additional details, return them
          return {
            name: name || matchingBooking.user.email || 'Unknown Customer',
            email: matchingBooking.user.email || 'N/A',
            phone: matchingBooking.user.phone || 'N/A',
            profession: matchingBooking.user.profession || 'N/A',
            location: matchingBooking.user.location || 'N/A',
            gender: matchingBooking.user.gender || 'N/A',
            dob: matchingBooking.user.dob ? formatDate(matchingBooking.user.dob) : 'N/A',
            age: matchingBooking.user.age || 'N/A',
            bloodGroup: matchingBooking.user.bloodGroup || 'N/A',
            emergencyContact: matchingBooking.user.emergencyContact || 'N/A',
            skills: matchingBooking.user.skills || 'N/A',
            currentCompany: matchingBooking.user.currentCompany || 'N/A',
            aadhar: matchingBooking.user.aadhar || 'N/A',
            drivingLicense: matchingBooking.user.drivingLicense || 'N/A',
            passportId: matchingBooking.user.passportId || 'N/A',
            language: matchingBooking.user.language || 'N/A'
          };
        } else {
          // We only have basic info, fetch complete details
          if (matchingBooking.user._id) {
            const completeUser = await fetchCompleteUserDetails(matchingBooking.user._id);
            if (completeUser) {
              return {
                name: name || completeUser.email || 'Unknown Customer',
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
              };
            }
          }
        }
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
          email: 'N/A',
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
        };
      }
      const name = `Customer #${payment.orderId.substring(0, 8)}`;
      console.log("Using orderId as name:", name);
      return {
        name: name,
        email: 'N/A',
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
      };
    }
    
    console.log("No customer info found");
    return {
      name: 'Unknown Customer',
      email: 'N/A',
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
    };
  };

  // Trip Card component
  const TripCard = ({ trip }) => {
    try {
      const isUpcoming = trip.tripStartDate && new Date(trip.tripStartDate) > new Date();
      const isExpanded = expandedTripId === trip._id;
      const bookings = tripBookings[trip._id] || [];
      const hasBookingError = bookingError[trip._id];
      
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-red-50 text-red-600">
                  <FiMap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {trip.tripTitle || "Untitled Trip"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      trip.groupType === 'public' ? 'bg-green-100 text-green-800' :
                      trip.groupType === 'private' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {trip.groupType?.charAt(0).toUpperCase() + trip.groupType?.slice(1) || 'Public'}
                    </span>
                    {isUpcoming && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Upcoming
                      </span>
                    )}
                    {trip.status === 'published' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      trip.bookingProcess === 'instant' ? 'bg-green-100 text-green-800' :
                      trip.bookingProcess === 'approval' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {trip.bookingProcess === 'instant' ? 'Instant Booking' : 
                       trip.bookingProcess === 'approval' ? 'Host Approval' : 'Not Set'}
                    </span>
                    {trip.allowPreviousParticipation && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Previous Participation Allowed
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewTrip(trip)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="View Trip"
                >
                  <FiEye className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleEditTrip(trip._id)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Edit Trip"
                >
                  <FiEdit className="h-5 w-5" />
                </button>
                {trip.status !== 'published' && (
                  <button 
                    onClick={() => handlePublish(trip)}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Publish Trip"
                  >
                    <FiSend className="h-5 w-5" />
                  </button>
                )}
                <button 
                  onClick={() => handleManageBookings(trip)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Manage Bookings"
                >
                  <FiUserCheck className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleDeleteClick(trip)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Trip"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiCalendar className="h-4 w-4 text-gray-500" />
                <span>{formatDate(trip.tripStartDate)} - {formatDate(trip.tripEndDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiDollarSign className="h-4 w-4 text-gray-500" />
                <span>{formatCurrency(trip.basePrice)} per person</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiCheck className="h-4 w-4 text-gray-500" />
                <span>Previous Participation: {trip.allowPreviousParticipation ? 'Allowed' : 'Not Allowed'}</span>
              </div>
            </div>
            {trip.description && (
              <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                {trip.description}
              </p>
            )}
            {trip.tripTags && trip.tripTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {trip.tripTags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <FiTag className="mr-1 h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Bookings</p>
                    <p className="text-lg font-semibold text-red-600">{trip.bookings || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency((trip.bookings || 0) * (trip.basePrice || 0))}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Pending Payments</p>
                    <p className="text-lg font-semibold text-yellow-600">
                      {trip.pendingPayments || 0}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleBookings(trip._id)}
                  className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                  {isExpanded ? 'Hide Bookings' : 'View Bookings'}
                  {isExpanded ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
                </button>
              </div>
              
              {/* Bookings List */}
              {isExpanded && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Bookings for this trip</h4>
                  
                  {hasBookingError ? (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">{hasBookingError}</p>
                    </div>
                  ) : bookings.length > 0 ? (
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                              </th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Booking Date
                              </th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map((booking) => (
                              <tr key={booking._id}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {booking.user?.firstName} {booking.user?.lastName}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(booking.createdAt)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {formatCurrency(booking.totalPrice)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {booking.status === 'approved' ? 'Approved' :
                                     booking.status === 'rejected' ? 'Rejected' : 'Pending'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                  {booking.status === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => handleApproveBooking(booking._id)}
                                        disabled={actionLoading}
                                        className="text-green-600 hover:text-green-900 mr-3 disabled:opacity-50"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleRejectBooking(booking._id)}
                                        disabled={actionLoading}
                                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  {booking.status !== 'pending' && (
                                    <span className="text-gray-500">No actions</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">No bookings for this trip yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => handleViewTrip(trip)}
                className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
              >
                View Details
              </button>
              <button 
                onClick={() => navigate(`/host/payments?tripId=${trip._id}`)}
                className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
              >
                View Payments
              </button>
            </div>
          </div>
        </div>
      );
    } catch (err) {
      console.error("Error rendering TripCard:", err);
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-5">
          <div className="text-red-500">Error displaying trip information</div>
        </div>
      );
    }
  };

  // User Booking Card component
  const UserBookingCard = ({ booking }) => {
    try {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">
                {booking.trip?.tripTitle || "Unknown Trip"}
              </h3>
              <p className="text-sm text-gray-500">
                Booking ID: #{booking._id.substring(0, 8)}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              booking.status === 'approved' ? 'bg-green-100 text-green-800' :
              booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {booking.status === 'approved' ? 'Approved' :
               booking.status === 'rejected' ? 'Rejected' : 'Pending'}
            </span>
          </div>
          
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mr-2 text-white text-xs font-semibold">
              {booking.user?.firstName?.charAt(0)}{booking.user?.lastName?.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {booking.user?.firstName} {booking.user?.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {booking.user?.email || "No email"}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div className="flex items-center">
              <FiCalendar className="h-4 w-4 text-gray-500 mr-1" />
              <span>{formatDate(booking.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <FiUsers className="h-4 w-4 text-gray-500 mr-1" />
              <span>{booking.numberOfPeople || 1} {booking.numberOfPeople === 1 ? 'person' : 'people'}</span>
            </div>
            <div className="flex items-center col-span-2">
              <FiDollarSign className="h-4 w-4 text-gray-500 mr-1" />
              <span className="font-medium">{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={() => handleViewUserBookingDetails(booking)}
              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
            >
              <FiEye className="h-4 w-4 mr-1" />
              View Details
            </button>
            
            {booking.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleApproveBooking(booking._id)}
                  disabled={actionLoading}
                  className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRejectBooking(booking._id)}
                  disabled={actionLoading}
                  className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      );
    } catch (err) {
      console.error("Error rendering UserBookingCard:", err);
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="text-red-500">Error displaying booking information</div>
        </div>
      );
    }
  };

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'trips', label: 'My Trips', icon: FiMap },
    { id: 'bookings', label: 'User Bookings', icon: FiUsers },
    { id: 'payments', label: 'Payments', icon: FiCreditCard },
    { id: 'pending', label: 'Pending Approvals', icon: FiUserCheck },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-red-600 text-white transition-all duration-300 ease-in-out shadow-xl`}>
        <div className="p-4 flex items-center justify-between">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
            
            {sidebarOpen && (
              <h1 className="ml-3 text-xl font-bold">WANDERGOO</h1>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-red-800 transition-colors"
          >
            {sidebarOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
        
        <div className="mt-8">
          <div className="px-4 mb-4">
            {sidebarOpen && (
              <p className="text-xs font-semibold text-red-300 uppercase tracking-wider">Main Menu</p>
            )}
          </div>
          <nav className="space-y-1 px-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center ${sidebarOpen ? 'px-4' : 'px-2 justify-center'} py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-red-800 text-white'
                      : 'text-red-100 hover:bg-red-800 hover:text-white'
                  }`}
                >
                  <Icon className={`${sidebarOpen ? 'mr-3' : ''} h-5 w-5`} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {activeSection === 'overview' && 'Dashboard Overview'}
                {activeSection === 'trips' && 'My Trips'}
                {activeSection === 'bookings' && 'User Bookings'}
                {activeSection === 'payments' && 'Payments'}
                {activeSection === 'pending' && 'Pending Approvals'}
                {activeSection === 'analytics' && 'Analytics'}
                {activeSection === 'settings' && 'Settings'}
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {currentUser?.firstName || 'User'}!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate('/create-trip')}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
              >
                <FiPlus className="h-5 w-5" />
                Create Trip
              </button>
            </div>
          </div>

          {showSuccess && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiCheck className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Success!</span> {successMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Section */}
              {activeSection === 'overview' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 rounded-lg bg-red-50 text-red-600">
                          <FiMapPin className="h-5 sm:h-6 w-5 sm:w-6" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Total Trips</p>
                          <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.totalTrips}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 rounded-lg bg-blue-50 text-blue-600">
                          <FiUsers className="h-5 sm:h-6 w-5 sm:w-6" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Total Bookings</p>
                          <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 rounded-lg bg-green-50 text-green-600">
                          <FiTrendingUp className="h-5 sm:h-6 w-5 sm:w-6" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Total Revenue</p>
                          <p className="text-xl sm:text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 rounded-lg bg-amber-50 text-amber-600">
                          <FiUserCheck className="h-5 sm:h-6 w-5 sm:w-6" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Pending Approvals</p>
                          <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.pendingApprovals}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Trips */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Recent Trips</h2>
                      <button
                        onClick={() => setActiveSection('trips')}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        View All
                      </button>
                    </div>

                    {trips.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.slice(0, 3).map((trip) => (
                          <TripCard key={trip._id} trip={trip} />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
                        <FiMap className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No trips published</h3>
                        <p className="mt-1 text-sm sm:text-base text-gray-500">Get started by creating your first trip.</p>
                        <div className="mt-6">
                          <button
                            onClick={() => navigate('/create-trip')}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <FiPlus className="-ml-1 h-5 w-5" />
                            New Trip
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recent Bookings */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                      <button
                        onClick={() => setActiveSection('bookings')}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        View All
                      </button>
                    </div>

                    {userBookings.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userBookings.slice(0, 3).map((booking) => (
                          <UserBookingCard key={booking._id} booking={booking} />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                        <FiUserCheck className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
                        <p className="mt-1 text-sm text-gray-500">You don't have any bookings yet.</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Trips Section */}
              {activeSection === 'trips' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Your Published Trips</h2>
                    <div className="text-sm text-gray-500">
                      {stats.totalTrips} {stats.totalTrips === 1 ? 'Trip' : 'Trips'}
                    </div>
                  </div>

                  {trips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trips.map((trip) => (
                        <TripCard key={trip._id} trip={trip} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No trips published</h3>
                      <p className="mt-1 text-sm sm:text-base text-gray-500">Get started by creating your first trip.</p>
                      <div className="mt-6">
                        <button
                          onClick={() => navigate('/create-trip')}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <FiPlus className="-ml-1 h-5 w-5" />
                          New Trip
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Bookings Section */}
              {activeSection === 'bookings' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">User Bookings</h2>
                    <div className="text-sm text-gray-500">
                      {userBookings.length} {userBookings.length === 1 ? 'Booking' : 'Bookings'}
                    </div>
                  </div>

                  {userBookingsLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div>
                    </div>
                  ) : userBookingsError ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{userBookingsError}</p>
                        </div>
                      </div>
                    </div>
                  ) : userBookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userBookings.map((booking) => (
                        <UserBookingCard key={booking._id} booking={booking} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                      <FiUserCheck className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
                      <p className="mt-1 text-sm text-gray-500">You don't have any bookings yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Payments Section */}
              {activeSection === 'payments' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
                    <button
                      onClick={() => navigate('/host/payments')}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      View All
                    </button>
                  </div>

                  {payments.length > 0 ? (
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
                                Trip
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
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((payment) => (
                              <tr key={payment._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {payment.orderId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {payment.userId ? `${payment.userId.firstName} ${payment.userId.lastName}` : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {payment.userId?.email || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {payment.tripId?.tripTitle || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(payment.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatCurrency(payment.amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    payment.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                                    payment.status === 'FAILURE' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {payment.status === 'SUCCESS' ? 'Completed' :
                                     payment.status === 'FAILURE' ? 'Failed' : 'Pending'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <button
                                    onClick={() => handleViewPaymentDetails(payment)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <FiEye className="h-5 w-5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                      <FiCreditCard className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No payments received</h3>
                      <p className="mt-1 text-sm text-gray-500">You haven't received any payments yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Pending Approvals Section */}
              {activeSection === 'pending' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
                    <div className="text-sm text-gray-500">
                      {pendingBookings.length} {pendingBookings.length === 1 ? 'Booking' : 'Bookings'} awaiting approval
                    </div>
                  </div>
                  {pendingBookings.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Booking ID
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trip
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {pendingBookings.map((booking) => (
                              <tr key={booking._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  #{booking._id.substring(0, 8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {booking.trip?.tripTitle || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {booking.user?.firstName} {booking.user?.lastName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(booking.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatCurrency(booking.totalPrice)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleApproveBooking(booking._id)}
                                    disabled={actionLoading}
                                    className="text-green-600 hover:text-green-900 mr-4 disabled:opacity-50"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectBooking(booking._id)}
                                    disabled={actionLoading}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                      <FiUserCheck className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No pending approvals</h3>
                      <p className="mt-1 text-sm text-gray-500">All bookings have been processed.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Analytics Section */}
              {activeSection === 'analytics' && (
                <div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <FiBarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Analytics Dashboard</h3>
                    <p className="mt-1 text-sm text-gray-500">Analytics features coming soon.</p>
                  </div>
                </div>
              )}

              {/* Settings Section */}
              {activeSection === 'settings' && (
                <div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <FiSettings className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Settings</h3>
                    <p className="mt-1 text-sm text-gray-500">Settings features coming soon.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Delete Trip
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete "{itemToDelete?.tripTitle || 'this trip'}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteConfirm}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                onClick={handleDeleteCancel}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Management Modal */}
      {showBookingModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Manage Bookings for "{selectedTrip.tripTitle}"
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedTrip.bookingProcess === 'approval' 
                      ? 'Host approval required for all bookings' 
                      : 'Instant booking enabled'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-6">
                {bookingError[selectedTrip._id] ? (
                  <div className="text-center py-8">
                    <FiAlertCircle className="mx-auto h-12 w-12 text-amber-500" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Booking Information Limited</h3>
                    <p className="mt-1 text-sm text-gray-500">{bookingError[selectedTrip._id]}</p>
                  </div>
                ) : tripBookings[selectedTrip._id] && tripBookings[selectedTrip._id].length > 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Booking ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
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
                          {tripBookings[selectedTrip._id].map((booking) => (
                            <tr key={booking._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{booking._id.substring(0, 8)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {booking.user?.firstName} {booking.user?.lastName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(booking.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatCurrency(booking.totalPrice)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {booking.status === 'approved' ? 'Approved' :
                                   booking.status === 'rejected' ? 'Rejected' : 'Pending'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {booking.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApproveBooking(booking._id)}
                                      disabled={actionLoading}
                                      className="text-green-600 hover:text-green-900 mr-4 disabled:opacity-50"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleRejectBooking(booking._id)}
                                      disabled={actionLoading}
                                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                {booking.status !== 'pending' && (
                                  <span className="text-gray-500">No actions</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiCheck className="mx-auto h-12 w-12 text-green-500" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
                    <p className="mt-1 text-sm text-gray-500">There are no bookings for this trip.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Booking Details Modal */}
      {showUserBookingModal && selectedUserBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
                  <p className="text-sm text-gray-500">Booking ID: #{selectedUserBooking._id.substring(0, 8)}</p>
                </div>
                <button
                  type="button"
                  onClick={closeUserBookingModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trip Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-4 text-red-700 flex items-center">
                    <FiMap className="h-5 w-5 mr-2" />
                    Trip Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="font-medium w-32">Trip Name:</span>
                      <span>{selectedUserBooking.trip?.tripTitle || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Start Date:</span>
                      <span>{formatDate(selectedUserBooking.trip?.tripStartDate)}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">End Date:</span>
                      <span>{formatDate(selectedUserBooking.trip?.tripEndDate)}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Destination:</span>
                      <span>{selectedUserBooking.trip?.destination || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Price:</span>
                      <span>{formatCurrency(selectedUserBooking.trip?.basePrice)}</span>
                    </div>
                  </div>
                </div>
                
                {/* User Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-4 text-red-700 flex items-center">
                    <FiUser className="h-5 w-5 mr-2" />
                    User Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="font-medium w-32">Name:</span>
                      <span>{selectedUserBooking.user?.firstName} {selectedUserBooking.user?.lastName}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Email:</span>
                      <span>{selectedUserBooking.user?.email || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Phone:</span>
                      <span>{selectedUserBooking.user?.phone || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Location:</span>
                      <span>{selectedUserBooking.user?.location || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Profession:</span>
                      <span>{selectedUserBooking.user?.profession || "N/A"}</span>
                    </div>
                  </div>
                </div>
                
                {/* Booking Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-4 text-red-700 flex items-center">
                    <FiCalendar className="h-5 w-5 mr-2" />
                    Booking Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="font-medium w-32">Booking Date:</span>
                      <span>{formatDate(selectedUserBooking.createdAt)}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Number of People:</span>
                      <span>{selectedUserBooking.numberOfPeople || 1}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Total Price:</span>
                      <span className="font-semibold">{formatCurrency(selectedUserBooking.totalPrice)}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedUserBooking.status === 'approved' ? 'bg-green-100 text-green-800' :
                        selectedUserBooking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedUserBooking.status === 'approved' ? 'Approved' :
                         selectedUserBooking.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Payment Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-4 text-red-700 flex items-center">
                    <FiCreditCard className="h-5 w-5 mr-2" />
                    Payment Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="font-medium w-32">Payment Status:</span>
                      <span>
                        {selectedUserBooking.paymentStatus === 'SUCCESS' ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : selectedUserBooking.paymentStatus === 'PENDING' ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        ) : selectedUserBooking.paymentStatus === 'FAILURE' ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Failed
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Not Available
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Payment Method:</span>
                      <span>{selectedUserBooking.paymentMethod || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Transaction ID:</span>
                      <span>{selectedUserBooking.transactionId || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Payment Date:</span>
                      <span>{formatDate(selectedUserBooking.paymentDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              {selectedUserBooking.status === 'pending' && (
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => handleRejectBooking(selectedUserBooking._id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject Booking
                  </button>
                  <button
                    onClick={() => handleApproveBooking(selectedUserBooking._id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showPaymentDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                  <p className="text-sm text-gray-500">Order ID: {selectedPayment.orderId}</p>
                </div>
                <button
                  type="button"
                  onClick={closePaymentDetailsModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-6">
                {paymentDetailsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Payment Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-lg mb-4 text-red-700 flex items-center">
                        <FiCreditCard className="h-5 w-5 mr-2" />
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedPayment.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                            selectedPayment.status === 'FAILURE' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedPayment.status === 'SUCCESS' ? 'Completed' :
                             selectedPayment.status === 'FAILURE' ? 'Failed' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="font-medium w-32">Payment Date:</span>
                          <span>{formatDate(selectedPayment.createdAt)}</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium w-32">Trip:</span>
                          <span>{selectedPayment.tripId?.tripTitle || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Customer Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-lg mb-4 text-red-700 flex items-center">
                        <FiUser className="h-5 w-5 mr-2" />
                        Customer Information
                      </h4>
                      {customerInfo ? (
                        <div className="space-y-3">
                          <div className="flex">
                            <span className="font-medium w-32">Name:</span>
                            <span>{customerInfo.name}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Email:</span>
                            <span>{customerInfo.email}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Phone:</span>
                            <span>{customerInfo.phone}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Profession:</span>
                            <span>{customerInfo.profession}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Location:</span>
                            <span>{customerInfo.location}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Gender:</span>
                            <span>{customerInfo.gender}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Date of Birth:</span>
                            <span>{customerInfo.dob}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Age:</span>
                            <span>{customerInfo.age}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Blood Group:</span>
                            <span>{customerInfo.bloodGroup}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Emergency Contact:</span>
                            <span>{customerInfo.emergencyContact}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Skills:</span>
                            <span>{customerInfo.skills}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Current Company:</span>
                            <span>{customerInfo.currentCompany}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Aadhar:</span>
                            <span>{customerInfo.aadhar}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Driving License:</span>
                            <span>{customerInfo.drivingLicense}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Passport ID:</span>
                            <span>{customerInfo.passportId}</span>
                          </div>
                          <div className="flex">
                            <span className="font-medium w-32">Language:</span>
                            <span>{customerInfo.language}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500">Customer information not available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Document Information */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-4 text-red-700 flex items-center">
                  <FiFileText className="h-5 w-5 mr-2" />
                  Document Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-2">Aadhar Document</h5>
                    {documentUrls.aadharDoc ? (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium w-24">Number:</span>
                          <span>{customerInfo?.aadhar || 'N/A'}</span>
                        </div>
                        <div className="mt-2">
                          <a 
                            href={documentUrls.aadharDoc} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
                          >
                            <FiDownload className="mr-1 h-4 w-4" />
                            View Document
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No document uploaded</p>
                    )}
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-2">Driving License</h5>
                    {documentUrls.drivingLicenseDoc ? (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium w-24">Number:</span>
                          <span>{customerInfo?.drivingLicense || 'N/A'}</span>
                        </div>
                        <div className="mt-2">
                          <a 
                            href={documentUrls.drivingLicenseDoc} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
                          >
                            <FiDownload className="mr-1 h-4 w-4" />
                            View Document
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No document uploaded</p>
                    )}
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-2">Passport</h5>
                    {documentUrls.passportDoc ? (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium w-24">Number:</span>
                          <span>{customerInfo?.passportId || 'N/A'}</span>
                        </div>
                        <div className="mt-2">
                          <a 
                            href={documentUrls.passportDoc} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
                          >
                            <FiDownload className="mr-1 h-4 w-4" />
                            View Document
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No document uploaded</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Transaction Details */}
              {selectedPayment.transactions && selectedPayment.transactions.length > 0 && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-4 text-red-700 flex items-center">
                    <FiFileText className="h-5 w-5 mr-2" />
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
                            <p className={`text-sm ${transaction.payment_status === 'SUCCESS' ? 'text-green-600' : transaction.payment_status === 'FAILURE' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {transaction.payment_status === 'SUCCESS' ? 'Success' : 
                               transaction.payment_status === 'FAILURE' ? 'Failed' : 'Pending'}
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
}

export default Dashboard;