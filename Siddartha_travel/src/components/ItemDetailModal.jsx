// ItemDetailModal.js
import React, { useState, useEffect } from 'react';
import { FiX, FiHeart, FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiClock, FiStar, FiUser, FiBookmark, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ItemDetailModal = ({ item, onClose, isSaved, onSave }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format date function
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

  // Format currency function
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

  // Calculate total price for trips
  const calculateTripTotalPrice = (trip) => {
    if (!trip) return 0;
    
    // Use basePrice if available
    if (trip.basePrice && trip.basePrice > 0) {
      return trip.basePrice;
    }
    
    // Calculate from pricing object
    const pricing = trip.pricing || {};
    const sumItems = (items = []) =>
      (items || []).reduce((s, it) => s + (Number(it?.cost) || 0), 0);
    const accommodationSum =
      Number(pricing.accommodation) ||
      sumItems(pricing.accommodationItems || []);
    const transportationSum =
      Number(pricing.transportation) ||
      sumItems(pricing.transportationItems || []);
    const activitiesSum =
      Number(pricing.activities) || sumItems(pricing.activityItems || []);
    const bufferPercentage = Number(pricing.bufferPercentage) || 0;
    const yourFee = Number(pricing.yourFee) || 0;
    const subtotal = accommodationSum + transportationSum + activitiesSum;
    const bufferAmount = subtotal * (bufferPercentage / 100);
    return subtotal + bufferAmount + yourFee;
  };

  // Get item details based on type
  const getItemDetails = () => {
    if (!item) return null;
    
    if (item.itemType === 'trip') {
      // Calculate total price using the same logic as TripDetail
      const totalPrice = calculateTripTotalPrice(item);
      
      return {
        title: item.tripTitle || "Untitled Trip",
        location: item.destination || "Location not specified",
        image: item.bannerImage || item.image || 'https://via.placeholder.com/400x300',
        date: item.tripStartDate,
        endDate: item.tripEndDate,
        duration: item.duration || `${item.durationDays || 0} days`,
        price: totalPrice,
        guide: item.guide || "Guide",
        rating: item.reviews && item.reviews.length > 0 
          ? item.reviews.reduce((acc, review) => acc + review.rating, 0) / item.reviews.length 
          : 0,
        reviewCount: item.reviews?.length || 0,
        category: item.tripCategory || "",
        type: "trip",
        description: item.description || "No description available",
        groupType: item.groupType || "public",
        tags: item.tripTags || [],
        bookings: item.bookings || 0
      };
    } else if (item.itemType === 'event') {
      return {
        title: item.eventTitle || "Untitled Event",
        location: item.destination || "Location not specified",
        image: item.bannerImage || item.image || 'https://via.placeholder.com/400x300',
        date: item.eventStartDate,
        endDate: item.eventEndDate,
        duration: item.duration || `${item.durationDays || 0} days`,
        price: item.pricing?.totalPrice || 0,
        guide: item.guide || "Organizer",
        rating: item.reviews && item.reviews.length > 0 
          ? item.reviews.reduce((acc, review) => acc + review.rating, 0) / item.reviews.length 
          : 0,
        reviewCount: item.reviews?.length || 0,
        category: item.eventCategory || "",
        type: "event",
        description: item.eDescription || "No description available",
        groupType: item.groupType || "public",
        tags: item.eventTags || [],
        bookings: item.bookings || 0
      };
    } else if (item.itemType === 'school') {
      return {
        title: item.schoolName || "Untitled School",
        location: item.address?.city || "Location not specified",
        image: item.coverImage || item.image || 'https://via.placeholder.com/400x300',
        date: null,
        endDate: null,
        duration: null,
        price: item.packages && item.packages.length > 0 
          ? Math.min(...item.packages.map(pkg => pkg.price || 0)) 
          : 0,
        guide: item.contactPerson || "Contact",
        rating: item.reviews && item.reviews.length > 0 
          ? item.reviews.reduce((acc, review) => acc + review.rating, 0) / item.reviews.length 
          : 0,
        reviewCount: item.reviews?.length || 0,
        category: item.adventureTypes?.[0] || "",
        type: "school",
        description: item.schoolDescription || "No description available",
        groupType: "public",
        tags: item.adventureTypes || [],
        packages: item.packages || [],
        bookings: item.packages ? 
          item.packages.reduce((sum, pkg) => sum + (pkg.bookings || 0), 0) : 0,
        address: item.address || {},
        yearEstablished: item.yearEstablished || null
      };
    }
    return null;
  };

  const details = getItemDetails();

  // Handle booking
  const handleBookNow = () => {
    if (!item) return;
    
    try {
      if (item.itemType === 'trip') {
        navigate(`/trip/${item._id || item.id}`);
      } else if (item.itemType === 'event') {
        navigate(`/event/${item._id || item.id}`);
      } else if (item.itemType === 'school') {
        navigate(`/adventure-school-details/${item._id || item.id}`);
      }
      onClose();
    } catch (err) {
      console.error("Error navigating to item details:", err);
      setError("Failed to navigate to item details");
    }
  };

  // Handle save
  const handleSave = () => {
    if (!item) return;
    
    try {
      onSave(item._id || item.id);
    } catch (err) {
      console.error("Error saving item:", err);
      setError("Failed to save item");
    }
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!details) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Item Details</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-500">Item details not available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Image */}
          <div className="h-64 md:h-80 overflow-hidden">
            <img 
              src={details.image} 
              alt={details.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300';
              }}
            />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <FiX size={20} />
            </button>
            <button 
              onClick={handleSave}
              className={`absolute top-4 left-4 p-2 rounded-full shadow-md transition-colors ${
                isSaved ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
              }`}
            >
              <FiHeart size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
          
          <div className="p-6">
            {/* Title and location */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  details.type === 'trip' ? 'bg-indigo-100 text-indigo-800' :
                  details.type === 'event' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {details.type === 'trip' ? 'Trip' : details.type === 'event' ? 'Event' : 'Adventure School'}
                </span>
                {details.category && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {details.category}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{details.title}</h1>
              <div className="flex items-center text-gray-600">
                <FiMapPin className="mr-2" />
                <span>{details.location}</span>
              </div>
            </div>
            
            {/* Rating and reviews */}
            {details.rating > 0 && (
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      size={16} 
                      className={i < Math.floor(details.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'} 
                      fill={i < Math.floor(details.rating) ? 'currentColor' : 'none'} 
                    />
                  ))}
                  <span className="ml-2 text-gray-700 font-medium">
                    {details.rating.toFixed(1)} ({details.reviewCount} reviews)
                  </span>
                </div>
              </div>
            )}
            
            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {details.date && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FiCalendar className="text-gray-500 mr-3" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="font-medium">{formatDate(details.date)}</p>
                  </div>
                </div>
              )}
              
              {details.endDate && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FiCalendar className="text-gray-500 mr-3" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="font-medium">{formatDate(details.endDate)}</p>
                  </div>
                </div>
              )}
              
              {details.duration && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FiClock className="text-gray-500 mr-3" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium">{details.duration}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FiUser className="text-gray-500 mr-3" size={20} />
                <div>
                  <p className="text-xs text-gray-500">
                    {details.type === 'school' ? 'Contact' : 'Guide'}
                  </p>
                  <p className="font-medium">{details.guide}</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FiDollarSign className="text-gray-500 mr-3" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Starting Price</p>
                  <p className="font-medium">{formatCurrency(details.price)}</p>
                </div>
              </div>
              
              {details.type === 'school' && details.yearEstablished && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-500 mr-3" size={20}>
                    🏛️
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Established</p>
                    <p className="font-medium">{details.yearEstablished}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{details.description}</p>
            </div>
            
            {/* Tags */}
            {details.tags && details.tags.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {details.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Packages (for schools) */}
            {details.type === 'school' && details.packages && details.packages.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Packages</h2>
                <div className="space-y-3">
                  {details.packages.map((pkg, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">{pkg.name || `Package ${index + 1}`}</h3>
                        <span className="font-semibold text-indigo-600">{formatCurrency(pkg.price || 0)}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{pkg.description || 'No description available'}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <FiUsers className="mr-1" size={14} />
                        <span>{pkg.bookings || 0} bookings</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBookNow}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                <FiEye className="mr-2" />
                View Full Details
              </button>
              <button
                onClick={handleSave}
                className={`px-6 py-3 font-medium rounded-lg transition-colors flex items-center justify-center ${
                  isSaved 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiHeart className="mr-2" fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? 'Remove from Saved' : 'Save for Later'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;