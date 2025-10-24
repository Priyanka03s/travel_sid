const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  // Basic Details
  tripTitle: { type: String, required: true },
  bannerImage: { type: String },
  tripCategory: { type: String, required: true },
  groupType: { type: String, enum: ["public", "private"], required: true },
  privateSharingOption: { type: String, enum: ["individual", "group"] },
  isPublic: { type: Boolean, default: false },
  bookingProcess: { type: String, enum: ["instant", "approval"], required: true },
  tripStartDate: { type: Date, required: true },
  tripEndDate: { type: Date, required: true },
  meetingLocation: { type: String, required: true },
  destination: { type: String, required: true },
  sameAsPickup: { type: Boolean, default: false },
  description: { type: String, required: true },
  
  // Itinerary
  itineraryType: { type: String, enum: ["freeText", "structured"], required: true },
  itineraryText: { type: String },
  structuredItinerary: [{
    day: { type: Number, required: true },
    date: { type: Date, required: true },
    title: { type: String },
    overview: { type: String },
    travelMode: { type: String, default: "" }, // Added travel mode field
    stops: [{
      name: { type: String },
      time: { type: String },
      place: {
        country: { type: String },
        state: { type: String },
        city: { type: String },
        full: { type: String }
      },
      activityType: { type: String },
      description: { type: String },
      image: { type: String },
      isMicroTrip: { type: Boolean, default: false },
      microTripPrice: { type: Number, default: 0 }
    }],
    completed: { type: Boolean, default: false }
  }],
  
  // Accommodation
  accommodation: {
    sharedImage: { type: String },
    sharedPrice: { type: Number, default: 0 },
    sharedName: { type: String, default: "" }, // Added accommodation name
    privateImage: { type: String },
    privatePrice: { type: Number, default: 0 },
    privateName: { type: String, default: "" }, // Added accommodation name
    campingImage: { type: String },
    campingPrice: { type: Number, default: 0 },
    campingName: { type: String, default: "" }, // Added accommodation name
    glampingImage: { type: String },
    glampingPrice: { type: Number, default: 0 },
    glampingName: { type: String, default: "" }, // Added accommodation name
    settleToVendor: { type: Boolean, default: false }, // Added settleToVendor field
    sharedDays: [{ // Added additional days for shared
      day: { type: Number },
      name: { type: String, default: "" },
      price: { type: Number, default: 0 }
    }],
    privateDays: [{ // Added additional days for private
      day: { type: Number },
      name: { type: String, default: "" },
      price: { type: Number, default: 0 }
    }],
    campingDays: [{ // Added additional days for camping
      day: { type: Number },
      name: { type: String, default: "" },
      price: { type: Number, default: 0 }
    }],
    glampingDays: [{ // Added additional days for glamping
      day: { type: Number },
      name: { type: String, default: "" },
      price: { type: Number, default: 0 }
    }]
  },
  
  // Meal Plans
  mealPlans: [{
    day: { type: String, required: true },
    type: { type: String, enum: ["breakfast", "lunch", "dinner", "snacks"], required: true },
    details: { type: String, required: true }
  }],
  
  // Inclusions and Exclusions
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  
  // FAQs
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  
  // Pricing
  pricing: {
    accommodation: { type: Number, default: 0 },
    transportation: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    bufferPercentage: { type: Number, default: 10 },
    yourFee: { type: Number, default: 0 },
    accommodationItems: [{
      name: { type: String },
      cost: { type: Number, default: 0 }
    }],
    transportationItems: [{
      name: { type: String },
      cost: { type: Number, default: 0 }
    }],
    activityItems: [{
      name: { type: String },
      cost: { type: Number, default: 0 }
    }]
  },
  
  // Base price (if set, overrides computed price)
  basePrice: { type: Number, default: 0 },
  discountPrice: { type: Number },
  discountDeadline: { type: Date },
  
  // Logistics
  minParticipants: { type: Number, required: true },
  maxParticipants: { type: Number, required: true },
  allowEarlyBooking: { type: Boolean, default: false },
  earlyBookingLimit: { type: Number },
  earlyBookingDiscount: { type: Number, default: 0 },
  earlyBookingEndDate: { type: Date },
  allowPreviousParticipation: { type: Boolean, default: false }, // Added previous participation
  bookingDeadline: { type: Date },
  bookingTimeline: {
    startDate: { type: Date },
    endDate: { type: Date }
  },
  paymentType: { type: String, enum: ["full", "partial", "both"], required: true },
  fullPaymentBookingStart: { type: Date },
  fullPaymentBookingEnd: { type: Date },
  partialPaymentStart: { type: Date },
  partialPaymentEnd: { type: Date },
  initialPaymentPercentage: { type: Number, default: 0 },
  additionalPayments: [{
    date: { type: Date },
    percentage: { type: Number },
    description: { type: String }
  }],
  paymentRequirement: {
    type: { type: String, enum: ["full", "partial"] },
    percentage: { type: Number }
  },
  noAgeLimit: { type: Boolean, default: false },
  ageGroup: {
    min: { type: Number },
    max: { type: Number }
  },
  genderPreferences: {
    male: { allowed: { type: Boolean, default: false }, count: { type: Number, default: 0 } },
    female: { allowed: { type: Boolean, default: false }, count: { type: Number, default: 0 } },
    kids: { allowed: { type: Boolean, default: false }, count: { type: Number, default: 0 } },
    pets: { type: Boolean, default: false },
    petTypes: {
      cat: { type: Boolean, default: false },
      dog: { type: Boolean, default: false }
    }
  },
  cancellationEnabled: { type: Boolean, default: false },
  cancellationRules: [{
    daysBefore: { type: Number, required: true },
    percentage: { type: Number, required: true },
    description: { type: String }
  }],
  socialGroupLinks: [{ type: String }],
  additionalLinks: [{
    type: { type: String, enum: ["link", "file", "video"] },
    value: { type: String }
  }],
  registrationFormLink: { type: String },
  tripTags: [{ type: String }],
  visaRequired: { type: Boolean, default: false },
  visaDocuments: [{ type: String }],
  visaProcess: {
    assistanceFee: { type: Number },
    processingTimeFrom: { type: Number },
    processingTimeTo: { type: Number },
    description: { type: String }
  },
  transportOptions: [{
    type: { type: String, enum: ["flight", "train", "bus", "cruise", "local"] },
    departureTime: { type: String },
    departureDate: { type: Date },
    cost: { type: Number, default: 0 },
    description: { type: String },
    included: { type: Boolean, default: true }
  }],
  additionalFields: [{
    name: { type: String, required: true },
    type: { type: String, enum: ["text", "textarea", "checkbox", "file"], required: true },
    required: { type: Boolean, default: false },
    description: { type: String }
  }],
  
  // Meta
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["draft", "published", "cancelled"], default: "draft" },
  publishedDate: { type: Date },
  bookings: { type: Number, default: 0 },
  savedCount: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5 },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 0, max: 5 },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);