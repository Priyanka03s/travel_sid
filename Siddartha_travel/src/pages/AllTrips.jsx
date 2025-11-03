import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchPublishedTrips, 
  fetchPublishedEvents, 
  fetchPublishedSchools 
} from '../store/slices/itemsSlice';
import { 
  setSearchTerm, 
  setSearchType, 
  setSortOption, 
  toggleSortOptions,
  updateFilter, 
  resetFilters 
} from '../store/slices/filterSlice';
import { toggleSavedItem } from '../store/slices/savedItemsSlice';
import { 
  FiSearch, FiFilter, FiHeart, FiStar, FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiClock,
  FiX, FiChevronDown, FiChevronUp, FiBookmark, FiEye, FiUser, FiHome
} from 'react-icons/fi';
import ItemDetailModal from '../components/ItemDetailModal';

// SVG component for the search icon
const SearchIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32" 
    style={{
      display: 'block',
      fill: 'none',
      height: '16px',
      width: '16px',
      stroke: 'white',
      strokeWidth: '4',
      overflow: 'visible'
    }} 
    aria-hidden="true" 
    role="presentation" 
    focusable="false"
  >
    <path 
      fill="none" 
      d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9"
    ></path>
  </svg>
);
console.log("run")
// Main Search Bar Component
const SearchBar = ({ searchTerm, searchType, onSearchTermChange, onSearchTypeChange }) => {
  const handleSearchTypeClick = (type) => {
    onSearchTypeChange(type);
  };

  return (
    <div className="flex items-center border border-gray-200 rounded-full shadow-lg w-full max-w-4xl mx-auto mb-8 bg-white hover:shadow-xl transition-shadow duration-300">
      {/* Trip Section */}
      <div 
        className={`px-6 py-4 cursor-pointer hover:bg-gray-50 rounded-l-full transition-all duration-300 flex-1 ${
          searchType === 'trip' 
            ? 'bg-blue-50 border-l-2 border-t-2 border-b-2 border-blue-500' 
            : ''
        }`}
        onClick={() => handleSearchTypeClick('trip')}
      >
        <p className="text-xs font-bold text-gray-500 mb-1">Trip</p>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search Trip"
            className={`text-sm font-medium bg-transparent border-none focus:outline-none w-full ${
              searchType === 'trip' ? 'text-gray-900' : 'text-gray-400'
            }`}
            value={searchType === 'trip' ? searchTerm : ''}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              handleSearchTypeClick('trip');
            }}
            readOnly={searchType !== 'trip'}
          />
          {searchType === 'trip' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      
      <div className="h-8 border-l border-gray-300"></div>

      {/* Event Section */}
      <div 
        className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-all duration-300 flex-1 ${
          searchType === 'event' 
            ? 'bg-blue-50 border-t-2 border-b-2 border-blue-500' 
            : ''
        }`}
        onClick={() => handleSearchTypeClick('event')}
      >
        <p className="text-xs font-bold text-gray-500 mb-1">Event</p>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search Event"
            className={`text-sm font-medium bg-transparent border-none focus:outline-none w-full ${
              searchType === 'event' ? 'text-gray-900' : 'text-gray-400'
            }`}
            value={searchType === 'event' ? searchTerm : ''}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              handleSearchTypeClick('event');
            }}
            readOnly={searchType !== 'event'}
          />
          {searchType === 'event' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      
      <div className="h-8 border-l border-gray-300"></div>

      {/* Adventure Section */}
      <div 
        className={`px-6 py-4 cursor-pointer hover:bg-gray-50 rounded-r-full transition-all duration-300 flex-1 ${
          searchType === 'adventure' 
            ? 'bg-blue-50 border-r-2 border-t-2 border-b-2 border-blue-500' 
            : ''
        }`}
        onClick={() => handleSearchTypeClick('adventure')}
      >
        <p className="text-xs font-bold text-gray-500 mb-1">Adventure</p>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search Adventure"
            className={`text-sm font-medium bg-transparent border-none focus:outline-none w-full ${
              searchType === 'adventure' ? 'text-gray-900' : 'text-gray-400'
            }`}
            value={searchType === 'adventure' ? searchTerm : ''}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              handleSearchTypeClick('adventure');
            }}
            readOnly={searchType !== 'adventure'}
          />
          {searchType === 'adventure' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      
      <div className="h-8 border-l border-gray-300"></div>

      {/* Search Button */}
      <div className="flex items-center px-6 py-4">
        <button className="bg-[#FF385C] text-white p-3 rounded-full hover:bg-[#E31C5F] transition-colors duration-200 shadow-md">
          <SearchIcon />
        </button>
      </div>
    </div>
  );
};

// Helper function to calculate total price for trips with early bird discount and room pricing
const calculateTripTotalPrice = (trip, selectedAccommodationType = 'shared') => {
  if (!trip) return { basePrice: 0, discountedPrice: 0, isEarlyBirdApplicable: false, roomPrice: 0 };
  
  // Calculate room price based on selected accommodation type
  let roomPrice = 0;
  const accommodation = trip.accommodation || {};
  
  if (selectedAccommodationType === 'shared' && accommodation.sharedPrice) {
    roomPrice = accommodation.sharedPrice;
    // Add additional days if any
    if (accommodation.sharedDays && accommodation.sharedDays.length > 0) {
      roomPrice += accommodation.sharedDays.reduce((sum, day) => sum + (day.price || 0), 0);
    }
  } else if (selectedAccommodationType === 'private' && accommodation.privatePrice) {
    roomPrice = accommodation.privatePrice;
    // Add additional days if any
    if (accommodation.privateDays && accommodation.privateDays.length > 0) {
      roomPrice += accommodation.privateDays.reduce((sum, day) => sum + (day.price || 0), 0);
    }
  } else if (selectedAccommodationType === 'camping' && accommodation.campingPrice) {
    roomPrice = accommodation.campingPrice;
    // Add additional days if any
    if (accommodation.campingDays && accommodation.campingDays.length > 0) {
      roomPrice += accommodation.campingDays.reduce((sum, day) => sum + (day.price || 0), 0);
    }
  } else if (selectedAccommodationType === 'glamping' && accommodation.glampingPrice) {
    roomPrice = accommodation.glampingPrice;
    // Add additional days if any
    if (accommodation.glampingDays && accommodation.glampingDays.length > 0) {
      roomPrice += accommodation.glampingDays.reduce((sum, day) => sum + (day.price || 0), 0);
    }
  }
  
  // Calculate base price including room
  let basePrice = 0;
  if (trip.basePrice && trip.basePrice > 0) {
    basePrice = trip.basePrice;
  } else {
    const pricing = trip.pricing || {};
    const sumItems = (items = []) =>
      (items || []).reduce((s, it) => s + (Number(it?.cost) || 0), 0);
    const transportationSum =
      Number(pricing.transportation) ||
      sumItems(pricing.transportationItems || []);
    const activitiesSum =
      Number(pricing.activities) || sumItems(pricing.activityItems || []);
    const bufferPercentage = Number(pricing.bufferPercentage) || 0;
    const yourFee = Number(pricing.yourFee) || 0;
    const subtotal = roomPrice + transportationSum + activitiesSum;
    const bufferAmount = subtotal * (bufferPercentage / 100);
    basePrice = subtotal + bufferAmount + yourFee;
  }
  
  // Check if early bird discount is applicable
  const isEarlyBirdApplicable = trip.allowEarlyBooking && 
                                 trip.earlyBookingDiscount > 0 &&
                                 trip.earlyBookingEndDate &&
                                 new Date() < new Date(trip.earlyBookingEndDate);
  
  // Calculate discounted price if applicable
  let discountedPrice = basePrice;
  if (isEarlyBirdApplicable) {
    discountedPrice = basePrice * (1 - trip.earlyBookingDiscount / 100);
  }
  
  return {
    basePrice,
    discountedPrice,
    isEarlyBirdApplicable,
    discountPercentage: trip.earlyBookingDiscount || 0,
    endDate: trip.earlyBookingEndDate || null,
    roomPrice,
    roomType: selectedAccommodationType
  };
};

// Helper function to get the best image for an item
const getItemBestImage = (item) => {
  if (item.itemType === 'trip') {
    return item.bannerImage || item.image || 'https://via.placeholder.com/400x300';
  } else if (item.itemType === 'event') {
    return item.bannerImage || item.image || 'https://via.placeholder.com/400x300';
  } else if (item.itemType === 'school') {
    return item.coverImage || item.image || 'https://via.placeholder.com/400x300';
  }
  return 'https://via.placeholder.com/400x300';
};

// Item Card Component
const ItemCard = ({ item, onClick, isSaved, onSave }) => {
  const navigate = useNavigate();
  const [selectedRoomType, setSelectedRoomType] = useState('shared');
  
  // Get item details based on type
  const getItemDetails = () => {
    if (item.itemType === 'trip') {
      const pricingInfo = calculateTripTotalPrice(item, selectedRoomType);
      
      return {
        title: item.tripTitle || "Untitled Trip",
        location: item.destination || "Location not specified",
        image: getItemBestImage(item),
        date: item.tripStartDate,
        duration: item.duration || `${item.durationDays || 0} days`,
        basePrice: pricingInfo.basePrice,
        discountedPrice: pricingInfo.discountedPrice,
        isEarlyBirdApplicable: pricingInfo.isEarlyBirdApplicable,
        discountPercentage: pricingInfo.discountPercentage,
        endDate: pricingInfo.endDate,
        roomPrice: pricingInfo.roomPrice,
        roomType: pricingInfo.roomType,
        availableRoomTypes: [
          { type: 'shared', price: item.accommodation?.sharedPrice || 0 },
          { type: 'private', price: item.accommodation?.privatePrice || 0 },
          { type: 'camping', price: item.accommodation?.campingPrice || 0 },
          { type: 'glamping', price: item.accommodation?.glampingPrice || 0 }
        ].filter(room => room.price > 0),
        guide: item.guide || "Guide",
        rating: item.reviews && item.reviews.length > 0 
          ? item.reviews.reduce((acc, review) => acc + review.rating, 0) / item.reviews.length 
          : 0,
        reviewCount: item.reviews?.length || 0,
        category: item.tripCategory || "",
        type: "trip"
      };
    } else if (item.itemType === 'event') {
      return {
        title: item.eventTitle || "Untitled Event",
        location: item.destination || "Location not specified",
        image: getItemBestImage(item),
        date: item.eventStartDate,
        duration: item.duration || `${item.durationDays || 0} days`,
        basePrice: item.pricing?.totalPrice || 0,
        discountedPrice: item.pricing?.totalPrice || 0,
        isEarlyBirdApplicable: false,
        discountPercentage: 0,
        endDate: null,
        roomPrice: 0,
        roomType: null,
        availableRoomTypes: [],
        guide: item.guide || "Organizer",
        rating: item.reviews && item.reviews.length > 0 
          ? item.reviews.reduce((acc, review) => acc + review.rating, 0) / item.reviews.length 
          : 0,
        reviewCount: item.reviews?.length || 0,
        category: item.eventCategory || "",
        type: "event"
      };
    } else if (item.itemType === 'school') {
      const minPrice = item.packages && item.packages.length > 0 
        ? Math.min(...item.packages.map(pkg => pkg.price || 0)) 
        : 0;
        
      return {
        title: item.schoolName || "Untitled School",
        location: item.address?.city || "Location not specified",
        image: getItemBestImage(item),
        date: null,
        duration: null,
        basePrice: minPrice,
        discountedPrice: minPrice,
        isEarlyBirdApplicable: false,
        discountPercentage: 0,
        endDate: null,
        roomPrice: 0,
        roomType: null,
        availableRoomTypes: [],
        guide: item.contactPerson || "Contact",
        rating: item.reviews && item.reviews.length > 0 
          ? item.reviews.reduce((acc, review) => acc + review.rating, 0) / item.reviews.length 
          : 0,
        reviewCount: item.reviews?.length || 0,
        category: item.adventureTypes?.[0] || "",
        type: "school"
      };
    }
    return {
      title: "Untitled",
      location: "Location not specified",
      image: 'https://via.placeholder.com/400x300',
      date: null,
      duration: null,
      basePrice: 0,
      discountedPrice: 0,
      isEarlyBirdApplicable: false,
      discountPercentage: 0,
      endDate: null,
      roomPrice: 0,
      roomType: null,
      availableRoomTypes: [],
      guide: "Guide",
      rating: 0,
      reviewCount: 0,
      category: "",
      type: "item"
    };
  };

  const details = getItemDetails();

  // Format date
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

  // Format currency
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

  // Handle room type change
  const handleRoomTypeChange = (roomType) => {
    setSelectedRoomType(roomType);
  };

  // Handle view details click
  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (item.itemType === 'trip') {
      navigate(`/trip/${item._id || item.id}`);
    } else if (item.itemType === 'event') {
      navigate(`/event/${item._id || item.id}`);
    } else if (item.itemType === 'school') {
      navigate(`/adventure-school-details/${item._id || item.id}`);
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
      onClick={() => onClick(item)}
    >
      <div className="relative">
        <img 
          src={details.image} 
          alt={details.title} 
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300';
          }}
        />
        
        {/* Save Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSave(item._id || item.id);
          }}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isSaved ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FiHeart size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
        
        {/* Early Bird Badge */}
        {details.isEarlyBirdApplicable && (
          <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
            <span className="mr-1">★</span>
            Early Bird: {details.discountPercentage}% OFF
          </div>
        )}
        
        {/* Type Badge */}
        <div className={`absolute bottom-4 left-4 text-white text-xs font-bold px-2 py-1 rounded-full ${
          details.isEarlyBirdApplicable ? 'bg-blue-600' : 'bg-black bg-opacity-60'
        }`}>
          {details.type === 'trip' ? 'Trip' : details.type === 'event' ? 'Event' : 'Adventure School'}
        </div>
        
        {/* Category Badge */}
        {details.category && (
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-800 text-xs font-bold px-2 py-1 rounded-full" 
               style={{ top: details.isEarlyBirdApplicable ? '3rem' : '1rem' }}>
            {details.category}
          </div>
        )}
        
        {/* Rating Badge */}
        {details.rating > 0 && (
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-800 text-xs font-bold px-2 py-1 rounded-full flex items-center" 
               style={{ top: (details.isEarlyBirdApplicable && details.category) ? '5rem' : 
                                 (details.isEarlyBirdApplicable || details.category) ? '3rem' : '1rem' }}>
            <FiStar size={12} className="text-yellow-500 mr-1" fill="currentColor" />
            {details.rating.toFixed(1)} ({details.reviewCount})
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-sm font-semibold text-blue-600 mb-1 flex items-center">
              <FiMapPin size={12} className="mr-1" />
              {details.location}
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
              {details.title}
            </h3>
          </div>
          {details.duration && (
            <div className="bg-blue-50 text-blue-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <FiClock size={12} className="mr-1" />
              {details.duration}
            </div>
          )}
        </div>
        
        <div className="flex items-center text-gray-600 mb-4">
          <FiUser size={14} className="mr-2 text-blue-500" />
          {details.guide}
        </div>
        
        {details.date && (
          <div className="flex items-center text-gray-600 mb-4">
            <FiCalendar size={14} className="mr-2" />
            {formatDate(details.date)}
          </div>
        )}
        
        {/* Room Type Selector for Trips */}
        {details.type === 'trip' && details.availableRoomTypes.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-gray-700 mb-2">
              <FiHome size={14} className="mr-2 text-blue-500" />
              <span className="text-sm font-medium">Room Type:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {details.availableRoomTypes.map((room) => (
                <button
                  key={room.type}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoomTypeChange(room.type);
                  }}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedRoomType === room.type
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            {details.isEarlyBirdApplicable ? (
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-gray-500 line-through text-sm">
                    {formatCurrency(details.basePrice)}
                  </span>
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                    Save {details.discountPercentage}%
                  </span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(details.discountedPrice)}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Offer ends {formatDate(details.endDate)}
                </div>
                {details.roomType && (
                  <div className="text-xs text-gray-500 mt-1">
                    {details.roomType.charAt(0).toUpperCase() + details.roomType.slice(1)} Room
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(details.discountedPrice)}
                </div>
                {details.roomType && (
                  <div className="text-xs text-gray-500 mt-1">
                    {details.roomType.charAt(0).toUpperCase() + details.roomType.slice(1)} Room
                  </div>
                )}
              </div>
            )}
          </div>
          <button 
            onClick={handleViewDetails}
            className="flex items-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            <FiEye size={14} />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Filter Panel Component
const FilterPanel = ({ 
  filters, 
  onTypeFilterChange, 
  onMonthFilterChange, 
  onDurationFilterChange, 
  onPriceChange, 
  onExcludeFlexibleChange,
  onApplyFilters,
  onResetFilters 
}) => {
  const monthsData = [
    { id: 'sep2025', label: 'Sep 2025', value: 'september' },
    { id: 'oct2025', label: 'Oct 2025', value: 'october' },
    { id: 'nov2025', label: 'Nov 2025', value: 'november' },
    { id: 'dec2025', label: 'Dec 2025', value: 'december' },
    { id: 'jan2026', label: 'Jan 2026', value: 'january' },
    { id: 'feb2026', label: 'Feb 2026', value: 'february' },
    { id: 'mar2026', label: 'Mar 2026', value: 'march' },
    { id: 'apr2026', label: 'Apr 2026', value: 'april' },
    { id: 'may2026', label: 'May 2026', value: 'may' },
    { id: 'jun2026', label: 'Jun 2026', value: 'june' },
    { id: 'jul2026', label: 'Jul 2026', value: 'july' },
    { id: 'aug2026', label: 'Aug 2026', value: 'august' }
  ];

  return (
    <div className="w-full lg:w-72 bg-white rounded-xl shadow-md p-6 h-fit sticky top-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <FiFilter className="mr-2" /> Filters
        </h3>
      </div>
      
      {/* Trip Type Filter */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3 text-gray-700">Trip Type</h3>
        <div className="space-y-3">
          {[
            { id: 'adventure', label: 'Adventure' },
            { id: 'cultural', label: 'Cultural' },
            { id: 'relaxation', label: 'Relaxation' },
            { id: 'wildlife', label: 'Wildlife' }
          ].map((type) => (
            <div key={type.id} className="flex items-center">
              <input
                type="checkbox"
                id={type.id}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-offset-0"
                checked={filters.types.includes(type.id)}
                onChange={() => onTypeFilterChange(type.id)}
              />
              <label htmlFor={type.id} className="ml-3 text-gray-700 cursor-pointer">
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Departure Month Filter */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3 text-gray-700">Departure Month</h3>
        <div className="grid grid-cols-3 gap-2">
          {monthsData.map((month) => (
            <button
              key={month.id}
              className={`py-2 px-3 text-sm rounded-lg border transition-all duration-200 ${
                filters.months.includes(month.value)
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
              onClick={() => onMonthFilterChange(month.value)}
            >
              {month.label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="exclude-flexible"
            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-offset-0"
            checked={filters.excludeFlexible}
            onChange={onExcludeFlexibleChange}
          />
          <label htmlFor="exclude-flexible" className="ml-3 text-gray-700 cursor-pointer text-sm">
            Exclude flexible departures
          </label>
        </div>
      </div>
      
      {/* Duration Filter */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3 text-gray-700">Duration</h3>
        <div className="space-y-3">
          {[
            { id: '1-3', label: '1-3 days' },
            { id: '4-7', label: '4-7 days' },
            { id: '8-14', label: '1-2 weeks' },
            { id: '15+', label: '3+ weeks' }
          ].map((duration) => (
            <div key={duration.id} className="flex items-center">
              <input
                type="checkbox"
                id={duration.id}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-offset-0"
                checked={filters.durations.includes(duration.id)}
                onChange={() => onDurationFilterChange(duration.id)}
              />
              <label htmlFor={duration.id} className="ml-3 text-gray-700 cursor-pointer">
                {duration.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3 text-gray-700">Price Range (₹)</h3>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            placeholder="Min"
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.minPrice}
            onChange={(e) => onPriceChange(e, 'minPrice')}
          />
          <span className="text-gray-500 font-medium">—</span>
          <input
            type="number"
            placeholder="Max"
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.maxPrice}
            onChange={(e) => onPriceChange(e, 'maxPrice')}
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <button 
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
          onClick={onApplyFilters}
        >
          Apply Filters
        </button>
        <button 
          className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-300"
          onClick={onResetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

// Main Component
const AllTripsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get state from Redux
  const { trips, events, schools, loading, error } = useSelector(state => state.items);
  const { searchTerm, searchType, sortOption, showSortOptions, filters } = useSelector(state => state.filter);
  const savedItems = useSelector(state => state.savedItems.items);
  
  // Local state
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchPublishedTrips());
    dispatch(fetchPublishedEvents());
    dispatch(fetchPublishedSchools());
  }, [dispatch]);
  
  // Handle saving/un-saving an item
  const handleSaveItem = (itemId) => {
    dispatch(toggleSavedItem(itemId));
  };
  
  // Handle filter changes
  const handleTypeFilterChange = (type) => {
    const types = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    dispatch(updateFilter({ filterType: 'types', value: types }));
  };

  const handleMonthFilterChange = (monthValue) => {
    const months = filters.months.includes(monthValue)
      ? filters.months.filter(m => m !== monthValue)
      : [...filters.months, monthValue];
    dispatch(updateFilter({ filterType: 'months', value: months }));
  };

  const handleDurationFilterChange = (duration) => {
    const durations = filters.durations.includes(duration)
      ? filters.durations.filter(d => d !== duration)
      : [...filters.durations, duration];
    dispatch(updateFilter({ filterType: 'durations', value: durations }));
  };

  const handlePriceChange = (e, type) => {
    const value = e.target.value;
    dispatch(updateFilter({ filterType: type, value }));
  };

  const handleExcludeFlexibleChange = (e) => {
    dispatch(updateFilter({ filterType: 'excludeFlexible', value: e.target.checked }));
  };

  const handleApplyFilters = () => {
    console.log("Applying filters:", filters);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  // Handle sort option change
  const handleSortChange = (option) => {
    dispatch(setSortOption(option));
    dispatch(toggleSortOptions());
  };

  // Handle item card click
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  // Combine all items and filter/sort them using useMemo for performance
  const processedItems = useMemo(() => {
    let allItems = [
      ...trips.map(trip => ({ ...trip, itemType: 'trip' })),
      ...events.map(event => ({ ...event, itemType: 'event' })),
      ...schools.map(school => ({ ...school, itemType: 'school' }))
    ];
    
    // Apply search based on search type
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      allItems = allItems.filter(item => {
        if (searchType === 'trip' && item.itemType === 'trip') {
          return (item.tripTitle?.toLowerCase().includes(term) || 
                 item.destination?.toLowerCase().includes(term));
        } else if (searchType === 'event' && item.itemType === 'event') {
          return (item.eventTitle?.toLowerCase().includes(term) || 
                 item.guide?.toLowerCase().includes(term));
        } else if (searchType === 'adventure' && item.itemType === 'school') {
          return (item.schoolName?.toLowerCase().includes(term) || 
                 item.adventureTypes?.some(type => type.toLowerCase().includes(term)));
        }
        return false;
      });
    }
    
    // Apply filters
    if (filters.types.length > 0) {
      allItems = allItems.filter(item => {
        if (item.itemType === 'trip') {
          return filters.types.includes(item.type?.toLowerCase());
        } else if (item.itemType === 'event') {
          return filters.types.includes(item.eventCategory?.toLowerCase());
        } else if (item.itemType === 'school') {
          return item.adventureTypes?.some(type => 
            filters.types.includes(type.toLowerCase())
          );
        }
        return false;
      });
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'departure-soon':
        allItems.sort((a, b) => {
          const dateA = a.tripStartDate || a.eventStartDate || new Date();
          const dateB = b.tripStartDate || b.eventStartDate || new Date();
          return new Date(dateA) - new Date(dateB);
        });
        break;
      case 'departure-late':
        allItems.sort((a, b) => {
          const dateA = a.tripStartDate || a.eventStartDate || new Date();
          const dateB = b.tripStartDate || b.eventStartDate || new Date();
          return new Date(dateB) - new Date(dateA);
        });
        break;
      case 'price-low':
        allItems.sort((a, b) => {
          const priceA = a.itemType === 'trip' 
            ? calculateTripTotalPrice(a, 'shared').discountedPrice 
            : a.itemType === 'event' 
              ? a.pricing?.totalPrice || 0
              : a.packages && a.packages.length > 0 
                ? Math.min(...a.packages.map(pkg => pkg.price || 0))
                : 0;
                
          const priceB = b.itemType === 'trip' 
            ? calculateTripTotalPrice(b, 'shared').discountedPrice 
            : b.itemType === 'event' 
              ? b.pricing?.totalPrice || 0
              : b.packages && b.packages.length > 0 
                ? Math.min(...b.packages.map(pkg => pkg.price || 0))
                : 0;
                
          return priceA - priceB;
        });
        break;
      case 'price-high':
        allItems.sort((a, b) => {
          const priceA = a.itemType === 'trip' 
            ? calculateTripTotalPrice(a, 'shared').discountedPrice 
            : a.itemType === 'event' 
              ? a.pricing?.totalPrice || 0
              : a.packages && a.packages.length > 0 
                ? Math.min(...a.packages.map(pkg => pkg.price || 0))
                : 0;
                
          const priceB = b.itemType === 'trip' 
            ? calculateTripTotalPrice(b, 'shared').discountedPrice 
            : b.itemType === 'event' 
              ? b.pricing?.totalPrice || 0
              : b.packages && b.packages.length > 0 
                ? Math.min(...b.packages.map(pkg => pkg.price || 0))
                : 0;
                
          return priceB - priceA;
        });
        break;
      case 'duration-short':
        allItems.sort((a, b) => {
          const durationA = a.durationDays || 1;
          const durationB = b.durationDays || 1;
          return durationA - durationB;
        });
        break;
      case 'duration-long':
        allItems.sort((a, b) => {
          const durationA = a.durationDays || 1;
          const durationB = b.durationDays || 1;
          return durationB - durationA;
        });
        break;
      default:
        break;
    }
    
    return allItems;
  }, [trips, events, schools, searchTerm, searchType, filters, sortOption]);

  // Update filtered items when processed items change
  useEffect(() => {
    setFilteredItems(processedItems);
  }, [processedItems]);

  // Get sort option display text
  const getSortOptionText = () => {
    switch (sortOption) {
      case 'departure-soon': return 'Departure: Soon';
      case 'departure-late': return 'Departure: Late';
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      case 'duration-short': return 'Duration: Short to Long';
      case 'duration-long': return 'Duration: Long to Short';
      default: return 'Departure: Soon';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header with search bar */}
      <header className="bg-white shadow-sm py-8 mb-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">Discover Your Next Adventure</h1>
          <SearchBar 
            searchTerm={searchTerm} 
            searchType={searchType}
            onSearchTermChange={(term) => dispatch(setSearchTerm(term))}
            onSearchTypeChange={(type) => dispatch(setSearchType(type))}
          />
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <FilterPanel 
          filters={filters}
          onTypeFilterChange={handleTypeFilterChange}
          onMonthFilterChange={handleMonthFilterChange}
          onDurationFilterChange={handleDurationFilterChange}
          onPriceChange={handlePriceChange}
          onExcludeFlexibleChange={handleExcludeFlexibleChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {filteredItems.length} {filteredItems.length === 1 ? 'Item' : 'Items'} Available
            </h2>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 py-3 px-5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => dispatch(toggleSortOptions())}
              >
                <span className="font-medium text-gray-700">{getSortOptionText()}</span>
                {showSortOptions ? <FiChevronUp className="h-5 w-5 text-gray-500" /> : <FiChevronDown className="h-5 w-5 text-gray-500" />}
              </button>
              
              {showSortOptions && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  {[
                    { id: 'departure-soon', label: 'Departure: Soon' },
                    { id: 'departure-late', label: 'Departure: Late' },
                    { id: 'price-low', label: 'Price: Low to High' },
                    { id: 'price-high', label: 'Price: High to Low' },
                    { id: 'duration-short', label: 'Duration: Short to Long' },
                    { id: 'duration-long', label: 'Duration: Long to Short' }
                  ].map((option) => (
                    <div
                      key={option.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                      onClick={() => handleSortChange(option.id)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Item Cards Grid */}
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <ItemCard 
                  key={`${item.itemType}-${item._id}`} 
                  item={item} 
                  onClick={handleItemClick}
                  isSaved={savedItems.includes(item._id || item.id)}
                  onSave={handleSaveItem}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Item Detail Modal */}
      {showModal && selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={closeModal}
          isSaved={savedItems.includes(selectedItem._id || selectedItem.id)}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
};

export default AllTripsPage;