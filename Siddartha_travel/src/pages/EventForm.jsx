import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import PricingCalculation from "../components/EventTrip.jsx/Pricingdetails";
import MergedItinerarySection from "../components/EventTrip.jsx/MergedItinerarySection";
import { format, parseISO, addDays, differenceInDays } from "date-fns";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext";

// Extract TripTags component outside of EventForm
const TripTags = ({ formik }) => {
  const [inputValue, setInputValue] = useState("");
  const handleAddTag = (tag) => {
    if (tag && !formik.values.eventTags.includes(tag.toLowerCase())) {
      formik.setFieldValue("eventTags", [
        ...formik.values.eventTags,
        tag.toLowerCase(),
      ]);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(inputValue.trim());
      setInputValue("");
    }
  };
  const handleRemoveTag = (tag) => {
    formik.setFieldValue(
      "eventTags",
      formik.values.eventTags.filter((t) => t !== tag)
    );
  };
  const suggestedTags = [
    "adventure",
    "nature",
    "mountains",
    "beach",
    "cultural",
    "photography",
    "backpacking",
    "luxury",
    "budget-friendly",
    "family-friendly",
  ];
  return (
    <div className="mb-8 p-4 border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Trip Tags*</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Add tags</label>
        <input
          type="text"
          name="eventTagsInput"
          placeholder="e.g. nature"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      {formik.values.eventTags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {formik.values.eventTags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleRemoveTag(tag)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {suggestedTags.map((tag) => {
          const isSelected = formik.values.eventTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              className={`px-3 py-1 rounded-full border text-sm transition ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
              onClick={() =>
                isSelected ? handleRemoveTag(tag) : handleAddTag(tag)
              }
            >
              {isSelected ? "✓ " : "+ "}
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const DEFAULT_PRICING = {
  accommodation: 0,
  transport: 0,
  visaRegFee: 0,
  customField: 0,
  commission: 0,
  pgCharges: 0,
  bufferPercentage: 10,
  yourFee: 0,
  accommodationItems: [],
  transportationItems: [],
  activityItems: [],
  totalPrice: 0,
  settleToVendor: false,
  collectPGCharges: false,
};

const EventForm = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [sharedRoomImagePreview, setSharedRoomImagePreview] = useState(null);
  const [privateRoomImagePreview, setPrivateRoomImagePreview] = useState(null);
  const [campingImagePreview, setCampingImagePreview] = useState(null);
  const [glampingImagePreview, setGlampingImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
  });
  const [cancellationEnabled, setCancellationEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // State for custom timing inputs
  const [newCustomTiming, setNewCustomTiming] = useState("");

  // Initialize formik with empty values
  const formik = useFormik({
    initialValues: {
      eventTitle: "",
      eventImage: null,
      eDescription: "",
      eventCategory: "",
      eventSubCategory: "",
      activityType: "",
      customActivity: "",
      groupType: "public",
      privateSharingOption: "individual",
      isPublic: false,
      bookingProcess: "instant",
      startDate: "",
      startTime: "09:00",
      endDate: "",
      endTime: "17:00",
      location: "",
      googleMapLink: "",
      isOnline: false,
      isOffline: true,
      onlineMeetingLink: "",
      description: "",
      itineraryType: "freeText",
      itinerary: "",
      structuredItinerary: [],
      eventActions: [],
      accommodationOptions: {
        sharedRoom: { price: "", image: null },
        privateRoom: { price: "", image: null },
        camping: { price: "", image: null },
        glamping: { price: "", image: null },
        settleToVendor: false,
      },
      mealPlan: [],
      inclusions: [],
      exclusions: [],
      faqs: [],
      minParticipants: "",
      maxParticipants: "",
      allowEarlyBooking: false,
      earlyBookingLimit: "",
      earlyBookingDiscount: "",
      cancellationEnabled: false,
      cancellationRules: [],
      earlyBookingEndDate: "",
      noAgeLimit: false,
      minAge: "",
      maxAge: "",
      genderPreferences: {
        male: { allowed: false, count: 0 },
        female: { allowed: false, count: 0 },
        kids: { allowed: false, count: 0 },
        pets: false,
        petTypes: { cat: false, dog: false },
      },
      bookingStartDate: "",
      bookingEndDate: "",
      minBookingFeePercentage: 20,
      visaProcess: {
        documentsRequired: "",
        assistanceFee: "",
        processingTime: "",
      },
      paymentOptions: [],
      socialLinks: {
        whatsapp1: "",
        whatsapp2: "",
        telegram1: "",
        telegram2: "",
        instagram: "",
      },
      additionalFields: [],
      eventTags: [],
      tripTags: [], // Added tripTags field
      pricing: {
        ...DEFAULT_PRICING,
        accommodationItems: [],
        transportationItems: [],
        activityItems: [],
      },
      // New fields for specific activity types
      yogaDetails: {
        style: "",
        level: "",
        peakTimings: [],
        customTimings: [], // New field for custom timings
        equipmentProvided: false,
        equipmentList: [],
      },
      sportsDetails: {
        sportType: "",
        courtType: "",
        peakTimings: [], // New field for sports peak timings
        customTimings: [], // New field for custom timings
        equipmentProvided: false,
        equipmentList: [],
        skillLevel: "",
      },
    },
    validate: (values) => {
      const errors = {};

      // Validate event image
      if (
        !values.eventImage ||
        (typeof values.eventImage !== "string" && !(values.eventImage instanceof File)) ||
        (typeof values.eventImage === "string" && !values.eventImage.startsWith("data:image/"))
      ) {
        errors.eventImage = "Please upload a valid event image";
      }

      // Validate activity type based on category
      if (values.eventCategory === "yoga" && !values.yogaDetails.style) {
        errors.yogaStyle = "Please select a yoga style";
      }

      if (values.eventCategory === "sports" && !values.sportsDetails.sportType) {
        errors.sportType = "Please select a sport type";
      }

      if (values.eventCategory === "custom" && !values.customActivity) {
        errors.customActivity = "Please describe your custom activity";
      }

      return errors;
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        setError(null);

        // Calculate total price
        const pricing = values.pricing || {};
        const totalPrice = calculateTotalPrice(pricing);

        // Validate event image
        if (
          !values.eventImage ||
          (typeof values.eventImage !== "string" && !(values.eventImage instanceof File)) ||
          (typeof values.eventImage === "string" && !values.eventImage.startsWith("data:image/"))
        ) {
          setError("Please upload a valid event image");
          setIsSaving(false);
          return;
        }

        // Create a copy of form values to modify
        const eventData = {
          ...values,
          pricing: {
            ...values.pricing,
            totalPrice: totalPrice,
            accommodationItems: values.pricing.accommodationItems || [],
            transportationItems: values.pricing.transportationItems || [],
            activityItems: values.pricing.activityItems || [],
            visaRegFee: Number(values.pricing.visaRegFee) || 0,
            customField: Number(values.pricing.customField) || 0,
            commission: Number(values.pricing.commission) || 0,
            pgCharges: Number(values.pricing.pgCharges) || 0,
            bufferPercentage: Number(values.pricing.bufferPercentage) || 0,
            yourFee: Number(values.pricing.yourFee) || 0,
          },
          // Ensure tripTags is included
          tripTags: values.tripTags || []
        };

        // Stringify structured itinerary if it's an object
        if (eventData.structuredItinerary && typeof eventData.structuredItinerary === 'object') {
          eventData.structuredItinerary = JSON.stringify(eventData.structuredItinerary);
        }

        if (!values.faqs || values.faqs.length === 0) {
          setError("Please add at least one FAQ before submitting");
          setIsSaving(false);
          return;
        }

        let response;
        if (isEditMode) {
          // Update existing event
          response = await api.put(`/events/${eventId}`, eventData);
        } else {
          // Create new event
          response = await api.post("/events", eventData);
        }

        // Navigate to dashboard with success message
        navigate("/dashboard", {
          state: {
            eventPublished: !isEditMode,
            eventUpdated: isEditMode,
            eventTitle: eventData.eventTitle,
          },
        });
      } catch (err) {
        console.error("Error saving event:", err);
        setError(err.response?.data?.message || "Failed to save event. Please try again.");
      } finally {
        setIsSaving(false);
      }
    },
  });

  const calculateTotalPrice = (pricing) => {
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

  // Load event data for editing
  useEffect(() => {
    const fetchEventData = async () => {
      if (eventId) {
        try {
          setIsLoading(true);
          console.log("Loading event data for ID:", eventId);
          
          // First try to get from location state
          if (location.state?.event) {
            const event = location.state.event;
            console.log("Event data from location state:", event);
            setIsEditMode(true);
            
            // Format dates for form inputs
            const formatDateForInput = (dateString) => {
              if (!dateString) return "";
              const date = new Date(dateString);
              return date.toISOString().split('T')[0];
            };
            
            // Create a properly formatted event object for formik
            const formattedEvent = {
              ...event,
              startDate: formatDateForInput(event.startDate),
              endDate: formatDateForInput(event.endDate),
              bookingStartDate: formatDateForInput(event.bookingStartDate),
              bookingEndDate: formatDateForInput(event.bookingEndDate),
              earlyBookingEndDate: formatDateForInput(event.earlyBookingEndDate),
              structuredItinerary: event.structuredItinerary || [],
              eventActions: event.eventActions || [],
              mealPlan: event.mealPlan || [],
              inclusions: event.inclusions || [],
              exclusions: event.exclusions || [],
              faqs: event.faqs || [],
              cancellationRules: event.cancellationRules || [],
              paymentOptions: event.paymentOptions || [],
              additionalFields: event.additionalFields || [],
              eventTags: event.eventTags || [],
              tripTags: event.tripTags || [], // Added tripTags
              pricing: {
                ...DEFAULT_PRICING, // Use the default pricing as base
                ...(event.pricing || {}), // Override with event pricing data
                accommodationItems: event.pricing?.accommodationItems || [],
                transportationItems: event.pricing?.transportationItems || [],
                activityItems: event.pricing?.activityItems || [],
                visaRegFee: event.pricing?.visaRegFee || 0,
                customField: event.pricing?.customField || 0,
                commission: event.pricing?.commission || 0,
                pgCharges: event.pricing?.pgCharges || 0,
                bufferPercentage: event.pricing?.bufferPercentage || 10,
                yourFee: event.pricing?.yourFee || 0,
                settleToVendor: event.pricing?.settleToVendor || false,
                collectPGCharges: event.pricing?.collectPGCharges || false,
              },
              genderPreferences: {
                male: event.genderPreferences?.male || { allowed: false, count: 0 },
                female: event.genderPreferences?.female || { allowed: false, count: 0 },
                kids: event.genderPreferences?.kids || { allowed: false, count: 0 },
                pets: event.genderPreferences?.pets || false,
                petTypes: event.genderPreferences?.petTypes || { cat: false, dog: false },
              },
              accommodationOptions: {
                sharedRoom: {
                  price: event.accommodationOptions?.sharedRoom?.price || "",
                  image: event.accommodationOptions?.sharedRoom?.image || null,
                },
                privateRoom: {
                  price: event.accommodationOptions?.privateRoom?.price || "",
                  image: event.accommodationOptions?.privateRoom?.image || null,
                },
                camping: {
                  price: event.accommodationOptions?.camping?.price || "",
                  image: event.accommodationOptions?.camping?.image || null,
                },
                glamping: {
                  price: event.accommodationOptions?.glamping?.price || "",
                  image: event.accommodationOptions?.glamping?.image || null,
                },
                settleToVendor: event.accommodationOptions?.settleToVendor || false,
              },
              visaProcess: {
                documentsRequired: event.visaProcess?.documentsRequired || "",
                assistanceFee: event.visaProcess?.assistanceFee || "",
                processingTime: event.visaProcess?.processingTime || "",
              },
              socialLinks: {
                whatsapp1: event.socialLinks?.whatsapp1 || "",
                whatsapp2: event.socialLinks?.whatsapp2 || "",
                telegram1: event.socialLinks?.telegram1 || "",
                telegram2: event.socialLinks?.telegram2 || "",
                instagram: event.socialLinks?.instagram || "",
              },
              // Add new fields for specific activity types
              yogaDetails: {
                style: event.yogaDetails?.style || "",
                level: event.yogaDetails?.level || "",
                peakTimings: event.yogaDetails?.peakTimings || [],
                customTimings: event.yogaDetails?.customTimings || [], // Load custom timings
                equipmentProvided: event.yogaDetails?.equipmentProvided || false,
                equipmentList: event.yogaDetails?.equipmentList || [],
              },
              sportsDetails: {
                sportType: event.sportsDetails?.sportType || "",
                courtType: event.sportsDetails?.courtType || "",
                peakTimings: event.sportsDetails?.peakTimings || [], // Load peak timings
                customTimings: event.sportsDetails?.customTimings || [], // Load custom timings
                equipmentProvided: event.sportsDetails?.equipmentProvided || false,
                equipmentList: event.sportsDetails?.equipmentList || [],
                skillLevel: event.sportsDetails?.skillLevel || "",
              },
            };
            
            // Set form values with the formatted event data
            formik.setValues(formattedEvent);
            
            // If there's an image, set the preview
            if (event.eventImage) {
              setImagePreview(event.eventImage);
            }
            
            // Set accommodation image previews
            if (event.accommodationOptions?.sharedRoom?.image) {
              setSharedRoomImagePreview(event.accommodationOptions.sharedRoom.image);
            }
            if (event.accommodationOptions?.privateRoom?.image) {
              setPrivateRoomImagePreview(event.accommodationOptions.privateRoom.image);
            }
            if (event.accommodationOptions?.camping?.image) {
              setCampingImagePreview(event.accommodationOptions.camping.image);
            }
            if (event.accommodationOptions?.glamping?.image) {
              setGlampingImagePreview(event.accommodationOptions.glamping.image);
            }
            
            // Set cancellation enabled state
            if (event.cancellationEnabled) {
              setCancellationEnabled(true);
            }
          } else {
            // If no event in state, try API
            try {
              const response = await api.get(`/events/${eventId}`);
              const event = response.data;
              console.log("Event data from API:", event);
              setIsEditMode(true);
              
              // Format dates for form inputs
              const formatDateForInput = (dateString) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
              };
              
              // Create a properly formatted event object for formik
              const formattedEvent = {
                ...event,
                startDate: formatDateForInput(event.startDate),
                endDate: formatDateForInput(event.endDate),
                bookingStartDate: formatDateForInput(event.bookingStartDate),
                bookingEndDate: formatDateForInput(event.bookingEndDate),
                earlyBookingEndDate: formatDateForInput(event.earlyBookingEndDate),
                structuredItinerary: event.structuredItinerary || [],
                eventActions: event.eventActions || [],
                mealPlan: event.mealPlan || [],
                inclusions: event.inclusions || [],
                exclusions: event.exclusions || [],
                faqs: event.faqs || [],
                cancellationRules: event.cancellationRules || [],
                paymentOptions: event.paymentOptions || [],
                additionalFields: event.additionalFields || [],
                eventTags: event.eventTags || [],
                tripTags: event.tripTags || [], // Added tripTags
                pricing: {
                  ...DEFAULT_PRICING, // Use the default pricing as base
                  ...(event.pricing || {}), // Override with event pricing data
                  accommodationItems: event.pricing?.accommodationItems || [],
                  transportationItems: event.pricing?.transportationItems || [],
                  activityItems: event.pricing?.activityItems || [],
                  visaRegFee: event.pricing?.visaRegFee || 0,
                  customField: event.pricing?.customField || 0,
                  commission: event.pricing?.commission || 0,
                  pgCharges: event.pricing?.pgCharges || 0,
                  bufferPercentage: event.pricing?.bufferPercentage || 10,
                  yourFee: event.pricing?.yourFee || 0,
                  settleToVendor: event.pricing?.settleToVendor || false,
                  collectPGCharges: event.pricing?.collectPGCharges || false,
                },
                genderPreferences: {
                  male: event.genderPreferences?.male || { allowed: false, count: 0 },
                  female: event.genderPreferences?.female || { allowed: false, count: 0 },
                  kids: event.genderPreferences?.kids || { allowed: false, count: 0 },
                  pets: event.genderPreferences?.pets || false,
                  petTypes: event.genderPreferences?.petTypes || { cat: false, dog: false },
                },
                accommodationOptions: {
                  sharedRoom: {
                    price: event.accommodationOptions?.sharedRoom?.price || "",
                    image: event.accommodationOptions?.sharedRoom?.image || null,
                  },
                  privateRoom: {
                    price: event.accommodationOptions?.privateRoom?.price || "",
                    image: event.accommodationOptions?.privateRoom?.image || null,
                  },
                  camping: {
                    price: event.accommodationOptions?.camping?.price || "",
                    image: event.accommodationOptions?.camping?.image || null,
                  },
                  glamping: {
                    price: event.accommodationOptions?.glamping?.price || "",
                    image: event.accommodationOptions?.glamping?.image || null,
                  },
                  settleToVendor: event.accommodationOptions?.settleToVendor || false,
                },
                visaProcess: {
                  documentsRequired: event.visaProcess?.documentsRequired || "",
                  assistanceFee: event.visaProcess?.assistanceFee || "",
                  processingTime: event.visaProcess?.processingTime || "",
                },
                socialLinks: {
                  whatsapp1: event.socialLinks?.whatsapp1 || "",
                  whatsapp2: event.socialLinks?.whatsapp2 || "",
                  telegram1: event.socialLinks?.telegram1 || "",
                  telegram2: event.socialLinks?.telegram2 || "",
                  instagram: event.socialLinks?.instagram || "",
                },
                // Add new fields for specific activity types
                yogaDetails: {
                  style: event.yogaDetails?.style || "",
                  level: event.yogaDetails?.level || "",
                  peakTimings: event.yogaDetails?.peakTimings || [],
                  customTimings: event.yogaDetails?.customTimings || [], // Load custom timings
                  equipmentProvided: event.yogaDetails?.equipmentProvided || false,
                  equipmentList: event.yogaDetails?.equipmentList || [],
                },
                sportsDetails: {
                  sportType: event.sportsDetails?.sportType || "",
                  courtType: event.sportsDetails?.courtType || "",
                  peakTimings: event.sportsDetails?.peakTimings || [], // Load peak timings
                  customTimings: event.sportsDetails?.customTimings || [], // Load custom timings
                  equipmentProvided: event.sportsDetails?.equipmentProvided || false,
                  equipmentList: event.sportsDetails?.equipmentList || [],
                  skillLevel: event.sportsDetails?.skillLevel || "",
                },
              };
              
              // Set form values with the formatted event data
              formik.setValues(formattedEvent);
              
              if (event.eventImage) {
                setImagePreview(event.eventImage);
              }
              
              // Set accommodation image previews
              if (event.accommodationOptions?.sharedRoom?.image) {
                setSharedRoomImagePreview(event.accommodationOptions.sharedRoom.image);
              }
              if (event.accommodationOptions?.privateRoom?.image) {
                setPrivateRoomImagePreview(event.accommodationOptions.privateRoom.image);
              }
              if (event.accommodationOptions?.camping?.image) {
                setCampingImagePreview(event.accommodationOptions.camping.image);
              }
              if (event.accommodationOptions?.glamping?.image) {
                setGlampingImagePreview(event.accommodationOptions.glamping.image);
              }
              
              if (event.cancellationEnabled) {
                setCancellationEnabled(true);
              }
            } catch (apiError) {
              console.log("API fetch failed:", apiError);
              setError("Failed to load event data. Please try again.");
            }
          }
        } catch (e) {
          console.error("Error loading event for editing:", e);
          setError("Failed to load event data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, location.state]);

  const formatDateLabel = (date, index) => {
    if (!date) return "";
    if (date === "Event Actions") return date;

    // If it's already a formatted date string, return it
    if (typeof date === "string" && date.includes("-")) {
      try {
        const dateObj = parseISO(date);
        return `Day ${index + 1} - ${format(dateObj, "MMM dd, yyyy")}`;
      } catch (e) {
        return `Day ${index + 1} - ${date}`;
      }
    }

    return `Day ${index + 1} - ${date}`;
  };

  // Update the handleAddFaq function to clear validation errors
  const handleAddFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

    const currentFaqs = Array.isArray(formik.values.faqs)
      ? [...formik.values.faqs]
      : [];

    formik.setFieldValue("faqs", [
      ...currentFaqs,
      {
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim(),
      },
    ]);

    // Clear any validation errors for FAQs
    if (formik.errors.faqs) {
      formik.setFieldError("faqs", undefined);
    }

    setNewFaq({ question: "", answer: "" });
  };

  // Generate trip dates from start and end dates
  const getTripDates = () => {
    if (!formik.values.startDate || !formik.values.endDate) return [];

    try {
      const startDate = parseISO(formik.values.startDate);
      const endDate = parseISO(formik.values.endDate);
      const daysCount = differenceInDays(endDate, startDate) + 1;

      const dates = [];
      for (let i = 0; i < daysCount; i++) {
        const date = addDays(startDate, i);
        dates.push(format(date, "yyyy-MM-dd"));
      }

      return dates;
    } catch (e) {
      console.error("Error parsing dates:", e);
      return [];
    }
  };

  // Get all dates (trip dates + extra dates)
  const getAllDates = () => {
    const tripDates = getTripDates();
    return [...tripDates];
  };

  const [newMeal, setNewMeal] = useState({
    day: "",
    type: "breakfast",
    details: "",
  });

  const handleAddMeal = () => {
    if (!newMeal.day || !newMeal.type || !newMeal.details) return;

    const current = Array.isArray(formik.values.mealPlan)
      ? [...formik.values.mealPlan]
      : [];

    // Push a meal object that supports both keys (day and dayDate) for compatibility
    current.push({
      day: newMeal.day,
      dayDate: newMeal.day, // keep compatibility with older key name
      mealType: newMeal.type,
      type: newMeal.type, // compatibility
      details: newMeal.details,
    });

    formik.setFieldValue("mealPlan", current);
    setNewMeal({ day: "", type: "breakfast", details: "" });
  };

  // Remove a meal at index
  const removeMealAt = (index) => {
    const current = Array.isArray(formik.values.mealPlan)
      ? [...formik.values.mealPlan]
      : [];
    current.splice(index, 1);
    formik.setFieldValue("mealPlan", current);
  };

  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        // Store base64 string instead of File object
        formik.setFieldValue("eventImage", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAccommodationImageChange = (roomType, e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        formik.setFieldValue(
          `accommodationOptions.${roomType}.image`,
          base64String
        );
        
        // Update the appropriate preview state
        if (roomType === 'sharedRoom') {
          setSharedRoomImagePreview(base64String);
        } else if (roomType === 'privateRoom') {
          setPrivateRoomImagePreview(base64String);
        } else if (roomType === 'camping') {
          setCampingImagePreview(base64String);
        } else if (roomType === 'glamping') {
          setGlampingImagePreview(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    formik.setFieldValue("eventImage", null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAccommodationImage = (roomType) => {
    formik.setFieldValue(`accommodationOptions.${roomType}.image`, null);
    
    // Update the appropriate preview state
    if (roomType === 'sharedRoom') {
      setSharedRoomImagePreview(null);
    } else if (roomType === 'privateRoom') {
      setPrivateRoomImagePreview(null);
    } else if (roomType === 'camping') {
      setCampingImagePreview(null);
    } else if (roomType === 'glamping') {
      setGlampingImagePreview(null);
    }
  };

  // Add this handler function in your component
  const handleCancellationEnabledChange = (e) => {
    const isEnabled = e.target.checked;
    setCancellationEnabled(isEnabled);
    formik.setFieldValue("cancellationEnabled", isEnabled);

    // Initialize with default rules if enabling for the first time
    if (
      (isEnabled && !formik.values.cancellationRules) ||
      formik.values.cancellationRules.length === 0
    ) {
      formik.setFieldValue("cancellationRules", [
        {
          daysBefore: 0,
          percentage: 0,
          description: "",
        },
      ]);
    }
  };

  const handleAddCancellationRule = () => {
    const currentRules = Array.isArray(formik.values.cancellationRules)
      ? [...formik.values.cancellationRules]
      : [];

    formik.setFieldValue("cancellationRules", [
      ...currentRules,
      {
        daysBefore: 0,
        percentage: 0,
        description: "",
      },
    ]);
  };

  const updateCancellationRule = (index, field, value) => {
    const currentRules = Array.isArray(formik.values.cancellationRules)
      ? [...formik.values.cancellationRules]
      : [];

    if (currentRules[index]) {
      currentRules[index] = {
        ...currentRules[index],
        [field]: value,
      };
      formik.setFieldValue("cancellationRules", currentRules);
    }
  };

  const removeCancellationRule = (index) => {
    const currentRules = Array.isArray(formik.values.cancellationRules)
      ? [...formik.values.cancellationRules]
      : [];

    currentRules.splice(index, 1);
    formik.setFieldValue("cancellationRules", currentRules);
  };

  const handleAddInclusion = () => {
    if (!newInclusion.trim()) return;

    const currentInclusions = Array.isArray(formik.values.inclusions)
      ? [...formik.values.inclusions]
      : [];

    formik.setFieldValue("inclusions", [
      ...currentInclusions,
      newInclusion.trim(),
    ]);
    setNewInclusion("");
  };

  const handleAddExclusion = () => {
    if (!newExclusion.trim()) return;

    const currentExclusions = Array.isArray(formik.values.exclusions)
      ? [...formik.values.exclusions]
      : [];

    formik.setFieldValue("exclusions", [
      ...currentExclusions,
      newExclusion.trim(),
    ]);
    setNewExclusion("");
  };

  const removeInclusionAt = (index) => {
    const current = Array.isArray(formik.values.inclusions)
      ? [...formik.values.inclusions]
      : [];
    current.splice(index, 1);
    formik.setFieldValue("inclusions", current);
  };

  const removeExclusionAt = (index) => {
    const current = Array.isArray(formik.values.exclusions)
      ? [...formik.values.exclusions]
      : [];
    current.splice(index, 1);
    formik.setFieldValue("exclusions", current);
  };

  const removeFaqAt = (index) => {
    const current = Array.isArray(formik.values.faqs)
      ? [...formik.values.faqs]
      : [];
    current.splice(index, 1);
    formik.setFieldValue("faqs", current);

    // If no FAQs left, set validation error
    if (current.length === 0) {
      formik.setFieldError("faqs", "At least one FAQ is required");
    }
  };

  const handleGenderPreferenceChange = (gender, field, value) => {
    const updatedPreferences = { ...formik.values.genderPreferences };
    if (field === "allowed") {
      updatedPreferences[gender] = {
        ...updatedPreferences[gender],
        allowed: value,
        count: value ? updatedPreferences[gender].count : 0,
      };
    } else if (field === "count") {
      updatedPreferences[gender] = {
        ...updatedPreferences[gender],
        count: value,
      };
    }
    formik.setFieldValue("genderPreferences", updatedPreferences);
  };

  const handlePetTypeChange = (petType, value) => {
    const updatedPreferences = { ...formik.values.genderPreferences };
    updatedPreferences.petTypes[petType] = value;
    formik.setFieldValue("genderPreferences", updatedPreferences);
  };

  const calculateRemainingSeats = (excludeGender = null) => {
    const maxParticipants = parseInt(formik.values.maxParticipants) || 0;
    let allocated = 0;
    if (
      formik.values.genderPreferences.male.allowed &&
      excludeGender !== "male"
    ) {
      allocated += parseInt(formik.values.genderPreferences.male.count) || 0;
    }
    if (
      formik.values.genderPreferences.female.allowed &&
      excludeGender !== "female"
    ) {
      allocated += parseInt(formik.values.genderPreferences.female.count) || 0;
    }
    if (
      formik.values.genderPreferences.kids.allowed &&
      excludeGender !== "kids"
    ) {
      allocated += parseInt(formik.values.genderPreferences.kids.count) || 0;
    }
    return maxParticipants - allocated;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Manually trigger validation
    await formik.validateForm();

    // Check if there are any validation errors
    if (Object.keys(formik.errors).length > 0) {
      // Focus on the first error field
      const firstErrorField = Object.keys(formik.errors)[0];
      if (firstErrorField === "faqs") {
        // Scroll to FAQ section
        document
          .querySelector(".mb-8.p-4.border.border-gray-200.rounded-lg")
          .scrollIntoView({
            behavior: "smooth",
          });
      }
      return;
    }

    // If validation passes, submit the form
    formik.handleSubmit(e);
  };

  // Helper functions for activity-specific fields
  const handleYogaTimingToggle = (timing) => {
    const currentTimings = [...formik.values.yogaDetails.peakTimings];
    const index = currentTimings.indexOf(timing);
    
    if (index > -1) {
      currentTimings.splice(index, 1);
    } else {
      currentTimings.push(timing);
    }
    
    formik.setFieldValue("yogaDetails.peakTimings", currentTimings);
  };

  const handleYogaEquipmentToggle = (equipment) => {
    const currentEquipment = [...formik.values.yogaDetails.equipmentList];
    const index = currentEquipment.indexOf(equipment);
    
    if (index > -1) {
      currentEquipment.splice(index, 1);
    } else {
      currentEquipment.push(equipment);
    }
    
    formik.setFieldValue("yogaDetails.equipmentList", currentEquipment);
  };

  const handleSportsEquipmentToggle = (equipment) => {
    const currentEquipment = [...formik.values.sportsDetails.equipmentList];
    const index = currentEquipment.indexOf(equipment);
    
    if (index > -1) {
      currentEquipment.splice(index, 1);
    } else {
      currentEquipment.push(equipment);
    }
    
    formik.setFieldValue("sportsDetails.equipmentList", currentEquipment);
  };

  const handleSportsTimingToggle = (timing) => {
    const currentTimings = [...formik.values.sportsDetails.peakTimings];
    const index = currentTimings.indexOf(timing);
    
    if (index > -1) {
      currentTimings.splice(index, 1);
    } else {
      currentTimings.push(timing);
    }
    
    formik.setFieldValue("sportsDetails.peakTimings", currentTimings);
  };

  // Add custom timing functions
  const handleAddCustomTiming = (category) => {
    if (!newCustomTiming.trim()) return;
    
    const timing = newCustomTiming.trim();
    
    if (category === "yoga") {
      const currentTimings = [...formik.values.yogaDetails.customTimings];
      if (!currentTimings.includes(timing)) {
        formik.setFieldValue("yogaDetails.customTimings", [...currentTimings, timing]);
      }
    } else if (category === "sports") {
      const currentTimings = [...formik.values.sportsDetails.customTimings];
      if (!currentTimings.includes(timing)) {
        formik.setFieldValue("sportsDetails.customTimings", [...currentTimings, timing]);
      }
    }
    
    setNewCustomTiming("");
  };

  const handleRemoveCustomTiming = (category, timing) => {
    if (category === "yoga") {
      const currentTimings = [...formik.values.yogaDetails.customTimings];
      formik.setFieldValue(
        "yogaDetails.customTimings",
        currentTimings.filter(t => t !== timing)
      );
    } else if (category === "sports") {
      const currentTimings = [...formik.values.sportsDetails.customTimings];
      formik.setFieldValue(
        "sportsDetails.customTimings",
        currentTimings.filter(t => t !== timing)
      );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">
        {isEditMode ? "Edit Event" : "Create New Event"}
      </h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Section 1: Event Title & Image */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Event Title & Image</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Event Title*</label>
            <input
              type="text"
              name="eventTitle"
              onChange={formik.handleChange}
              value={formik.values.eventTitle}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            {formik.errors.eventTitle && formik.touched.eventTitle && (
              <div className="text-red-500 text-sm">
                {formik.errors.eventTitle}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Event Description*
            </label>
            <textarea
              name="eDescription" // Changed from "description" to "eDescription"
              onChange={formik.handleChange}
              value={formik.values.eDescription}
              className="w-full p-2 border border-gray-300 rounded min-h-[120px]"
              placeholder="Provide a detailed description of your event..."
              required
            />
            {formik.errors.eDescription && formik.touched.eDescription && (
              <div className="text-red-500 text-sm">
                {formik.errors.eDescription}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Include important details about your event to attract attendees
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Event Image* <span className="text-red-500">(Required)</span>
            </label>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4 relative">
                <div className="text-sm text-gray-500 mb-2">Image Preview:</div>
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* File Input */}
            <div className="flex items-center justify-center w-full">
              <label
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                  imagePreview
                    ? "border-gray-300"
                    : "border-blue-300 bg-blue-50 hover:bg-blue-100"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-blue-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF (MAX. 5MB)
                  </p>
                </div>
                <input
                  id="eventImage"
                  name="eventImage"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  accept="image/*"
                  // No required attribute here
                />
              </label>
            </div>
            {!imagePreview && (
              <p className="text-red-500 text-sm mt-1">
                Event image is required
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Upload a high-quality image that represents your event
              (recommended: 16:9 aspect ratio)
            </p>
          </div>
        </div>
        
        {/* Section 2: Event Category */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Event Category</h2>
          <div className="mb-4">
            <select
              name="eventCategory"
              onChange={formik.handleChange}
              value={formik.values.eventCategory}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="yoga">Yoga & Meditation</option>
              <option value="sports">Sports & Fitness</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="leisure">Leisure</option>
              <option value="business">Business</option>
              <option value="custom">Custom Activity</option>
            </select>
            {formik.errors.eventCategory && formik.touched.eventCategory && (
              <div className="text-red-500 text-sm">
                {formik.errors.eventCategory}
              </div>
            )}
          </div>

          {/* Subcategory based on main category */}
          {formik.values.eventCategory === "yoga" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Yoga Style*</label>
              <select
                name="yogaDetails.style"
                onChange={formik.handleChange}
                value={formik.values.yogaDetails.style}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select Yoga Style</option>
                <option value="hatha">Hatha Yoga</option>
                <option value="vinyasa">Vinyasa Flow</option>
                <option value="ashtanga">Ashtanga</option>
                <option value="iyengar">Iyengar</option>
                <option value="kundalini">Kundalini</option>
                <option value="yin">Yin Yoga</option>
                <option value="restorative">Restorative</option>
                <option value="power">Power Yoga</option>
                <option value="prenatal">Prenatal</option>
                <option value="meditation">Meditation</option>
              </select>
              {formik.errors.yogaStyle && (
                <div className="text-red-500 text-sm">
                  {formik.errors.yogaStyle}
                </div>
              )}
            </div>
          )}

          {formik.values.eventCategory === "sports" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Sport Type*</label>
              <select
                name="sportsDetails.sportType"
                onChange={formik.handleChange}
                value={formik.values.sportsDetails.sportType}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select Sport</option>
                <option value="tennis">Tennis</option>
                <option value="badminton">Badminton</option>
                <option value="squash">Squash</option>
                <option value="cricket">Cricket</option>
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
                <option value="volleyball">Volleyball</option>
                <option value="swimming">Swimming</option>
                <option value="running">Running</option>
                <option value="cycling">Cycling</option>
                <option value="martial">Martial Arts</option>
                <option value="other">Other Sport</option>
              </select>
              {formik.errors.sportType && (
                <div className="text-red-500 text-sm">
                  {formik.errors.sportType}
                </div>
              )}
            </div>
          )}

          {formik.values.eventCategory === "custom" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Describe Your Activity*</label>
              <input
                type="text"
                name="customActivity"
                onChange={formik.handleChange}
                value={formik.values.customActivity}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g. Pottery workshop, Cooking class, etc."
                required
              />
              {formik.errors.customActivity && (
                <div className="text-red-500 text-sm">
                  {formik.errors.customActivity}
                </div>
              )}
            </div>
          )}

          {/* Activity-specific details */}
          {formik.values.eventCategory === "yoga" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Yoga Details</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Experience Level</label>
                <select
                  name="yogaDetails.level"
                  onChange={formik.handleChange}
                  value={formik.values.yogaDetails.level}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all">All Levels</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Peak Timings</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "Early Morning (5-7 AM)",
                    "Morning (7-10 AM)",
                    "Mid-Morning (10-12 PM)",
                    "Afternoon (12-3 PM)",
                    "Late Afternoon (3-6 PM)",
                    "Evening (6-9 PM)",
                  ].map((timing) => (
                    <label
                      key={timing}
                      className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={formik.values.yogaDetails.peakTimings.includes(timing)}
                        onChange={() => handleYogaTimingToggle(timing)}
                        className="mr-2"
                      />
                      <span className="text-sm">{timing}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Timings for Yoga */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Custom Timings</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newCustomTiming}
                    onChange={(e) => setNewCustomTiming(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded"
                    placeholder="e.g. 4:30 AM - 5:30 AM, Weekend Special"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTiming('yoga');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCustomTiming('yoga')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                {formik.values.yogaDetails.customTimings.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formik.values.yogaDetails.customTimings.map((timing, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2"
                      >
                        {timing}
                        <button
                          type="button"
                          className="text-green-500 hover:text-green-700"
                          onClick={() => handleRemoveCustomTiming('yoga', timing)}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="yogaDetails.equipmentProvided"
                    checked={formik.values.yogaDetails.equipmentProvided}
                    onChange={formik.handleChange}
                    className="mr-2"
                  />
                  <label className="text-gray-700">Equipment Provided</label>
                </div>
                
                {formik.values.yogaDetails.equipmentProvided && (
                  <div className="pl-6">
                    <label className="block text-gray-700 mb-2">Select Equipment</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        "Yoga Mat",
                        "Yoga Blocks",
                        "Yoga Strap",
                        "Bolster",
                        "Blanket",
                        "Meditation Cushion",
                      ].map((equipment) => (
                        <label
                          key={equipment}
                          className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={formik.values.yogaDetails.equipmentList.includes(equipment)}
                            onChange={() => handleYogaEquipmentToggle(equipment)}
                            className="mr-2"
                          />
                          <span className="text-sm">{equipment}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {formik.values.eventCategory === "sports" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Sports Details</h3>
              
              {formik.values.sportsDetails.sportType === "tennis" && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Court Type</label>
                  <select
                    name="sportsDetails.courtType"
                    onChange={formik.handleChange}
                    value={formik.values.sportsDetails.courtType}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select Court Type</option>
                    <option value="hardcourt">Hard Court</option>
                    <option value="clay">Clay Court</option>
                    <option value="grass">Grass Court</option>
                    <option value="carpet">Carpet Court</option>
                    <option value="synthetic">Synthetic</option>
                  </select>
                </div>
              )}

              {formik.values.sportsDetails.sportType === "badminton" && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Court Type</label>
                  <select
                    name="sportsDetails.courtType"
                    onChange={formik.handleChange}
                    value={formik.values.sportsDetails.courtType}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select Court Type</option>
                    <option value="wooden">Wooden</option>
                    <option value="synthetic">Synthetic</option>
                    <option value="cement">Cement</option>
                  </select>
                </div>
              )}

              {formik.values.sportsDetails.sportType === "cricket" && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Ground Type</label>
                  <select
                    name="sportsDetails.courtType"
                    onChange={formik.handleChange}
                    value={formik.values.sportsDetails.courtType}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select Ground Type</option>
                    <option value="turf">Turf</option>
                    <option value="grass">Grass</option>
                    <option value="concrete">Concrete</option>
                    <option value="matting">Matting</option>
                  </select>
                </div>
              )}

              {formik.values.sportsDetails.sportType === "football" && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Field Type</label>
                  <select
                    name="sportsDetails.courtType"
                    onChange={formik.handleChange}
                    value={formik.values.sportsDetails.courtType}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select Field Type</option>
                    <option value="grass">Grass</option>
                    <option value="turf">Artificial Turf</option>
                    <option value="futsal">Futsal (Indoor)</option>
                    <option value="concrete">Concrete</option>
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Skill Level</label>
                <select
                  name="sportsDetails.skillLevel"
                  onChange={formik.handleChange}
                  value={formik.values.sportsDetails.skillLevel}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="professional">Professional</option>
                  <option value="all">All Levels</option>
                </select>
              </div>

              {/* Peak Timings for Sports */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Peak Timings</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "Early Morning (5-7 AM)",
                    "Morning (7-10 AM)",
                    "Mid-Morning (10-12 PM)",
                    "Afternoon (12-3 PM)",
                    "Late Afternoon (3-6 PM)",
                    "Evening (6-9 PM)",
                    "Night (9-11 PM)",
                  ].map((timing) => (
                    <label
                      key={timing}
                      className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={formik.values.sportsDetails.peakTimings.includes(timing)}
                        onChange={() => handleSportsTimingToggle(timing)}
                        className="mr-2"
                      />
                      <span className="text-sm">{timing}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Timings for Sports */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Custom Timings</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newCustomTiming}
                    onChange={(e) => setNewCustomTiming(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded"
                    placeholder="e.g. 11:30 PM - 1:00 AM, Midnight Special"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTiming('sports');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCustomTiming('sports')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                {formik.values.sportsDetails.customTimings.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formik.values.sportsDetails.customTimings.map((timing, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2"
                      >
                        {timing}
                        <button
                          type="button"
                          className="text-green-500 hover:text-green-700"
                          onClick={() => handleRemoveCustomTiming('sports', timing)}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="sportsDetails.equipmentProvided"
                    checked={formik.values.sportsDetails.equipmentProvided}
                    onChange={formik.handleChange}
                    className="mr-2"
                  />
                  <label className="text-gray-700">Equipment Provided</label>
                </div>
                
                {formik.values.sportsDetails.equipmentProvided && (
                  <div className="pl-6">
                    <label className="block text-gray-700 mb-2">Select Equipment</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {formik.values.sportsDetails.sportType === "tennis" && [
                        "Tennis Racket",
                        "Tennis Balls",
                        "Water Bottle",
                        "Towel",
                      ].map((equipment) => (
                        <label
                          key={equipment}
                          className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={formik.values.sportsDetails.equipmentList.includes(equipment)}
                            onChange={() => handleSportsEquipmentToggle(equipment)}
                            className="mr-2"
                          />
                          <span className="text-sm">{equipment}</span>
                        </label>
                      ))}
                      
                      {formik.values.sportsDetails.sportType === "badminton" && [
                        "Badminton Racket",
                        "Shuttlecocks",
                        "Water Bottle",
                        "Towel",
                      ].map((equipment) => (
                        <label
                          key={equipment}
                          className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={formik.values.sportsDetails.equipmentList.includes(equipment)}
                            onChange={() => handleSportsEquipmentToggle(equipment)}
                            className="mr-2"
                          />
                          <span className="text-sm">{equipment}</span>
                        </label>
                      ))}
                      
                      {formik.values.sportsDetails.sportType === "cricket" && [
                        "Cricket Bat",
                        "Cricket Ball",
                        "Stumps",
                        "Gloves",
                        "Pads",
                        "Helmet",
                      ].map((equipment) => (
                        <label
                          key={equipment}
                          className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={formik.values.sportsDetails.equipmentList.includes(equipment)}
                            onChange={() => handleSportsEquipmentToggle(equipment)}
                            className="mr-2"
                          />
                          <span className="text-sm">{equipment}</span>
                        </label>
                      ))}
                      
                      {formik.values.sportsDetails.sportType === "football" && [
                        "Football",
                        "Jersey",
                        "Shorts",
                        "Shin Guards",
                        "Water Bottle",
                      ].map((equipment) => (
                        <label
                          key={equipment}
                          className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={formik.values.sportsDetails.equipmentList.includes(equipment)}
                            onChange={() => handleSportsEquipmentToggle(equipment)}
                            className="mr-2"
                          />
                          <span className="text-sm">{equipment}</span>
                        </label>
                      ))}
                      
                      {formik.values.sportsDetails.sportType === "basketball" && [
                        "Basketball",
                        "Jersey",
                        "Water Bottle",
                      ].map((equipment) => (
                        <label
                          key={equipment}
                          className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={formik.values.sportsDetails.equipmentList.includes(equipment)}
                            onChange={() => handleSportsEquipmentToggle(equipment)}
                            className="mr-2"
                          />
                          <span className="text-sm">{equipment}</span>
                        </label>
                      ))}
                      
                      {formik.values.sportsDetails.sportType === "volleyball" && [
                        "Volleyball",
                        "Knee Pads",
                        "Water Bottle",
                      ].map((equipment) => (
                        <label
                          key={equipment}
                          className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={formik.values.sportsDetails.equipmentList.includes(equipment)}
                            onChange={() => handleSportsEquipmentToggle(equipment)}
                            className="mr-2"
                          />
                          <span className="text-sm">{equipment}</span>
                        </label>
                      ))}
                      
                      {formik.values.sportsDetails.sportType === "swimming" && [
                        "Swimming Goggles",
                        "Swimming Cap",
                        "Towel",
                        "Floatation Device",
                      ].map((equipment) => (
                        <label
                          key={equipment}
                          className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={formik.values.sportsDetails.equipmentList.includes(equipment)}
                            onChange={() => handleSportsEquipmentToggle(equipment)}
                            className="mr-2"
                          />
                          <span className="text-sm">{equipment}</span>
                        </label>
                      ))}
                      
                      {formik.values.sportsDetails.sportType === "running" && [
                        "Running Bib",
                        "Water Bottle",
                        "Energy Drink",
                        "Towel",
                      ].map((equipment) => (
                        <label
                          key={equipment}
                          className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={formik.values.sportsDetails.equipmentList.includes(equipment)}
                            onChange={() => handleSportsEquipmentToggle(equipment)}
                            className="mr-2"
                          />
                          <span className="text-sm">{equipment}</span>
                        </label>
                      ))}
                      
                      {formik.values.sportsDetails.sportType === "cycling" && [
                        "Bicycle",
                        "Helmet",
                        "Water Bottle",
                        "Repair Kit",
                      ].map((equipment) => (
                        <label
                          key={equipment}
                          className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={formik.values.sportsDetails.equipmentList.includes(equipment)}
                            onChange={() => handleSportsEquipmentToggle(equipment)}
                            className="mr-2"
                          />
                          <span className="text-sm">{equipment}</span>
                        </label>
                      ))}
                      
                      {formik.values.sportsDetails.sportType === "martial" && [
                        "Uniform",
                        "Belt",
                        "Protective Gear",
                        "Training Weapons",
                      ].map((equipment) => (
                        <label
                          key={equipment}
                          className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={formik.values.sportsDetails.equipmentList.includes(equipment)}
                            onChange={() => handleSportsEquipmentToggle(equipment)}
                            className="mr-2"
                          />
                          <span className="text-sm">{equipment}</span>
                        </label>
                      ))}
                      
                      {formik.values.sportsDetails.sportType === "other" && [
                        "Sport Equipment 1",
                        "Sport Equipment 2",
                        "Sport Equipment 3",
                        "Water Bottle",
                        "Towel",
                      ].map((equipment) => (
                        <label
                          key={equipment}
                          className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={formik.values.sportsDetails.equipmentList.includes(equipment)}
                            onChange={() => handleSportsEquipmentToggle(equipment)}
                            className="mr-2"
                          />
                          <span className="text-sm">{equipment}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Section 3: Group Type */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Group Type</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                type: "public",
                icon: "🌍",
                title: "Public Event",
                description:
                  "Open to all attendees. Anyone can discover and join this event.",
              },
              {
                type: "private",
                icon: "🔐",
                title: "Private Event",
                description:
                  "Only visible to people you share with. Perfect for friends, family, or special groups.",
              },
            ].map((item) => (
              <div
                key={item.type}
                onClick={() => formik.setFieldValue("groupType", item.type)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formik.values.groupType === item.type
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{item.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hidden radio inputs for form validation */}
          <input
            type="radio"
            name="groupType"
            value="public"
            checked={formik.values.groupType === "public"}
            onChange={formik.handleChange}
            className="hidden"
            required
          />
          <input
            type="radio"
            name="groupType"
            value="private"
            checked={formik.values.groupType === "private"}
            onChange={formik.handleChange}
            className="hidden"
          />

          {/* Private Options (shown only when private is selected) */}
          {formik.values.groupType === "private" && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">
                Private Options
              </h4>

              {/* Add your private-specific form fields here */}
              <div className="mb-4">
                <label className="block text-gray-600 text-sm mb-1">
                  Select Sharing Option
                </label>
                <select
                  name="privateSharingOption"
                  onChange={formik.handleChange}
                  value={formik.values.privateSharingOption || "individual"}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="individual">Individual Order Group</option>
                  <option value="group">Group Sharing</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="publicOption"
                  name="isPublic"
                  checked={formik.values.isPublic || false}
                  onChange={formik.handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="publicOption" className="text-gray-700 text-sm">
                  Mark as Public (applicable only for Private events)
                </label>
              </div>
            </div>
          )}
        </div>
        
        {/* Section 4: Booking Process */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Booking Process</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                value: "instant",
                icon: "⚡",
                title: "Instant Booking",
                description:
                  "Attendees can book immediately without waiting for approval.",
              },
              {
                value: "hostApproval",
                icon: "👋",
                title: "Host Approval",
                description:
                  "You'll review and approve each booking request manually.",
              },
            ].map((item) => (
              <div
                key={item.value}
                onClick={() =>
                  formik.setFieldValue("bookingProcess", item.value)
                }
                className={`p-4 border rounded-lg cursor-pointer transition-all text-center ${
                  formik.values.bookingProcess === item.value
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-medium text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Hidden radio inputs for form validation */}
          <input
            type="radio"
            name="bookingProcess"
            value="instant"
            checked={formik.values.bookingProcess === "instant"}
            onChange={formik.handleChange}
            className="hidden"
            required
          />
          <input
            type="radio"
            name="bookingProcess"
            value="hostApproval"
            checked={formik.values.bookingProcess === "hostApproval"}
            onChange={formik.handleChange}
            className="hidden"
          />
        </div>
        
        {/* Section 5: Event Date & Time */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Event Date & Time</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Start Date*</label>
              <input
                type="date"
                name="startDate"
                onChange={formik.handleChange}
                value={formik.values.startDate}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formik.errors.startDate && formik.touched.startDate && (
                <div className="text-red-500 text-sm">
                  {formik.errors.startDate}
                </div>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Start Time*</label>
              <input
                type="time"
                name="startTime"
                onChange={formik.handleChange}
                value={formik.values.startTime || "09:00"}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formik.errors.startTime && formik.touched.startTime && (
                <div className="text-red-500 text-sm">
                  {formik.errors.startTime}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">End Date*</label>
              <input
                type="date"
                name="endDate"
                onChange={formik.handleChange}
                value={formik.values.endDate}
                min={
                  formik.values.startDate ||
                  new Date().toISOString().split("T")[0]
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formik.errors.endDate && formik.touched.endDate && (
                <div className="text-red-500 text-sm">
                  {formik.errors.endDate}
                </div>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">End Time*</label>
              <input
                type="time"
                name="endTime"
                onChange={formik.handleChange}
                value={formik.values.endTime || "17:00"}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formik.errors.endTime && formik.touched.endTime && (
                <div className="text-red-500 text-sm">
                  {formik.errors.endTime}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Section 6: Event Location */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Event Location</h2>

          {/* Selection Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              {
                key: "isOnline",
                icon: "💻",
                label: "Online Event",
              },
              {
                key: "isOffline",
                icon: "📍",
                label: "Offline Event",
              },
            ].map((item) => (
              <div
                key={item.key}
                onClick={() =>
                  formik.setFieldValue(item.key, !formik.values[item.key])
                }
                className={`p-4 border rounded-lg cursor-pointer transition-all text-center ${
                  formik.values[item.key]
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-medium text-gray-800">{item.label}</h3>
              </div>
            ))}
          </div>

          {/* Offline Fields */}
          {formik.values.isOffline && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Place / Venue / Turf*
                </label>
                <input
                  type="text"
                  name="location"
                  onChange={formik.handleChange}
                  value={formik.values.location}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  required={formik.values.isOffline}
                />
                {formik.errors.location && formik.touched.location && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.location}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Google Map Link
                </label>
                <input
                  type="url"
                  name="googleMapLink"
                  onChange={formik.handleChange}
                  value={formik.values.googleMapLink}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Online Fields */}
          {formik.values.isOnline && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Online Meeting Link (Zoom/Meet/Other)*
              </label>
              <input
                type="url"
                name="onlineMeetingLink"
                onChange={formik.handleChange}
                value={formik.values.onlineMeetingLink}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                required={formik.values.isOnline}
              />
              {formik.errors.onlineMeetingLink &&
                formik.touched.onlineMeetingLink && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.onlineMeetingLink}
                  </div>
                )}
            </div>
          )}
        </div>
        
        <MergedItinerarySection formik={formik} />
        
        {/* Section 10: Accommodation Options */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Accommodation Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Shared Room</label>
              <input
                type="number"
                placeholder="Price"
                value={formik.values.accommodationOptions.sharedRoom.price}
                onChange={(e) => {
                  formik.setFieldValue(
                    "accommodationOptions.sharedRoom.price",
                    e.target.value
                  );
                }}
                className="w-full p-2 border border-gray-300 rounded"
              />
              
              {sharedRoomImagePreview && (
                <div className="mt-2 relative">
                  <img 
                    src={sharedRoomImagePreview} 
                    alt="Shared room" 
                    className="w-24 h-24 object-cover rounded-md" 
                  />
                  <button
                    type="button"
                    onClick={() => removeAccommodationImage('sharedRoom')}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <input
                type="file"
                onChange={(e) =>
                  handleAccommodationImageChange("sharedRoom", e)
                }
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Private Room</label>
              <input
                type="number"
                placeholder="Price"
                value={formik.values.accommodationOptions.privateRoom.price}
                onChange={(e) => {
                  formik.setFieldValue(
                    "accommodationOptions.privateRoom.price",
                    e.target.value
                  );
                }}
                className="w-full p-2 border border-gray-300 rounded"
              />
              
              {privateRoomImagePreview && (
                <div className="mt-2 relative">
                  <img 
                    src={privateRoomImagePreview} 
                    alt="Private room" 
                    className="w-24 h-24 object-cover rounded-md" 
                  />
                  <button
                    type="button"
                    onClick={() => removeAccommodationImage('privateRoom')}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <input
                type="file"
                onChange={(e) =>
                  handleAccommodationImageChange("privateRoom", e)
                }
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Camping</label>
              <input
                type="number"
                placeholder="Price"
                value={formik.values.accommodationOptions.camping.price}
                onChange={(e) => {
                  formik.setFieldValue(
                    "accommodationOptions.camping.price",
                    e.target.value
                  );
                }}
                className="w-full p-2 border border-gray-300 rounded"
              />
              
              {campingImagePreview && (
                <div className="mt-2 relative">
                  <img 
                    src={campingImagePreview} 
                    alt="Camping" 
                    className="w-24 h-24 object-cover rounded-md" 
                  />
                  <button
                    type="button"
                    onClick={() => removeAccommodationImage('camping')}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <input
                type="file"
                onChange={(e) =>
                  handleAccommodationImageChange("camping", e)
                }
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Glamping</label>
              <input
                type="number"
                placeholder="Price"
                value={formik.values.accommodationOptions.glamping.price}
                onChange={(e) => {
                  formik.setFieldValue(
                    "accommodationOptions.glamping.price",
                    e.target.value
                  );
                }}
                className="w-full p-2 border border-gray-300 rounded"
              />
              
              {glampingImagePreview && (
                <div className="mt-2 relative">
                  <img 
                    src={glampingImagePreview} 
                    alt="Glamping" 
                    className="w-24 h-24 object-cover rounded-md" 
                  />
                  <button
                    type="button"
                    onClick={() => removeAccommodationImage('glamping')}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <input
                type="file"
                onChange={(e) =>
                  handleAccommodationImageChange("glamping", e)
                }
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
            </div>
          </div>
          
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="settleToVendor"
              checked={formik.values.accommodationOptions.settleToVendor || false}
              onChange={(e) => {
                formik.setFieldValue("accommodationOptions", {
                  ...formik.values.accommodationOptions,
                  settleToVendor: e.target.checked,
                });
              }}
              className="mr-2"
            />
            <label htmlFor="settleToVendor" className="text-gray-700">
              Settle accommodation payment directly to vendor
            </label>
          </div>
        </div>
        
        {/* Section 11: Meal Plan */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Meal Plan</h2>
          {/* Existing meals */}
          {(formik.values.mealPlan || []).length === 0 ? (
            <p className="text-sm text-gray-500 italic mb-4">
              No meal plans added yet.
            </p>
          ) : (
            (formik.values.mealPlan || []).map((meal, index) => {
              // support both day and dayDate keys
              const dayKey = meal.day ?? meal.dayDate ?? "";
              const mealType = meal.mealType ?? meal.type ?? "meal";
              return (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-md mb-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h3 className="font-medium">
                      {dayKey ? formatDateLabel(dayKey, index) : ""} -{" "}
                      {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeMealAt(index)}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{meal.details}</p>
                </div>
              );
            })
          )}
          {/* Add new meal */}
          <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="font-medium mb-4">Add Meal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Date *</label>
                <select
                  value={newMeal.day}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, day: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Choose a date</option>
                  {getAllDates().map((d, idx) => (
                    <option key={d + "-" + idx} value={d}>
                      {formatDateLabel(d, idx)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Meal Type *</label>
                <select
                  value={newMeal.type}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Details *</label>
                <input
                  type="text"
                  value={newMeal.details}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, details: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Meal details"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleAddMeal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Add Meal
              </button>

              <button
                type="button"
                onClick={() => {
                  // quick-fill date with first trip date if none selected
                  if (!newMeal.day && getAllDates().length > 0) {
                    setNewMeal((prev) => ({ ...prev, day: getAllDates()[0] }));
                  } else {
                    // nothing
                  }
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Quick Pick Date
              </button>
            </div>
          </div>
        </div>
        
        {/* Section 12: Inclusions & Exclusions */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Inclusions & Exclusions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Inclusions *
              </label>
              <div className="space-y-2 mb-4">
                {(formik.values.inclusions || []).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-gray-50 rounded"
                  >
                    <span className="mr-2">✓</span>
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeInclusionAt(index)}
                      className="ml-auto text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {(!formik.values.inclusions ||
                  formik.values.inclusions.length === 0) && (
                  <p className="text-sm text-gray-500 italic">
                    No inclusions added yet.
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row">
                <input
                  type="text"
                  value={newInclusion}
                  onChange={(e) => setNewInclusion(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add inclusion"
                />
                <button
                  type="button"
                  onClick={handleAddInclusion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition mt-2 sm:mt-0"
                >
                  Add
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Exclusions *
              </label>
              <div className="space-y-2 mb-4">
                {(formik.values.exclusions || []).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-gray-50 rounded"
                  >
                    <span className="mr-2">✗</span>
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeExclusionAt(index)}
                      className="ml-auto text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {(!formik.values.exclusions ||
                  formik.values.exclusions.length === 0) && (
                  <p className="text-sm text-gray-500 italic">
                    No exclusions added yet.
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row">
                <input
                  type="text"
                  value={newExclusion}
                  onChange={(e) => setNewExclusion(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add exclusion"
                />
                <button
                  type="button"
                  onClick={handleAddExclusion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition mt-2 sm:mt-0"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 13: FAQ */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Frequently Asked Questions *
          </h2>

          {/* Display validation error if exists */}
          {formik.errors.faqs && (
            <div className="text-red-500 text-sm mb-4">
              {formik.errors.faqs}
            </div>
          )}

          <div className="space-y-4">
            {(formik.values.faqs || []).map((faq, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-md"
              >
                <div className="flex flex-col sm:flex-row justify-between">
                  <h3 className="font-medium">{faq.question}</h3>
                  <button
                    type="button"
                    onClick={() => removeFaqAt(index)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </div>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              </div>
            ))}

            {(!formik.values.faqs || formik.values.faqs.length === 0) && (
              <p className="text-sm text-gray-500 italic">No FAQs added yet.</p>
            )}

            <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <h3 className="font-medium mb-4">Add New FAQ</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={newFaq.question}
                    onChange={(e) =>
                      setNewFaq({ ...newFaq, question: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What's a common question travelers might ask?"
                  />
                </div>
                <div>
                  <textarea
                    value={newFaq.answer}
                    onChange={(e) =>
                      setNewFaq({ ...newFaq, answer: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Provide a helpful and detailed answer..."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add FAQ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 14: Participants */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Participants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Minimum Participants*
              </label>
              <input
                type="number"
                name="minParticipants"
                onChange={formik.handleChange}
                value={formik.values.minParticipants}
                className="w-full p-2 border border-gray-300 rounded"
                min="1"
                required
              />
              {formik.errors.minParticipants &&
                formik.touched.minParticipants && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.minParticipants}
                  </div>
                )}
              <p className="text-sm text-gray-500 mt-1">
                Minimum needed for trip to proceed
              </p>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Maximum Participants*
              </label>
              <input
                type="number"
                name="maxParticipants"
                onChange={formik.handleChange}
                value={formik.values.maxParticipants}
                className="w-full p-2 border border-gray-300 rounded"
                min={formik.values.minParticipants || 1}
                required
              />
              {formik.errors.maxParticipants &&
                formik.touched.maxParticipants && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.maxParticipants}
                  </div>
                )}
              <p className="text-sm text-gray-500 mt-1">
                Maximum capacity for the trip
              </p>
            </div>
          </div>
          {/* Age Group Preferences */}
          <div className="pb-6">
            <h3 className="text-lg font-semibold mb-4">
              Age Group Preferences
            </h3>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                name="noAgeLimit"
                checked={formik.values.noAgeLimit}
                onChange={(e) => {
                  formik.setFieldValue("noAgeLimit", e.target.checked);
                  if (e.target.checked) {
                    formik.setFieldValue("minAge", "");
                    formik.setFieldValue("maxAge", "");
                  }
                }}
                className="w-5 h-5"
              />
              <span className="text-gray-700 text-sm">No Age Limit</span>
            </div>
            {!formik.values.noAgeLimit && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Minimum Age
                  </label>
                  <input
                    type="number"
                    name="minAge"
                    value={formik.values.minAge}
                    onChange={formik.handleChange}
                    placeholder="Enter minimum age"
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled={
                      !formik.values.minParticipants ||
                      !formik.values.maxParticipants
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Maximum Age
                  </label>
                  <input
                    type="number"
                    name="maxAge"
                    value={formik.values.maxAge}
                    onChange={formik.handleChange}
                    placeholder="Enter maximum age"
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled={
                      !formik.values.minParticipants ||
                      !formik.values.maxParticipants
                    }
                  />
                </div>
              </div>
            )}
            {!formik.values.minParticipants ||
            !formik.values.maxParticipants ? (
              <p className="text-sm text-gray-500 italic">
                Please enter minimum and maximum participants to enable Age
                Group Preferences.
              </p>
            ) : null}
          </div>
          {/* Gender Preferences */}
          <div className="pb-6">
            <h3 className="text-lg font-semibold mb-4">Gender Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-4">
              {/* Male */}
              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formik.values.genderPreferences.male.allowed}
                    onChange={(e) =>
                      handleGenderPreferenceChange(
                        "male",
                        "allowed",
                        e.target.checked
                      )
                    }
                    className="w-5 h-5"
                    disabled={
                      !formik.values.minParticipants ||
                      !formik.values.maxParticipants
                    }
                  />
                  <span className="text-gray-700">Allow Male</span>
                </label>
                {formik.values.genderPreferences.male.allowed && (
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      Male Seats
                    </label>
                    <input
                      type="number"
                      value={formik.values.genderPreferences.male.count}
                      onChange={(e) =>
                        handleGenderPreferenceChange(
                          "male",
                          "count",
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                      max={formik.values.maxParticipants}
                      className="w-full p-2 border border-gray-300 rounded"
                      disabled={
                        !formik.values.minParticipants ||
                        !formik.values.maxParticipants
                      }
                    />
                  </div>
                )}
              </div>
              {/* Female */}
              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formik.values.genderPreferences.female.allowed}
                    onChange={(e) =>
                      handleGenderPreferenceChange(
                        "female",
                        "allowed",
                        e.target.checked
                      )
                    }
                    className="w-5 h-5"
                    disabled={
                      !formik.values.minParticipants ||
                      !formik.values.maxParticipants
                    }
                  />
                  <span className="text-gray-700">Allow Female</span>
                </label>
                {formik.values.genderPreferences.female.allowed && (
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      Female Seats
                    </label>
                    <input
                      type="number"
                      value={formik.values.genderPreferences.female.count}
                      onChange={(e) => {
                        const femaleCount = Math.min(
                          parseInt(e.target.value) || 0,
                          calculateRemainingSeats("female")
                        );
                        handleGenderPreferenceChange(
                          "female",
                          "count",
                          femaleCount
                        );
                      }}
                      min="0"
                      max={calculateRemainingSeats("female")}
                      className="w-full p-2 border border-gray-300 rounded"
                      disabled={
                        !formik.values.minParticipants ||
                        !formik.values.maxParticipants
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Remaining seats after male allocation:{" "}
                      {calculateRemainingSeats("female")}
                    </p>
                  </div>
                )}
              </div>
              {/* Kids */}
              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formik.values.genderPreferences.kids.allowed}
                    onChange={(e) =>
                      handleGenderPreferenceChange(
                        "kids",
                        "allowed",
                        e.target.checked
                      )
                    }
                    className="w-5 h-5"
                    disabled={
                      !formik.values.minParticipants ||
                      !formik.values.maxParticipants
                    }
                  />
                  <span className="text-gray-700">Allow Kids (below 12)</span>
                </label>
                {formik.values.genderPreferences.kids.allowed && (
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      Kids Seats
                    </label>
                    <input
                      type="number"
                      value={formik.values.genderPreferences.kids.count}
                      onChange={(e) => {
                        const kidsCount = Math.min(
                          parseInt(e.target.value) || 0,
                          calculateRemainingSeats("kids")
                        );
                        handleGenderPreferenceChange(
                          "kids",
                          "count",
                          kidsCount
                        );
                      }}
                      min="0"
                      max={calculateRemainingSeats("kids")}
                      className="w-full p-2 border border-gray-300 rounded"
                      disabled={
                        !formik.values.minParticipants ||
                        !formik.values.maxParticipants
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Remaining seats after male + female allocation:{" "}
                      {calculateRemainingSeats("kids")}
                    </p>
                  </div>
                )}
              </div>
              {/* Pets */}
              <div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formik.values.genderPreferences.pets}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        formik.setFieldValue("genderPreferences", {
                          ...formik.values.genderPreferences,
                          pets: checked,
                          petTypes: checked
                            ? formik.values.genderPreferences.petTypes
                            : { cat: false, dog: false },
                        });
                      }}
                      className="w-5 h-5"
                      disabled={
                        !formik.values.minParticipants ||
                        !formik.values.maxParticipants
                      }
                    />
                    <span className="text-gray-700">Allow Pets</span>
                  </label>
                  {formik.values.genderPreferences.pets && (
                    <div className="flex items-center gap-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formik.values.genderPreferences.petTypes.cat}
                          onChange={(e) =>
                            handlePetTypeChange("cat", e.target.checked)
                          }
                          className="w-4 h-4"
                          disabled={
                            !formik.values.minParticipants ||
                            !formik.values.maxParticipants
                          }
                        />
                        <span className="text-gray-600 text-sm">Cats</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formik.values.genderPreferences.petTypes.dog}
                          onChange={(e) =>
                            handlePetTypeChange("dog", e.target.checked)
                          }
                          className="w-4 h-4"
                          disabled={
                            !formik.values.minParticipants ||
                            !formik.values.maxParticipants
                          }
                        />
                        <span className="text-gray-600 text-sm">Dogs</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {!formik.values.minParticipants ||
            !formik.values.maxParticipants ? (
              <p className="text-sm text-gray-500 italic">
                Please enter minimum and maximum participants to enable Gender
                Preferences.
              </p>
            ) : null}
          </div>
        </div>
        
        {/* Section 17: Booking Process Timelines */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Booking Process Timelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Booking Start Date
              </label>
              <input
                type="date"
                name="bookingStartDate"
                onChange={formik.handleChange}
                value={formik.values.bookingStartDate}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Booking End Date
              </label>
              <input
                type="date"
                name="bookingEndDate"
                onChange={formik.handleChange}
                value={formik.values.bookingEndDate}
                min={formik.values.bookingStartDate}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Minimum Booking Fee Percentage *
            </label>
            <input
              type="number"
              name="minBookingFeePercentage"
              onChange={formik.handleChange}
              value={formik.values.minBookingFeePercentage}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
              max="100"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              The minimum percentage of the total amount required to book (e.g.,
              20 for 20%)
            </p>
          </div>
        </div>
        
       
        {/* Section 19: Additional Information */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          {/* Cancellation Policy Section */}
          <div className="mb-6">
            <label className="block text-gray-800 font-semibold text-base mb-2">
              Cancellation Policy
            </label>
            {/* Enable/Disable Checkbox */}
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                checked={formik.values.cancellationEnabled || false}
                onChange={handleCancellationEnabledChange}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="text-gray-700">Enable Cancellation Policy</span>
            </div>

            {/* Custom Cancellation Rules */}
            {formik.values.cancellationEnabled && (
              <>
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Cancellation Rules
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Define cancellation charges based on days before trip start
                    date.
                  </p>

                  {(formik.values.cancellationRules || []).map(
                    (rule, index) => (
                      <div
                        key={index}
                        className="mb-4 p-3 border rounded-md bg-white"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">
                            Rule {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCancellationRule(index)}
                            className="text-red-500 text-sm hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <label className="block text-gray-600 text-sm mb-1">
                              Days Before Trip *
                            </label>
                            <input
                              type="number"
                              value={rule.daysBefore || ""}
                              onChange={(e) =>
                                updateCancellationRule(
                                  index,
                                  "daysBefore",
                                  Number(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              min="0"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-gray-600 text-sm mb-1">
                              Charge Percentage *
                            </label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                value={rule.percentage || ""}
                                onChange={(e) =>
                                  updateCancellationRule(
                                    index,
                                    "percentage",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                min="0"
                                max="100"
                                required
                              />
                              <span className="ml-2 text-gray-600">%</span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-600 text-sm mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={rule.description || ""}
                              onChange={(e) =>
                                updateCancellationRule(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="E.g., 30+ days before departure"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  <button
                    type="button"
                    onClick={handleAddCancellationRule}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Rule
                  </button>
                </div>

                {/* Preview Section */}
                <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0016 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Preview: How Users Will See This Policy
                  </h4>

                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <h5 className="font-medium text-gray-800 mb-3">
                      Cancellation Policy
                    </h5>

                    {(formik.values.cancellationRules || []).length === 0 ? (
                      <p className="text-gray-500 italic">
                        No cancellation rules have been added yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {/* Sort rules by daysBefore in descending order for display */}
                        {[...(formik.values.cancellationRules || [])]
                          .sort(
                            (a, b) => (b.daysBefore || 0) - (a.daysBefore || 0)
                          )
                          .map((rule, index) => {
                            const daysBefore = rule.daysBefore || 0;
                            const percentage = rule.percentage || 0;
                            const description = rule.description || "";

                            let ruleText = "";
                            if (daysBefore === 0) {
                              ruleText =
                                percentage === 0
                                  ? "No cancellation charges"
                                  : `${percentage}% cancellation charge will apply`;
                            } else {
                              ruleText =
                                percentage === 0
                                  ? `Free cancellation up to ${daysBefore} day${
                                      daysBefore !== 1 ? "s" : ""
                                    } before the trip`
                                  : `${percentage}% cancellation charge for cancellations made ${daysBefore} day${
                                      daysBefore !== 1 ? "s" : ""
                                    } before the trip`;
                            }

                            return (
                              <div key={index} className="flex items-start">
                                <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-gray-700">
                                    {ruleText}
                                    {description && (
                                      <span className="text-gray-600">
                                        {" "}
                                        ({description})
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Section 20: Social Group Links */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Social Group Links</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              WhatsApp Group 1 (Enable only after payment)
            </label>
            <input
              type="url"
              name="socialLinks.whatsapp1"
              onChange={(e) => {
                formik.setFieldValue("socialLinks.whatsapp1", e.target.value);
              }}
              value={formik.values.socialLinks.whatsapp1}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              WhatsApp Group 2 (Visa processing)
            </label>
            <input
              type="url"
              name="socialLinks.whatsapp2"
              onChange={(e) => {
                formik.setFieldValue("socialLinks.whatsapp2", e.target.value);
              }}
              value={formik.values.socialLinks.whatsapp2}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Telegram Group 1</label>
            <input
              type="url"
              name="socialLinks.telegram1"
              onChange={(e) => {
                formik.setFieldValue("socialLinks.telegram1", e.target.value);
              }}
              value={formik.values.socialLinks.telegram1}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Telegram Group 2</label>
            <input
              type="url"
              name="socialLinks.telegram2"
              onChange={(e) => {
                formik.setFieldValue("socialLinks.telegram2", e.target.value);
              }}
              value={formik.values.socialLinks.telegram2}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Instagram Link (Past Trips)
            </label>
            <input
              type="url"
              name="socialLinks.instagram"
              onChange={(e) => {
                formik.setFieldValue("socialLinks.instagram", e.target.value);
              }}
              value={formik.values.socialLinks.instagram}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Additional Fields</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Add custom fields to collect traveler information
            </label>
            {formik.values.additionalFields.map((field, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Field Name"
                  value={field}
                  onChange={(e) => {
                    const newFields = [...formik.values.additionalFields];
                    newFields[index] = e.target.value;
                    formik.setFieldValue("additionalFields", newFields);
                  }}
                  className="p-2 border border-gray-300 rounded flex-grow"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newFields = [...formik.values.additionalFields];
                    newFields.splice(index, 1);
                    formik.setFieldValue("additionalFields", newFields);
                  }}
                  className="ml-2 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                formik.setFieldValue("additionalFields", [
                  ...formik.values.additionalFields,
                  "",
                ]);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Field
            </button>
          </div>
        </div>
        <TripTags formik={formik} />
        <PricingCalculation formik={formik} />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : (isEditMode ? "Update Event" : "Publish")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;