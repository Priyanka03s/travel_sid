const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "host"], default: "user" },
    
    // Add approval field
    approved: { 
      type: Boolean, 
      default: function() {
        return this.role === "user"; // Users are auto-approved, hosts need approval
      }
    },
    
    // login
    email: {
      type: String,
      required: function () {
        return this.loginMethod === "email";
      },
    },
    userId: {
      type: String,
      required: function () {
        return this.loginMethod === "userid";
      },
    },
    loginMethod: { type: String, enum: ["email", "userid"], default: "email" },

    // common fields
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    age: { type: Number },
    password: { type: String, required: true },

    // extra user fields
    aadhar: String,
    drivingLicense: String,
    passportId: String,
    language: String,
    profession: String,
    location: String,
    bloodGroup: String,
    emergencyContact: String,
    skills: String,
    currentCompany: String,

    // document paths
    aadharDoc: String,
    drivingLicenseDoc: String,
    passportDoc: String,

    // host-only fields
    groupName: String,
    bio: String,
    experience: String,
    tripsHosted: Number,
    followersCount: Number,
    tripCategory: String,
    nextTripDate: Date,
    itinerary: String,
    tripDuration: Number,
    setupPercentage: Number,
    frequency: String,
    minFee: Number,
    maxFee: Number,

    // Additional host questions (dynamic)
    additionalQuestions: [{
      question: String,
      answer: String
    }],

    socialLinks: {
      instagram: String,
      youtube: String,
      facebook: String,
    },

    // ✅ Business / Banking Fields
    panNumber: String,
    gst: String,
    bankName: String,
    accountHolder: String,
    accountNumber: String,
    accountType: String,
    ifsc: String,
    upi: String,
    businessType: String,
    cin: String,
    products: String,
    address: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);