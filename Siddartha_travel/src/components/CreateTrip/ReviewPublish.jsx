import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiAlertCircle,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiMapPin,
  FiTag,
  FiArrowLeft,
  FiImage,
  FiHome,
  FiCoffee,
  FiX,
  FiLink,
  FiClipboard,
  FiTruck,
  FiUserX,
  FiInfo,
  FiNavigation,
  FiActivity,
  FiMap,
} from "react-icons/fi";

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

export default function ReviewPublish({ tripData = {} }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [selectedAccommodationType, setSelectedAccommodationType] = useState("shared");

  const safeTripData = useMemo(() => {
    const td = tripData || {};

    return {
      // Basic Details
      tripTitle: td.tripTitle || "",
      bannerImage: td.bannerImage || "",
      tripCategory: td.tripCategory || "",
      groupType: td.groupType || "public",
      privateSharingOption: td.privateSharingOption || "",
      isPublic: !!td.isPublic,
      bookingProcess: td.bookingProcess || "instant",
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
      pricing: { ...DEFAULT_PRICING, ...(td.pricing || {}) },

      // Logistics
      minParticipants: td.minParticipants || null,
      maxParticipants: td.maxParticipants || null,
      allowEarlyBooking: td.allowEarlyBooking || false,
      allowEarlyParticipants: td.allowEarlyParticipants || false,
      earlyBookingLimit: td.earlyBookingLimit || null,
      earlyBookingDiscount: td.earlyBookingDiscount || 0,
      earlyBookingEndDate: td.earlyBookingEndDate || "",
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
        ? td.cancellationRules.map((r) => ({
            daysBefore: Number(r?.daysBefore) || 0,
            percentage: Number(r?.percentage) || 0,
            description: r?.description ? String(r.description) : "",
            ...r,
          }))
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
      visaProcess: {
        assistanceFee: td.visaProcess?.assistanceFee ?? null,
        processingTimeFrom: td.visaProcess?.processingTimeFrom ?? null,
        processingTimeTo: td.visaProcess?.processingTimeTo ?? null,
        description: td.visaProcess?.description ?? "",
      },
      transportOptions: Array.isArray(td.transportOptions)
        ? td.transportOptions.map((it) => ({
            type: it?.type || "flight",
            departureTime: it?.departureTime || "",
            departureDate: it?.departureDate || "",
            cost: Number(it?.cost) || 0,
            description: it?.description || "",
            included: !!it?.included,
            ...it,
          }))
        : [],
      additionalFields: Array.isArray(td.additionalFields)
        ? td.additionalFields
        : [],

      basePrice: td.basePrice || 0,
      discountPrice: td.discountPrice || null,
      discountDeadline: td.discountDeadline || null,
    };
  }, [tripData]);

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Helper function to format place object
  const formatPlace = (place) => {
    if (!place) return "";
    if (typeof place === "string") return place;
    return [place.city, place.state, place.country].filter(Boolean).join(", ");
  };

  // Helper function to get travel mode icon
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

  const computePricingTotalLocal = (pricing = {}, accommodationData = null, selectedType = "shared") => {
    const full = { ...DEFAULT_PRICING, ...(pricing || {}) };
    const sumItems = (items = []) =>
      (items || []).reduce((s, it) => s + (Number(it?.cost) || 0), 0);

    // Calculate accommodation sum based on selected type
    let accommodationSum = 0;
    
    if (full.accommodation) {
      accommodationSum = Number(full.accommodation);
    } else if (full.accommodationItems && full.accommodationItems.length > 0) {
      accommodationSum = sumItems(full.accommodationItems);
    } else if (accommodationData) {
      // Use accommodationData if pricing doesn't have accommodation info
      const acc = accommodationData || {};
      
      // Calculate total for the selected accommodation type
      const typePrice = acc[`${selectedType}Price`] || 0;
      const typeDays = acc[`${selectedType}Days`] || [];
      const typeTotal = typePrice + typeDays.reduce((sum, day) => sum + (day.price || 0), 0);
      
      accommodationSum = typeTotal;
      
      // If no accommodation data is available for selected type, use default price
      if (accommodationSum === 0) {
        accommodationSum = selectedType === "shared" ? 1000 : 
                          selectedType === "private" ? 2000 :
                          selectedType === "camping" ? 800 : 1500;
      }
    } else {
      // Default to shared room if no accommodation data is available
      accommodationSum = selectedType === "shared" ? 1000 : 
                        selectedType === "private" ? 2000 :
                        selectedType === "camping" ? 800 : 1500;
    }

    const transportationSum =
      Number(full.transportation) || sumItems(full.transportationItems || []);
    const activitiesSum =
      Number(full.activities) || sumItems(full.activityItems || []);
    const bufferPercentage = Number(full.bufferPercentage) || 0;
    const yourFee = Number(full.yourFee) || 0;

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

  const calculateDuration = () => {
    if (!safeTripData.tripStartDate) return 0;
    const start = new Date(safeTripData.tripStartDate);
    const end = safeTripData.tripEndDate
      ? new Date(safeTripData.tripEndDate)
      : start;
    const diffMs = end - start;
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return days >= 0 ? days + 1 : 0;
  };

  // Calculate pricing and early bird discount
  const pricingData = useMemo(() => {
    const p = computePricingTotalLocal(safeTripData.pricing || {}, safeTripData.accommodation, selectedAccommodationType);
    const basePriceWithoutDiscount = Number(safeTripData.basePrice) > 0
        ? Number(safeTripData.basePrice)
        : p.total;

    // Check if early bird discount is applicable
    const isEarlyBirdApplicable = safeTripData.allowEarlyBooking && 
                                 safeTripData.earlyBookingDiscount > 0 &&
                                 safeTripData.earlyBookingEndDate &&
                                 new Date() < new Date(safeTripData.earlyBookingEndDate);

    // Calculate the discounted price if applicable
    const discountedPrice = isEarlyBirdApplicable 
        ? basePriceWithoutDiscount * (1 - safeTripData.earlyBookingDiscount / 100)
        : basePriceWithoutDiscount;

    return {
      basePriceWithoutDiscount,
      isEarlyBirdApplicable,
      discountedPrice,
      ...p
    };
  }, [safeTripData, selectedAccommodationType]);

  const renderStructuredItineraryPreview = () => {
    if (
      !Array.isArray(safeTripData.structuredItinerary) ||
      safeTripData.structuredItinerary.length === 0
    )
      return null;

    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h4 className="font-bold text-gray-700 mb-3">
          Structured Itinerary Preview
        </h4>

        <div className="space-y-6 max-h-80 overflow-auto pr-2">
          {safeTripData.structuredItinerary.map((day, idx) => {
            const dayNumber = day.day ?? idx + 1;
            const dateLabel = day.date
              ? new Date(day.date).toLocaleDateString("en-IN")
              : "No date";

            return (
              <div key={day.date ?? idx} className="text-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">
                      Day {dayNumber} {day.title ? `— ${day.title}` : ""}
                    </div>
                    <div className="text-xs text-gray-500">{dateLabel}</div>
                  </div>

                  <div className="text-xs text-gray-500">
                    {day.completed ? "Completed" : "Not completed"}
                  </div>
                </div>

                {/* Travel Mode */}
                {day.travelMode && (
                  <div className="mt-2 flex items-center text-xs bg-blue-50 p-2 rounded-md">
                    {getTravelModeIcon(day.travelMode)}
                    <span className="ml-2 font-medium text-blue-700">
                      Travel Mode: {day.travelMode.charAt(0).toUpperCase() + day.travelMode.slice(1)}
                    </span>
                  </div>
                )}

                {day.overview && (
                  <p className="text-gray-600 mt-2">{day.overview}</p>
                )}

                {Array.isArray(day.stops) && day.stops.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {day.stops.map((s, i) => (
                      <div
                        key={s.id ?? `${idx}-stop-${i}`}
                        className="p-3 border rounded-md bg-gray-50"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="font-medium">
                              {s.time ? `${s.time} — ` : ""}
                              {s.name || "Unnamed Stop"}
                              {s.place && (
                                <span className="ml-2 text-gray-500 text-sm">
                                  ({formatPlace(s.place)})
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {s.activityType || "activity"}
                            </div>
                          </div>

                          <div className="text-right text-xs text-gray-500">
                            {s.isMicroTrip ? (
                              <div>
                                Micro trip:{" "}
                                <span className="font-medium">Yes</span>
                                <div>₹{s.microTripPrice ?? 0}</div>
                              </div>
                            ) : (
                              <div>Micro trip: No</div>
                            )}
                          </div>
                        </div>

                        {s.description && (
                          <p className="text-gray-700 mt-2">{s.description}</p>
                        )}

                        {s.image && (
                          <img
                            src={s.image}
                            alt={s.name || "stop image"}
                            className="w-28 h-20 object-cover rounded-md mt-3"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic mt-2">
                    No stops added for this day.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAccommodationDetails = () => {
    if (!safeTripData.accommodation) return null;

    // Helper function to render each accommodation type
    const renderAccommodationType = (type, title, icon) => {
      const basePrice = safeTripData.accommodation[`${type}Price`] || 0;
      const baseName = safeTripData.accommodation[`${type}Name`] || "";
      const image = safeTripData.accommodation[`${type}Image`];
      const days = safeTripData.accommodation[`${type}Days`] || [];
      
      // Calculate total for this accommodation type
      const total = basePrice + days.reduce((sum, day) => sum + (day.price || 0), 0);
      
      // Only show if there's a base price or additional days
      if (basePrice <= 0 && days.length === 0) return null;

      return (
        <div className={`border rounded-lg p-4 mb-4 ${selectedAccommodationType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
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
            
            {/* Day 1 (Base Price) */}
            {basePrice > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Day 1</span>
                <span className="font-medium">{formatCurrency(basePrice)}</span>
              </div>
            )}
            
            {/* Additional Days */}
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
            
            {/* Total */}
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
        
        {/* Accommodation Type Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Accommodation Type for Pricing
          </label>
          <select
            value={selectedAccommodationType}
            onChange={(e) => setSelectedAccommodationType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="shared">Shared Rooms</option>
            <option value="private">Private Rooms</option>
            <option value="camping">Camping</option>
            <option value="glamping">Glamping</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderAccommodationType("shared", "Shared Rooms", "👥")}
          {renderAccommodationType("private", "Private Rooms", "🏠")}
          {renderAccommodationType("camping", "Camping", "⛺")}
          {renderAccommodationType("glamping", "Glamping", "🏕️")}
        </div>
        
        {safeTripData.accommodation.settleToVendor && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Payment will be settled directly with vendor
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderGenderPreferences = () => {
    if (!safeTripData.genderPreferences) return null;

    const { male, female, kids } = safeTripData.genderPreferences;
    const petTypes = safeTripData.genderPreferences?.petTypes || {
      cat: false,
      dog: false,
    };
    const petsAllowed =
      safeTripData.genderPreferences?.pets || petTypes.cat || petTypes.dog;

    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
          <FiUsers className="text-gray-500" /> Gender & Pet Preferences
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {male?.allowed && (
            <div>
              <p className="font-medium">Male</p>
              <p className="text-gray-600">{male.count} seats</p>
            </div>
          )}
          {female?.allowed && (
            <div>
              <p className="font-medium">Female</p>
              <p className="text-gray-600">{female.count} seats</p>
            </div>
          )}
          {kids?.allowed && (
            <div>
              <p className="font-medium">Kids (below 12)</p>
              <p className="text-gray-600">{kids.count} seats</p>
            </div>
          )}
          {/* Pets */}
          {petsAllowed && (
            <div>
              <p className="font-medium">Pets Allowed</p>
              <p className="text-gray-600">
                {petTypes.cat ? "Cats" : ""}
                {petTypes.cat && petTypes.dog ? ", " : ""}
                {petTypes.dog ? "Dogs" : ""}
                {!petTypes.cat && !petTypes.dog ? "Yes" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBookingDetails = () => {
    if (!safeTripData) return null;

    const formatDate = (d) => {
      if (!d) return "—";
      try {
        const dt = new Date(d);
        if (Number.isNaN(dt.getTime())) return d;
        return dt.toLocaleDateString("en-IN");
      } catch {
        return d;
      }
    };

    const isValidDate = (d) => {
      if (!d) return false;
      const dt = new Date(d);
      return !Number.isNaN(dt.getTime());
    };

    const additionalSum = (safeTripData.additionalPayments || []).reduce(
      (s, p) => s + (Number(p.percentage) || 0),
      0
    );

    const initialPerc = Number(safeTripData.initialPaymentPercentage) || 0;
    const paymentReq = safeTripData.paymentRequirement || {};

    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
          <FiCalendar className="text-gray-500" /> Booking & Payment
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Booking process & deadline */}
          <div>
            <p className="font-medium">Booking Process</p>
            <p className="text-gray-600 capitalize">
              {safeTripData.bookingProcess === "instant"
                ? "Instant booking"
                : safeTripData.bookingProcess === "approval"
                ? "Host approval required"
                : safeTripData.bookingProcess}
            </p>
          </div>

          {safeTripData.bookingDeadline && (
            <div>
              <p className="font-medium">Booking Deadline</p>
              <p className="text-gray-600">
                {formatDate(safeTripData.bookingDeadline)}
              </p>
            </div>
          )}

          {/* Previous Participation */}
          <div>
            <p className="font-medium">Previous Participation</p>
            <p className="text-gray-600">
              {safeTripData.allowPreviousParticipation ? "Allowed" : "Not Allowed"}
            </p>
          </div>

          {/* Group Size */}
          <div>
            <p className="font-medium">Group Size</p>
            <p className="text-gray-600">
              {safeTripData.minParticipants ?? 0} –{" "}
              {safeTripData.maxParticipants ?? "∞"} participants
            </p>
          </div>

          {/* Booking timeline (explicit start/end) */}
          {(safeTripData.bookingStartDate || safeTripData.bookingEndDate) && (
            <>
              <div>
                <p className="font-medium">Booking Timeline Start</p>
                <p className="text-gray-600">
                  {formatDate(safeTripData.bookingStartDate)}
                </p>
              </div>
              <div>
                <p className="font-medium">Booking Timeline End</p>
                <p className="text-gray-600">
                  {formatDate(safeTripData.bookingEndDate)}
                </p>
              </div>
            </>
          )}

          {/* Early bird */}
          {safeTripData.allowEarlyBooking && (
            <>
              <div>
                <p className="font-medium">Early-bird Discount</p>
                <p className="text-gray-600">
                  {safeTripData.earlyBookingDiscount
                    ? `${safeTripData.earlyBookingDiscount}% off`
                    : "Configured"}
                </p>
              </div>
              <div>
                <p className="font-medium">Early-bird End Date</p>
                <p className="text-gray-600">
                  {formatDate(safeTripData.earlyBookingEndDate)}
                </p>
              </div>
            </>
          )}

          {/* Payment type */}
          <div>
            <p className="font-medium">Payment Type</p>
            <p className="text-gray-600 capitalize">
              {safeTripData.paymentType}
            </p>
          </div>

          {/* Full payment window */}
          {(safeTripData.paymentType === "full" ||
            safeTripData.paymentType === "both") && (
            <>
              <div>
                <p className="font-medium">Full Payment Start</p>
                <p className="text-gray-600">
                  {formatDate(safeTripData.fullPaymentBookingStart)}
                </p>
              </div>
              <div>
                <p className="font-medium">Full Payment End</p>
                <p className="text-gray-600">
                  {formatDate(safeTripData.fullPaymentBookingEnd)}
                </p>
              </div>
            </>
          )}

          {/* Partial payment window and initial percentage */}
          {(safeTripData.paymentType === "partial" ||
            safeTripData.paymentType === "both") && (
            <>
              <div>
                <p className="font-medium">Partial Payment Start</p>
                <p className="text-gray-600">
                  {formatDate(safeTripData.partialPaymentStart)}
                </p>
              </div>
              <div>
                <p className="font-medium">Partial Payment End</p>
                <p className="text-gray-600">
                  {formatDate(safeTripData.partialPaymentEnd)}
                </p>
              </div>
              <div>
                <p className="font-medium">Initial Payment</p>
                <p className="text-gray-600">{initialPerc}%</p>
              </div>
            </>
          )}

          {/* Additional installments */}
          {safeTripData.additionalPayments?.length > 0 && (
            <div className="md:col-span-2">
              <p className="font-medium">Additional Installments</p>
              <ul className="list-disc list-inside text-gray-600">
                {safeTripData.additionalPayments.map((p, i) => {
                  const dateStr = isValidDate(p.date)
                    ? formatDate(p.date)
                    : p.date || "—";
                  const percStr = p.percentage ?? p.perc ?? 0;
                  return (
                    <li key={i}>
                      {p.label || `Installment ${i + 1}`} — {percStr}% due on{" "}
                      {dateStr}
                      {p.description ? ` (${p.description})` : ""}
                    </li>
                  );
                })}
              </ul>

              <p className="text-sm text-gray-500 mt-2">
                Installments total:{" "}
                <span className="font-medium">{additionalSum}%</span>
                {safeTripData.paymentType === "partial" && (
                  <>
                    {" "}
                    - initial {initialPerc}% ={" "}
                    <span className="font-medium">
                      {initialPerc + additionalSum}%
                    </span>{" "}
                    of total (should not exceed 100%)
                  </>
                )}
              </p>
            </div>
          )}

          {/* Payment requirement / summary */}
          <div className="md:col-span-2">
            <p className="font-medium">Payment Requirement</p>
            <p className="text-gray-700">
              {paymentReq.type === "partial"
                ? `Partial payment — ${
                    paymentReq.percentage ?? initialPerc
                  }% required upfront`
                : "Full payment required"}
            </p>

            {/* Helpful hint if percentages mismatch */}
            {paymentReq.type === "partial" &&
              initialPerc + additionalSum > 100 && (
              <p className="text-sm text-red-600 mt-2">
                Warning: initial + installments exceed 100% (
                {initialPerc + additionalSum}%)
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPricingDetails = () => {
    if (!safeTripData) return null;

    const pricing = safeTripData.pricing || { ...DEFAULT_PRICING };

    const sumItems = (items = []) =>
      (items || []).reduce((sum, it) => sum + (Number(it?.cost) || 0), 0);

    // Calculate accommodation sum based on selected type
    let accommodationSum = 0;
    let accommodationDetails = "";
    
    if (pricing.accommodation) {
      accommodationSum = Number(pricing.accommodation);
      accommodationDetails = "Using flat accommodation value";
    } else if (pricing.accommodationItems && pricing.accommodationItems.length > 0) {
      accommodationSum = sumItems(pricing.accommodationItems);
      accommodationDetails = "Using accommodation items";
    } else {
      // Use safeTripData.accommodation if pricing doesn't have accommodation info
      const acc = safeTripData.accommodation || {};
      
      // Calculate total for the selected accommodation type
      const typePrice = acc[`${selectedAccommodationType}Price`] || 0;
      const typeDays = acc[`${selectedAccommodationType}Days`] || [];
      const typeTotal = typePrice + typeDays.reduce((sum, day) => sum + (day.price || 0), 0);
      
      accommodationSum = typeTotal;
      accommodationDetails = `Using ${selectedAccommodationType} accommodation (${formatCurrency(typeTotal)})`;
      
      // If no accommodation data is available for selected type, use default price
      if (accommodationSum === 0) {
        const defaultPrice = selectedAccommodationType === "shared" ? 1000 : 
                             selectedAccommodationType === "private" ? 2000 :
                             selectedAccommodationType === "camping" ? 800 : 1500;
        accommodationSum = defaultPrice;
        accommodationDetails = `Using default ${selectedAccommodationType} price (${formatCurrency(defaultPrice)})`;
      }
    }

    const transportationSum =
      Number(pricing.transportation) ||
      sumItems(pricing.transportationItems || []);
    const activitiesSum =
      Number(pricing.activities) || sumItems(pricing.activityItems || []);
    const bufferPercentage =
      Number(pricing.bufferPercentage) || DEFAULT_PRICING.bufferPercentage;
    const yourFee = Number(pricing.yourFee) || 0;

    const subtotal = accommodationSum + transportationSum + activitiesSum;
    const bufferAmount = subtotal * (bufferPercentage / 100);
    const computedTotal = subtotal + bufferAmount + yourFee;
    const finalPrice =
      safeTripData.basePrice && safeTripData.basePrice > 0
        ? Number(safeTripData.basePrice)
        : computedTotal;

    // discount / early bird handling (if any)
    const hasDiscount = Number(safeTripData.discountPrice) > 0;
    const discountPrice = hasDiscount
      ? Number(safeTripData.discountPrice)
      : null;
    const discountDeadline = safeTripData.discountDeadline || null;

    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
          <FiDollarSign className="text-gray-500" /> Pricing Details (per
          person)
        </h4>

        {/* Itemized Sections */}
        <div className="space-y-4">
          {/* Accommodation items */}
          <div>
            <div className="font-medium text-gray-800 mb-2">Accommodation</div>
            <div className="text-sm text-gray-500 mb-2">
              {accommodationDetails}
            </div>
            
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-600">Accommodation subtotal</span>
              <span className="font-medium">
                {formatCurrency(accommodationSum)}
              </span>
            </div>
          </div>

          {/* Transportation items */}
          <div>
            <div className="font-medium text-gray-800 mb-2">Transportation</div>
            {pricing.transportationItems &&
            pricing.transportationItems.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-600">
                {pricing.transportationItems.map((it, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{it.name || `Transport ${i + 1}`}</span>
                    <span className="font-medium">
                      {formatCurrency(Number(it.cost) || 0)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500">
                No line items — using flat value.
              </div>
            )}

            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-600">Transportation subtotal</span>
              <span className="font-medium">
                {formatCurrency(transportationSum)}
              </span>
            </div>
          </div>

          {/* Activities items */}
          <div>
            <div className="font-medium text-gray-800 mb-2">
              Activities / Extras
            </div>
            {pricing.activityItems && pricing.activityItems.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-600">
                {pricing.activityItems.map((it, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{it.name || `Activity ${i + 1}`}</span>
                    <span className="font-medium">
                      {formatCurrency(Number(it.cost) || 0)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500">
                No line items — using flat value.
              </div>
            )}

            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-600">Activities subtotal</span>
              <span className="font-medium">
                {formatCurrency(activitiesSum)}
              </span>
            </div>
          </div>

          {/* Divider + totals */}
          <div className="border-t pt-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-sm mt-1">
              <span>Buffer ({bufferPercentage}%)</span>
              <span className="font-medium">
                {formatCurrency(bufferAmount)}
              </span>
            </div>

            <div className="flex justify-between text-sm mt-1">
              <span>Your fee</span>
              <span className="font-medium">{formatCurrency(yourFee)}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg mt-3">
              <span>Computed total</span>
              <span>{formatCurrency(computedTotal)}</span>
            </div>

            <div className="mt-3">
              {/* Early bird discount display */}
              {pricingData.isEarlyBirdApplicable ? (
                <>
                  <p className="text-gray-800">
                    Final price per person:{" "}
                    <span className="text-gray-500 line-through">
                      {formatCurrency(pricingData.basePriceWithoutDiscount)}
                    </span>
                    <span className="font-bold text-2xl text-green-600 ml-2">
                      {formatCurrency(pricingData.discountedPrice)}
                    </span>
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Early bird discount: {safeTripData.earlyBookingDiscount}% off until {new Date(safeTripData.earlyBookingEndDate).toLocaleDateString("en-IN")}
                  </p>
                </>
              ) : (
                <p className="text-gray-800">
                  Final price per person:{" "}
                  <span className="font-bold text-2xl">
                    {formatCurrency(pricingData.basePriceWithoutDiscount)}
                  </span>
                  {Number(safeTripData.basePrice) > 0 && (
                    <span className="ml-3 text-sm text-gray-500">
                      (basePrice overrides computed)
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Regular discount (if any) */}
            {hasDiscount && (
              <div className="mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                    Discount Price
                  </span>
                  <span className="text-gray-700 font-medium">
                    {formatCurrency(discountPrice)}
                  </span>
                </div>
                {discountDeadline && (
                  <p className="text-gray-500 mt-1">
                    Valid until:{" "}
                    {new Date(discountDeadline).toLocaleDateString("en-IN")}
                  </p>
                )}
              </div>
            )}

            {/* Helpful warnings */}
            <div className="mt-3">
              {computedTotal <= 0 && (
                <p className="text-sm text-red-600">
                  Warning: computed pricing is zero — please configure pricing
                  or basePrice.
                </p>
              )}

              {Number(safeTripData.basePrice) > 0 &&
                Number(safeTripData.basePrice) !== Number(finalPrice) && (
                <p className="text-sm text-gray-500">
                  Note: Base price set to{" "}
                  {formatCurrency(Number(safeTripData.basePrice))} — this
                  overrides computed pricing.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMealPlans = () => {
    if (!safeTripData.mealPlans || safeTripData.mealPlans.length === 0)
      return null;

    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
          <FiCoffee className="text-gray-500" /> Meal Plans
        </h4>
        <ul className="list-disc pl-5">
          {safeTripData.mealPlans.map((meal, index) => (
            <li key={index} className="text-gray-600">
              {/* Render nicely */}
              {meal.type ? (
                <>
                  <span className="font-semibold">{meal.type}</span>
                  {meal.details && ` – ${meal.details}`}
                  {meal.day && ` (Day ${meal.day})`}
                </>
              ) : (
                String(meal) // fallback if it's just a string
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderInclusionsExclusions = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {safeTripData.inclusions && safeTripData.inclusions.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-700 mb-2">Inclusions</h4>
            <ul className="list-disc pl-5">
              {safeTripData.inclusions.map((item, index) => (
                <li key={index} className="text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {safeTripData.exclusions && safeTripData.exclusions.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-700 mb-2">Exclusions</h4>
            <ul className="list-disc pl-5">
              {safeTripData.exclusions.map((item, index) => (
                <li key={index} className="text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderFAQs = () => {
    if (!safeTripData.faqs || safeTripData.faqs.length === 0) return null;

    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-bold text-gray-700 mb-4">
          Frequently Asked Questions
        </h4>
        <div className="space-y-4">
          {safeTripData.faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-100 pb-4 last:border-0"
            >
              <h5 className="font-medium text-gray-800">{faq.question}</h5>
              <p className="text-gray-600 mt-1">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTransportOptions = () => {
    if (
      !safeTripData.transportOptions ||
      safeTripData.transportOptions.length === 0
    )
      return null;

    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
          <FiTruck className="text-gray-500" /> Transport Options
        </h4>

        <div className="space-y-3">
          {safeTripData.transportOptions.map((t, i) => (
            <div key={i} className="p-3 border rounded-md bg-gray-50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-gray-800">
                    {t.type?.charAt(0)?.toUpperCase() + t.type?.slice(1) ||
                      "Transport"}
                    {t.included ? (
                      <span className="ml-3 inline-block px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                        Included
                      </span>
                    ) : (
                      <span className="ml-3 inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        Optional
                      </span>
                    )}
                  </div>

                  {(t.departureDate || t.departureTime) && (
                    <div className="text-sm text-gray-600 mt-1">
                      {t.departureDate
                        ? new Date(t.departureDate).toLocaleDateString("en-IN")
                        : ""}
                      {t.departureDate && t.departureTime ? " • " : ""}
                      {t.departureTime ? t.departureTime : ""}
                    </div>
                  )}

                  {t.description && (
                    <div className="text-sm text-gray-700 mt-2">
                      {t.description}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  {t.cost > 0 ? (
                    <div className="text-gray-900 font-medium">
                      {formatCurrency(t.cost)}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No extra cost</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCancellationPolicy = () => {
    if (
      !safeTripData.cancellationEnabled ||
      !safeTripData.cancellationRules ||
      safeTripData.cancellationRules.length === 0
    )
      return null;

    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
          <FiUserX className="text-gray-500" /> Cancellation Policy
        </h4>

        <div className="space-y-3">
          {safeTripData.cancellationRules.map((rule, index) => {
            const days = Number(rule.daysBefore) || 0;
            const chargePerc = Number(rule.percentage) || 0; // charge %
            const refundPerc = Math.max(0, Math.min(100, 100 - chargePerc)); // implied refund %
            const desc = rule.description || "";

            return (
              <div key={index} className="text-sm">
                <p className="font-medium">
                  {days === 0
                    ? "On or after trip date"
                    : `${days} day${days > 1 ? "s" : ""} before trip`}
                  :
                  <span className="ml-2 text-gray-800">
                    {chargePerc}% charge
                  </span>
                  <span className="ml-3 text-gray-600">
                    ({refundPerc}% refund)
                  </span>
                </p>
                {desc && <p className="text-gray-500 mt-1">{desc}</p>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderVisaInfo = () => {
    if (!safeTripData.visaRequired) return null;

    const hasDocs =
      Array.isArray(safeTripData.visaDocuments) &&
      safeTripData.visaDocuments.length > 0;
    const vp = safeTripData.visaProcess || {};
    const hasProcessDetails =
      (vp.assistanceFee !== null &&
        vp.assistanceFee !== undefined &&
        vp.assistanceFee !== 0) ||
      (vp.processingTimeFrom !== null && vp.processingTimeFrom !== undefined) ||
      (vp.processingTimeTo !== null && vp.processingTimeTo !== undefined) ||
      (vp.description && vp.description.trim() !== "");

    const formatProcessingTime = () => {
      const from = vp.processingTimeFrom;
      const to = vp.processingTimeTo;
      if (from && to) return `${from} - ${to} days`;
      if (from) return `${from} day${from > 1 ? "s" : ""}`;
      if (to) return `Up to ${to} day${to > 1 ? "s" : ""}`;
      return "—";
    };

    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h4 className="font-bold text-gray-700 mb-2">Visa Information</h4>
        <p className="text-gray-600 mb-3">Visa is required for this trip</p>

        {hasDocs && (
          <div className="mb-3">
            <h5 className="font-medium text-gray-700 mb-1">
              Required Documents
            </h5>
            <ul className="list-disc pl-5">
              {safeTripData.visaDocuments.map((doc, idx) => (
                <li key={idx} className="text-gray-600">
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasProcessDetails && (
          <div>
            <h5 className="font-medium text-gray-700 mb-1">Visa Process</h5>

            {/* Assistance Fee */}
            {vp.assistanceFee !== null && vp.assistanceFee !== undefined && (
              <p className="text-gray-600">
                <span className="font-medium">Processing assistance fee: </span>
                {formatCurrency(vp.assistanceFee)}
              </p>
            )}

            {/* Processing Time */}
            {(vp.processingTimeFrom || vp.processingTimeTo) && (
              <p className="text-gray-600 mt-1">
                <span className="font-medium">Processing time: </span>
                {formatProcessingTime()}
              </p>
            )}

            {/* Description */}
            {vp.description && vp.description.trim() !== "" && (
              <div className="mt-2">
                <h6 className="font-medium text-gray-700 mb-1">Notes</h6>
                <p className="text-gray-600">{vp.description}</p>
              </div>
            )}
          </div>
        )}

        {/* If no docs or process data, show helpful hint */}
        {!hasDocs && !hasProcessDetails && (
          <p className="text-sm text-gray-500">
            No visa documents or process details provided yet.
          </p>
        )}
      </div>
    );
  };

  const renderLinks = () => {
    const hasSocialLinks =
      safeTripData.socialGroupLinks &&
      safeTripData.socialGroupLinks.some((link) => link && link.trim() !== "");
    const hasAdditionalLinks =
      safeTripData.additionalLinks && safeTripData.additionalLinks.length > 0;
    const hasRegistrationLink =
      safeTripData.registrationFormLink &&
      safeTripData.registrationFormLink.trim() !== "";

    if (!hasSocialLinks && !hasAdditionalLinks && !hasRegistrationLink)
      return null;

    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
          <FiLink className="text-gray-500" /> Important Links
        </h4>

        {hasRegistrationLink && (
          <div className="mb-3">
            <h5 className="font-medium text-gray-700 mb-1">
              Registration Form:
            </h5>
            <a
              href={safeTripData.registrationFormLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {safeTripData.registrationFormLink}
            </a>
          </div>
        )}

        {hasSocialLinks && (
          <div className="mb-3">
            <h5 className="font-medium text-gray-700 mb-1">
              Social Group Links:
            </h5>
            <div className="space-y-1">
              {safeTripData.socialGroupLinks.map(
                (link, index) =>
                  link &&
                  link.trim() !== "" && (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all block"
                    >
                      {link}
                    </a>
                  )
              )}
            </div>
          </div>
        )}

        {hasAdditionalLinks && (
          <div>
            <h5 className="font-medium text-gray-700 mb-1">
              Additional Links:
            </h5>
            <div className="space-y-1">
              {safeTripData.additionalLinks.map((link, index) => (
                <div key={index} className="flex items-center">
                  <span className="mr-2 text-gray-500 capitalize">
                    {link.type || "link"}:
                  </span>
                  {link.type === "file" ? (
                    <span className="text-gray-600">
                      {link.value?.name || "Uploaded file"}
                    </span>
                  ) : (
                    <a
                      href={link.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {link.value}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleEdit = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Review & Publish</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Final check — confirm everything below before publishing.
        </p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700">{error}</p>
                <div className="mt-2">
                  <button
                    onClick={handleEdit}
                    className="text-sm underline text-red-600"
                  >
                    Go back to edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Hero / banner preview */}
          <div className="relative bg-gray-50 rounded-lg overflow-hidden h-[260px] w-full">
            {safeTripData.bannerImage ? (
              <img
                src={safeTripData.bannerImage}
                alt="Trip banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400">
                <div className="flex flex-col items-center">
                  <FiImage className="w-8 h-8 mb-2" />
                  <div>No banner image</div>
                </div>
              </div>
            )}

            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/35 to-transparent text-white">
              <h3 className="text-2xl font-bold">
                {safeTripData.tripTitle || "Untitled Trip"}
              </h3>
              <p className="text-sm mt-1 line-clamp-2">
                {safeTripData.description || "No description provided"}
              </p>
              <div className="mt-3 flex gap-2">
                <span className="px-2 py-1 rounded text-xs bg-white/20">
                  {safeTripData.groupType || "not specified"}
                </span>
                {safeTripData.tripCategory && (
                  <span className="px-2 py-1 rounded text-xs bg-white/20">
                    {safeTripData.tripCategory}
                  </span>
                )}
                {safeTripData.groupType === "private" && (
                  <>
                    {safeTripData.privateSharingOption && (
                      <span className="px-2 py-1 rounded text-xs bg-white/20">
                        {safeTripData.privateSharingOption === "individual"
                          ? "Individual orders"
                          : safeTripData.privateSharingOption === "group"
                          ? "Group sharing"
                          : safeTripData.privateSharingOption}
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        safeTripData.isPublic
                          ? "bg-green-600/20"
                          : "bg-white/20"
                      }`}
                    >
                      {safeTripData.isPublic
                        ? "Marked public"
                        : "Not marked public"}
                    </span>
                  </>
                )}
                <span className="px-2 py-1 rounded text-xs bg-white/20 capitalize">
                  {safeTripData.bookingProcess === "instant"
                    ? "Instant Booking"
                    : safeTripData.bookingProcess === "approval"
                    ? "Host Approval"
                    : safeTripData.bookingProcess || "Booking"}
                </span>
              </div>
            </div>
          </div>

          {/* Summary grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FiMapPin className="text-gray-500" /> Route
              </h4>
              <p className="text-gray-600">
                <span className="font-medium">
                  {safeTripData.meetingLocation || "No pick-up location"}
                </span>
                <span className="mx-2 text-gray-400">→</span>
                <span className="font-medium">
                  {safeTripData.destination || "No destination"}
                </span>
              </p>
              {safeTripData.sameAsPickup && (
                <p className="text-sm text-gray-500 mt-1">
                  Drop-off same as pick-up
                </p>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FiCalendar className="text-gray-500" /> Dates
              </h4>
              <p className="text-gray-600">
                {safeTripData.tripStartDate
                  ? new Date(safeTripData.tripStartDate).toLocaleDateString(
                      "en-IN"
                    )
                  : "No start date"}
                {safeTripData.tripEndDate &&
                  ` - ${new Date(safeTripData.tripEndDate).toLocaleDateString(
                    "en-IN"
                  )}`}
              </p>
              {safeTripData.tripStartDate && (
                <p className="text-sm text-gray-500 mt-1">
                  Duration: {calculateDuration()} days
                </p>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FiUsers className="text-gray-500" /> Capacity
              </h4>
              <p className="text-gray-600">
                {safeTripData.minParticipants || 1} -{" "}
                {safeTripData.maxParticipants || "Unlimited"} people
              </p>
              {(safeTripData.minAge || safeTripData.maxAge) && (
                <p className="text-sm text-gray-500 mt-1">
                  Age: {safeTripData.minAge ?? "Any"} -{" "}
                  {safeTripData.maxAge ?? "Any"}
                </p>
              )}
            </div>

            {/* Price (enhanced with early bird discount) */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FiDollarSign className="text-gray-500" /> Price
              </h4>

              {pricingData.isEarlyBirdApplicable ? (
                <>
                  <div className="mt-2">
                    <p className="text-gray-800">
                      Per person:{" "}
                      <span className="text-gray-500 line-through">
                        {formatCurrency(pricingData.basePriceWithoutDiscount)}
                      </span>
                      <span className="font-bold text-xl text-green-600 ml-2">
                        {formatCurrency(pricingData.discountedPrice)}
                      </span>
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Early bird discount: {safeTripData.earlyBookingDiscount}% off until {new Date(safeTripData.earlyBookingEndDate).toLocaleDateString("en-IN")}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Based on {selectedAccommodationType} accommodation
                    </p>
                  </div>
                </>
              ) : (
                <div className="mt-2">
                  <p className="text-gray-800">
                    Per person:{" "}
                    <span className="font-bold text-xl">
                      {formatCurrency(pricingData.basePriceWithoutDiscount)}
                    </span>
                    {Number(safeTripData.basePrice) > 0 && (
                      <span className="ml-3 text-sm text-gray-500">
                        (basePrice overrides computed)
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Based on {selectedAccommodationType} accommodation
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Itinerary preview: free text or structured */}
          {safeTripData.itineraryText ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-700 mb-2">Itinerary</h4>
              <div className="whitespace-pre-line text-gray-700">
                {safeTripData.itineraryText}
              </div>
            </div>
          ) : (
            renderStructuredItineraryPreview()
          )}

          {/* Accommodation Details */}
          <div className="space-y-6">
            {renderAccommodationDetails()}
            {renderGenderPreferences()}
          </div>

          {/* Meal Plans */}
          {renderMealPlans()}

          {/* Inclusions & Exclusions */}
          {renderInclusionsExclusions()}

          {/* Transport Options */}
          {renderTransportOptions()}

          {/* FAQs */}
          {renderFAQs()}

          {/* Payment Details */}
          {renderBookingDetails()}

          {/* Cancellation Policy */}
          {renderCancellationPolicy()}

          {/* Visa Information */}
          {renderVisaInfo()}

          {/* Important Links */}
          {renderLinks()}

          {renderPricingDetails()}

          {/* Additional Fields */}
          {safeTripData.additionalFields &&
            safeTripData.additionalFields.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FiClipboard className="text-gray-500" /> Additional
                  Information Fields
                </h4>
                <div className="space-y-4">
                  {safeTripData.additionalFields.map((field, index) => (
                    <div key={index} className="border-b pb-3 last:border-0">
                      <h5 className="font-medium text-gray-700 mb-1">
                        {field.name}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h5>
                      <p className="text-sm text-gray-600 mb-1">
                        Type: {field.type}{" "}
                        {field.description && `- ${field.description}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Tags */}
          {Array.isArray(safeTripData.tripTags) &&
            safeTripData.tripTags.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FiTag className="text-gray-500" /> Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {safeTripData.tripTags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Checklist */}
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-700 mb-4">
              Pre-Launch Checklist
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div
                  className={`mt-0.5 mr-2 ${
                    safeTripData.tripTitle &&
                    safeTripData.description &&
                    safeTripData.destination
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                >
                  <FiCheck />
                </div>
                <span
                  className={
                    safeTripData.tripTitle &&
                    safeTripData.description &&
                    safeTripData.destination
                      ? "text-gray-800"
                      : "text-gray-500"
                  }
                >
                  All essential information is complete (title, description,
                  destination)
                </span>
              </li>

              <li className="flex items-start">
                <div
                  className={`mt-0.5 mr-2 ${
                    safeTripData.bannerImage
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                >
                  <FiCheck />
                </div>
                <span
                  className={
                    safeTripData.bannerImage ? "text-gray-800" : "text-gray-500"
                  }
                >
                  Banner image is present
                </span>
              </li>

              <li className="flex items-start">
                <div
                  className={`mt-0.5 mr-2 ${
                    (safeTripData.basePrice || 0) > 0 ||
                    pricingData.total > 0
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                >
                  <FiCheck />
                </div>
                <span
                  className={
                    (safeTripData.basePrice || 0) > 0 ||
                    pricingData.total > 0
                      ? "text-gray-800"
                      : "text-gray-500"
                  }
                >
                  Pricing is configured (price:{" "}
                  {formatCurrency(
                    safeTripData.basePrice > 0
                      ? safeTripData.basePrice
                      : pricingData.total
                  )}
                  )
                </span>
              </li>

              <li className="flex items-start">
                <div
                  className={`mt-0.5 mr-2 ${
                    safeTripData.itineraryText ||
                    (Array.isArray(safeTripData.structuredItinerary) &&
                      safeTripData.structuredItinerary.length > 0)
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                >
                  <FiCheck />
                </div>
                <span
                  className={
                    safeTripData.itineraryText ||
                    (Array.isArray(safeTripData.structuredItinerary) &&
                      safeTripData.structuredItinerary.length > 0)
                      ? "text-gray-800"
                      : "text-gray-500"
                  }
                >
                  Itinerary is present
                </span>
              </li>

              <li className="flex items-start">
                <div
                  className={`mt-0.5 mr-2 ${
                    safeTripData.tripStartDate &&
                    (!safeTripData.tripEndDate ||
                      new Date(safeTripData.tripEndDate) >=
                        new Date(safeTripData.tripStartDate))
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                >
                  <FiCheck />
                </div>
                <span
                  className={
                    safeTripData.tripStartDate &&
                    (!safeTripData.tripEndDate ||
                      new Date(safeTripData.tripEndDate) >=
                        new Date(safeTripData.tripStartDate))
                      ? "text-gray-800"
                      : "text-gray-500"
                  }
                >
                  Dates are properly set
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}