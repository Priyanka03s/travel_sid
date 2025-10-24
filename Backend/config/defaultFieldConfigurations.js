module.exports = [
  // BasicDetails
  {
    fieldName: "tripTitle",
    label: "Trip Title",
    component: "BasicDetails",
    inputType: "text",
    enabled: true,
    required: true,
    order: 1
  },
  {
    fieldName: "bannerImage",
    label: "Banner Image",
    component: "BasicDetails",
    inputType: "file",
    enabled: true,
    required: true,
    order: 2
  },
  {
    fieldName: "tripCategory",
    label: "Trip Category",
    component: "BasicDetails",
    inputType: "select",
    enabled: true,
    required: true,
    options: ["adventure", "cultural", "beach", "wildlife", "trekking", "roadtrip", "spiritual", "family", "luxury"],
    order: 3
  },
  {
    fieldName: "groupType",
    label: "Group Type",
    component: "BasicDetails",
    inputType: "radio",
    enabled: true,
    required: true,
    options: ["public", "private"],
    order: 4
  },
  {
    fieldName: "privateSharingOption",
    label: "Private Sharing Option",
    component: "BasicDetails",
    inputType: "select",
    enabled: true,
    required: false,
    order: 5
  },
  {
    fieldName: "isPublic",
    label: "Mark as Public",
    component: "BasicDetails",
    inputType: "checkbox",
    enabled: true,
    required: false,
    order: 6
  },
  {
    fieldName: "bookingProcess",
    label: "Booking Process",
    component: "BasicDetails",
    inputType: "radio",
    enabled: true,
    required: true,
    options: ["instant", "approval"],
    order: 7
  },
  {
    fieldName: "tripStartDate",
    label: "Start Date",
    component: "BasicDetails",
    inputType: "date",
    enabled: true,
    required: true,
    order: 8
  },
  {
    fieldName: "tripEndDate",
    label: "End Date",
    component: "BasicDetails",
    inputType: "date",
    enabled: true,
    required: true,
    order: 9
  },
  {
    fieldName: "meetingLocation",
    label: "Pick-up Location",
    component: "BasicDetails",
    inputType: "text",
    enabled: true,
    required: true,
    order: 10
  },
  {
    fieldName: "destination",
    label: "Destination",
    component: "BasicDetails",
    inputType: "text",
    enabled: true,
    required: true,
    order: 11
  },
  {
    fieldName: "sameAsPickup",
    label: "Same as pick-up location",
    component: "BasicDetails",
    inputType: "checkbox",
    enabled: true,
    required: false,
    order: 12
  },
  {
    fieldName: "description",
    label: "Trip Description",
    component: "BasicDetails",
    inputType: "textarea",
    enabled: true,
    required: true,
    order: 13
  },
  
  // ItineraryDetails
  {
    fieldName: "itineraryType",
    label: "Itinerary Type",
    component: "ItineraryDetails",
    inputType: "radio",
    enabled: true,
    required: true,
    options: ["freeText", "structured"],
    order: 1
  },
  {
    fieldName: "itineraryText",
    label: "Free Text Itinerary",
    component: "ItineraryDetails",
    inputType: "textarea",
    enabled: true,
    required: false,
    order: 2
  },
  {
    fieldName: "structuredItinerary",
    label: "Structured Itinerary",
    component: "ItineraryDetails",
    inputType: "complex",
    enabled: true,
    required: false,
    order: 3
  },
  {
    fieldName: "sharedAccommodation",
    label: "Shared Rooms",
    component: "ItineraryDetails",
    inputType: "complex",
    enabled: true,
    required: false,
    order: 4
  },
  {
    fieldName: "privateAccommodation",
    label: "Private Rooms",
    component: "ItineraryDetails",
    inputType: "complex",
    enabled: true,
    required: false,
    order: 5
  },
  {
    fieldName: "settleToVendor",
    label: "Settle accommodation payment directly to vendor",
    component: "ItineraryDetails",
    inputType: "checkbox",
    enabled: true,
    required: false,
    order: 6
  },
  {
    fieldName: "mealPlans",
    label: "Meal Plans",
    component: "ItineraryDetails",
    inputType: "complex",
    enabled: true,
    required: true,
    order: 7
  },
  {
    fieldName: "inclusions",
    label: "Inclusions",
    component: "ItineraryDetails",
    inputType: "complex",
    enabled: true,
    required: true,
    order: 8
  },
  {
    fieldName: "exclusions",
    label: "Exclusions",
    component: "ItineraryDetails",
    inputType: "complex",
    enabled: true,
    required: true,
    order: 9
  },
  {
    fieldName: "faqs",
    label: "FAQs",
    component: "ItineraryDetails",
    inputType: "complex",
    enabled: true,
    required: false,
    order: 10
  },
  {
    fieldName: "tripTags",
    label: "Trip Tags",
    component: "ItineraryDetails",
    inputType: "checkbox",
    enabled: true,
    required: true,
    order: 11
  },
  
  // LogisticsSection
  {
    fieldName: "minParticipants",
    label: "Minimum Participants",
    component: "LogisticsSection",
    inputType: "number",
    enabled: true,
    required: true,
    validation: { min: 1 },
    order: 1
  },
  {
    fieldName: "maxParticipants",
    label: "Maximum Participants",
    component: "LogisticsSection",
    inputType: "number",
    enabled: true,
    required: true,
    validation: { min: 1 },
    order: 2
  },
  {
    fieldName: "allowEarlyBooking",
    label: "Allow Early Booking Participants",
    component: "LogisticsSection",
    inputType: "checkbox",
    enabled: true,
    required: false,
    order: 3
  },
  {
    fieldName: "earlyBookingLimit",
    label: "Early Booking Limit",
    component: "LogisticsSection",
    inputType: "number",
    enabled: true,
    required: false,
    order: 4
  },
  {
    fieldName: "earlyBookingDiscount",
    label: "Early Booking Discount (%)",
    component: "LogisticsSection",
    inputType: "number",
    enabled: true,
    required: false,
    order: 5
  },
  {
    fieldName: "earlyBookingEndDate",
    label: "Early Booking End Date",
    component: "LogisticsSection",
    inputType: "date",
    enabled: true,
    required: false,
    order: 6
  },
  {
    fieldName: "minAge",
    label: "Minimum Age",
    component: "LogisticsSection",
    inputType: "number",
    enabled: true,
    required: false,
    order: 7
  },
  {
    fieldName: "maxAge",
    label: "Maximum Age",
    component: "LogisticsSection",
    inputType: "number",
    enabled: true,
    required: false,
    order: 8
  },
  {
    fieldName: "allowMale",
    label: "Allow Male",
    component: "LogisticsSection",
    inputType: "checkbox",
    enabled: true,
    required: false,
    order: 9
  },
  {
    fieldName: "maleSeats",
    label: "Male Seats",
    component: "LogisticsSection",
    inputType: "number",
    enabled: true,
    required: false,
    order: 10
  },
  {
    fieldName: "allowFemale",
    label: "Allow Female",
    component: "LogisticsSection",
    inputType: "checkbox",
    enabled: true,
    required: false,
    order: 11
  },
  {
    fieldName: "femaleSeats",
    label: "Female Seats",
    component: "LogisticsSection",
    inputType: "number",
    enabled: true,
    required: false,
    order: 12
  },
  {
    fieldName: "allowKids",
    label: "Allow Kids (below 12)",
    component: "LogisticsSection",
    inputType: "checkbox",
    enabled: true,
    required: false,
    order: 13
  },
  {
    fieldName: "kidsSeats",
    label: "Kids Seats",
    component: "LogisticsSection",
    inputType: "number",
    enabled: true,
    required: false,
    order: 14
  },
  {
    fieldName: "allowPets",
    label: "Allow Pets",
    component: "LogisticsSection",
    inputType: "checkbox",
    enabled: true,
    required: false,
    order: 15
  },
  {
    fieldName: "bookingDeadline",
    label: "Booking Deadline",
    component: "LogisticsSection",
    inputType: "date",
    enabled: true,
    required: true,
    order: 16
  },
  {
    fieldName: "paymentType",
    label: "Payment Type",
    component: "LogisticsSection",
    inputType: "radio",
    enabled: true,
    required: true,
    options: ["full", "partial", "both"],
    order: 17
  },
  {
    fieldName: "fullPaymentBookingStart",
    label: "Full Payment Booking Start",
    component: "LogisticsSection",
    inputType: "date",
    enabled: true,
    required: false,
    order: 18
  },
  {
    fieldName: "fullPaymentBookingEnd",
    label: "Full Payment Booking End",
    component: "LogisticsSection",
    inputType: "date",
    enabled: true,
    required: false,
    order: 19
  },
  {
    fieldName: "partialPaymentStart",
    label: "Partial Payment Start",
    component: "LogisticsSection",
    inputType: "date",
    enabled: true,
    required: false,
    order: 20
  },
  {
    fieldName: "partialPaymentEnd",
    label: "Partial Payment End",
    component: "LogisticsSection",
    inputType: "date",
    enabled: true,
    required: false,
    order: 21
  },
  {
    fieldName: "initialPaymentPercentage",
    label: "Initial Payment Percentage",
    component: "LogisticsSection",
    inputType: "number",
    enabled: true,
    required: false,
    order: 22
  },
  {
    fieldName: "additionalPayments",
    label: "Additional Installments",
    component: "LogisticsSection",
    inputType: "complex",
    enabled: true,
    required: false,
    order: 23
  },
  {
    fieldName: "cancellationEnabled",
    label: "Enable Cancellation Policy",
    component: "LogisticsSection",
    inputType: "checkbox",
    enabled: true,
    required: false,
    order: 24
  },
  {
    fieldName: "cancellationRules",
    label: "Cancellation Rules",
    component: "LogisticsSection",
    inputType: "complex",
    enabled: true,
    required: false,
    order: 25
  },
  {
    fieldName: "visaRequired",
    label: "Visa Required",
    component: "LogisticsSection",
    inputType: "checkbox",
    enabled: true,
    required: false,
    order: 26
  },
  {
    fieldName: "visaDocuments",
    label: "Documents Required",
    component: "LogisticsSection",
    inputType: "complex",
    enabled: true,
    required: false,
    order: 27
  },
  {
    fieldName: "visaAssistanceFee",
    label: "Processing Assistance Fee",
    component: "LogisticsSection",
    inputType: "number",
    enabled: true,
    required: false,
    order: 28
  },
  {
    fieldName: "visaProcessingTime",
    label: "Processing Time (Days)",
    component: "LogisticsSection",
    inputType: "complex",
    enabled: true,
    required: false,
    order: 29
  },
  {
    fieldName: "transportOptions",
    label: "Transport Options",
    component: "LogisticsSection",
    inputType: "complex",
    enabled: true,
    required: true,
    order: 30
  },
  {
    fieldName: "socialGroupLinks",
    label: "Social Groups",
    component: "LogisticsSection",
    inputType: "complex",
    enabled: true,
    required: false,
    order: 31
  },
  {
    fieldName: "additionalLinks",
    label: "Additional Links",
    component: "LogisticsSection",
    inputType: "complex",
    enabled: true,
    required: false,
    order: 32
  },
  {
    fieldName: "additionalFields",
    label: "Additional Fields",
    component: "LogisticsSection",
    inputType: "complex",
    enabled: true,
    required: false,
    order: 33
  },
  
  // PricingSection
  {
    fieldName: "yourFee",
    label: "Your Fee",
    component: "PricingSection",
    inputType: "number",
    enabled: true,
    required: false,
    order: 1
  },
  {
    fieldName: "accommodationCost",
    label: "Accommodation Cost",
    component: "PricingSection",
    inputType: "complex",
    enabled: true,
    required: false,
    order: 2
  },
  {
    fieldName: "transportationCost",
    label: "Transportation Cost",
    component: "PricingSection",
    inputType: "complex",
    enabled: true,
    required: false,
    order: 3
  },
  {
    fieldName: "activitiesCost",
    label: "Activities Cost",
    component: "PricingSection",
    inputType: "complex",
    enabled: true,
    required: false,
    order: 4
  },
  {
    fieldName: "bufferPercentage",
    label: "Buffer Percentage",
    component: "PricingSection",
    inputType: "number",
    enabled: true,
    required: false,
    order: 5
  },
  {
    fieldName: "pricing",
    label: "Pricing Details",
    component: "PricingSection",
    inputType: "complex",
    enabled: true,
    required: true,
    order: 6
  },
  
  // ReviewPublish
  {
    fieldName: "review",
    label: "Review & Publish",
    component: "ReviewPublish",
    inputType: "complex",
    enabled: true,
    required: true,
    order: 1
  },
  {
    fieldName: "reviewPublish",
    label: "Review & Publish",
    component: "ReviewPublish",
    inputType: "button", // This is now valid after adding 'button' to the schema
    enabled: true,
    required: true,
    order: 2
  }
];