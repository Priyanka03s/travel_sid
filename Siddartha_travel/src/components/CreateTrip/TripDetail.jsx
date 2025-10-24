import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FiImage,
  FiCalendar,
  FiUsers,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiInfo,
  FiMap,
  FiCamera,
  FiBookOpen,
  FiFileText,
  FiPlusCircle,
  FiArrowLeft,
  FiCheck,
  FiX,
  FiShare2,
  FiHeart,
  FiHome,
  FiCoffee,
  FiUserX,
  FiLink,
  FiClipboard,
  FiTruck,
  FiNavigation,
  FiActivity,
  FiTag,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";
import PaymentComponent from "../../pages/Payment.jsx";
import api from "../../services/api";

export default function TripDetail({ fallbackTrip = {} }) {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [trip, setTrip] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedAccommodationType, setSelectedAccommodationType] = useState("private");
  
  const sectionRefs = {
    overview: useRef(null),
    itinerary: useRef(null),
    accommodation: useRef(null),
    pricing: useRef(null),
    gallery: useRef(null),
    booking: useRef(null),
    policies: useRef(null),
    extras: useRef(null),
    faqs: useRef(null),
  };

  useEffect(() => {
    const fetchTrip = async () => {
      if (trip && (trip.id === tripId || trip._id === tripId)) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await api.get(`/trips/${tripId}`);
        setTrip(response.data);
        
        const savedRaw = localStorage.getItem("savedTrips");
        const savedList = savedRaw ? JSON.parse(savedRaw) : [];
        const savedFlag = Array.isArray(savedList) ? savedList.includes(tripId) : false;
        setIsSaved(Boolean(savedFlag));
        setError(null);
      } catch (e) {
        console.error("Error reading trip:", e);
        setError("Failed to load trip details");
        if (fallbackTrip && Object.keys(fallbackTrip).length > 0) {
          setTrip(fallbackTrip);
        } else {
          setTrip(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (tripId) {
      fetchTrip();
    } else {
      setLoading(false);
      setError("No trip ID provided");
    }
  }, [tripId, fallbackTrip, trip]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      let currentSection = "overview";
      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (ref.current && ref.current.offsetTop <= scrollPosition) {
          currentSection = section;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    if (sectionRefs[sectionId] && sectionRefs[sectionId].current) {
      window.scrollTo({
        top: sectionRefs[sectionId].current.offsetTop - 20,
        behavior: "smooth",
      });
    }
  };

  const formatPlace = (place) => {
    if (!place) return "";
    if (typeof place === "string") return place;
    return [place.city, place.state, place.country].filter(Boolean).join(", ");
  };

  const safe = useMemo(() => {
    if (!trip) return null;
    
    const td = trip;
    return {
      // Basic Details
      tripTitle: td.tripTitle || "Untitled Trip",
      bannerImage: td.bannerImage || "",
      tripCategory: td.tripCategory || "",
      groupType: td.groupType || "public",
      privateSharingOption: td.privateSharingOption || "",
      isPublic: !!td.isPublic,
      tripStartDate: td.tripStartDate || "",
      tripEndDate: td.tripEndDate || "",
      tripDates: Array.isArray(td.tripDates) ? td.tripDates : [],
      meetingLocation: td.meetingLocation || "",
      destination: td.destination || "",
      sameAsPickup: td.sameAsPickup || false,
      description: td.description || "",
      
      // Itinerary
      itineraryType: td.itineraryType || "freeText",
      itineraryText: td.itineraryText || "",
      stops: Array.isArray(td.stops) ? td.stops : [],
      accommodation: td.accommodation || {
        sharedImage: null,
        sharedPrice: 0,
        sharedName: "",
        sharedDays: [],
        privateImage: null,
        privatePrice: 0,
        privateName: "",
        privateDays: [],
        campingImage: null,
        campingPrice: 0,
        campingName: "",
        campingDays: [],
        glampingImage: null,
        glampingPrice: 0,
        glampingName: "",
        glampingDays: [],
        settleToVendor: false,
      },
      mealPlans: Array.isArray(td.mealPlans) ? td.mealPlans : [],
      inclusions: Array.isArray(td.inclusions) ? td.inclusions : [],
      exclusions: Array.isArray(td.exclusions) ? td.exclusions : [],
      faqs: Array.isArray(td.faqs) ? td.faqs : [],
      structuredItinerary: Array.isArray(td.structuredItinerary)
        ? td.structuredItinerary
        : [],

      // Pricing
      pricing: td.pricing || {},
      basePrice: td.basePrice || 0,
      discountPrice: td.discountPrice || null,
      discountDeadline: td.discountDeadline || null,
      allowEarlyBooking: !!td.allowEarlyBooking,
      earlyBookingDiscount: td.earlyBookingDiscount || 0,
      earlyBookingEndDate: td.earlyBookingEndDate || "",

      // Logistics
      minParticipants: td.minParticipants || null,
      maxParticipants: td.maxParticipants || null,
      allowEarlyBooking: td.allowEarlyBooking || false,
      allowEarlyParticipants: td.allowEarlyParticipants || false,
      earlyBookingLimit: td.earlyBookingLimit || null,
      allowPreviousParticipation: td.allowPreviousParticipation || false,
      bookingDeadline: td.bookingDeadline || "",
      bookingTimeline: td.bookingTimeline || {},
      bookingStartDate: td.bookingStartDate || "",
      bookingEndDate: td.bookingEndDate || "",
      paymentType: td.paymentType || "full",
      fullPaymentBookingStart: td.fullPaymentBookingStart || "",
      fullPaymentBookingEnd: td.fullPaymentBookingEnd || "",
      partialPaymentStart: td.partialPaymentStart || "",
      partialPaymentEnd: td.partialPaymentEnd || "",
      initialPaymentPercentage: td.initialPaymentPercentage || 0,
      additionalPayments: Array.isArray(td.additionalPayments)
        ? td.additionalPayments
        : [],
      paymentRequirement: td.paymentRequirement || {
        type: "full",
        percentage: 0,
      },
      noAgeLimit: td.noAgeLimit || false,
      ageGroup: td.ageGroup || { min: undefined, max: undefined },
      minAge: td.minAge || null,
      maxAge: td.maxAge || null,
      genderPreferences: td.genderPreferences || {},
      cancellationEnabled: !!td.cancellationEnabled,
      cancellationRules: Array.isArray(td.cancellationRules)
        ? td.cancellationRules
        : [],
      socialGroupLinks: Array.isArray(td.socialGroupLinks)
        ? td.socialGroupLinks
        : ["", "", "", ""],
      additionalLinks: Array.isArray(td.additionalLinks)
        ? td.additionalLinks
        : [],
      registrationFormLink: td.registrationFormLink || "",
      tripTags: Array.isArray(td.tripTags) ? td.tripTags : [],
      visaRequired: td.visaRequired || false,
      visaDocuments: Array.isArray(td.visaDocuments) ? td.visaDocuments : [],
      visaProcess: td.visaProcess || {},
      transportOptions: Array.isArray(td.transportOptions)
        ? td.transportOptions
        : [],
      additionalFields: Array.isArray(td.additionalFields)
        ? td.additionalFields
        : [],

      id: td.id || td._id,
      status: td.status,
      publishedDate: td.publishedDate,
      bookings: td.bookings || 0,
      reviews: Array.isArray(td.reviews) ? td.reviews : [],
      savedCount: td.savedCount || 0,
      createdBy: td.createdBy || {},
    };
  }, [trip]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const formatDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  const computePricingTotalLocal = (pricing = {}, accommodationData = null, selectedType = "private") => {
    const sumItems = (items = []) =>
      (items || []).reduce((s, it) => s + (Number(it?.cost) || 0), 0);

    let accommodationSum = 0;
    
    if (pricing.accommodation) {
      accommodationSum = Number(pricing.accommodation);
    } else if (pricing.accommodationItems && pricing.accommodationItems.length > 0) {
      accommodationSum = sumItems(pricing.accommodationItems);
    } else if (accommodationData) {
      const acc = accommodationData || {};
      const typePrice = acc[`${selectedType}Price`] || 0;
      const typeDays = acc[`${selectedType}Days`] || [];
      const typeTotal = typePrice + typeDays.reduce((sum, day) => sum + (day.price || 0), 0);
      
      accommodationSum = typeTotal;
      
      if (accommodationSum === 0) {
        accommodationSum = selectedType === "shared" ? 1000 : 
                          selectedType === "private" ? 2000 :
                          selectedType === "camping" ? 800 : 1500;
      }
    } else {
      accommodationSum = selectedType === "shared" ? 1000 : 
                        selectedType === "private" ? 2000 :
                        selectedType === "camping" ? 800 : 1500;
    }

    const transportationSum =
      Number(pricing.transportation) || sumItems(pricing.transportationItems || []);
    const activitiesSum =
      Number(pricing.activities) || sumItems(pricing.activityItems || []);
    const bufferPercentage = Number(pricing.bufferPercentage) || 0;
    const yourFee = Number(pricing.yourFee) || 0;

    const subtotal = accommodationSum + transportationSum + activitiesSum;
    const bufferAmount = subtotal * (bufferPercentage / 100);
    const total = subtotal + bufferAmount + yourFee;

    return {
      accommodationSum,
      transportationSum,
      activitiesSum,
      subtotal,
      bufferAmount,
      yourFee,
      total,
    };
  };

  const calculateTotalPrice = () => {
    if (!safe) return 0;
    
    if (safe.basePrice && safe.basePrice > 0) {
      return safe.basePrice;
    }
    
    const pricing = safe.pricing || {};
    const accommodationData = safe.accommodation || {};
    
    const pricingData = computePricingTotalLocal(pricing, accommodationData, selectedAccommodationType);
    return pricingData.total;
  };

  const displayPrice = useMemo(() => {
    return calculateTotalPrice();
  }, [safe, selectedAccommodationType]);

  const earlyBirdPricing = useMemo(() => {
    if (!safe) return null;
    
    const isEarlyBirdApplicable = safe.allowEarlyBooking && 
                                 safe.earlyBookingDiscount > 0 &&
                                 safe.earlyBookingEndDate &&
                                 new Date() < new Date(safe.earlyBookingEndDate);
    
    if (!isEarlyBirdApplicable) {
      return {
        isEarlyBirdApplicable: false,
        basePrice: displayPrice,
        discountedPrice: displayPrice,
        discountPercentage: 0,
        endDate: null
      };
    }
    
    const discountedPrice = displayPrice * (1 - safe.earlyBookingDiscount / 100);
    
    return {
      isEarlyBirdApplicable: true,
      basePrice: displayPrice,
      discountedPrice,
      discountPercentage: safe.earlyBookingDiscount,
      endDate: safe.earlyBookingEndDate
    };
  }, [safe, displayPrice]);

  const calculateDuration = () => {
    if (!safe || !safe.tripStartDate) return 0;
    try {
      const start = new Date(safe.tripStartDate);
      const end = safe.tripEndDate
        ? new Date(safe.tripEndDate)
        : start;
      const diffMs = end - start;
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return days >= 0 ? days + 1 : 0;
    } catch {
      return 0;
    }
  };

  const extractLinkHref = (l) => {
    if (!l) return "";
    if (typeof l === "string") return l;
    if (typeof l === "object") return l.url || l.value || l.href || "";
    return String(l);
  };

  const extractLinkLabel = (l) => {
    if (!l) return "";
    if (typeof l === "string") return l;
    if (typeof l === "object")
      return (
        l.label || l.name || l.value || l.url || l.type || JSON.stringify(l)
      );
    return String(l);
  };

  const normalizeTag = (t) => {
    if (typeof t === "string") return t;
    if (typeof t === "object") return t.label || t.name || JSON.stringify(t);
    return String(t);
  };

  const renderPricingBreakdown = () => {
    if (!safe) return null;
    
    const pricing = safe.pricing || {};
    const accommodationData = safe.accommodation || {};
    const pricingData = computePricingTotalLocal(pricing, accommodationData, selectedAccommodationType);
    
    return (
      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between text-sm">
          <span>Accommodation ({selectedAccommodationType})</span>
          <span>{formatCurrency(pricingData.accommodationSum)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Transportation</span>
          <span>{formatCurrency(pricingData.transportationSum)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Activities</span>
          <span>{formatCurrency(pricingData.activitiesSum)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Buffer ({pricing.bufferPercentage || 0}%)</span>
          <span>{formatCurrency(pricingData.bufferAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Organizer fee</span>
          <span>{formatCurrency(pricingData.yourFee)}</span>
        </div>
        <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
          <span>Computed total</span>
          <span>{formatCurrency(pricingData.total)}</span>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Accommodation Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {["shared", "private", "camping", "glamping"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedAccommodationType(type)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedAccommodationType === type
                    ? "bg-indigo-100 text-indigo-700 font-medium"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getTravelModeIcon = (mode) => {
    switch (mode) {
      case "bus": return <FiTruck className="text-gray-500" />;
      case "car": return <FiNavigation className="text-gray-500" />;
      case "train": return <FiNavigation className="text-gray-500" />;
      case "flight": return <FiNavigation className="text-gray-500" />;
      case "walking": return <FiActivity className="text-gray-500" />;
      case "bike": return <FiNavigation className="text-gray-500" />;
      case "boat": return <FiMap className="text-gray-500" />;
      default: return <FiTruck className="text-gray-500" />;
    }
  };

  const renderAccommodationDetails = () => {
    if (!safe.accommodation) return null;

    const renderAccommodationType = (type, title, icon) => {
      const basePrice = safe.accommodation[`${type}Price`] || 0;
      const baseName = safe.accommodation[`${type}Name`] || "";
      const image = safe.accommodation[`${type}Image`];
      const days = safe.accommodation[`${type}Days`] || [];
      
      const total = basePrice + days.reduce((sum, day) => sum + (day.price || 0), 0);
      
      if (basePrice <= 0 && days.length === 0) return null;

      return (
        <div className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all ${
          selectedAccommodationType === type 
            ? 'border-blue-500 bg-blue-50 shadow-md' 
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
        onClick={() => setSelectedAccommodationType(type)}
        >
          <div className="flex items-center mb-3">
            <span className="text-xl mr-2">{icon}</span>
            <h4 className="font-bold text-gray-700">{title}</h4>
            {selectedAccommodationType === type && (
              <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">Selected</span>
            )}
          </div>
          
          {image && (
            <img
              src={image}
              alt={`${title} preview`}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
          )}
          
          <div className="mb-3">
            <h5 className="font-medium text-gray-700 mb-1">Accommodation Name</h5>
            <p className="text-gray-600">{baseName || "Not specified"}</p>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium text-gray-700 mb-2">Pricing Details</h5>
            
            {basePrice > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Day 1</span>
                <span className="font-medium">{formatCurrency(basePrice)}</span>
              </div>
            )}
            
            {days.length > 0 && days.map((day, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                <div>
                  <span className="text-gray-600">Day {day.day}</span>
                  {day.name && (
                    <div className="text-sm text-gray-500">{day.name}</div>
                  )}
                </div>
                <span className="font-medium">{formatCurrency(day.price || 0)}</span>
              </div>
            ))}
            
            <div className="flex justify-between py-2 mt-2 font-bold">
              <span>Total</span>
              <span className="text-blue-700">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
          <FiHome className="text-gray-500" /> Accommodation Details
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderAccommodationType("shared", "Shared Rooms", "👥")}
          {renderAccommodationType("private", "Private Rooms", "🏠")}
          {renderAccommodationType("camping", "Camping", "⛺")}
          {renderAccommodationType("glamping", "Glamping", "🏕️")}
        </div>
        
        {safe.accommodation.settleToVendor && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Payment will be settled directly with vendor
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderFAQs = () => {
    if (!safe.faqs || safe.faqs.length === 0) return null;

    return (
      <section
        id="faqs"
        ref={sectionRefs.faqs}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiInfo size={20} className="text-indigo-600" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {safe.faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-100 pb-4 last:border-0"
            >
              <h3 className="font-medium text-gray-800">{faq.question}</h3>
              <p className="text-gray-600 mt-1">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const handleSaveTrip = () => {
    if (!tripId) return;
    
    const savedRaw = localStorage.getItem("savedTrips");
    let savedList = savedRaw ? JSON.parse(savedRaw) : [];
    
    if (!Array.isArray(savedList)) {
      savedList = [];
    }
    
    if (isSaved) {
      savedList = savedList.filter(id => id !== tripId);
    } else {
      savedList.push(tripId);
    }
    
    localStorage.setItem("savedTrips", JSON.stringify(savedList));
    setIsSaved(!isSaved);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Error Loading Trip
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Trip not found
          </h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-2">
                <button
                  onClick={() => navigate(-1)}
                  className="text-sm underline text-red-600"
                >
                  Go back to edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative h-96 bg-black/5">
        {safe.bannerImage ? (
          <img
            src={safe.bannerImage}
            alt="banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-100 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <FiImage className="mx-auto w-12 h-12 mb-2" />
              <div>No banner image</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    {safe.groupType}
                  </span>
                  {safe.tripCategory && (
                    <span className="px-3 py-1 bg-indigo-500 rounded-full text-xs font-medium">
                      {safe.tripCategory}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {safe.tripTitle}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                  <div className="flex items-center gap-1">
                    <FiMapPin size={14} />
                    <span>{safe.destination}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    <span>
                      {formatDate(safe.tripStartDate)}
                      {safe.tripEndDate
                        ? ` - ${formatDate(safe.tripEndDate)}`
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiUsers size={14} />
                    <span>
                      {safe.minParticipants ?? 0} -{" "}
                      {safe.maxParticipants ?? "∞"} travelers
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <FiShare2 size={18} />
                </button>
                <button
                  className={`p-2 rounded-full transition-colors ${
                    isSaved ? "bg-red-500" : "bg-white/20 hover:bg-white/30"
                  }`}
                  onClick={handleSaveTrip}
                >
                  <FiHeart size={18} fill={isSaved ? "white" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <section
            id="overview"
            ref={sectionRefs.overview}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiInfo size={20} className="text-indigo-600" />
              Overview
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">
                {safe.description || "No overview provided"}
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Meeting Point</div>
                  <div className="font-medium">
                    {safe.meetingLocation || "N/A"}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <FiUsers size={18} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Group Size</div>
                  <div className="font-medium">
                    {safe.minParticipants ?? 0} -{" "}
                    {safe.maxParticipants ?? "∞"} travelers
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <FiCalendar size={18} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-medium">
                    {calculateDuration() > 0 ? `${calculateDuration()} days` : "N/A"}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <FiDollarSign size={18} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Starting From</div>
                  {earlyBirdPricing.isEarlyBirdApplicable ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 line-through">
                        {formatCurrency(earlyBirdPricing.basePrice)}
                      </span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(earlyBirdPricing.discountedPrice)}
                      </span>
                    </div>
                  ) : (
                    <div className="font-medium">
                      {formatCurrency(displayPrice)}
                    </div>
                  )}
                  <span className="text-xs text-gray-500 ml-1">
                    ({selectedAccommodationType})
                  </span>
                </div>
              </div>
            </div>
            {safe.tripTags.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Trip Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {safe.tripTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {normalizeTag(tag)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section
            id="itinerary"
            ref={sectionRefs.itinerary}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiMap size={20} className="text-indigo-600" />
              Itinerary
            </h2>
            {safe.itineraryText ? (
              <div className="prose max-w-none whitespace-pre-line text-gray-700">
                {safe.itineraryText}
              </div>
            ) : safe.structuredItinerary.length > 0 ? (
              <div className="space-y-6">
                {safe.structuredItinerary.map((day, idx) => (
                  <div key={idx} className="p-5 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-medium text-lg">
                          Day {day.day ?? idx + 1}: {day.title || "Untitled"}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <FiCalendar size={14} />
                          {day.date
                            ? formatDate(day.date)
                            : "No date specified"}
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          day.completed
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {day.completed ? "Completed" : "Planned"}
                      </div>
                    </div>
                    
                    {day.travelMode && (
                      <div className="mt-2 flex items-center text-xs bg-blue-50 p-2 rounded-md mb-3">
                        {getTravelModeIcon(day.travelMode)}
                        <span className="ml-2 font-medium text-blue-700">
                          Travel Mode: {day.travelMode.charAt(0).toUpperCase() + day.travelMode.slice(1)}
                        </span>
                      </div>
                    )}
                    
                    {day.overview && (
                      <p className="text-gray-700 mb-4">{day.overview}</p>
                    )}
                    {Array.isArray(day.stops) && day.stops.length > 0 ? (
                      <ul className="space-y-4">
                        {day.stops.map((s, i) => (
                          <li
                            key={i}
                            className="p-4 border rounded-md bg-gray-50"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium flex items-center gap-2">
                                  {s.time && (
                                    <span className="text-sm bg-white py-1 px-2 rounded">
                                      {s.time}
                                    </span>
                                  )}
                                  {s.name || "Unnamed"}
                                </div>
                                {s.place && (
                                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                    <FiMapPin size={12} /> {formatPlace(s.place)}
                                  </div>
                                )}
                                {s.description && (
                                  <div className="text-sm mt-2 text-gray-700">
                                    {s.description}
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 text-right">
                                {s.isMicroTrip ? (
                                  <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">
                                    Micro Trip:{" "}
                                    {formatCurrency(s.microTripPrice)}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            {s.image && (
                              <img
                                src={s.image}
                                alt={s.name}
                                className="mt-3 w-full h-48 object-cover rounded-lg"
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No stops for this day
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No itinerary provided</p>
            )}
          </section>

          <section
            id="accommodation"
            ref={sectionRefs.accommodation}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            {renderAccommodationDetails()}
          </section>

          <section
            id="pricing"
            ref={sectionRefs.pricing}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiDollarSign size={20} className="text-indigo-600" />
              Pricing Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Price Breakdown</h3>
                {renderPricingBreakdown()}
              </div>
              <div>
                <h3 className="font-medium mb-3">Final Pricing</h3>
                <div className="bg-indigo-50 p-5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-700">Price per person</div>
                    {earlyBirdPricing.isEarlyBirdApplicable ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 line-through">
                          {formatCurrency(earlyBirdPricing.basePrice)}
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(earlyBirdPricing.discountedPrice)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-indigo-700">
                        {formatCurrency(displayPrice)}
                      </div>
                    )}
                  </div>
                  {earlyBirdPricing.isEarlyBirdApplicable && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-green-800">
                            Early Bird Discount
                          </div>
                          <div className="text-sm text-green-700">
                            {earlyBirdPricing.discountPercentage}% off until {formatDate(earlyBirdPricing.endDate)}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-green-800">
                          {formatCurrency(earlyBirdPricing.discountedPrice)}
                        </div>
                      </div>
                    </div>
                  )}
                  {safe.allowEarlyBooking && !earlyBirdPricing.isEarlyBirdApplicable && safe.earlyBookingDiscount > 0 && (
                    <div className="mt-3 text-sm text-amber-700 bg-amber-50 p-2 rounded">
                      Early bird {safe.earlyBookingDiscount}% discount was available until {formatDate(safe.earlyBookingEndDate)}
                    </div>
                  )}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <div className="font-medium mb-2">What's included:</div>
                  <ul className="space-y-1">
                    {safe.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <FiCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                  {safe.exclusions.length > 0 && (
                    <>
                      <div className="font-medium mb-2 mt-4">Not included:</div>
                      <ul className="space-y-1">
                        {safe.exclusions.map((exc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <FiX className="text-red-500 mt-0.5 flex-shrink-0" />
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section
            id="gallery"
            ref={sectionRefs.gallery}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiCamera size={20} className="text-indigo-600" />
              Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {safe.bannerImage ? (
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={safe.bannerImage}
                    alt="banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <FiImage size={24} />
                </div>
              )}
              {safe.accommodation?.sharedImage ? (
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={safe.accommodation.sharedImage}
                    alt="shared accommodation"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}
              {safe.accommodation?.privateImage ? (
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={safe.accommodation.privateImage}
                    alt="private accommodation"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}
              {safe.structuredItinerary
                .flatMap((d) => d.stops || [])
                .slice(0, 8)
                .map((s, i) =>
                  s.image ? (
                    <div
                      key={i}
                      className="aspect-square overflow-hidden rounded-lg"
                    >
                      <img
                        src={s.image}
                        alt={s.name || "stop"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"
                    >
                      <FiImage size={24} />
                    </div>
                  )
                )}
            </div>
          </section>

          <section
            id="booking"
            ref={sectionRefs.booking}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiBookOpen size={20} className="text-indigo-600" />
              Booking & Payments
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Booking Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-0.5">
                      <FiClock size={16} />
                    </div>
                    <div>
                      <div className="font-medium">Booking Process</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {safe.bookingProcess}
                      </div>
                    </div>
                  </div>
                  {safe.bookingDeadline && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-0.5">
                        <FiCalendar size={16} />
                      </div>
                      <div>
                        <div className="font-medium">Booking Deadline</div>
                        <div className="text-sm text-gray-600">
                          {formatDate(safe.bookingDeadline)}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-0.5">
                      <FiUsers size={16} />
                    </div>
                    <div>
                      <div className="font-medium">Group Size</div>
                      <div className="text-sm text-gray-600">
                        {safe.minParticipants ?? 0} –{" "}
                        {safe.maxParticipants ?? "∞"} participants
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Payment Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-0.5">
                      <FiDollarSign size={16} />
                    </div>
                    <div>
                      <div className="font-medium">Payment Type</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {safe.paymentType}
                      </div>
                    </div>
                  </div>
                  {safe.additionalPayments.length > 0 && (
                    <div>
                      <div className="font-medium mb-2">Installment Plan</div>
                      <div className="space-y-2">
                        {safe.additionalPayments.map((p, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded"
                          >
                            <span>{p.percentage}% payment</span>
                            <span className="text-gray-500">
                              {formatDate(p.date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section
            id="policies"
            ref={sectionRefs.policies}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiFileText size={20} className="text-indigo-600" />
              Policies
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {safe.cancellationEnabled && safe.cancellationRules.length > 0 ? (
                <div>
                  <h3 className="font-medium mb-3">Cancellation Policy</h3>
                  <div className="space-y-3">
                    {safe.cancellationRules.map((r, i) => (
                      <div key={i} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">
                            {r.daysBefore} day(s) before trip
                          </span>
                          <span
                            className={`font-semibold ${
                              r.percentage > 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {r.percentage ?? 0}% charge
                          </span>
                        </div>
                        {r.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {r.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium mb-3">Cancellation Policy</h3>
                  <p className="text-sm text-gray-500">
                    No cancellation policy provided.
                  </p>
                </div>
              )}
              {safe.visaRequired && (
                <div>
                  <h3 className="font-medium mb-3">Visa Assistance</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="mb-3">
                      <div className="text-sm text-gray-500">
                        Processing Time
                      </div>
                      <div className="font-medium">
                        {safe.visaProcess?.processingTimeFrom ?? "—"} –{" "}
                        {safe.visaProcess?.processingTimeTo ?? "—"} days
                      </div>
                    </div>
                    {safe.visaDocuments.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-500 mb-2">
                          Required Documents
                        </div>
                        <ul className="space-y-1">
                          {safe.visaDocuments.map((doc, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm"
                            >
                              <FiCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section
            id="extras"
            ref={sectionRefs.extras}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiPlusCircle size={20} className="text-indigo-600" />
              Extras
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {safe.transportOptions.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Transport Options</h3>
                  <div className="space-y-3">
                    {safe.transportOptions.map((t, i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium capitalize">{t.type}</div>
                          <div className="font-semibold">
                            {t.cost ? formatCurrency(t.cost) : "—"}
                          </div>
                        </div>
                        {t.departureDate && (
                          <div className="text-sm text-gray-600 mb-2">
                            Departure: {formatDate(t.departureDate)} {t.departureTime || ""}
                          </div>
                        )}
                        {t.description && (
                          <div className="text-sm text-gray-700">
                            {t.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {safe.mealPlans.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Meal Plans</h3>
                  <div className="space-y-2">
                    {safe.mealPlans.map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span>
                          {m.type
                            ? `${m.type}${m.day ? ` (Day ${m.day})` : ""}`
                            : String(m)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {safe.registrationFormLink && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Registration Form</h3>
                <a
                  href={safe.registrationFormLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {safe.registrationFormLink}
                </a>
              </div>
            )}
            
            {Object.keys(safe.genderPreferences || {}).length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Group Preferences</h3>
                <div className="p-4 border rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    {safe.genderPreferences?.male?.allowed && (
                      <div>
                        <div className="text-sm text-gray-500">
                          Male Travelers
                        </div>
                        <div className="font-medium">
                          {safe.genderPreferences.male.count}
                        </div>
                      </div>
                    )}
                    {safe.genderPreferences?.female?.allowed && (
                      <div>
                        <div className="text-sm text-gray-500">
                          Female Travelers
                        </div>
                        <div className="font-medium">
                          {safe.genderPreferences.female.count}
                        </div>
                      </div>
                    )}
                    {safe.genderPreferences?.kids?.allowed && (
                      <div>
                        <div className="text-sm text-gray-500">Children</div>
                        <div className="font-medium">
                          {safe.genderPreferences.kids.count}
                        </div>
                      </div>
                    )}
                    {safe.genderPreferences?.pets && (
                      <div>
                        <div className="text-sm text-gray-500">Pets</div>
                        <div className="font-medium">Allowed</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {safe.additionalFields.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Additional Information</h3>
                <div className="space-y-3">
                  {safe.additionalFields.map((field, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <p className="font-medium text-gray-800 mb-2">
                        {field.name}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </p>
                      {field.type === "text" && (
                        <p className="text-gray-600">
                          {String(field.value ?? "")}
                        </p>
                      )}
                      {field.type === "textarea" && (
                        <p className="text-gray-600 whitespace-pre-line">
                          {String(field.value ?? "")}
                        </p>
                      )}
                      {field.type === "checkbox" && (
                        <p className="text-gray-600">
                          {Array.isArray(field.value)
                            ? field.value.join(", ")
                            : String(field.value ?? "")}
                        </p>
                      )}
                      {field.type === "file" && field.value && (
                        <img
                          src={field.value}
                          alt={field.name}
                          className="w-48 h-32 object-cover rounded-md mt-2"
                        />
                      )}
                      {!["text", "textarea", "checkbox", "file"].includes(
                        field.type
                      ) && (
                        <pre className="text-gray-600 whitespace-pre-wrap">
                          {typeof field.value === "object"
                            ? JSON.stringify(field.value, null, 2)
                            : String(field.value ?? "")}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {safe.additionalLinks.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Additional Links</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {safe.additionalLinks.map((l, i) => {
                    const href = extractLinkHref(l);
                    const label = extractLinkLabel(l);
                    return (
                      <div
                        key={i}
                        className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium break-words"
                          >
                            {label}
                          </a>
                        ) : (
                          <span className="text-gray-700">{label}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {safe.socialGroupLinks.some(Boolean) && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Social / Group Links</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {safe.socialGroupLinks.filter(Boolean).map((s, i) => {
                    const href = extractLinkHref(s);
                    const label = extractLinkLabel(s);
                    return href ? (
                      <a
                        key={i}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-blue-600 hover:text-blue-800 font-medium break-words"
                      >
                        {label}
                      </a>
                    ) : (
                      <div
                        key={i}
                        className="p-3 border rounded-lg text-gray-700"
                      >
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {renderFAQs()}
        </div>

        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-0">
            <div className="mb-6">
              <h3 className="font-medium mb-3">Trip Navigation</h3>
              <nav className="space-y-1">
                {[
                  {
                    id: "overview",
                    label: "Overview",
                    icon: <FiInfo size={16} />,
                  },
                  {
                    id: "itinerary",
                    label: "Itinerary",
                    icon: <FiMap size={16} />,
                  },
                  {
                    id: "accommodation",
                    label: "Accommodation",
                    icon: <FiHome size={16} />,
                  },
                  {
                    id: "pricing",
                    label: "Pricing",
                    icon: <FiDollarSign size={16} />,
                  },
                  {
                    id: "gallery",
                    label: "Gallery",
                    icon: <FiCamera size={16} />,
                  },
                  {
                    id: "booking",
                    label: "Booking",
                    icon: <FiBookOpen size={16} />,
                  },
                  {
                    id: "policies",
                    label: "Policies",
                    icon: <FiFileText size={16} />,
                  },
                  {
                    id: "extras",
                    label: "Extras",
                    icon: <FiPlusCircle size={16} />,
                  },
                  {
                    id: "faqs",
                    label: "FAQs",
                    icon: <FiInfo size={16} />,
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
                      activeSection === item.id
                        ? "bg-indigo-100 text-indigo-700 font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="text-center mb-6">
              <div className="text-sm text-gray-500 mb-1">Starting from</div>
              {earlyBirdPricing.isEarlyBirdApplicable ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-gray-500 line-through text-lg">
                      {formatCurrency(earlyBirdPricing.basePrice)}
                    </span>
                    <span className="text-3xl font-bold text-green-600">
                      {formatCurrency(earlyBirdPricing.discountedPrice)}
                    </span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Early bird {earlyBirdPricing.discountPercentage}% off until {formatDate(earlyBirdPricing.endDate)}
                  </div>
                </div>
              ) : (
                <div className="text-3xl font-bold text-indigo-700">
                  {formatCurrency(displayPrice)}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                ({selectedAccommodationType} accommodation)
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">
                  {calculateDuration() > 0 ? `${calculateDuration()} days` : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Group Size</span>
                <span className="font-medium">
                  {safe.minParticipants || 0} - {safe.maxParticipants ?? "∞"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Payment</span>
                <span className="font-medium capitalize">
                  {safe.paymentType}
                </span>
              </div>
            </div>

            {earlyBirdPricing.isEarlyBirdApplicable && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 text-sm font-medium text-center">
                  Early bird {earlyBirdPricing.discountPercentage}% off until{" "}
                  {formatDate(earlyBirdPricing.endDate)}
                </div>
              </div>
            )}

            <div className="mt-6">
              {currentUser && currentUser._id === safe.createdBy?._id ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNavigating(true);
                    navigate(`/create-trip/${trip.id}`, {
                      state: { trip, step: "review" },
                    });
                  }}
                  disabled={isNavigating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isNavigating ? 'Loading...' : 'Edit Trip'}
                </button>
              ) : (
                <button
                  disabled={true}
                  className="w-full bg-gray-400 text-white py-3 rounded-lg font-medium cursor-not-allowed opacity-50"
                >
                  Payment Disabled
                </button>
              )}
              <button
                className="w-full mt-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium transition-colors"
                onClick={() => navigate(-1)}
              >
                Back to Dashboard
              </button>
            </div>

            {safe.additionalLinks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium mb-3">Quick Links</h4>
                <div className="space-y-2">
                  {safe.additionalLinks.slice(0, 3).map((l, i) => {
                    const href = extractLinkHref(l);
                    const label = extractLinkLabel(l);
                    return (
                      <div key={i}>
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 underline break-words block py-1"
                          >
                            {label}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-700">{label}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}