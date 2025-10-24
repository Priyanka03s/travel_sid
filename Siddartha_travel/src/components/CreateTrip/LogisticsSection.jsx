import React, { useState } from "react";
import PropTypes from "prop-types";

export default function LogisticsSection({
  tripData,
  updateTripData,
  addArrayField,
}) {
  const [newVisaDoc, setNewVisaDoc] = useState("");
  const bookingDatesSelected =
    tripData.bookingTimeline?.startDate && tripData.bookingTimeline?.endDate;

  const handleAddVisaDoc = () => {
    if (newVisaDoc) {
      addArrayField("visaDocuments", newVisaDoc);
      setNewVisaDoc("");
    }
  };

  const handleChange = (index, value, type, isAdditional = false) => {
    if (!isAdditional) {
      const links = [...(tripData.socialGroupLinks || [])];
      links[index] = value;
      updateTripData("socialGroupLinks", links);
    } else {
      const additional = [...(tripData.additionalLinks || [])];
      additional[index] = { value, type };
      updateTripData("additionalLinks", additional);
    }
  };

  const addField = () => {
    const additional = [...(tripData.additionalLinks || [])];
    additional.push({ value: "", type: "link" });
    updateTripData("additionalLinks", additional);
  };

  const removeField = (index) => {
    const additional = [...(tripData.additionalLinks || [])];
    if (index >= 0 && index < additional.length) {
      additional.splice(index, 1);
      updateTripData("additionalLinks", additional);
    }
  };

  // safely derived lengths & arrays
  const transportOptions = tripData.transportOptions || [];
  const visaDocuments = tripData.visaDocuments || [];
  const additionalLinks = tripData.additionalLinks || [];
  const socialGroupLinks = tripData.socialGroupLinks || ["", "", "", ""];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Logistics Details</h2>

      {/* Participants Section */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Participants</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Minimum Participants *
            </label>
            <input
              type="number"
              value={tripData.minParticipants ?? ""}
              onChange={(e) =>
                updateTripData("minParticipants", Number(e.target.value))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Minimum needed for trip to proceed
            </p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Maximum Participants *
            </label>
            <input
              type="number"
              value={tripData.maxParticipants ?? ""}
              onChange={(e) =>
                updateTripData("maxParticipants", Number(e.target.value))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={tripData.minParticipants || 1}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum capacity for the trip
            </p>
          </div>
        </div>

        {/* Early Booking Participants */}
        <div className="mb-6 p-4 border rounded-lg bg-blue-50">
          <h3 className="text-md text-gray-700 font-semibold mb-3">
            Early Booking Participants
          </h3>

          {/* Allow/Don't Allow Radio Buttons */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Early Booking Option
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label
                className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer transition ${
                  tripData.allowEarlyBooking
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="earlyBookingOption"
                  value="allow"
                  checked={tripData.allowEarlyBooking ?? false}
                  onChange={(e) => {
                    updateTripData("allowEarlyBooking", e.target.checked);
                    // Reset early booking settings if disabling
                    if (!e.target.checked) {
                      updateTripData("earlyBookingLimit", "");
                      updateTripData("earlyBookingDiscount", "");
                      updateTripData("earlyBookingEndDate", "");
                      updateTripData("allowPreviousParticipation", false);
                    }
                  }}
                  className="mr-2 accent-blue-600"
                />
                <span className="font-medium">Allow</span>
              </label>

              <label
                className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer transition ${
                  !tripData.allowEarlyBooking
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="earlyBookingOption"
                  value="disallow"
                  checked={!tripData.allowEarlyBooking}
                  onChange={(e) => {
                    updateTripData("allowEarlyBooking", !e.target.checked);
                    // Reset early booking settings if disabling
                    if (e.target.checked) {
                      updateTripData("earlyBookingLimit", "");
                      updateTripData("earlyBookingDiscount", "");
                      updateTripData("earlyBookingEndDate", "");
                      updateTripData("allowPreviousParticipation", false);
                    }
                  }}
                  className="mr-2 accent-blue-600"
                />
                <span className="font-medium">Don't Allow</span>
              </label>
            </div>
          </div>

          {tripData.allowEarlyBooking && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Early Booking Limit
                </label>
                <input
                  type="number"
                  value={tripData.earlyBookingLimit || ""}
                  onChange={(e) =>
                    updateTripData("earlyBookingLimit", Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                  max={tripData.maxParticipants || ""}
                  placeholder="Max early participants"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum number of early booking participants
                </p>
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Early Booking Discount (%)
                </label>
                <input
                  type="number"
                  value={tripData.earlyBookingDiscount || ""}
                  onChange={(e) =>
                    updateTripData(
                      "earlyBookingDiscount",
                      Number(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0"
                  max="100"
                  placeholder="Discount percentage"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Discount offered for early booking
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-600 text-sm mb-1">
                  Early Booking End Date
                </label>
                <input
                  type="date"
                  value={tripData.earlyBookingEndDate || ""}
                  onChange={(e) =>
                    updateTripData("earlyBookingEndDate", e.target.value)
                  }
                  min={new Date().toISOString().split("T")[0]}
                  max={tripData.tripEndDate || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Last date for early booking (before general booking starts)
                </p>
              </div>
              
              {/* Allow Previous Participation Radio Buttons */}
              <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                <label className="block text-gray-700 font-medium mb-2">
                  Allow Previous Participation
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label
                    className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer transition ${
                      tripData.allowPreviousParticipation
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="previousParticipation"
                      value="yes"
                      checked={tripData.allowPreviousParticipation ?? false}
                      onChange={(e) =>
                        updateTripData("allowPreviousParticipation", e.target.value === "yes")
                      }
                      className="mr-2 accent-blue-600"
                    />
                    <span className="font-medium">Yes</span>
                  </label>

                  <label
                    className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer transition ${
                      !tripData.allowPreviousParticipation
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="previousParticipation"
                      value="no"
                      checked={!tripData.allowPreviousParticipation}
                      onChange={(e) =>
                        updateTripData("allowPreviousParticipation", e.target.value === "yes")
                      }
                      className="mr-2 accent-blue-600"
                    />
                    <span className="font-medium">No</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Age Group Preferences */}
        <div className="pb-6">
          <h3 className="text-lg font-semibold mb-4">Age Group Preferences</h3>

          {/* No Age Limit Checkbox */}
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              checked={tripData.noAgeLimit ?? false}
              onChange={(e) => {
                updateTripData("noAgeLimit", e.target.checked);
                if (e.target.checked) {
                  updateTripData("ageGroup", { min: null, max: null });
                  updateTripData("minAge", null);
                  updateTripData("maxAge", null);
                }
              }}
              className="w-5 h-5 accent-blue-600"
            />
            <span className="text-gray-700 text-sm">No Age Limit</span>
          </div>

          {!tripData.noAgeLimit && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
              {/* Minimum Age */}
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Minimum Age
                </label>
                <input
                  type="number"
                  value={tripData.ageGroup?.min ?? tripData.minAge ?? ""}
                  onChange={(e) => {
                    const value = e.target.value
                      ? Number(e.target.value)
                      : null;
                    updateTripData("ageGroup", {
                      ...tripData.ageGroup,
                      min: value,
                    });
                    updateTripData("minAge", value);
                  }}
                  placeholder="Enter minimum age"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={
                    !tripData.minParticipants || !tripData.maxParticipants
                  }
                />
              </div>

              {/* Maximum Age */}
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Maximum Age
                </label>
                <input
                  type="number"
                  value={tripData.ageGroup?.max ?? tripData.maxAge ?? ""}
                  onChange={(e) => {
                    const value = e.target.value
                      ? Number(e.target.value)
                      : null;
                    updateTripData("ageGroup", {
                      ...tripData.ageGroup,
                      max: value,
                    });
                    updateTripData("maxAge", value);
                  }}
                  placeholder="Enter maximum age"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={
                    !tripData.minParticipants || !tripData.maxParticipants
                  }
                />
              </div>
            </div>
          )}

          {!tripData.minParticipants || !tripData.maxParticipants ? (
            <p className="text-sm text-gray-500 italic">
              Please enter minimum and maximum participants to enable Age Group
              Preferences.
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
                  checked={tripData.genderPreferences?.male?.allowed ?? false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateTripData("genderPreferences", {
                        ...(tripData.genderPreferences || {}),
                        male: { allowed: true, count: 0 },
                      });
                    } else {
                      const { male, ...rest } =
                        tripData.genderPreferences || {};
                      updateTripData("genderPreferences", rest);
                    }
                  }}
                  className="w-5 h-5 accent-blue-600"
                  disabled={
                    !tripData.minParticipants || !tripData.maxParticipants
                  }
                />
                <span className="text-gray-700">Allow Male</span>
              </label>

              {tripData.genderPreferences?.male?.allowed && (
                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Male Seats
                  </label>
                  <input
                    type="number"
                    value={tripData.genderPreferences?.male?.count ?? ""}
                    onChange={(e) => {
                      const maleCount = Number(e.target.value);
                      updateTripData("genderPreferences", {
                        ...(tripData.genderPreferences || {}),
                        male: { allowed: true, count: maleCount },
                      });
                    }}
                    min="0"
                    max={tripData.maxParticipants}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={
                      !tripData.minParticipants || !tripData.maxParticipants
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
                  checked={tripData.genderPreferences?.female?.allowed ?? false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateTripData("genderPreferences", {
                        ...(tripData.genderPreferences || {}),
                        female: { allowed: true, count: 0 },
                      });
                    } else {
                      const { female, ...rest } =
                        tripData.genderPreferences || {};
                      updateTripData("genderPreferences", rest);
                    }
                  }}
                  className="w-5 h-5 accent-blue-600"
                  disabled={
                    !tripData.minParticipants || !tripData.maxParticipants
                  }
                />
                <span className="text-gray-700">Allow Female</span>
              </label>

              {tripData.genderPreferences?.female?.allowed && (
                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Female Seats
                  </label>
                  <input
                    type="number"
                    value={tripData.genderPreferences?.female?.count ?? ""}
                    onChange={(e) => {
                      const maleCount =
                        tripData.genderPreferences?.male?.count || 0;
                      const remaining =
                        (tripData.maxParticipants || 0) - maleCount;
                      const femaleCount = Math.min(
                        Number(e.target.value),
                        remaining
                      );

                      updateTripData("genderPreferences", {
                        ...(tripData.genderPreferences || {}),
                        female: { allowed: true, count: femaleCount },
                      });
                    }}
                    min="0"
                    max={
                      (tripData.maxParticipants || 0) -
                      (tripData.genderPreferences?.male?.count || 0)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={
                      !tripData.minParticipants || !tripData.maxParticipants
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Remaining seats after male allocation.
                  </p>
                </div>
              )}
            </div>

            {/* Kids */}
            <div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={tripData.genderPreferences?.kids?.allowed ?? false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateTripData("genderPreferences", {
                        ...(tripData.genderPreferences || {}),
                        kids: { allowed: true, count: 0 },
                      });
                    } else {
                      const { kids, ...rest } =
                        tripData.genderPreferences || {};
                      updateTripData("genderPreferences", rest);
                    }
                  }}
                  className="w-5 h-5 accent-blue-600"
                  disabled={
                    !tripData.minParticipants || !tripData.maxParticipants
                  }
                />
                <span className="text-gray-700">Allow Kids (below 12)</span>
              </label>

              {tripData.genderPreferences?.kids?.allowed && (
                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Kids Seats
                  </label>
                  <input
                    type="number"
                    value={tripData.genderPreferences?.kids?.count ?? ""}
                    onChange={(e) => {
                      const maleCount =
                        tripData.genderPreferences?.male?.count || 0;
                      const femaleCount =
                        tripData.genderPreferences?.female?.count || 0;
                      const remaining =
                        (tripData.maxParticipants || 0) -
                        (maleCount + femaleCount);
                      const kidsCount = Math.min(
                        Number(e.target.value),
                        remaining
                      );

                      updateTripData("genderPreferences", {
                        ...(tripData.genderPreferences || {}),
                        kids: { allowed: true, count: kidsCount },
                      });
                    }}
                    min="0"
                    max={
                      (tripData.maxParticipants || 0) -
                      ((tripData.genderPreferences?.male?.count || 0) +
                        (tripData.genderPreferences?.female?.count || 0))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={
                      !tripData.minParticipants || !tripData.maxParticipants
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Remaining seats after male + female allocation.
                  </p>
                </div>
              )}
            </div>

            {/* Pets chooser */}
            <div>
              <div className="flex items-center gap-4">
                {/* Allow Pets toggle (legacy boolean) */}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={tripData.genderPreferences?.pets ?? false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      updateTripData("genderPreferences", {
                        ...(tripData.genderPreferences || {}),
                        pets: checked,
                        // clear petTypes when unchecked
                        petTypes: checked
                          ? tripData.genderPreferences?.petTypes || {
                              cat: false,
                              dog: false,
                            }
                          : { cat: false, dog: false },
                      });
                    }}
                    className="w-5 h-5 accent-blue-600"
                    disabled={
                      !tripData.minParticipants || !tripData.maxParticipants
                    }
                  />
                  <span className="text-gray-700">Allow Pets</span>
                </label>

                {/* Show types only when pets allowed */}
                {tripData.genderPreferences?.pets && (
                  <div className="flex items-center gap-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={
                          tripData.genderPreferences?.petTypes?.cat ?? false
                        }
                        onChange={(e) => {
                          const checked = e.target.checked;
                          updateTripData("genderPreferences", {
                            ...(tripData.genderPreferences || {}),
                            pets: true, // ensure main toggle remains true
                            petTypes: {
                              ...(tripData.genderPreferences?.petTypes || {}),
                              cat: checked,
                            },
                          });
                        }}
                        className="w-4 h-4 accent-blue-600"
                        disabled={
                          !tripData.minParticipants || !tripData.maxParticipants
                        }
                      />
                      <span className="text-gray-600 text-sm">Cats</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={
                          tripData.genderPreferences?.petTypes?.dog ?? false
                        }
                        onChange={(e) => {
                          const checked = e.target.checked;
                          updateTripData("genderPreferences", {
                            ...(tripData.genderPreferences || {}),
                            pets: true,
                            petTypes: {
                              ...(tripData.genderPreferences?.petTypes || {}),
                              dog: checked,
                            },
                          });
                        }}
                        className="w-4 h-4 accent-blue-600"
                        disabled={
                          !tripData.minParticipants || !tripData.maxParticipants
                        }
                      />
                      <span className="text-gray-600 text-sm">Dogs</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!tripData.minParticipants || !tripData.maxParticipants ? (
            <p className="text-sm text-gray-500 italic">
              Please enter minimum and maximum participants to enable Gender
              Preferences.
            </p>
          ) : null}
        </div>
      </div>

      {/* Booking Process */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Booking Process</h3>

        {/* Booking Deadline */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Booking Deadline
          </label>
          <input
            type="date"
            value={tripData.bookingDeadline || ""}
            onChange={(e) => updateTripData("bookingDeadline", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            max={tripData.tripStartDate || ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-sm text-gray-500 mt-1">
            Final date to book this trip
          </p>
        </div>

        {/* Booking Timeline */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Booking Timeline</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={tripData.bookingTimeline?.startDate || ""}
                onChange={(e) =>
                  updateTripData("bookingTimeline", {
                    ...tripData.bookingTimeline,
                    startDate: e.target.value,
                  })
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                max={tripData.bookingDeadline || ""}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                End Date
              </label>
              <input
                type="date"
                value={tripData.bookingTimeline?.endDate || ""}
                onChange={(e) =>
                  updateTripData("bookingTimeline", {
                    ...tripData.bookingTimeline,
                    endDate: e.target.value,
                  })
                }
                min={
                  tripData.bookingTimeline?.startDate ||
                  new Date().toISOString().split("T")[0]
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                max={tripData.bookingDeadline || ""}
              />
            </div>
          </div>
        </div>

        {/* Payment Type Selection */}
        <div className="mb-6">
          <label className="block text-gray-800 font-semibold text-base mb-4">
            Payment Type <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <label
              className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer transition ${
                tripData.paymentType === "full"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value="full"
                checked={tripData.paymentType === "full"}
                onChange={(e) => {
                  updateTripData("paymentType", e.target.value);
                  updateTripData("paymentRequirement", {
                    type: "full",
                    percentage: 100,
                  });
                }}
                className="mr-2 accent-blue-600"
              />
              <span className="font-medium">Full Payment Only</span>
            </label>

            <label
              className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer transition ${
                tripData.paymentType === "partial"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value="partial"
                checked={tripData.paymentType === "partial"}
                onChange={(e) => {
                  updateTripData("paymentType", e.target.value);
                  updateTripData("paymentRequirement", {
                    type: "partial",
                    percentage: tripData.initialPaymentPercentage || 0,
                  });
                }}
                className="mr-2 accent-blue-600"
              />
              <span className="font-medium">Partial Payment Only</span>
            </label>

            <label
              className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer transition ${
                tripData.paymentType === "both"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value="both"
                checked={tripData.paymentType === "both"}
                onChange={(e) => updateTripData("paymentType", e.target.value)}
                className="mr-2 accent-blue-600"
              />
              <span className="font-medium">Both Options Available</span>
            </label>
          </div>
        </div>

        {/* Full Payment Booking Dates */}
        {(tripData.paymentType === "full" ||
          tripData.paymentType === "both") && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold text-gray-800 mb-3">
              Full Payment Booking Period
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Booking Start Date *
                </label>
                <input
                  type="date"
                  value={tripData.fullPaymentBookingStart || ""}
                  onChange={(e) =>
                    updateTripData("fullPaymentBookingStart", e.target.value)
                  }
                  min={new Date().toISOString().split("T")[0]}
                  max={tripData.bookingDeadline || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
                {tripData.tripStartDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Must be before trip start date:{" "}
                    {new Date(tripData.tripStartDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Booking End Date *
                </label>
                <input
                  type="date"
                  value={tripData.fullPaymentBookingEnd || ""}
                  onChange={(e) =>
                    updateTripData("fullPaymentBookingEnd", e.target.value)
                  }
                  min={
                    tripData.fullPaymentBookingStart ||
                    new Date().toISOString().split("T")[0]
                  }
                  max={tripData.bookingDeadline || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
                {tripData.tripStartDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Must be before trip start date:{" "}
                    {new Date(tripData.tripStartDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Partial Payment Booking Dates */}
        {(tripData.paymentType === "partial" ||
          tripData.paymentType === "both") && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold text-gray-800 mb-3">
              Partial Payment Schedule
            </h4>

            {/* Initial Payment */}
            <div className="mb-4">
              <h5 className="font-medium text-gray-700 mb-2">
                Initial Payment
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Booking Start Date *
                  </label>
                  <input
                    type="date"
                    value={tripData.partialPaymentStart || ""}
                    onChange={(e) =>
                      updateTripData("partialPaymentStart", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                    max={tripData.bookingDeadline || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Booking End Date *
                  </label>
                  <input
                    type="date"
                    value={tripData.partialPaymentEnd || ""}
                    onChange={(e) =>
                      updateTripData("partialPaymentEnd", e.target.value)
                    }
                    min={
                      tripData.partialPaymentStart ||
                      new Date().toISOString().split("T")[0]
                    }
                    max={tripData.bookingDeadline || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-gray-600 text-sm mb-1">
                  Initial Payment Percentage *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tripData.initialPaymentPercentage || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      updateTripData("initialPaymentPercentage", value);

                      // Update payment requirement if payment type is partial
                      if (tripData.paymentType === "partial") {
                        updateTripData("paymentRequirement", {
                          type: "partial",
                          percentage: value,
                        });
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    min="1"
                    max="99"
                    required
                  />
                  <span className="text-gray-600">%</span>
                </div>
              </div>
            </div>

            {/* Additional Payment Installments */}
            <div className="mb-4">
              <h5 className="font-medium text-gray-700 mb-2">
                Additional Installments
              </h5>

              {(tripData.additionalPayments || []).map((payment, index) => (
                <div key={index} className="mb-3 p-3 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">
                      Installment {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [
                          ...(tripData.additionalPayments || []),
                        ];
                        updated.splice(index, 1);
                        updateTripData("additionalPayments", updated);
                      }}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">
                        Payment Date *
                      </label>
                      <input
                        type="date"
                        value={payment.date || ""}
                        onChange={(e) => {
                          const updated = [
                            ...(tripData.additionalPayments || []),
                          ];
                          updated[index] = {
                            ...updated[index],
                            date: e.target.value,
                          };
                          updateTripData("additionalPayments", updated);
                        }}
                        min={
                          tripData.partialPaymentEnd ||
                          new Date().toISOString().split("T")[0]
                        }
                        max={tripData.bookingDeadline || ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                      {tripData.tripStartDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Must be before trip start date:{" "}
                          {new Date(
                            tripData.tripStartDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">
                        Percentage *
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={payment.percentage || ""}
                          onChange={(e) => {
                            const updated = [
                              ...(tripData.additionalPayments || []),
                            ];
                            updated[index] = {
                              ...updated[index],
                              percentage: Number(e.target.value),
                            };
                            updateTripData("additionalPayments", updated);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          min="1"
                          required
                        />
                        <span className="text-gray-600">%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={payment.description || ""}
                      onChange={(e) => {
                        const updated = [
                          ...(tripData.additionalPayments || []),
                        ];
                        updated[index] = {
                          ...updated[index],
                          description: e.target.value,
                        };
                        updateTripData("additionalPayments", updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="E.g., Second installment for accommodation"
                    />
                  </div>
                </div>
              ))}

              {/* Only show button if installments are less than 2 */}
              {(!tripData.additionalPayments ||
                tripData.additionalPayments.length < 2) && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...(tripData.additionalPayments || [])];
                    updated.push({ date: "", percentage: "", description: "" });
                    updateTripData("additionalPayments", updated);
                  }}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm"
                >
                  Add Installment
                </button>
              )}
            </div>
          </div>
        )}

        {/* Payment Requirement */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">
            Payment Requirement
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm mb-1">Type</label>
              <input
                type="text"
                value={tripData.paymentRequirement?.type || ""}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">
                Percentage
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tripData.paymentRequirement?.percentage || ""}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
                <span className="text-gray-600">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="mt-6">
          <label className="block text-gray-800 font-semibold text-base mb-2">
            Cancellation Policy
          </label>
          {/* Enable/Disable Checkbox */}
          <div className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              checked={tripData.cancellationEnabled ?? false}
              onChange={(e) => {
                updateTripData("cancellationEnabled", e.target.checked);
                // Initialize with default rules if enabling for the first time
                if (e.target.checked && !tripData.cancellationRules) {
                  updateTripData("cancellationRules", [
                    {
                      daysBefore: 0,
                      percentage: 0,
                      description: "",
                    },
                  ]);
                }
              }}
              className="w-5 h-5 accent-blue-600"
            />
            <span className="text-gray-700">Enable Cancellation Policy</span>
          </div>
          {/* Custom Cancellation Rules */}
          {tripData.cancellationEnabled && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-semibold text-gray-800 mb-3">
                Cancellation Rules
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Define cancellation charges based on days before trip start
                date.
              </p>

              {(tripData.cancellationRules || []).map((rule, index) => (
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
                      onClick={() => {
                        const updated = [...(tripData.cancellationRules || [])];
                        updated.splice(index, 1);
                        updateTripData("cancellationRules", updated);
                      }}
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
                        value={rule.daysBefore ?? ""}
                        onChange={(e) => {
                          const updated = [
                            ...(tripData.cancellationRules || []),
                          ];
                          updated[index] = {
                            ...updated[index],
                            daysBefore: Number(e.target.value),
                          };
                          updateTripData("cancellationRules", updated);
                        }}
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
                          value={rule.percentage ?? ""}
                          onChange={(e) => {
                            const updated = [
                              ...(tripData.cancellationRules || []),
                            ];
                            updated[index] = {
                              ...updated[index],
                              percentage: Number(e.target.value),
                            };
                            updateTripData("cancellationRules", updated);
                          }}
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
                        onChange={(e) => {
                          const updated = [
                            ...(tripData.cancellationRules || []),
                          ];
                          updated[index] = {
                            ...updated[index],
                            description: e.target.value,
                          };
                          updateTripData("cancellationRules", updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="E.g., 30+ days before departure"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const updated = [...(tripData.cancellationRules || [])];
                  updated.push({
                    daysBefore: 0,
                    percentage: 0,
                    description: "",
                  });
                  updateTripData("cancellationRules", updated);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Rule
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Visa Process */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Visa Process (Optional)</h3>

        <div
          className={`flex items-center border rounded-lg cursor-pointer justify-center transition w-fit ${
            tripData.visaRequired
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onClick={() => {
            const checked = !tripData.visaRequired;
            updateTripData("visaRequired", checked);
            if (!checked) {
              updateTripData("visaDocuments", []);
              updateTripData("visaProcess", {});
            }
          }}
        >
          <input
            type="checkbox"
            checked={tripData.visaRequired || false}
            readOnly
            className="my-3 ml-4 accent-blue-600"
          />
          <label className="text-gray-700 my-3 mx-4 font-medium select-none">
            Visa process is required
          </label>
        </div>

        {tripData.visaRequired && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Documents Required
              </label>
              <div className="space-y-2 mb-4">
                {visaDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-gray-50 rounded"
                  >
                    <span className="mr-2">•</span>
                    <span>{doc}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...visaDocuments];
                        updated.splice(index, 1);
                        updateTripData("visaDocuments", updated);
                      }}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row">
                <input
                  type="text"
                  value={newVisaDoc}
                  onChange={(e) => setNewVisaDoc(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md"
                  placeholder="Add required document"
                />
                <button
                  type="button"
                  onClick={handleAddVisaDoc}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Processing Assistance Fee (₹)
                </label>
                <input
                  type="number"
                  value={tripData.visaProcess?.assistanceFee ?? ""}
                  onChange={(e) =>
                    updateTripData("visaProcess", {
                      ...(tripData.visaProcess || {}),
                      assistanceFee: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Processing Time (Days)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={tripData.visaProcess?.processingTimeFrom ?? ""}
                    onChange={(e) =>
                      updateTripData("visaProcess", {
                        ...(tripData.visaProcess || {}),
                        processingTimeFrom: Number(e.target.value),
                      })
                    }
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                    min="1"
                    max="7"
                    placeholder="From"
                  />
                  <span className="self-center">to</span>
                  <input
                    type="number"
                    value={tripData.visaProcess?.processingTimeTo ?? ""}
                    onChange={(e) =>
                      updateTripData("visaProcess", {
                        ...(tripData.visaProcess || {}),
                        processingTimeTo: Number(e.target.value),
                      })
                    }
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                    min={tripData.visaProcess?.processingTimeFrom || 1}
                    placeholder="To"
                    max="15"
                  />
                </div>
                <label className="block text-gray-500 mb-2">
                  Max 7-15 Days
                </label>
              </div>
            </div>

            <div className="mt-4 flex">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto"
                onClick={() => alert("Visa process details added!")}
              >
                Add Visa Process
              </button>
            </div>
          </>
        )}
      </div>

      {/* Transport Options */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Transport Options</h3>

        <div className="space-y-4">
          {transportOptions.map((option, index) => (
            <div
              key={index}
              className={`flex flex-col border rounded-lg cursor-pointer transition p-4 ${
                option.included
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-300 hover:border-gray-400 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={option.included || false}
                  readOnly
                  className="mr-3 accent-blue-600"
                  onClick={() => {
                    const updated = [...transportOptions];
                    updated[index] = {
                      ...(updated[index] || {}),
                      included: !updated[index]?.included,
                    };
                    updateTripData("transportOptions", updated);
                  }}
                />
                <label className="font-medium select-none cursor-pointer">
                  Include this transport option
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const updated = (transportOptions || []).slice();
                    updated.splice(index, 1);
                    updateTripData("transportOptions", updated);
                  }}
                  className="ml-auto px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Transport Type *
                  </label>
                  <select
                    value={option.type || "flight"}
                    onChange={(e) => {
                      const updated = [...transportOptions];
                      updated[index] = {
                        ...(updated[index] || {}),
                        type: e.target.value,
                      };
                      updateTripData("transportOptions", updated);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="flight">Flight</option>
                    <option value="train">Train</option>
                    <option value="bus">Bus</option>
                    <option value="cruise">Cruise</option>
                    <option value="local">Local Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Departure Time
                  </label>
                  <input
                    type="time"
                    value={option.departureTime || ""}
                    onChange={(e) => {
                      const updated = [...transportOptions];
                      updated[index] = {
                        ...(updated[index] || {}),
                        departureTime: e.target.value,
                      };
                      updateTripData("transportOptions", updated);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={option.departureDate || ""}
                    onChange={(e) => {
                      const updated = [...transportOptions];
                      updated[index] = {
                        ...(updated[index] || {}),
                        departureDate: e.target.value,
                      };
                      updateTripData("transportOptions", updated);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Cost per Person (₹)
                  </label>
                  <input
                    type="number"
                    value={option.cost ?? ""}
                    onChange={(e) => {
                      const updated = [...transportOptions];
                      updated[index] = {
                        ...(updated[index] || {}),
                        cost: Number(e.target.value),
                      };
                      updateTripData("transportOptions", updated);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
              </div>

              <label className="block text-gray-600 text-sm mb-1">
                Description
              </label>
              <input
                type="text"
                value={option.description || ""}
                onChange={(e) => {
                  const updated = [...transportOptions];
                  updated[index] = {
                    ...(updated[index] || {}),
                    description: e.target.value,
                  };
                  updateTripData("transportOptions", updated);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Flight number, bus type, etc."
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              addArrayField("transportOptions", {
                type: "flight",
                departureTime: "",
                cost: 0,
                description: "",
                included: true,
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Transport Option
          </button>
        </div>
      </div>

      {/* Social Groups */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Social Groups</h3>

        <div className="mb-4 space-y-4">
          {[
            {
              label: "Group 1 (Partially Paid)",
              placeholder:
                "WhatsApp/Telegram link for partially paid participants",
            },
            {
              label: "Group 2 (Fully Paid)",
              placeholder: "WhatsApp/Telegram link for fully paid participants",
            },
            {
              label: "Group 3 (Visa processing)",
              placeholder: "WhatsApp/Telegram link for visa processing",
            },
            {
              label: "YouTube/Instagram Link",
              placeholder: "Enter YouTube/Instagram URL",
            },
          ].map((field, index) => (
            <div key={index}>
              <label className="block text-gray-600 text-sm mb-1">
                {field.label}
              </label>
              <input
                type="url"
                value={socialGroupLinks[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder={field.placeholder}
              />
            </div>
          ))}

          {/* Additional dynamic fields */}
          {additionalLinks.map((item, index) => (
            <div key={index} className="border p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-600 text-sm">
                  {item.type === "link"
                    ? "Link"
                    : item.type === "file"
                    ? "File"
                    : "Video"}
                </label>
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>

              {item.type === "link" && (
                <input
                  type="url"
                  value={item.value || ""}
                  onChange={(e) =>
                    handleChange(index, e.target.value, "link", true)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2"
                  placeholder="Enter URL"
                />
              )}

              {item.type === "file" && (
                <input
                  type="file"
                  onChange={(e) =>
                    handleChange(index, e.target.files[0], "file", true)
                  }
                  className="w-full mb-2"
                />
              )}

              {item.type === "video" && (
                <input
                  type="url"
                  value={item.value || ""}
                  onChange={(e) =>
                    handleChange(index, e.target.value, "video", true)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2"
                  placeholder="Video URL (YouTube/Vimeo)"
                />
              )}

              <select
                value={item.type}
                onChange={(e) =>
                  handleChange(index, item.value, e.target.value, true)
                }
                className="w-full border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="link">Link</option>
                <option value="file">File</option>
                <option value="video">Video</option>
              </select>
            </div>
          ))}

          <button
            type="button"
            onClick={addField}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add More
          </button>
        </div>

        {/* Additional Fields */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Additional Fields</h3>
          <div className="space-y-4">
            {(tripData.additionalFields || []).map((field, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 cursor-pointer transition hover:shadow-sm bg-white"
              >
                <label className="block text-gray-600 text-sm mb-1">
                  Field Name *
                </label>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={field.name || ""}
                      onChange={(e) => {
                        const updated = [...(tripData.additionalFields || [])];
                        updated[index] = {
                          ...(updated[index] || {}),
                          name: e.target.value,
                        };
                        updateTripData("additionalFields", updated);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Packing List"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = [...(tripData.additionalFields || [])];
                      updated.splice(index, 1);
                      updateTripData("additionalFields", updated);
                    }}
                    className="ml-4 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      Field Type *
                    </label>
                    <select
                      value={field.type || "text"}
                      onChange={(e) => {
                        const updated = [...(tripData.additionalFields || [])];
                        updated[index] = {
                          ...(updated[index] || {}),
                          type: e.target.value,
                        };
                        updateTripData("additionalFields", updated);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Long Text</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="file">File Upload</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      Required
                    </label>
                    <div
                      className={`px-4 py-2 border rounded-md text-center cursor-pointer transition ${
                        field.required
                          ? "bg-blue-50 border-blue-600 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => {
                        const updated = [...(tripData.additionalFields || [])];
                        updated[index] = {
                          ...(updated[index] || {}),
                          required: !updated[index]?.required,
                        };
                        updateTripData("additionalFields", updated);
                      }}
                    >
                      {field.required ? "Yes" : "No"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      Optional Placeholder
                    </label>
                    <input
                      type="text"
                      value={field.description || ""}
                      onChange={(e) => {
                        const updated = [...(tripData.additionalFields || [])];
                        updated[index] = {
                          ...(updated[index] || {}),
                          description: e.target.value,
                        };
                        updateTripData("additionalFields", updated);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Help text for this field"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                addArrayField("additionalFields", {
                  name: "",
                  type: "text",
                  required: false,
                  description: "",
                })
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Add Additional Field
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

LogisticsSection.propTypes = {
  tripData: PropTypes.object.isRequired,
  updateTripData: PropTypes.func.isRequired,
  addArrayField: PropTypes.func.isRequired,
};