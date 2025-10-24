import React, { Component } from "react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  FiGlobe,
  FiWifi,
  FiUser,
  FiPhone,
  FiMail,
  FiTag,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import api from "../../services/api.js";

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Something went wrong
              </h3>
              <p className="text-red-600 mb-4">
                {this.props.fallbackMessage || "An error occurred while loading this content."}
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mb-4">
                  <summary className="text-sm text-red-700 cursor-pointer">
                    Error Details (Development Mode)
                  </summary>
                  <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto max-h-32">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              <div className="flex gap-2">
                <button
                  onClick={this.handleRetry}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FiRefreshCw className="h-4 w-4" />
                  Try Again
                </button>
                {this.props.onDismiss && (
                  <button
                    onClick={this.props.onDismiss}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Safe data access helper
const safeAccess = (obj, path, defaultValue = null) => {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

// Safe rendering wrapper
const SafeRender = ({ children, fallback = null }) => {
  try {
    return children;
  } catch (error) {
    console.error("SafeRender caught error:", error);
    return fallback || <div className="text-red-500">Content unavailable</div>;
  }
};

export default function EventDetails({ fallbackEvent } = {}) {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const MAX_RETRIES = 3;

  const sectionRefs = {
    overview: useRef(null),
    itinerary: useRef(null),
    pricing: useRef(null),
    gallery: useRef(null),
    booking: useRef(null),
    policies: useRef(null),
    extras: useRef(null),
    faq: useRef(null),
  };

  const fetchEventData = async (attempt = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.get(`/events/${eventId}`);
        const eventData = response.data;
        setEvent(eventData);
        
        const savedRaw = localStorage.getItem("savedEvents");
        const savedList = savedRaw ? JSON.parse(savedRaw) : [];
        const savedFlag = Array.isArray(savedList)
          ? savedList.includes(eventId)
          : false;
        setIsSaved(Boolean(savedFlag));
        
        setIsLoading(false);
        return;
      } catch (apiError) {
        console.log("API fetch failed, trying localStorage:", apiError);
        const raw = localStorage.getItem("publishedEvents");
        const storedEvents = raw ? JSON.parse(raw) : [];
        const foundEvent =
          storedEvents.find((e) => e._id === eventId) || fallbackEvent || null;
        
        if (foundEvent) {
          if (
            foundEvent.eventImage &&
            typeof foundEvent.eventImage === "string" &&
            !foundEvent.eventImage.startsWith("data:image/")
          ) {
            console.warn("Invalid image data format");
            foundEvent.eventImage = null;
          }
          setEvent(foundEvent);
          
          const savedRaw = localStorage.getItem("savedEvents");
          const savedList = savedRaw ? JSON.parse(savedRaw) : [];
          const savedFlag = Array.isArray(savedList)
            ? savedList.includes(eventId)
            : false;
          setIsSaved(Boolean(savedFlag));
        } else {
          setError("Event not found");
        }
      }
    } catch (e) {
      console.error("Error reading events:", e);
      setEvent(fallbackEvent || null);
      setIsSaved(false);
      setError("Failed to load event data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId, fallbackEvent, retryCount]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (ref.current && ref.current.offsetTop <= scrollPosition) {
          setActiveSection(section);
        }
      }
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

  const toggleSave = () => {
    try {
      const savedRaw = localStorage.getItem("savedEvents");
      const savedList = savedRaw ? JSON.parse(savedRaw) : [];
      if (isSaved) {
        const updatedList = savedList.filter((id) => id !== eventId);
        localStorage.setItem("savedEvents", JSON.stringify(updatedList));
        setIsSaved(false);
      } else {
        savedList.push(eventId);
        localStorage.setItem("savedEvents", JSON.stringify(savedList));
        setIsSaved(true);
      }
    } catch (e) {
      console.error("Error updating saved events:", e);
    }
  };

  const safe = useMemo(() => {
    if (!event) return null;
    
    return {
      _id: event._id,
      eventTitle: event.eventTitle || event.title || "Untitled Event",
      eDescription: event.eDescription || event.description || "No overview provided",
      bannerImage: event.eventImage || event.bannerImage || event.image || "",
      eventCategory: event.eventCategory || event.category || "",
      groupType: event.groupType || "public",
      privateSharingOption: event.privateSharingOption || "individual",
      isPublic: event.isPublic || false,
      bookingProcess: event.bookingProcess || "instant",
      eventStartDate: event.startDate || event.eventStartDate || "",
      eventEndDate: event.endDate || event.eventEndDate || "",
      startTime: event.startTime || event.eventStartTime || "09:00",
      endTime: event.endTime || event.eventEndTime || "17:00",
      location: event.location || event.eventLocation || "",
      googleMapLink: event.googleMapLink || "",
      isOnline: event.isOnline || false,
      isOffline: event.isOffline !== false,
      onlineMeetingLink: event.onlineMeetingLink || "",
      description: event.description || "",
      itineraryType: event.itineraryType || (event.structuredItinerary && event.structuredItinerary.length > 0 ? "structured" : "freeText"),
      itineraryText: event.itinerary || event.itineraryText || "",
      structuredItinerary: Array.isArray(event.structuredItinerary) ? event.structuredItinerary : [],
      eventActions: Array.isArray(event.eventActions) ? event.eventActions : [],
      accommodationOptions: event.accommodationOptions || {
        sharedRoom: { price: "", image: null },
        privateRoom: { price: "", image: null },
      },
      mealPlan: Array.isArray(event.mealPlan) ? event.mealPlan : [],
      inclusions: Array.isArray(event.inclusions) ? event.inclusions : [],
      exclusions: Array.isArray(event.exclusions) ? event.exclusions : [],
      faqs: Array.isArray(event.faqs) ? event.faqs : [],
      minParticipants: event.minParticipants || event.eventMinParticipants || null,
      maxParticipants: event.maxParticipants || event.eventMaxParticipants || null,
      allowEarlyBooking: !!event.allowEarlyBooking,
      earlyBookingLimit: event.earlyBookingLimit || "",
      earlyBookingDiscount: event.earlyBookingDiscount || "",
      earlyBookingEndDate: event.earlyBookingEndDate || "",
      noAgeLimit: !!event.noAgeLimit,
      minAge: event.minAge || "",
      maxAge: event.maxAge || "",
      genderPreferences: event.genderPreferences || {},
      bookingStartDate: event.bookingStartDate || "",
      bookingEndDate: event.bookingEndDate || "",
      minBookingFeePercentage: event.minBookingFeePercentage || 20,
      visaProcess: event.visaProcess || {},
      paymentOptions: Array.isArray(event.paymentOptions) ? event.paymentOptions : [],
      socialLinks: event.socialLinks || {},
      additionalFields: Array.isArray(event.additionalFields) ? event.additionalFields : [],
      eventTags: Array.isArray(event.eventTags) ? event.eventTags : [],
      pricing: event.pricing || {},
      cancellationEnabled: !!event.cancellationEnabled,
      cancellationRules: Array.isArray(event.cancellationRules) ? event.cancellationRules : [],
      status: event.status,
      publishedDate: event.publishedDate,
      bookings: event.bookings || 0,
      reviews: Array.isArray(event.reviews) ? event.reviews : [],
      savedCount: event.savedCount || 0,
    };
  }, [event]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const formatDate = (d) => {
    if (!d) return "";
    try {
      const dateObj = new Date(d);
      if (isNaN(dateObj.getTime())) {
        const isoDate = new Date(d);
        if (isNaN(isoDate.getTime())) return d;
        return isoDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
      return dateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  const formatDateTime = (date, time) => {
    if (!date) return "";
    try {
      let dateObj;
      
      if (time) {
        dateObj = new Date(`${date}T${time}`);
        if (isNaN(dateObj.getTime())) {
          dateObj = new Date(date);
        }
      } else {
        dateObj = new Date(date);
      }
      
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date:", date);
        return date ? `${date}${time ? ' ' + time : ''}` : "";
      }
      
      return dateObj.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: time ? "2-digit" : undefined,
        minute: time ? "2-digit" : undefined,
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return date ? `${date}${time ? ' ' + time : ''}` : "";
    }
  };

  const calculateDuration = () => {
    if (!safe.eventStartDate || !safe.eventEndDate) return "";
    
    try {
      const parseDate = (dateStr, timeStr = "00:00") => {
        if (!dateStr) return null;
        
        let dateObj;
        if (dateStr.includes('T')) {
          dateObj = new Date(dateStr);
        } else {
          dateObj = new Date(`${dateStr}T${timeStr}`);
        }
        
        if (isNaN(dateObj.getTime())) {
          dateObj = new Date(dateStr);
        }
        
        return isNaN(dateObj.getTime()) ? null : dateObj;
      };

      const start = parseDate(safe.eventStartDate, safe.startTime);
      const end = parseDate(safe.eventEndDate, safe.endTime);
      
      if (!start || !end) {
        console.error("Invalid dates:", { start: safe.eventStartDate, end: safe.eventEndDate });
        return "";
      }
      
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      
      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
      } else {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
      }
    } catch (e) {
      console.error("Duration calculation error:", e);
      return "";
    }
  };

  const normalizeTag = (t) => {
    if (typeof t === "string") return t;
    if (typeof t === "object") return t.label || t.name || JSON.stringify(t);
    return String(t);
  };

  const renderPricingBreakdown = () => {
    const pricing = safe.pricing || {};

    if (pricing.totalPrice && pricing.totalPrice > 0) {
      return (
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Total Price</span>
            <span>{formatCurrency(pricing.totalPrice)}</span>
          </div>
        </div>
      );
    }

    const sumItems = (items = []) =>
      (items || []).reduce((s, it) => s + (Number(it?.cost) || 0), 0);

    const accommodationSum = sumItems(pricing.accommodationItems || []);
    const transportationSum = sumItems(pricing.transportationItems || []);
    const activitiesSum = sumItems(pricing.activityItems || []);
    const visaRegFee = Number(pricing.visaRegFee) || 0;
    const customField = Number(pricing.customField) || 0;
    const commission = Number(pricing.commission) || 0;
    const pgCharges = Number(pricing.pgCharges) || 0;
    const bufferPercentage = Number(pricing.bufferPercentage) || 0;
    const yourFee = Number(pricing.yourFee) || 0;

    const subtotal = accommodationSum + transportationSum + activitiesSum + visaRegFee + customField;
    const bufferAmount = subtotal * (bufferPercentage / 100);
    const commissionAmount = subtotal * (commission / 100);
    const pgChargesAmount = subtotal * (pgCharges / 100);
    const computedTotal = subtotal + bufferAmount + yourFee + commissionAmount + pgChargesAmount;

    return (
      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
        {accommodationSum > 0 && (
          <div className="flex justify-between text-sm">
            <span>Accommodation</span>
            <span>{formatCurrency(accommodationSum)}</span>
          </div>
        )}
        {transportationSum > 0 && (
          <div className="flex justify-between text-sm">
            <span>Transportation</span>
            <span>{formatCurrency(transportationSum)}</span>
          </div>
        )}
        {activitiesSum > 0 && (
          <div className="flex justify-between text-sm">
            <span>Activities</span>
            <span>{formatCurrency(activitiesSum)}</span>
          </div>
        )}
        {visaRegFee > 0 && (
          <div className="flex justify-between text-sm">
            <span>Visa/Registration Fee</span>
            <span>{formatCurrency(visaRegFee)}</span>
          </div>
        )}
        {customField > 0 && (
          <div className="flex justify-between text-sm">
            <span>Custom Field</span>
            <span>{formatCurrency(customField)}</span>
          </div>
        )}
        {bufferPercentage > 0 && (
          <div className="flex justify-between text-sm">
            <span>Buffer ({bufferPercentage}%)</span>
            <span>{formatCurrency(bufferAmount)}</span>
          </div>
        )}
        {yourFee > 0 && (
          <div className="flex justify-between text-sm">
            <span>Organizer Fee</span>
            <span>{formatCurrency(yourFee)}</span>
          </div>
        )}
        {commission > 0 && (
          <div className="flex justify-between text-sm">
            <span>Commission ({commission}%)</span>
            <span>{formatCurrency(commissionAmount)}</span>
          </div>
        )}
        {pgCharges > 0 && (
          <div className="flex justify-between text-sm">
            <span>PG Charges ({pgCharges}%)</span>
            <span>{formatCurrency(pgChargesAmount)}</span>
          </div>
        )}
        <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
          <span>Total Price</span>
          <span>{formatCurrency(computedTotal)}</span>
        </div>
      </div>
    );
  };

  const computedTotal = useMemo(() => {
    if (!safe || !safe.pricing) return 0;

    if (safe.pricing.totalPrice && safe.pricing.totalPrice > 0) {
      return safe.pricing.totalPrice;
    }

    const sumItems = (items = []) =>
      (items || []).reduce((sum, it) => sum + (Number(it?.cost) || 0), 0);

    const accommodationSum = sumItems(safe.pricing.accommodationItems || []);
    const transportationSum = sumItems(safe.pricing.transportationItems || []);
    const activitiesSum = sumItems(safe.pricing.activityItems || []);
    const visaRegFee = Number(safe.pricing.visaRegFee) || 0;
    const customField = Number(safe.pricing.customField) || 0;
    const commission = Number(safe.pricing.commission) || 0;
    const pgCharges = Number(safe.pricing.pgCharges) || 0;
    const bufferPercentage = Number(safe.pricing.bufferPercentage) || 0;
    const yourFee = Number(safe.pricing.yourFee) || 0;

    const subtotal = accommodationSum + transportationSum + activitiesSum + visaRegFee + customField;
    const bufferAmount = subtotal * (bufferPercentage / 100);
    const commissionAmount = subtotal * (commission / 100);
    const pgChargesAmount = subtotal * (pgCharges / 100);
    const computedTotal = subtotal + bufferAmount + yourFee + commissionAmount + pgChargesAmount;

    return computedTotal;
  }, [safe]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Event not found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The event you're looking for doesn't exist or has been removed."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => fetchEventData(retryCount + 1)}
              disabled={retryCount >= MAX_RETRIES}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <FiRefreshCw className="h-4 w-4" />
              {retryCount < MAX_RETRIES ? 'Retry' : 'Max retries reached'}
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallbackMessage="Failed to load event details">
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="relative h-96 bg-black/5">
          {safe.bannerImage && (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={safe.bannerImage}
                alt="banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (process.env.NODE_ENV === 'development') {
                    console.error("Banner image failed to load:", e);
                  }
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      safe.groupType === "public" ? "bg-blue-500" : "bg-purple-500"
                    }`}>
                      {safe.groupType === "public" ? "Public Event" : "Private Event"}
                    </span>
                    {safe.eventCategory && (
                      <span className="px-3 py-1 bg-indigo-500 rounded-full text-xs font-medium">
                        {safe.eventCategory}
                      </span>
                    )}
                    {safe.isOnline && (
                      <span className="px-3 py-1 bg-green-500 rounded-full text-xs font-medium flex items-center gap-1">
                        <FiGlobe size={12} /> Online
                      </span>
                    )}
                    {safe.isOffline && (
                      <span className="px-3 py-1 bg-yellow-500 rounded-full text-xs font-medium flex items-center gap-1">
                        <FiMapPin size={12} /> Offline
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {safe.eventTitle}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                    <div className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      <span>
                        {formatDateTime(safe.eventStartDate, safe.startTime)}
                        {safe.eventEndDate
                          ? ` - ${formatDateTime(safe.eventEndDate, safe.endTime)}`
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiUsers size={14} />
                      <span>
                        {safe.minParticipants ?? 0} - {safe.maxParticipants ?? "∞"} attendees
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock size={14} />
                      <span>{calculateDuration()}</span>
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
                    onClick={toggleSave}
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
            <ErrorBoundary fallbackMessage="Failed to load overview section">
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
                    {safe.eDescription || "No overview provided"}
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {safe.isOffline && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <FiMapPin size={18} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium">{safe.location || "N/A"}</div>
                        {safe.googleMapLink && (
                          <a
                            href={safe.googleMapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View on Google Maps
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  {safe.isOnline && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <FiWifi size={18} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Online Meeting</div>
                        <div className="font-medium">
                          <a
                            href={safe.onlineMeetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Join Meeting
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                      <FiUsers size={18} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Group Size</div>
                      <div className="font-medium">
                        {safe.minParticipants ?? 0} - {safe.maxParticipants ?? "∞"} attendees
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                      <FiClock size={18} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-medium">
                        {calculateDuration() || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </ErrorBoundary>

            <ErrorBoundary fallbackMessage="Failed to load itinerary section">
              <section
                id="itinerary"
                ref={sectionRefs.itinerary}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiMap size={20} className="text-indigo-600" />
                  Itinerary
                </h2>

                <SafeRender>
                  {safe.itineraryType === "freeText" ? (
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">
                        {safe.itineraryText || "No itinerary provided"}
                      </p>
                    </div>
                  ) : safe.itineraryType === "structured" || (safe.structuredItinerary && safe.structuredItinerary.length > 0) ? (
                    <div className="space-y-6">
                      {safe.structuredItinerary.map((day, dayIndex) => (
                        <ErrorBoundary key={dayIndex} fallbackMessage={`Error loading day ${dayIndex + 1}`}>
                          <div className="border-l-2 border-indigo-500 pl-4 py-2">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-lg">
                                {day.title || `Day ${dayIndex + 1}`}
                              </h3>
                              {day.date && (
                                <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {formatDate(day.date)}
                                </div>
                              )}
                            </div>

                            {day.overview && (
                              <p className="mt-2 text-gray-700">{day.overview}</p>
                            )}

                            {day.stops && day.stops.length > 0 ? (
                              <div className="mt-4 space-y-4">
                                {day.stops.map((stop, stopIndex) => (
                                  <ErrorBoundary key={stopIndex} fallbackMessage="Error loading stop details">
                                    <div className="border border-gray-200 rounded-lg p-4">
                                      <div className="flex justify-between">
                                        <h4 className="font-medium">
                                          {stop.name || "Stop"}
                                        </h4>
                                        {stop.time && (
                                          <span className="text-sm text-gray-500">
                                            {stop.time}
                                          </span>
                                        )}
                                      </div>
                                      {stop.place && (
                                        <p className="text-sm text-gray-600 mt-1">
                                          {typeof stop.place === 'string' ? stop.place : 
                                           `${stop.place?.city || ''}${stop.place?.state ? ', ' + stop.place.state : ''}${stop.place?.country ? ', ' + stop.place.country : ''}`}
                                        </p>
                                      )}
                                      {stop.description && (
                                        <p className="mt-2 text-gray-700">
                                          {stop.description}
                                        </p>
                                      )}
                                      {stop.activityType && (
                                        <div className="mt-2">
                                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                                            {stop.activityType}
                                          </span>
                                        </div>
                                      )}
                                      {stop.additionalCost && (
                                        <p className="mt-2 text-sm text-green-600">
                                          Additional cost: {formatCurrency(stop.additionalCost)}
                                        </p>
                                      )}
                                      {stop.image && (
                                        <div className="mt-3">
                                          <img
                                            src={stop.image}
                                            alt={stop.name}
                                            className="w-full h-48 object-cover rounded-md"
                                            onError={(e) => {
                                              if (process.env.NODE_ENV === 'development') {
                                                console.error("Stop image failed to load:", e);
                                              }
                                              e.currentTarget.style.display = "none";
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </ErrorBoundary>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <FiMap size={48} className="mx-auto text-gray-300 mb-3" />
                                <p>No stops added for this day yet.</p>
                              </div>
                            )}
                          </div>
                        </ErrorBoundary>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FiMap size={48} className="mx-auto text-gray-300 mb-3" />
                      <p>No itinerary information available</p>
                    </div>
                  )}
                </SafeRender>
              </section>
            </ErrorBoundary>

            <ErrorBoundary fallbackMessage="Failed to load pricing section">
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
                        <div className="text-2xl font-bold text-indigo-700">
                          {formatCurrency(safe.pricing?.basePrice || computedTotal)}
                        </div>
                      </div>
                      {safe.allowEarlyBooking && safe.earlyBookingDiscount > 0 && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium text-green-800">
                                Early Bird Discount
                              </div>
                              <div className="text-sm text-green-700">
                                Available until {formatDate(safe.earlyBookingEndDate)}
                              </div>
                            </div>
                            <div className="text-lg font-bold text-green-800">
                              {formatCurrency(
                                (safe.pricing?.basePrice || computedTotal) *
                                (1 - safe.earlyBookingDiscount / 100)
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <div className="font-medium mb-2">What's included:</div>
                      <ul className="space-y-1">
                        {safe.inclusions.map((inc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <FiCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{inc ? String(inc) : "—"}</span>
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
                                <span>{exc ? String(exc) : "—"}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </ErrorBoundary>

            <ErrorBoundary fallbackMessage="Failed to load gallery section">
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
                        onError={(e) => {
                          if (process.env.NODE_ENV === 'development') {
                            console.error("Gallery banner image failed to load:", e);
                          }
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <FiImage size={24} />
                    </div>
                  )}
                  {safe.accommodationOptions.sharedRoom.image && (
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={safe.accommodationOptions.sharedRoom.image}
                        alt="shared accommodation"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (process.env.NODE_ENV === 'development') {
                            console.error("Accommodation image failed to load:", e);
                          }
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  {safe.accommodationOptions.privateRoom.image && (
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={safe.accommodationOptions.privateRoom.image}
                        alt="private accommodation"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (process.env.NODE_ENV === 'development') {
                            console.error("Private accommodation image failed to load:", e);
                          }
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  {safe.eventActions
                    .filter((action) => action.image)
                    .slice(0, 6)
                    .map((action, i) => (
                      <div
                        key={i}
                        className="aspect-square overflow-hidden rounded-lg"
                      >
                        <img
                          src={action.image}
                          alt={action.name || "event action"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            if (process.env.NODE_ENV === 'development') {
                              console.error("Event action image failed to load:", e);
                            }
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    ))}
                </div>
              </section>
            </ErrorBoundary>

            <ErrorBoundary fallbackMessage="Failed to load booking section">
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
                      {safe.bookingStartDate && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-0.5">
                            <FiCalendar size={16} />
                          </div>
                          <div>
                            <div className="font-medium">Booking Period</div>
                            <div className="text-sm text-gray-600">
                              {formatDate(safe.bookingStartDate)} - {formatDate(safe.bookingEndDate)}
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
                            {safe.minParticipants || 0} – {safe.maxParticipants ?? "∞"} participants
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
                          <div className="font-medium">Minimum Booking Fee</div>
                          <div className="text-sm text-gray-600">
                            {safe.minBookingFeePercentage}% of total price
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-2">Payment Options</div>
                        <div className="flex flex-wrap gap-2">
                          {safe.paymentOptions.map((option, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize"
                            >
                              {option}
                            </span>
                          ))}
                          {safe.paymentOptions.length === 0 && (
                            <span className="text-sm text-gray-500">
                              No payment options specified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </ErrorBoundary>

            <ErrorBoundary fallbackMessage="Failed to load policies section">
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
                                {r.daysBefore} day(s) before event
                              </span>
                              <span className={`font-semibold ${
                                r.percentage > 0 ? "text-red-600" : "text-green-600"
                              }`}>
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
                  <div>
                    <h3 className="font-medium mb-3">Age & Gender Preferences</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      {!safe.noAgeLimit && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-500">Age Range</div>
                          <div className="font-medium">
                            {safe.minAge || "No minimum"} - {safe.maxAge || "No maximum"} years
                          </div>
                        </div>
                      )}
                      {safe.noAgeLimit && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-500">Age Range</div>
                          <div className="font-medium">No age limit</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-500 mb-2">
                          Gender Preferences
                        </div>
                        <div className="space-y-2">
                          {safe.genderPreferences.male?.allowed && (
                            <div className="flex justify-between">
                              <span>Male attendees</span>
                              <span>{safe.genderPreferences.male.count}</span>
                            </div>
                          )}
                          {safe.genderPreferences.female?.allowed && (
                            <div className="flex justify-between">
                              <span>Female attendees</span>
                              <span>{safe.genderPreferences.female.count}</span>
                            </div>
                          )}
                          {safe.genderPreferences.kids?.allowed && (
                            <div className="flex justify-between">
                              <span>Kids (below 12)</span>
                              <span>{safe.genderPreferences.kids.count}</span>
                            </div>
                          )}
                          {safe.genderPreferences.pets && (
                            <div className="flex justify-between">
                              <span>Pets allowed</span>
                              <span>Yes</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </ErrorBoundary>

            <ErrorBoundary fallbackMessage="Failed to load extras section">
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
                  {safe.mealPlan.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3">Meal Plans</h3>
                      <div className="space-y-2">
                        {safe.mealPlan.map((meal, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>
                              {meal.dayDate ? formatDate(meal.dayDate) : ""} - {meal.mealType || meal.type || "Meal"} - {meal.details}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {safe.accommodationOptions.sharedRoom.price ||
                  safe.accommodationOptions.privateRoom.price ? (
                    <div>
                      <div className="space-y-3">
                        {safe.accommodationOptions.sharedRoom.price && (
                          <div className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium">Shared Room</div>
                              <div className="font-semibold">
                                {formatCurrency(safe.accommodationOptions.sharedRoom.price)}
                              </div>
                            </div>
                          </div>
                        )}
                        {safe.accommodationOptions.privateRoom.price && (
                          <div className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium">Private Room</div>
                              <div className="font-semibold">
                                {formatCurrency(safe.accommodationOptions.privateRoom.price)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
                {safe.additionalFields.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Additional Information</h3>
                    <div className="space-y-3">
                      {safe.additionalFields.map((field, idx) => (
                        <div key={idx} className="p-4 border border-gray-200 rounded-lg">
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
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "";
                              }}
                            />
                          )}
                          {!["text", "textarea", "checkbox", "file"].includes(field.type) && (
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
                {Object.keys(safe.socialLinks).some(
                  (key) => safe.socialLinks[key]
                ) && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Social Links</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {safe.socialLinks.whatsapp1 && (
                        <a
                          href={safe.socialLinks.whatsapp1}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-green-600 hover:text-green-800 font-medium break-words"
                        >
                          WhatsApp Group 1
                        </a>
                      )}
                      {safe.socialLinks.whatsapp2 && (
                        <a
                          href={safe.socialLinks.whatsapp2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-green-600 hover:text-green-800 font-medium break-words"
                        >
                          WhatsApp Group 2
                        </a>
                      )}
                      {safe.socialLinks.telegram1 && (
                        <a
                          href={safe.socialLinks.telegram1}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-blue-600 hover:text-blue-800 font-medium break-words"
                        >
                          Telegram Group 1
                        </a>
                      )}
                      {safe.socialLinks.telegram2 && (
                        <a
                          href={safe.socialLinks.telegram2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-blue-600 hover:text-blue-800 font-medium break-words"
                        >
                          Telegram Group 2
                        </a>
                      )}
                      {safe.socialLinks.instagram && (
                        <a
                          href={safe.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-pink-600 hover:text-pink-800 font-medium break-words"
                        >
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </section>
            </ErrorBoundary>

            <ErrorBoundary fallbackMessage="Failed to load FAQ section">
              <section
                id="faq"
                ref={sectionRefs.faq}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiFileText size={20} className="text-indigo-600" />
                  Frequently Asked Questions
                </h2>

                {safe.faqs && safe.faqs.length > 0 ? (
                  <div className="space-y-4">
                    {safe.faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="bg-gray-50 px-4 py-3 font-medium flex justify-between items-center">
                          <span>{faq.question ? String(faq.question) : "No question"}</span>
                          <span className="text-indigo-600">Q{index + 1}</span>
                        </div>
                        <div className="px-4 py-3 bg-white">
                          <p className="text-gray-700">{faq.answer ? String(faq.answer) : "No answer provided"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiFileText size={48} className="mx-auto text-gray-300 mb-3" />
                    <p>No FAQs available for this event.</p>
                  </div>
                )}
              </section>
            </ErrorBoundary>
          </div>

          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-0">
              <div className="mb-6">
                <h3 className="font-medium mb-3">Event Navigation</h3>
                <nav className="space-y-1">
                  {[
                    { id: "overview", label: "Overview", icon: <FiInfo size={16} /> },
                    { id: "itinerary", label: "Itinerary", icon: <FiMap size={16} /> },
                    { id: "pricing", label: "Pricing", icon: <FiDollarSign size={16} /> },
                    { id: "gallery", label: "Gallery", icon: <FiCamera size={16} /> },
                    { id: "booking", label: "Booking", icon: <FiBookOpen size={16} /> },
                    { id: "policies", label: "Policies", icon: <FiFileText size={16} /> },
                    { id: "extras", label: "Extras", icon: <FiPlusCircle size={16} /> },
                    { id: "faq", label: "FAQ", icon: <FiFileText size={16} /> }
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
                <div className="text-3xl font-bold text-indigo-700">
                  {formatCurrency(safe.pricing?.basePrice || computedTotal)}
                </div>
                {safe.allowEarlyBooking && safe.earlyBookingDiscount > 0 && (
                  <div className="text-sm text-green-600 mt-1">
                    Early bird: {formatCurrency(
                      (safe.pricing?.basePrice || computedTotal) *
                      (1 - safe.earlyBookingDiscount / 100)
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">
                    {calculateDuration() || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Group Size</span>
                  <span className="font-medium">
                    {safe.minParticipants || 0} - {safe.maxParticipants ?? "∞"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Booking Process</span>
                  <span className="font-medium capitalize">
                    {safe.bookingProcess}
                  </span>
                </div>
              </div>

              {safe.allowEarlyBooking && safe.earlyBookingDiscount > 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="text-amber-800 text-sm font-medium text-center">
                    Early bird {safe.earlyBookingDiscount}% off until {formatDate(safe.earlyBookingEndDate)}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (event && event._id) {
                      console.log("Navigating to edit event with ID:", event._id);
                      navigate(`/event-form/${event._id}`, {
                        state: { event: event },
                      });
                    }
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors"
                  disabled={!event}
                >
                  Edit Event
                </button>
                <button
                  className="w-full mt-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium transition-colors"
                  onClick={() => navigate(-1)}
                >
                  Back to Dashboard
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative mt-6">
                <h4 className="font-medium mb-4">Event Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published</span>
                    <span className="font-medium">
                      {formatDate(safe.publishedDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium capitalize">
                      {safe.status || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bookings</span>
                    <span className="font-medium">{safe.bookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saved</span>
                    <span className="font-medium">{safe.savedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reviews</span>
                    <span className="font-medium">{safe.reviews.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </ErrorBoundary>
  );
}