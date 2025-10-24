const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  // Basic Details
  eventTitle: { type: String, required: true },
  eventImage: { type: String },
  eventCategory: { type: String, required: true },
  groupType: { type: String, enum: ["public", "private"], required: true },
  privateSharingOption: { type: String, enum: ["individual", "group"] },
  isPublic: { type: Boolean, default: false },
  bookingProcess: { type: String, enum: ["instant", "hostApproval"], required: true },
  
  // Date and Time
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  
  // Location
  location: { type: String },
  googleMapLink: { type: String },
  isOnline: { type: Boolean, default: false },
  isOffline: { type: Boolean, default: true },
  onlineMeetingLink: { type: String },
  
  // Description
  eDescription: { type: String, required: true },
  
  // Itinerary
  itinerary: { type: String },
  itineraryType: { type: String, enum: ["freeText", "structured"] },
  structuredItinerary: [{
    day: { type: Number, required: true },
    date: { type: Date, required: true },
    title: { type: String },
    overview: { type: String },
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
      additionalCost: { type: Number, default: 0 },
      isMicroTrip: { type: Boolean, default: false },
      microTripPrice: { type: Number, default: 0 }
    }],
    completed: { type: Boolean, default: false }
  }],
  
  // Accommodation Options
  accommodationOptions: {
    sharedRoom: { 
      price: { type: Number, default: 0 },
      image: { type: String }
    },
    privateRoom: { 
      price: { type: Number, default: 0 },
      image: { type: String }
    },
    camping: { 
      price: { type: Number, default: 0 },
      image: { type: String }
    },
    glamping: { 
      price: { type: Number, default: 0 },
      image: { type: String }
    },
    settleToVendor: { type: Boolean, default: false }
  },
  
  // Meal Plan
  mealPlan: [{
    day: { type: String, required: true },
    dayDate: { type: String, required: true },
    mealType: { type: String, enum: ["breakfast", "lunch", "dinner", "snacks"], required: true },
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
  
  // Trip Tags
  tripTags: [{ type: String }],
  
  // Participants
  minParticipants: { type: Number, required: true },
  maxParticipants: { type: Number, required: true },
  allowEarlyBooking: { type: Boolean, default: false },
  earlyBookingLimit: { type: Number },
  earlyBookingDiscount: { type: Number, default: 0 },
  earlyBookingEndDate: { type: Date },
  
  // Age and Gender Preferences
  noAgeLimit: { type: Boolean, default: false },
  minAge: { type: Number },
  maxAge: { type: Number },
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
  
  // Booking Process Timelines
  bookingStartDate: { type: Date },
  bookingEndDate: { type: Date },
  minBookingFeePercentage: { type: Number, default: 20 },
  
  // Cancellation Policy
  cancellationEnabled: { type: Boolean, default: false },
  cancellationRules: [{
    daysBefore: { type: Number, required: true },
    percentage: { type: Number, required: true },
    description: { type: String }
  }],
  
  // Payment Options
  paymentOptions: [{ type: String }],
  
  // Social Links
  socialLinks: {
    whatsapp1: { type: String },
    whatsapp2: { type: String },
    telegram1: { type: String },
    telegram2: { type: String },
    instagram: { type: String }
  },
  
  // Additional Fields
  additionalFields: [{
    name: { type: String, required: true },
    type: { type: String, enum: ["text", "textarea", "checkbox", "file"], required: true },
    required: { type: Boolean, default: false },
    value: { type: mongoose.Schema.Types.Mixed }
  }],
  
  // Pricing
  pricing: {
    basePrice: { type: Number, default: 0 },
    accommodation: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    visaRegFee: { type: Number, default: 0 },
    customField: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    pgCharges: { type: Number, default: 0 },
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
  
  // Visa Process
  visaProcess: {
    documentsRequired: { type: String },
    assistanceFee: { type: Number },
    processingTime: { type: String }
  },
  
  // Meta
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["draft", "published", "cancelled"], default: "draft" },
  publishedDate: { type: Date },
  bookings: { type: Number, default: 0 },
  savedCount: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 0, max: 5 },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);