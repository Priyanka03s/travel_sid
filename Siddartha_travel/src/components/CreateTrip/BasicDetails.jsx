import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// API base URL configuration
const API_BASE_URL = 'http://localhost:5000';

const BasicDetails = ({ tripData, updateTripData }) => {
  const [showPrivateOptions, setShowPrivateOptions] = useState(
    tripData.groupType === "private" || false
  );
  
  // State to store field configurations
  const [fieldConfigs, setFieldConfigs] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch field configurations on component mount
  useEffect(() => {
    fetchFieldConfigs();
    
    // Listen for field configuration updates
    const handleFieldConfigUpdate = () => {
      fetchFieldConfigs();
    };
    
    window.addEventListener('fieldConfigUpdated', handleFieldConfigUpdate);
    
    return () => {
      window.removeEventListener('fieldConfigUpdated', handleFieldConfigUpdate);
    };
  }, []);

  const fetchFieldConfigs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/field-configurations`);
      // Convert array to object with fieldName as key for easier lookup
      const configs = {};
      response.data.forEach(field => {
        configs[field.fieldName] = field;
      });
      setFieldConfigs(configs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching field configurations:', error);
      setLoading(false);
    }
  };

  // Helper function to check if a field is enabled
  const isFieldEnabled = (fieldName) => {
    // If loading or field not found in config, default to enabled
    if (loading || !fieldConfigs[fieldName]) return true;
    return fieldConfigs[fieldName].enabled;
  };

  // Helper function to check if a field is required
  const isFieldRequired = (fieldName) => {
    // If loading or field not found in config, default to not required
    if (loading || !fieldConfigs[fieldName]) return false;
    return fieldConfigs[fieldName].required;
  };

  const handleImageUpload = useCallback(
    (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      // Validate image type
      if (!file.type.match("image.*")) {
        alert("Please upload an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        updateTripData("bannerImage", event.target.result);
      };
      reader.readAsDataURL(file);
    },
    [updateTripData]
  );

  const handleGroupTypeChange = (type) => {
    updateTripData("groupType", type);
    if (type === "private") {
      setShowPrivateOptions(true);
      // Set default sharing option if not already set
      if (!tripData.privateSharingOption) {
        updateTripData("privateSharingOption", "individual");
      }
    } else {
      setShowPrivateOptions(false);
      updateTripData("privateSharingOption", "");
      updateTripData("isPublic", false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Basic Trip Details</h2>
      <p className="text-gray-600 mb-8">
        Let's start with the essentials of your adventure
      </p>

      <div className="space-y-6">
        {/* Trip Title */}
        {isFieldEnabled('tripTitle') && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Trip Title {isFieldRequired('tripTitle') ? '*' : ''}
            </label>
            <input
              type="text"
              value={tripData.tripTitle || ""}
              onChange={(e) => updateTripData("tripTitle", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your trip title"
              maxLength={100}
              required={isFieldRequired('tripTitle')}
            />
            <p className="text-sm text-gray-500 mt-1">
              {(tripData.tripTitle || "").length}/100
            </p>
          </div>
        )}

        {/* Banner Image */}
        {isFieldEnabled('bannerImage') && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Banner Image {isFieldRequired('bannerImage') ? '*' : ''}
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="bannerImageUpload"
                required={isFieldRequired('bannerImage')}
              />
              <label
                htmlFor="bannerImageUpload"
                className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
              >
                Upload Image
              </label>
              {tripData.bannerImage && (
                <button
                  type="button"
                  onClick={() => updateTripData("bannerImage", "")}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="mt-2 p-4 border border-gray-200 rounded-md">
              {tripData.bannerImage ? (
                <img
                  src={tripData.bannerImage}
                  alt="Banner preview"
                  className="w-full h-40 object-cover rounded"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 rounded">
                  Banner preview will appear here
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trip Category */}
        {isFieldEnabled('tripCategory') && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Trip Category {isFieldRequired('tripCategory') ? '*' : ''}
            </label>
            <select
              value={tripData.tripCategory || ""}
              onChange={(e) => updateTripData("tripCategory", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={isFieldRequired('tripCategory')}
            >
              <option value="">Select a category</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="beach">Beach</option>
              <option value="wildlife">Wildlife</option>
              <option value="trekking">Trekking</option>
              <option value="roadtrip">Road Trip</option>
              <option value="spiritual">Spiritual</option>
              <option value="family">Family</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
        )}

        {/* Group Type */}
        {isFieldEnabled('groupType') && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Group Type {isFieldRequired('groupType') ? '*' : ''}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  type: "public",
                  icon: "🌍",
                  title: "Public Trip",
                  description:
                    "Open to all travelers. Anyone can discover and join this trip.",
                },
                {
                  type: "private",
                  icon: "🔐",
                  title: "Private Trip",
                  description:
                    "Only visible to people you share with. Perfect for friends, family, or special groups.",
                },
              ].map((item) => (
                <div
                  key={item.type}
                  onClick={() => handleGroupTypeChange(item.type)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    tripData.groupType === item.type
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

            {/* Private Options */}
            {showPrivateOptions && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-3">
                  Private Options
                </h4>

                {/* Select Option */}
                {isFieldEnabled('privateSharingOption') && (
                  <div className="mb-4">
                    <label className="block text-gray-600 text-sm mb-1">
                      Select Order Group {isFieldRequired('privateSharingOption') ? '*' : ''}
                    </label>
                    <select
                      value={tripData.privateSharingOption || "individual"}
                      onChange={(e) =>
                        updateTripData("privateSharingOption", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      required={isFieldRequired('privateSharingOption')}
                    >
                      <option value="individual">Individual Order Group</option>
                      <option value="group">Group Sharing</option>
                    </select>
                  </div>
                )}

                {/* Checkbox */}
                {isFieldEnabled('isPublic') && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="publicOption"
                      checked={!!tripData.isPublic}
                      onChange={(e) => updateTripData("isPublic", e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="publicOption" className="text-gray-700 text-sm">
                      Mark as Public (applicable only for Private trips)
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Booking Process */}
        {isFieldEnabled('bookingProcess') && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Booking Process {isFieldRequired('bookingProcess') ? '*' : ''}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => updateTripData("bookingProcess", "instant")}
                className={`p-4 border rounded-md text-center ${
                  tripData.bookingProcess === "instant"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="text-xl mb-1">⚡</div>
                <div>Instant Booking</div>
              </button>
              <button
                type="button"
                onClick={() => updateTripData("bookingProcess", "approval")}
                className={`p-4 border rounded-md text-center ${
                  tripData.bookingProcess === "approval"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="text-xl mb-1">👋</div>
                <div>Host Approval</div>
              </button>
            </div>
          </div>
        )}

        {/* Trip Dates */}
        {(isFieldEnabled('tripStartDate') || isFieldEnabled('tripEndDate')) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isFieldEnabled('tripStartDate') && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Start Date {isFieldRequired('tripStartDate') ? '*' : ''}
                </label>
                <input
                  type="date"
                  value={tripData.tripStartDate || ""}
                  onChange={(e) => updateTripData("tripStartDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  max={tripData.tripEndDate|| ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={isFieldRequired('tripStartDate')}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Bookings will be enabled 40 days before the trip
                </p>
              </div>
            )}
            
            {isFieldEnabled('tripEndDate') && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  End Date {isFieldRequired('tripEndDate') ? '*' : ''}
                </label>
                <input
                  type="date"
                  value={tripData.tripEndDate || ""}
                  onChange={(e) => updateTripData("tripEndDate", e.target.value)}
                  min={
                    tripData.tripStartDate || new Date().toISOString().split("T")[0]
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={isFieldRequired('tripEndDate')}
                />
              </div>
            )}
          </div>
        )}

        {/* Trip Locations */}
        {(isFieldEnabled('meetingLocation') || isFieldEnabled('destination')) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pick-up Location */}
            {isFieldEnabled('meetingLocation') && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Pick-up Location {isFieldRequired('meetingLocation') ? '*' : ''}
                </label>
                <input
                  type="text"
                  value={tripData.meetingLocation || ""}
                  onChange={(e) => {
                    updateTripData("meetingLocation", e.target.value);
                    if (tripData.sameAsPickup) {
                      updateTripData("destination", e.target.value);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter pick-up location"
                  required={isFieldRequired('meetingLocation')}
                />
              </div>
            )}

            {/* Destination */}
            {isFieldEnabled('destination') && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Drop Location {isFieldRequired('destination') ? '*' : ''}
                </label>
                <input
                  type="text"
                  value={tripData.destination || ""}
                  onChange={(e) => updateTripData("destination", e.target.value)}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    tripData.sameAsPickup ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter destination"
                  required={isFieldRequired('destination')}
                  disabled={tripData.sameAsPickup}
                />

                {/* Checkbox: Same as pickup */}
                {isFieldEnabled('sameAsPickup') && (
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      checked={tripData.sameAsPickup || false}
                      onChange={(e) => {
                        updateTripData("sameAsPickup", e.target.checked);
                        if (e.target.checked) {
                          updateTripData(
                            "destination",
                            tripData.meetingLocation || ""
                          );
                        }
                      }}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-gray-700 text-sm">
                      Same as pick-up location
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Trip Description */}
        {isFieldEnabled('description') && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Trip Description / Highlights {isFieldRequired('description') ? '*' : ''}
            </label>
            <textarea
              value={tripData.description || ""}
              onChange={(e) => updateTripData("description", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              placeholder="Share what makes your trip unique and exciting"
              required={isFieldRequired('description')}
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
};

BasicDetails.propTypes = {
  tripData: PropTypes.object.isRequired,
  updateTripData: PropTypes.func.isRequired,
};

export default BasicDetails;