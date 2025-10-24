import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import StepNavigation from "../components/CreateTrip/StepNavigation";
import BasicDetails from "../components/CreateTrip/BasicDetails";
import ItineraryDetails from "../components/CreateTrip/ItineraryDetails";
import PricingSection from "../components/CreateTrip/PricingSection";
import LogisticsSection from "../components/CreateTrip/LogisticsSection";
import ReviewPublish from "../components/CreateTrip/ReviewPublish";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

const DEFAULT_PRICING = {
  accommodation: 0,
  transportation: 0,
  activities: 0,
  bufferPercentage: 10,
  yourFee: 0,
  accommodationItems: [],
  transportationItems: [],
  activityItems: [],
};

export default function CreateTrip() {
  const steps = useMemo(() => [
    "Basic Details",
    "Itinerary & Details",
    "Logistics",
    "Pricing",
    "Review & Publish",
  ], []);
  
  const navigate = useNavigate();
  const { tripId } = useParams();
  const location = useLocation();
  const { currentUser } = useAuth();
  const loadedRef = useRef(false);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(!!tripId);
  
  // Memoize initial trip data to prevent recreation
  const initialTripData = useMemo(() => ({
    // Basic Details
    tripTitle: "",
    bannerImage: "",
    tripCategory: "",
    groupType: "public",
    privateSharingOption: "",
    isPublic: false,
    bookingProcess: "instant",
    tripStartDate: "",
    tripEndDate: "",
    tripDates: [],
    meetingLocation: "",
    destination: "",
    sameAsPickup: false,
    description: "",
    // Itinerary
    itineraryType: "freeText",
    itineraryText: "",
    stops: [],
    accommodation: {
      sharedImage: null,
      sharedPrice: 0,
      privateImage: null,
      privatePrice: 0,
      settleToVendor: false,
    },
    mealPlans: [],
    inclusions: [],
    exclusions: [],
    faqs: [],
    structuredItinerary: [],
    // Pricing
    pricing: { ...DEFAULT_PRICING },
    // Logistics
    minParticipants: null,
    maxParticipants: null,
    allowEarlyBooking: false,
    allowEarlyParticipants: false,
    earlyBookingLimit: null,
    earlyBookingDiscount: 0,
    earlyBookingEndDate: "",
    bookingDeadline: "",
    bookingTimeline: {
      startDate: "",
      endDate: "",
    },
    paymentType: "full",
    fullPaymentBookingStart: "",
    fullPaymentBookingEnd: "",
    partialPaymentStart: "",
    partialPaymentEnd: "",
    initialPaymentPercentage: 0,
    additionalPayments: [
      {
        date: "",
        percentage: 0,
        description: "",
      },
    ],
    paymentRequirement: {
      type: "full",
      percentage: 100,
    },
    noAgeLimit: false,
    ageGroup: { min: null, max: null },
    minAge: null,
    maxAge: null,
    genderPreferences: {
      male: { allowed: false, count: 0 },
      female: { allowed: false, count: 0 },
      kids: { allowed: false, count: 0 },
      pets: false,
      petTypes: { cat: false, dog: false },
    },
    cancellationEnabled: false,
    cancellationRules: [
      {
        daysBefore: 0,
        percentage: 0,
        description: "",
      },
    ],
    socialGroupLinks: ["", "", ""],
    additionalLinks: [],
    registrationFormLink: "",
    tripTags: [],
    visaRequired: false,
    visaDocuments: [],
    visaProcess: {
      assistanceFee: 0,
      processingTimeFrom: null,
      processingTimeTo: null,
      description: "",
    },
    transportOptions: [],
    additionalFields: [],
    basePrice: 0,
    discountPrice: null,
    discountDeadline: null,
    // Add id field for editing
    id: null,
  }), []);
  
  const [tripData, setTripData] = useState(initialTripData);
  
  // --- helper: map step keys to indexes ---
  const STEP_INDEX = useMemo(() => ({
    basic: 0,
    itinerary: 1,
    logistics: 2,
    pricing: 3,
    review: 4,
  }), []);
  
  // Memoize date generation function
  const generateDateRange = useCallback((start, end) => {
    if (!start || !end) return [];
    const dates = [];
    let current = new Date(start);
    const last = new Date(end);
    // normalize time to avoid timezone edge cases
    current.setHours(0, 0, 0, 0);
    last.setHours(0, 0, 0, 0);
    while (current <= last) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, []);
  
  // Memoize pricing calculation functions
  const sumItems = useCallback((items = []) =>
    (items || []).reduce((sum, it) => sum + (Number(it?.cost) || 0), 0), []);
    
  const computePricingTotal = useCallback((pricing = {}) => {
    const full = { ...DEFAULT_PRICING, ...(pricing || {}) };
    const accommodationSum =
      Number(full.accommodation) || sumItems(full.accommodationItems || []);
    const transportationSum =
      Number(full.transportation) || sumItems(full.transportationItems || []);
    const activitiesSum =
      Number(full.activities) || sumItems(full.activityItems || []);
    const bufferPercentage = Number(full.bufferPercentage) || 0;
    const yourFee = Number(full.yourFee) || 0;
    const subtotal = accommodationSum + transportationSum + activitiesSum;
    const bufferAmount = subtotal * (bufferPercentage / 100);
    return subtotal + bufferAmount + yourFee;
  }, [sumItems]);
  
  // Memoize validation function
  const validateBeforePublish = useCallback(() => {
    setError(null);
    const required = [
      "tripTitle",
      "tripStartDate",
      "destination",
      "meetingLocation",
      "description",
    ];
    const missing = required.filter((k) => {
      const v = tripData[k];
      return (
        v === undefined ||
        v === null ||
        (typeof v === "string" && v.trim() === "")
      );
    });
    if (missing.length > 0) {
      throw new Error(`Please fill required fields: ${missing.join(", ")}`);
    }
    
    // check price: either explicit basePrice > 0 or computed pricing > 0
    const hasBasePrice = Number(tripData.basePrice) > 0;
    const computedTotal = computePricingTotal(tripData.pricing);
    const hasComputedPricing = Number(computedTotal) > 0;
    if (!hasBasePrice && !hasComputedPricing) {
      throw new Error(
        "Please set a price (basePrice or fill pricing section)."
      );
    }
    
    // participant sanity
    const minP = Number(tripData.minParticipants) || 0;
    const maxP = Number(tripData.maxParticipants) || 0;
    if (minP > 0 && maxP > 0 && minP > maxP) {
      throw new Error(
        "Minimum participants cannot be greater than maximum participants."
      );
    }
    
    // date checks
    if (
      tripData.tripEndDate &&
      new Date(tripData.tripStartDate) > new Date(tripData.tripEndDate)
    ) {
      throw new Error("Trip end date cannot be before start date.");
    }
    
    // booking window sanity (if present)
    if (tripData.fullPaymentBookingStart && tripData.fullPaymentBookingEnd) {
      if (
        new Date(tripData.fullPaymentBookingStart) >
        new Date(tripData.fullPaymentBookingEnd)
      ) {
        throw new Error(
          "Full payment booking start cannot be after booking end date."
        );
      }
    }
    
    // payment requirement sanity
    if (tripData.paymentType === "partial") {
      const ip = Number(tripData.initialPaymentPercentage) || 0;
      if (ip <= 0 || ip >= 100)
        throw new Error(
          "Initial payment percentage must be between 1 and 99 for partial payments."
        );
      const additionalSum = (tripData.additionalPayments || []).reduce(
        (s, p) => s + (Number(p.percentage) || 0),
        0
      );
      if (ip + additionalSum > 100)
        throw new Error(
          "Sum of initial + additional payment percentages cannot exceed 100%."
        );
    }
    
    return true;
  }, [tripData, computePricingTotal]);
  
  // Memoize publish function
  const publishTrip = useCallback(async () => {
    setIsPublishing(true);
    setError(null);
    
    try {
      // validation (throws if invalid)
      validateBeforePublish();
      
      // compute final price
      const pricingTotal = computePricingTotal(tripData.pricing);
      const finalPrice =
        Number(tripData.basePrice) > 0
          ? Number(tripData.basePrice)
          : pricingTotal;
      
      // Prepare data for submission - remove id to avoid duplicate key error
      const { id, ...dataToSubmit } = tripData;
      
      let response;
      if (isEditMode && id) {
        // Update existing trip
        response = await api.put(`/trips/${id}`, dataToSubmit);
        
        // Then publish it
        await api.patch(`/trips/${id}/publish`);
      } else {
        // Create new trip
        response = await api.post("/trips", dataToSubmit);
        
        // Then publish it
        await api.patch(`/trips/${response.data.id}/publish`);
      }
      
      // navigate back to dashboard with state indicating action
      navigate("/dashboard", {
        state: {
          tripPublished: !isEditMode,
          tripUpdated: isEditMode,
          tripTitle: tripData.tripTitle,
        },
      });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to publish. Check required fields.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsPublishing(false);
    }
  }, [tripData, isEditMode, validateBeforePublish, computePricingTotal, navigate]);
  
  // Memoize update function
  const updateTripData = useCallback((field, value) => {
    setTripData((prev) => {
      // shallow copy base
      const updated = { ...prev, [field]: value };
      
      // --- trip date range generation ---
      const startDate = field === "tripStartDate" ? value : prev.tripStartDate;
      const endDate = field === "tripEndDate" ? value : prev.tripEndDate;
      if (startDate && endDate) {
        try {
          if (new Date(endDate) < new Date(startDate)) {
            updated.tripDates = [];
          } else {
            updated.tripDates = generateDateRange(startDate, endDate);
          }
        } catch (e) {
          updated.tripDates = [];
        }
      }
      
      // --- booking timeline sync: if bookingTimeline object provided, ensure it's merged ---
      if (field === "bookingTimeline" && typeof value === "object") {
        updated.bookingTimeline = {
          ...(prev.bookingTimeline || {}),
          ...(value || {}),
        };
      }
      
      // --- payment type & requirements sync ---
      if (field === "paymentType") {
        const type = value;
        // default percentage logic
        let percentage =
          (prev.paymentRequirement && prev.paymentRequirement.percentage) ??
          (prev.initialPaymentPercentage || 0);
        if (type === "full") percentage = 100;
        else percentage = Number(prev.initialPaymentPercentage) || 0;
        updated.paymentRequirement = {
          ...(prev.paymentRequirement || {}),
          type,
          percentage,
        };
      }
      
      if (field === "paymentRequirement" && typeof value === "object") {
        updated.paymentRequirement = {
          ...(prev.paymentRequirement || {}),
          ...(value || {}),
        };
        if (value?.type) updated.paymentType = value.type;
      }
      
      if (field === "initialPaymentPercentage") {
        const perc = Number(value) || 0;
        if (prev.paymentType === "partial" || prev.paymentType === "both") {
          updated.paymentRequirement = {
            ...(prev.paymentRequirement || {}),
            percentage: perc,
          };
        }
      }
      
      if (field === "allowEarlyBooking") updated.allowEarlyParticipants = value;
      if (field === "allowEarlyParticipants") updated.allowEarlyBooking = value;
      
      // --- age group syncing ---
      if (field === "ageGroup" && typeof value === "object") {
        updated.minAge = value?.min ?? prev.minAge;
        updated.maxAge = value?.max ?? prev.maxAge;
      } else if (field === "minAge" || field === "maxAge") {
        updated.ageGroup = {
          ...(prev.ageGroup || {}),
          min: field === "minAge" ? value : prev.ageGroup?.min,
          max: field === "maxAge" ? value : prev.ageGroup?.max,
        };
      }
      
      // merge genderPreferences safely
      if (field === "genderPreferences" && typeof value === "object") {
        updated.genderPreferences = {
          ...(prev.genderPreferences || {}),
          ...(value || {}),
        };
        // merge petTypes if provided inside the value
        if (value?.petTypes && typeof value.petTypes === "object") {
          updated.genderPreferences.petTypes = {
            ...(prev.genderPreferences?.petTypes || { cat: false, dog: false }),
            ...(value.petTypes || {}),
          };
        }
      }
      
      // allow direct petTypes updates (optional)
      if (field === "petTypes" && typeof value === "object") {
        updated.genderPreferences = {
          ...(prev.genderPreferences || {}),
          petTypes: {
            ...(prev.genderPreferences?.petTypes || { cat: false, dog: false }),
            ...(value || {}),
          },
          pets: true, // selecting a pet type implies pets allowed
        };
      }
      
      // --- normalize cancellationRules when set from children ---
      if (field === "cancellationRules" && Array.isArray(value)) {
        updated.cancellationRules = (value || []).map((r) => ({
          daysBefore: Number(r?.daysBefore) || 0,
          percentage: Number(r?.percentage) || 0,
          description: r?.description ? String(r.description) : "",
          ...r,
        }));
      }
      
      // --- visaProcess merge (so child inputs can update only one field) ---
      if (field === "visaProcess" && typeof value === "object") {
        updated.visaProcess = { ...(prev.visaProcess || {}), ...(value || {}) };
      }
      
      if (field === "transportOptions" && Array.isArray(value)) {
        updated.transportOptions = (value || []).map((it) => ({
          type: "flight",
          departureTime: "",
          departureDate: "",
          cost: 0,
          description: "",
          included: false,
          // merge incoming values last so they overwrite defaults
          ...(it || {}),
        }));
      }
      
      return updated;
    });
  }, [generateDateRange]);
  
  // Memoize add array function
  const addArrayField = useCallback((field, value) => {
    setTripData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field]) ? [...prev[field], value] : [value],
    }));
  }, []);
  
  // --- Pre-fill form when in EDIT mode ---
  useEffect(() => {
    // prefer navigation state (fast, avoids extra localStorage read)
    const stateTrip = location.state?.trip;
    const stateStep = location.state?.step;
    // if we already loaded from route/state and nothing new, skip
    if (loadedRef.current && !stateTrip) return;
    
    if (stateTrip) {
      setTripData((prev) => ({ 
        ...prev, 
        ...stateTrip,
        id: stateTrip._id || stateTrip.id || tripId // Ensure id is set
      }));
      setIsEditMode(true);
      loadedRef.current = true;
    } else if (tripId) {
      const fetchTrip = async () => {
        try {
          const response = await api.get(`/trips/${tripId}`);
          const trip = response.data;
          setTripData((prev) => ({ 
            ...prev, 
            ...trip,
            id: trip._id || trip.id // Ensure id is set
          }));
          setIsEditMode(true);
          loadedRef.current = true;
        } catch (e) {
          console.error("Failed to load trip for editing:", e);
          setError("Failed to load trip data. Please try again.");
        }
      };
      fetchTrip();
    }
    
    // set initial step if provided via state or query param
    if (stateStep) {
      setCurrentStep(STEP_INDEX[stateStep] ?? Number(stateStep) ?? 0);
    } else {
      const q = new URLSearchParams(location.search);
      const qStep = q.get("step");
      if (qStep) setCurrentStep(STEP_INDEX[qStep] ?? Number(qStep) ?? 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId, location.key, STEP_INDEX]);
  
  // Memoize step components
  const StepComponents = useMemo(() => [
    <BasicDetails
      key="basic"
      tripData={tripData}
      updateTripData={updateTripData}
    />,
    <ItineraryDetails
      key="itinerary"
      tripData={tripData}
      updateTripData={updateTripData}
      addArrayField={addArrayField}
    />,
    <LogisticsSection
      key="logistics"
      tripData={tripData}
      updateTripData={updateTripData}
      addArrayField={addArrayField}
    />,
    <PricingSection
      key="pricing"
      tripData={tripData}
      updateTripData={updateTripData}
      addArrayField={addArrayField}
    />,
    <ReviewPublish key="review" tripData={tripData} />,
  ], [tripData, updateTripData, addArrayField]);
  
  // Memoize navigation handlers
  const handleBackStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);
  
  const handleNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  }, [steps.length]);
  
  return (
    <div className="min-h-screen bg-gray-50 font-cormorant">
      {/* Hero Section */}
      <div
        className="relative h-48 sm:h-56 md:h-64 lg:h-80 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-2 sm:px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 font-oleo">
            {isEditMode ? "Edit Your Trip" : "Create Your Dream Trip"}
          </h1>
          <p className="text-gray-200 text-base sm:text-lg md:text-xl max-w-xl">
            {isEditMode 
              ? "Update your trip details step-by-step."
              : "Fill in the details step-by-step to plan the perfect adventure for your group."
            }
          </p>
        </div>
      </div>
      
      {/* Main Form */}
      <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto p-2 sm:p-4 md:p-6 bg-white shadow-xl rounded-lg -mt-10 sm:-mt-12 md:-mt-16 relative z-10 border border-gray-100">
        {/* Step Navigation */}
        <StepNavigation
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />
        
        {/* Error (publish validation) */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Step Content */}
        <div className="mt-6 sm:mt-8 px-2 sm:px-4">
          {StepComponents[currentStep]}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between mt-8 sm:mt-10 gap-3">
          <button
            disabled={currentStep === 0}
            onClick={handleBackStep}
            className="px-4 sm:px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition disabled:opacity-50 text-base sm:text-lg font-semibold"
          >
            ← Back
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNextStep}
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-base sm:text-lg font-semibold"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={publishTrip}
              disabled={isPublishing}
              className={`px-4 sm:px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition text-base sm:text-lg ${
                isPublishing ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isPublishing ? "Publishing..." : (isEditMode ? "Update Trip" : "Publish Trip")}
            </button>
          )}
        </div>
      </div>
      
      {/* Decorative Footer */}
      <div className="text-center mt-8 sm:mt-12 mb-6 sm:mb-8 px-2">
        {/* <p className="text-gray-500 italic text-base sm:text-xl">
          "The journey of a thousand miles begins with a single step."
          <span className="block mt-1">- Lao Tzu</span>
        </p> */}
      </div>
    </div>
  );
}