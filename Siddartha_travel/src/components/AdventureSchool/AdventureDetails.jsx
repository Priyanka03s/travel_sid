
import React, { useEffect, useState, useMemo, useRef } from "react";
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
} from "react-icons/fi";
import api from "../../services/api";

export default function AdventureDetails({ fallbackAdventure } = {}) {
  const { adventureId, schoolId } = useParams();
  const navigate = useNavigate();
  const [adventure, setAdventure] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  
  // Create refs for each section
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

  // Normalize school data to adventure structure
  const normalizeSchoolToAdventure = (school) => {
    if (!school) return null;
    
    // Get first package as primary adventure
    const primaryPackage = school.packages && school.packages.length > 0 
      ? school.packages[0] 
      : {};
    
    return {
      id: school._id || school.id,
      adventureTitle: school.schoolName || "Untitled Adventure",
      aDescription: school.schoolDescription || "No overview provided",
      bannerImage: school.schoolImages && school.schoolImages.length > 0 
        ? school.schoolImages[0] 
        : "",
      adventureCategory: school.adventureTypes && school.adventureTypes.length > 0 
        ? school.adventureTypes[0] 
        : "",
      groupType: "public",
      privateSharingOption: "individual",
      isPublic: true,
      bookingProcess: primaryPackage.bookingType || "instant",
      startDate: primaryPackage.startDate || "",
      endDate: primaryPackage.endDate || "",
      startTime: "09:00",
      endTime: "17:00",
      location: school.address?.location || school.address?.city || "Not specified",
      googleMapLink: school.mapLocation || "",
      isOnline: false,
      isOffline: true,
      onlineMeetingLink: "",
      description: school.schoolDescription || "",
      itineraryType: "text",
      itineraryText: primaryPackage.detailedItinerary || "",
      structuredItinerary: [],
      adventureActions: [],
      accommodationOptions: {
        sharedRoom: { price: "", image: null },
        privateRoom: { price: "", image: null },
      },
      mealPlan: [],
      inclusions: [],
      exclusions: [],
      faqs: primaryPackage.faqs || [],
      minParticipants: primaryPackage.minParticipants || null,
      maxParticipants: primaryPackage.maxParticipants || null,
      allowEarlyBooking: false,
      earlyBookingLimit: "",
      earlyBookingDiscount: "",
      earlyBookingEndDate: "",
      noAgeLimit: !primaryPackage.minAge && !primaryPackage.maxAge,
      minAge: primaryPackage.minAge || "",
      maxAge: primaryPackage.maxAge || "",
      genderPreferences: {},
      bookingStartDate: "",
      bookingEndDate: "",
      minBookingFeePercentage: 20,
      visaProcess: {},
      paymentOptions: primaryPackage.paymentOptions || [],
      socialLinks: school.socialLinks || {},
      additionalFields: [],
      adventureTags: school.adventureTypes || [],
      pricing: {
        totalPrice: primaryPackage.price ? parseFloat(primaryPackage.price) : 0,
      },
      cancellationEnabled: !!primaryPackage.cancellationPolicy,
      cancellationRules: primaryPackage.cancellationPolicy ? [{
        daysBefore: 0,
        percentage: 100,
        description: primaryPackage.cancellationPolicy
      }] : [],
      status: school.status || "published",
      publishedDate: school.publishedDate || new Date().toISOString(),
      bookings: school.packages 
        ? school.packages.reduce((sum, pkg) => sum + (pkg.bookings || 0), 0) 
        : 0,
      reviews: school.testimonials || [],
      savedCount: 0,
      // Add duration fields
      duration: primaryPackage.duration || "",
      durationUnit: primaryPackage.durationUnit || "hours",
      // Add accommodation details
      accommodation: primaryPackage.accommodation || "",
      foodDetails: primaryPackage.foodDetails || "",
      gearProvided: primaryPackage.gearProvided || "",
      whatToBring: primaryPackage.whatToBring || "",
      safetyInfo: primaryPackage.safetyInfo || "",
      insuranceOptions: primaryPackage.insuranceOptions || "",
      // Add location details
      startLocation: primaryPackage.startLocation || "",
      endLocation: primaryPackage.endLocation || "",
      // Add skill level
      skillLevel: primaryPackage.skillLevel || "beginner",
      // Add price unit
      priceUnit: primaryPackage.priceUnit || "perPerson",
      // Add season
      season: primaryPackage.season || [],
    };
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (schoolId) {
          // Fetch school details from backend
          const response = await api.get(`/adventure-schools/${schoolId}`);
          const school = response.data;
          // Normalize school data to adventure structure
          const normalizedAdventure = normalizeSchoolToAdventure(school);
          setAdventure(normalizedAdventure);
        } else {
          // Existing localStorage logic for adventureId
          const raw = localStorage.getItem("publishedAdventures");
          const storedAdventures = raw ? JSON.parse(raw) : [];
          const foundAdventure =
            storedAdventures.find((e) => e.id === adventureId) || fallbackAdventure || null;
          setAdventure(foundAdventure);
        }
        // Check if adventure is saved
        const savedRaw = localStorage.getItem("savedAdventures");
        const savedList = savedRaw ? JSON.parse(savedRaw) : [];
        const savedFlag = Array.isArray(savedList)
          ? savedList.includes(adventureId || schoolId)
          : false;
        setIsSaved(Boolean(savedFlag));
      } catch (e) {
        console.error("Error reading adventures:", e);
        setAdventure(fallbackAdventure || null);
        setIsSaved(false);
      }
    }
    fetchData();
  }, [adventureId, schoolId, fallbackAdventure]);

  // Add scroll listener to track active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      // Determine which section is currently in view
      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (ref.current && ref.current.offsetTop <= scrollPosition) {
          setActiveSection(section);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to scroll to a specific section
  const scrollToSection = (sectionId) => {
    if (sectionRefs[sectionId] && sectionRefs[sectionId].current) {
      window.scrollTo({
        top: sectionRefs[sectionId].current.offsetTop - 20,
        behavior: "smooth",
      });
    }
  };

  // Toggle save status
  const toggleSave = () => {
    try {
      const savedRaw = localStorage.getItem("savedAdventures");
      const savedList = savedRaw ? JSON.parse(savedList) : [];
      if (isSaved) {
        // Remove from saved
        const updatedList = savedList.filter((id) => id !== (adventureId || schoolId));
        localStorage.setItem("savedAdventures", JSON.stringify(updatedList));
        setIsSaved(false);
      } else {
        // Add to saved
        savedList.push(adventureId || schoolId);
        localStorage.setItem("savedAdventures", JSON.stringify(savedList));
        setIsSaved(true);
      }
    } catch (e) {
      console.error("Error updating saved adventures:", e);
    }
  };

  // Safe data extraction with defaults
  const safe = useMemo(() => {
    if (!adventure) return null;
    return {
      id: adventure.id,
      adventureTitle: adventure.adventureTitle || "Untitled Adventure",
      aDescription: adventure.aDescription || "No overview provided",
      bannerImage: adventure.bannerImage || "",
      adventureCategory: adventure.adventureCategory || "",
      groupType: adventure.groupType || "public",
      privateSharingOption: adventure.privateSharingOption || "individual",
      isPublic: adventure.isPublic || false,
      bookingProcess: adventure.bookingProcess || "instant",
      startDate: adventure.startDate || "",
      endDate: adventure.endDate || "",
      startTime: adventure.startTime || "09:00",
      endTime: adventure.endTime || "17:00",
      location: adventure.location || "",
      googleMapLink: adventure.googleMapLink || "",
      isOnline: adventure.isOnline || false,
      isOffline: adventure.isOffline || true,
      onlineMeetingLink: adventure.onlineMeetingLink || "",
      description: adventure.description || "",
      itineraryType: adventure.itineraryType || "text",
      itineraryText: adventure.itineraryText || "",
      structuredItinerary: Array.isArray(adventure.structuredItinerary)
        ? adventure.structuredItinerary
        : [],
      adventureActions: Array.isArray(adventure.adventureActions) ? adventure.adventureActions : [],
      accommodationOptions: adventure.accommodationOptions || {
        sharedRoom: { price: "", image: null },
        privateRoom: { price: "", image: null },
      },
      mealPlan: Array.isArray(adventure.mealPlan) ? adventure.mealPlan : [],
      inclusions: Array.isArray(adventure.inclusions) ? adventure.inclusions : [],
      exclusions: Array.isArray(adventure.exclusions) ? adventure.exclusions : [],
      faqs: Array.isArray(adventure.faqs) ? adventure.faqs : [],
      minParticipants: adventure.minParticipants || null,
      maxParticipants: adventure.maxParticipants || null,
      allowEarlyBooking: !!adventure.allowEarlyBooking,
      earlyBookingLimit: adventure.earlyBookingLimit || "",
      earlyBookingDiscount: adventure.earlyBookingDiscount || "",
      earlyBookingEndDate: adventure.earlyBookingEndDate || "",
      noAgeLimit: !!adventure.noAgeLimit,
      minAge: adventure.minAge || "",
      maxAge: adventure.maxAge || "",
      genderPreferences: adventure.genderPreferences || {},
      bookingStartDate: adventure.bookingStartDate || "",
      bookingEndDate: adventure.bookingEndDate || "",
      minBookingFeePercentage: adventure.minBookingFeePercentage || 20,
      visaProcess: adventure.visaProcess || {},
      paymentOptions: Array.isArray(adventure.paymentOptions)
        ? adventure.paymentOptions
        : [],
      socialLinks: adventure.socialLinks || {},
      additionalFields: Array.isArray(adventure.additionalFields)
        ? adventure.additionalFields
        : [],
      adventureTags: Array.isArray(adventure.adventureTags) ? adventure.adventureTags : [],
      pricing: adventure.pricing || {},
      cancellationEnabled: !!adventure.cancellationEnabled,
      cancellationRules: Array.isArray(adventure.cancellationRules)
        ? adventure.cancellationRules
        : [],
      status: adventure.status,
      publishedDate: adventure.publishedDate,
      bookings: adventure.bookings || 0,
      reviews: Array.isArray(adventure.reviews) ? adventure.reviews : [],
      savedCount: adventure.savedCount || 0,
      // Add duration fields
      duration: adventure.duration || "",
      durationUnit: adventure.durationUnit || "hours",
      // Add accommodation details
      accommodation: adventure.accommodation || "",
      foodDetails: adventure.foodDetails || "",
      gearProvided: adventure.gearProvided || "",
      whatToBring: adventure.whatToBring || "",
      safetyInfo: adventure.safetyInfo || "",
      insuranceOptions: adventure.insuranceOptions || "",
      // Add location details
      startLocation: adventure.startLocation || "",
      endLocation: adventure.endLocation || "",
      // Add skill level
      skillLevel: adventure.skillLevel || "beginner",
      // Add price unit
      priceUnit: adventure.priceUnit || "perPerson",
      // Add season
      season: adventure.season || [],
    };
  }, [adventure]);

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

  const formatDateTime = (date, time) => {
    if (!date || !time) return "";
    try {
      const dateObj = new Date(`${date}T${time}`);
      return dateObj.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return `${date} ${time}`;
    }
  };

  // Helper function to calculate total price
  const calculateAdventureTotal = (pricing) => {
    if (!pricing) return 0;

    // First check if there's a totalPrice set (which takes precedence)
    if (pricing.totalPrice && pricing.totalPrice > 0) {
      return pricing.totalPrice;
    }

    const sumItems = (items = []) =>
      (items || []).reduce((sum, it) => sum + (Number(it?.cost) || 0), 0);

    const accommodationSum = sumItems(pricing.accommodationItems);
    const transportationSum = sumItems(pricing.transportationItems);
    const activitiesSum = sumItems(pricing.activityItems);
    const visaRegFee = Number(pricing.visaRegFee) || 0;
    const customField = Number(pricing.customField) || 0;
    const commission = Number(pricing.commission) || 0;
    const pgCharges = Number(pricing.pgCharges) || 0;
    const bufferPercentage = Number(pricing.bufferPercentage) || 0;
    const yourFee = Number(pricing.yourFee) || 0;

    const subtotal =
      accommodationSum +
      transportationSum +
      activitiesSum +
      visaRegFee +
      customField;

    const bufferAmount = subtotal * (bufferPercentage / 100);
    const commissionAmount = subtotal * (commission / 100);
    const pgChargesAmount = subtotal * (pgCharges / 100);

    return (
      subtotal + bufferAmount + yourFee + commissionAmount + pgChargesAmount
    );
  };

  const computedTotal = useMemo(() => {
    if (!safe || !safe.pricing) return 0;

    // First check if there's a totalPrice set (which takes precedence)
    if (safe.pricing.totalPrice && safe.pricing.totalPrice > 0) {
      return safe.pricing.totalPrice;
    }

    // Otherwise calculate from components using the same logic
    return calculateAdventureTotal(safe.pricing);
  }, [safe]);

  const calculateDuration = () => {
    // If we have duration and durationUnit, use them
    if (safe.duration && safe.durationUnit) {
      return `${safe.duration} ${safe.durationUnit}`;
    }
    
    // Otherwise, try to calculate from startDate and endDate
    if (!safe.startDate || !safe.endDate) return "";
    try {
      const start = new Date(`${safe.startDate}T${safe.startTime}`);
      const end = new Date(`${safe.endDate}T${safe.endTime}`);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      if (diffDays > 1) {
        return `${diffDays} days`;
      } else {
        return `${diffHours} hours`;
      }
    } catch {
      return "";
    }
  };

  // Helper to normalize tags
  const normalizeTag = (t) => {
    if (typeof t === "string") return t;
    if (typeof t === "object") return t.label || t.name || JSON.stringify(t);
    return String(t);
  };

  // Small helper to render pricing breakdown
  const renderPricingBreakdown = () => {
    const pricing = safe.pricing || {};

    // First check if there's a totalPrice set (which takes precedence)
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

    const subtotal =
      accommodationSum +
      transportationSum +
      activitiesSum +
      visaRegFee +
      customField;

    const bufferAmount = subtotal * (bufferPercentage / 100);
    const commissionAmount = subtotal * (commission / 100);
    const pgChargesAmount = subtotal * (pgCharges / 100);
    const computedTotal =
      subtotal + bufferAmount + yourFee + commissionAmount + pgChargesAmount;

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

  if (!adventure) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Adventure not found
          </h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* HERO */}
      <div className="relative h-96 bg-black/5">
        {safe.bannerImage && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={safe.bannerImage}
              alt="banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Image failed to load:", e);
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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      safe.groupType === "public"
                        ? "bg-green-500"
                        : "bg-purple-500"
                    }`}
                  >
                    {safe.groupType === "public"
                      ? "Public Adventure"
                      : "Private Adventure"}
                  </span>
                  {safe.adventureCategory && (
                    <span className="px-3 py-1 bg-green-600 rounded-full text-xs font-medium">
                      {safe.adventureCategory}
                    </span>
                  )}
                  {safe.isOnline && (
                    <span className="px-3 py-1 bg-blue-500 rounded-full text-xs font-medium flex items-center gap-1">
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
                  {safe.adventureTitle}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                  <div className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    <span>
                      {formatDateTime(safe.startDate, safe.startTime)}
                      {safe.endDate
                        ? ` - ${formatDateTime(
                            safe.endDate,
                            safe.endTime
                          )}`
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiUsers size={14} />
                    <span>
                      {safe.minParticipants ?? 0} -{" "}
                      {safe.maxParticipants ?? "∞"} participants
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

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT: content area */}
        <div className="lg:col-span-3 space-y-8">
          {/* Overview Section */}
          <section
            id="overview"
            ref={sectionRefs.overview}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiInfo size={20} className="text-green-600" />
              Overview
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">
                {safe.aDescription || safe.description || "No overview provided"}
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-medium">{safe.location || "Not specified"}</div>
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
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <FiUsers size={18} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Group Size</div>
                  <div className="font-medium">
                    {safe.minParticipants ?? "Not specified"} - {safe.maxParticipants ?? "∞"} participants
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <FiClock size={18} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-medium">
                    {calculateDuration() || "Not specified"}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-medium mb-3">Booking Available</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">
                  {safe.bookingProcess ? safe.bookingProcess : "Not specified"}
                </div>
              </div>
            </div>
          </section>

          {/* Itinerary Section */}
          <section
            id="itinerary"
            ref={sectionRefs.itinerary}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiMap size={20} className="text-green-600" />
              Itinerary
            </h2>

            {/* Check for freeText itinerary type */}
            {safe.itineraryType === "freeText" ? (
              // Display text itinerary
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">
                  {safe.itineraryText || "No itinerary provided"}
                </p>
              </div>
            ) : safe.itineraryType === "structured" ? (
              // Display structured itinerary
              <div className="space-y-6">
                {safe.structuredItinerary &&
                safe.structuredItinerary.length > 0 ? (
                  safe.structuredItinerary.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="border-l-2 border-green-500 pl-4 py-2"
                    >
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

                      {day.stops && day.stops.length > 0 && (
                        <div className="mt-4 space-y-4">
                          {day.stops.map((stop, stopIndex) => (
                            <div
                              key={stopIndex}
                              className="border border-gray-200 rounded-lg p-4"
                            >
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
                                  {stop.place}
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
                                  Additional cost:{" "}
                                  {formatCurrency(stop.additionalCost)}
                                </p>
                              )}
                              {stop.image && (
                                <div className="mt-3">
                                  <img
                                    src={stop.image}
                                    alt={stop.name}
                                    className="w-full h-48 object-cover rounded-md"
                                    onError={(e) => {
                                      console.error(
                                        "Stop image failed to load:",
                                        e
                                      );
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiMap size={48} className="mx-auto text-gray-300 mb-3" />
                    <p>No structured itinerary provided</p>
                  </div>
                )}
              </div>
            ) : (
              // Fallback if no itinerary type is specified
              <div className="text-center py-8 text-gray-500">
                <FiMap size={48} className="mx-auto text-gray-300 mb-3" />
                <p>No itinerary information available</p>
              </div>
            )}
          </section>

          {/* Pricing Section */}
          <section
            id="pricing"
            ref={sectionRefs.pricing}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiDollarSign size={20} className="text-green-600" />
              Pricing Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Price Breakdown</h3>
                {renderPricingBreakdown()}
              </div>
              <div>
                <h3 className="font-medium mb-3">Final Pricing</h3>
                <div className="bg-green-50 p-5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-700">Price per person</div>
                    <div className="text-2xl font-bold text-green-700">
                      {formatCurrency(computedTotal)}
                    </div>
                  </div>
                  {safe.allowEarlyBooking && safe.earlyBookingDiscount > 0 && (
                    <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-green-800">
                            Early Bird Discount
                          </div>
                          <div className="text-sm text-green-700">
                            Available until{" "}
                            {formatDate(safe.earlyBookingEndDate)}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-green-800">
                          {formatCurrency(
                            computedTotal *
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

          {/* Gallery Section */}
          <section
            id="gallery"
            ref={sectionRefs.gallery}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiCamera size={20} className="text-green-600" />
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
              {safe.accommodationOptions.sharedRoom.image && (
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={safe.accommodationOptions.sharedRoom.image}
                    alt="shared accommodation"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Accommodation image failed to load:", e);
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
                  />
                </div>
              )}
              {safe.adventureActions
                .filter((action) => action.image)
                .slice(0, 6)
                .map((action, i) => (
                  <div
                    key={i}
                    className="aspect-square overflow-hidden rounded-lg"
                  >
                    <img
                      src={action.image}
                      alt={action.name || "adventure action"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
            </div>
          </section>

          {/* Booking Section */}
          <section
            id="booking"
            ref={sectionRefs.booking}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiBookOpen size={20} className="text-green-600" />
              Booking & Payments
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Booking Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-0.5">
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
                      <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-0.5">
                        <FiCalendar size={16} />
                      </div>
                      <div>
                        <div className="font-medium">Booking Period</div>
                        <div className="text-sm text-gray-600">
                          {formatDate(safe.bookingStartDate)} -{" "}
                          {formatDate(safe.bookingEndDate)}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-0.5">
                      <FiUsers size={16} />
                    </div>
                    <div>
                      <div className="font-medium">Group Size</div>
                      <div className="text-sm text-gray-600">
                        {safe.minParticipants || 0} –{" "}
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
                    <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-0.5">
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
                    {/* <div className="font-medium mb-2">Payment Options</div> */}
                    <div className="flex flex-wrap gap-2">
                      {/* {safe.paymentOptions.map((option, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize"
                        >
                          {option}
                        </span>
                      ))} */}
                      {/* {safe.paymentOptions.length === 0 && (
                        <span className="text-sm text-gray-500">
                          No payment options specified
                        </span>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Policies Section */}
          <section
            id="policies"
            ref={sectionRefs.policies}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiFileText size={20} className="text-green-600" />
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
                            {r.daysBefore} day(s) before adventure
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
              <div>
                <h3 className="font-medium mb-3">Age & Gender Preferences</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  {!safe.noAgeLimit && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-500">Age Range</div>
                      <div className="font-medium">
                        {safe.minAge || "No minimum"} -{" "}
                        {safe.maxAge || "No maximum"} years
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
                          <span>Male participants</span>
                          <span>{safe.genderPreferences.male.count}</span>
                        </div>
                      )}
                      {safe.genderPreferences.female?.allowed && (
                        <div className="flex justify-between">
                          <span>Female participants</span>
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

          {/* Extras Section */}
          <section
            id="extras"
            ref={sectionRefs.extras}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiPlusCircle size={20} className="text-green-600" />
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
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>
                          {meal.dayDate ? formatDate(meal.dayDate) : ""} -{" "}
                          {meal.mealType || meal.type || "Meal"}{" "}-{" "}
                          {meal.details}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {safe.accommodationOptions.sharedRoom.price ||
              safe.accommodationOptions.privateRoom.price ? (
                <div>
                  <h3 className="font-medium mb-3">Accommodation Options</h3>
                  <div className="space-y-3">
                    {safe.accommodationOptions.sharedRoom.price && (
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">Shared Tent/Camp</div>
                          <div className="font-semibold">
                            {formatCurrency(
                              safe.accommodationOptions.sharedRoom.price
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {safe.accommodationOptions.privateRoom.price && (
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">Private Tent/Camp</div>
                          <div className="font-semibold">
                            {formatCurrency(
                              safe.accommodationOptions.privateRoom.price
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            
            {/* Add accommodation details section */}
            {safe.accommodation && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Accommodation Details</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{safe.accommodation}</p>
                </div>
              </div>
            )}
            
            {/* Add food details section */}
            {safe.foodDetails && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Food Details</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{safe.foodDetails}</p>
                </div>
              </div>
            )}
            
            {/* Add gear provided section */}
            {safe.gearProvided && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Gear Provided</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{safe.gearProvided}</p>
                </div>
              </div>
            )}
            
            {/* Add what to bring section */}
            {safe.whatToBring && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">What to Bring</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{safe.whatToBring}</p>
                </div>
              </div>
            )}
            
            {/* Add safety info section */}
            {safe.safetyInfo && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Safety Information</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{safe.safetyInfo}</p>
                </div>
              </div>
            )}
            
            {/* Add insurance options section */}
            {safe.insuranceOptions && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Insurance Options</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{safe.insuranceOptions}</p>
                </div>
              </div>
            )}
            
            {/* Add location details section */}
            {(safe.startLocation || safe.endLocation) && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Location Details</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  {safe.startLocation && (
                    <div className="mb-2">
                      <div className="text-sm text-gray-500">Start Location</div>
                      <div className="text-gray-700">{safe.startLocation}</div>
                    </div>
                  )}
                  {safe.endLocation && (
                    <div>
                      <div className="text-sm text-gray-500">End Location</div>
                      <div className="text-gray-700">{safe.endLocation}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Add skill level section */}
            {safe.skillLevel && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Skill Level</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-gray-700 capitalize">{safe.skillLevel}</div>
                </div>
              </div>
            )}
            
            {/* Add season section */}
            {safe.season && safe.season.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Season / Availability</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {safe.season.map((month, i) => (
                      <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {month}
                      </span>
                    ))}
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
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "";
                          }}
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

          <section
            id="faq"
            ref={sectionRefs.faq}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 scroll-mt-24"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiFileText size={20} className="text-green-600" />
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
                      <span>{faq.question}</span>
                      <span className="text-green-600">Q{index + 1}</span>
                    </div>
                    <div className="px-4 py-3 bg-white">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FiFileText size={48} className="mx-auto text-gray-300 mb-3" />
                <p>No FAQs available for this adventure.</p>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT: Sidebar with navigation */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-0">
            {/* Navigation Menu */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Adventure Navigation</h3>
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
                    id: "faq",
                    label: "FAQ",
                    icon: <FiFileText size={16} />,
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
                      activeSection === item.id
                        ? "bg-green-100 text-green-700 font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Booking Card */}
            <div className="text-center mb-6">
              <div className="text-sm text-gray-500 mb-1">Starting from</div>
              <div className="text-3xl font-bold text-green-700">
                {formatCurrency(safe.pricing?.basePrice || computedTotal)}
              </div>
              {safe.allowEarlyBooking && safe.earlyBookingDiscount > 0 && (
                <div className="text-sm text-green-600 mt-1">
                  Early bird:{" "}
                  {formatCurrency(
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
                  Early bird {safe.earlyBookingDiscount}% off until{" "}
                  {formatDate(safe.earlyBookingEndDate)}
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (adventure && adventure.id) {
                    navigate(`/adventure-form/${adventure.id}`, {
                      state: { adventure, step: "review" },
                    });
                  }
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                disabled={!adventure}
              >
                Edit Adventure
              </button>
              <button
                className="w-full mt-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-medium transition-colors"
                onClick={() => navigate(-1)}
              >
                Back to Dashboard
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative mt-6">
              <h4 className="font-medium mb-4">Adventure Details</h4>
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
  );
}