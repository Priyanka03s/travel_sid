import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import travelLogo from "../assets/travel-logo.png";
import bgImage from "../assets/travel.jpg";

// ✅ Import Google Font dynamically
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

function TravelRegistrationForm() {
  const [role, setRole] = useState("user");
  const [loginMethod, setLoginMethod] = useState("email");
  const [additionalQuestions, setAdditionalQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    // Common Fields
    email: "",
    userId: "",
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    dob: "",
    age: "",
    password: "",
    confirmPassword: "",
    aadhar: "",
    drivingLicense: "",
    passportId: "",
    language: "",
    profession: "",
    location: "",
    bloodGroup: "",
    emergencyContact: "",
    skills: "",
    currentCompany: "",

    // Document files
    aadharDoc: null, 
    drivingLicenseDoc: null,
    passportDoc: null,

    // Host Fields
    groupName: "",
    bio: "",
    instagram: "",
    youtube: "",
    facebook: "",
    experience: "",
    tripsHosted: "",
    followersCount: "",
    tripCategory: "",
    nextTripDate: "",
    itinerary: "",
    tripDuration: "",
    setupPercentage: "",
    frequency: "",
    minFee: "",
    maxFee: "",
  });

  const navigate = useNavigate();

  // Fetch additional questions when component mounts or role changes to host
  useEffect(() => {
    if (role === "host") {
      fetchAdditionalQuestions();
    } else {
      setAdditionalQuestions([]);
    }
  }, [role]);

  const fetchAdditionalQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const response = await axios.get("http://localhost:5000/api/users/additional-questions");
      setAdditionalQuestions(response.data);

      const initialQuestions = {};
      response.data.forEach(q => {
        initialQuestions[q.question] = "";
      });
      setFormData(prev => ({ ...prev, ...initialQuestions }));
    } catch (error) {
      console.error("Error fetching additional questions:", error);
      setAdditionalQuestions([
        { question: "How did you hear about us?", type: "text" },
        { question: "What makes you a great host?", type: "text" }
      ]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }

    const payload = new FormData();
    
    // Append all form data
    payload.append("role", role);
    payload.append("loginMethod", loginMethod);
    payload.append("email", loginMethod === "email" ? formData.email : "");
    payload.append("userId", loginMethod === "userid" ? formData.userId : "");
    payload.append("firstName", formData.firstName);
    payload.append("lastName", formData.lastName);
    payload.append("phone", formData.phone);
    payload.append("gender", formData.gender);
    payload.append("dob", formData.dob);
    payload.append("age", formData.age);
    payload.append("password", formData.password);
    payload.append("aadhar", formData.aadhar);
    payload.append("drivingLicense", formData.drivingLicense);
    payload.append("passportId", formData.passportId);
    payload.append("language", formData.language);
    payload.append("profession", formData.profession);
    payload.append("location", formData.location);
    payload.append("bloodGroup", formData.bloodGroup);
    payload.append("emergencyContact", formData.emergencyContact);
    payload.append("skills", formData.skills);
    payload.append("currentCompany", formData.currentCompany);

    // Append document files if they exist
    if (formData.aadharDoc) payload.append("aadharDoc", formData.aadharDoc);
    if (formData.drivingLicenseDoc) payload.append("drivingLicenseDoc", formData.drivingLicenseDoc);
    if (formData.passportDoc) payload.append("passportDoc", formData.passportDoc);

    // Host-specific fields
    if (role === "host") {
      payload.append("groupName", formData.groupName);
      payload.append("bio", formData.bio);
      payload.append("instagram", formData.instagram);
      payload.append("youtube", formData.youtube);
      payload.append("facebook", formData.facebook);
      payload.append("experience", formData.experience);
      payload.append("tripsHosted", formData.tripsHosted);
      payload.append("followersCount", formData.followersCount);
      payload.append("tripCategory", formData.tripCategory);
      payload.append("nextTripDate", formData.nextTripDate);
      payload.append("itinerary", formData.itinerary);
      payload.append("tripDuration", formData.tripDuration);
      payload.append("setupPercentage", formData.setupPercentage);
      payload.append("frequency", formData.frequency);
      payload.append("minFee", formData.minFee);
      payload.append("maxFee", formData.maxFee);
      
      const additionalQuestionsData = additionalQuestions.map(q => ({
        question: q.question,
        answer: formData[q.question] || ""
      }));
      payload.append("additionalQuestions", JSON.stringify(additionalQuestionsData));
    }

    console.log("📤 Sending Data to Backend");

    try {
      const res = await axios.post("http://localhost:5000/api/users/register", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("userName", `${formData.firstName} ${formData.lastName}`);
      localStorage.setItem("userRole", role);
      
      console.log("✅ Backend Response:", res.data);
      alert("Registered Successfully!");
      
      if (role === "host") {
        navigate("/payment");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      alert("Registration Failed!");
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold ${
                step === currentStep
                  ? "bg-red-600 border-red-600 text-white"
                  : step < currentStep
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              {step < currentStep ? "✓" : step}
            </div>
            <span className={`text-xs mt-2 font-medium ${
              step === currentStep ? "text-red-600" : "text-gray-600"
            }`}>
              {step === 1 ? "Personal" : step === 2 ? "Documents" : "Account"}
            </span>
          </div>
          {step < totalSteps && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Age *
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Profession
          </label>
          <input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="Your profession"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Your city"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Documents & Details</h2>
        <p className="text-gray-600">Provide your identification details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Number</label>
          <input
            type="text"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Document</label>
          <div className="relative">
            <input
              type="file"
              name="aadharDoc"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Driving License</label>
          <input
            type="text"
            name="drivingLicense"
            value={formData.drivingLicense}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Driving License Document</label>
          <input
            type="file"
            name="drivingLicenseDoc"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Passport ID</label>
          <input
            type="text"
            name="passportId"
            value={formData.passportId}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Passport Document</label>
          <input
            type="file"
            name="passportDoc"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
          <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder="Languages you speak"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact</label>
          <input
            type="tel"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Emergency contact number"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Skill Set</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Dance, Singing, Photography, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Current Company</label>
        <input
          type="text"
          name="currentCompany"
          value={formData.currentCompany}
          onChange={handleChange}
          placeholder="Your current company"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Account Security</h2>
        <p className="text-gray-600">Set up your login credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="font-semibold text-red-800 mb-2">Password Requirements</h3>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• At least 8 characters long</li>
          <li>• Include uppercase and lowercase letters</li>
          <li>• Include at least one number</li>
          <li>• Include special characters</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-4xl w-full">
        {/* Header Card */}
        <div className="bg-red-600 rounded-2xl shadow-xl p-8 mb-6 border border-red-700">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
              <span className="text-red-600 text-2xl font-bold">✈️</span>
            </div>
            <h1 className="text-3xl font-bold text-white font-['Playfair_Display']">
              Travel Registration Form
            </h1>
            <p className="text-red-100 mt-2 max-w-md">
              Join our travel community and start your adventure today
            </p>
          </div>

          {/* Role Selection */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                role === "user"
                  ? "bg-white text-red-600 shadow-lg shadow-red-500/25"
                  : "bg-red-700 text-red-100 hover:bg-red-800"
              }`}
            >
              👤 Traveler
            </button>
            <button
              type="button"
              disabled
              className="px-8 py-3 rounded-xl font-semibold bg-red-800 text-red-200 cursor-not-allowed opacity-60"
            >
              🏠 Host (Coming Soon)
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Step Indicator */}
          {renderStepIndicator()}

          <form onSubmit={handleSubmit}>
            {/* Step Content */}
            <div className="mb-8">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
              >
                ← Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-500/25"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-500/25 flex items-center gap-2"
                >
                  <span>Complete Registration</span>
                  <span>🎉</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-red-600 font-semibold hover:text-red-700">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TravelRegistrationForm;