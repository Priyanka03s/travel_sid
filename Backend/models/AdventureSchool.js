const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  adventureType: { type: String, required: true },
  shortDescription: { type: String },
  detailedItinerary: { type: String },
  skillLevel: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  duration: { type: String },
  durationUnit: { type: String, enum: ["hours", "days"], default: "hours" },
  minParticipants: { type: String },
  maxParticipants: { type: String },
  minAge: { type: String },
  maxAge: { type: String },
  season: [{ type: String }],
  startLocation: { type: String },
  endLocation: { type: String },
  accommodation: { type: String },
  foodDetails: { type: String },
  gearProvided: { type: String },
  whatToBring: { type: String },
  safetyInfo: { type: String },
  insuranceOptions: { type: String },
  faqs: [{
    question: { type: String },
    answer: { type: String }
  }],
  price: { type: String },
  priceUnit: { type: String, enum: ["perPerson", "perGroup"], default: "perPerson" },
  discounts: [mongoose.Schema.Types.Mixed],
  paymentOptions: [{ type: String }],
  cancellationPolicy: { type: String },
  bookingType: { type: String, enum: ["instant", "request"], default: "instant" },
  images: [{ type: String }],
  bookings: { type: Number, default: 0 } // Added bookings field
});

const testimonialSchema = new mongoose.Schema({
  customerName: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  comment: { type: String },
  date: { type: Date, default: Date.now }
});

const adventureSchoolSchema = new mongoose.Schema({
  // School Details
  schoolName: { type: String, required: true },
  schoolDescription: { type: String, required: true },
  yearEstablished: { type: Number },
  accreditationFiles: [{ type: String }],
  adventureTypes: [{ type: String }],
  website: { type: String },
  socialLinks: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    youtube: { type: String }
  },
  contactPerson: { type: String },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String },
  address: {
    location: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pinCode: { type: String }
  },
  mapLocation: { type: String },
  idProof: { type: String },
  schoolImages: [{ type: String }],
  testimonials: [testimonialSchema],
  packages: [packageSchema],
  
  // Meta
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["draft", "published", "inactive"], default: "draft" },
  publishedDate: { type: Date },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("AdventureSchool", adventureSchoolSchema);