import React, { useState, useEffect, useMemo } from "react";
import { format, parseISO, addDays, differenceInDays } from "date-fns";
import { Country, State, City } from "country-state-city";

export default function MergedItinerarySection({ formik }) {
  const [showItineraryAfterPayment, setShowItineraryAfterPayment] = useState(false);
  const [collapsedDays, setCollapsedDays] = useState({});
  const [extraDates, setExtraDates] = useState([]);
  const itineraryType = formik.values.itineraryType;
  
  // Location data state
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Initialize countries on component mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  const handleItineraryTypeChange = (type) => {
    formik.setFieldValue("itineraryType", type);
  };

  // Generate trip dates from start and end dates
  const tripDates = useMemo(() => {
    if (!formik.values.startDate || !formik.values.endDate) return [];

    try {
      const startDate = parseISO(formik.values.startDate);
      const endDate = parseISO(formik.values.endDate);
      const daysCount = differenceInDays(endDate, startDate) + 1;
      const dates = [];

      for (let i = 0; i < daysCount; i++) {
        const date = addDays(startDate, i);
        dates.push({
          date: format(date, "yyyy-MM-dd"),
          label: format(date, "MMM dd, yyyy"),
        });
      }
      return dates;
    } catch (e) {
      console.error("Error parsing dates:", e);
      return [];
    }
  }, [formik.values.startDate, formik.values.endDate]);

  // All dates (trip dates + extra dates)
  const allDates = useMemo(
    () => [...tripDates.map((d) => d.date), ...extraDates],
    [tripDates, extraDates]
  );

  // Initialize structured itinerary when trip dates change
  useEffect(() => {
    if (tripDates.length === 0) return;

    // Get current structured itinerary from formik
    const currentStructured = formik.values.structuredItinerary || [];

    // Create a map of existing days by date for quick lookup
    const existingDaysMap = new Map();
    currentStructured.forEach((day) => {
      if (day.date) {
        existingDaysMap.set(day.date, day);
      }
    });

    // Create new structured itinerary based on trip dates and extra dates
    const newStructured = [];

    // Add trip dates
    tripDates.forEach((tripDate, index) => {
      const existingDay = existingDaysMap.get(tripDate.date);
      if (existingDay) {
        // Use existing day data but ensure the day number is correct
        newStructured.push({
          ...existingDay,
          day: index + 1,
          date: tripDate.date,
        });
      } else {
        // Create new day
        newStructured.push({
          day: index + 1,
          date: tripDate.date,
          title: `Day ${index + 1} - ${tripDate.label}`,
          overview: "",
          stops: [],
          completed: false,
        });
      }
    });

    // Add extra dates
    extraDates.forEach((extraDate, index) => {
      const existingDay = existingDaysMap.get(extraDate);
      if (existingDay) {
        // Use existing day data but ensure the day number is correct
        newStructured.push({
          ...existingDay,
          day: tripDates.length + index + 1,
          date: extraDate,
        });
      } else {
        // Create new day
        newStructured.push({
          day: tripDates.length + index + 1,
          date: extraDate,
          title: extraDate,
          overview: "",
          stops: [],
          completed: false,
        });
      }
    });

    // Update Formik state
    formik.setFieldValue("structuredItinerary", newStructured);
  }, [tripDates, extraDates]);

  // Reset collapsed state when allDates change
  useEffect(() => {
    setCollapsedDays({});
  }, [allDates]);

  const toggleDayCollapsed = (dateKey) => {
    setCollapsedDays((prev) => ({ ...prev, [dateKey]: !prev[dateKey] }));
  };

  const addExtraDate = () => {
    const label = `Extra Day ${extraDates.length + 1}`;
    setExtraDates((prev) => [...prev, label]);
  };

  const removeExtraDateAt = (extraIndex) => {
    const updatedExtra = [...extraDates];
    updatedExtra.splice(extraIndex, 1);
    setExtraDates(updatedExtra);
  };

  const formatDateLabel = (dateKey, idx) => {
    const tripDateObj = tripDates.find((d) => d.date === dateKey);
    if (tripDateObj) return ` (${tripDateObj.label})`;
    if (dateKey) return ` (${dateKey})`;
    return idx != null ? ` (Day ${idx + 1})` : "";
  };

  // Format place for display
  const formatPlace = (place) => {
    if (!place) return "";
    if (typeof place === "string") return place;
    return [place.city, place.state, place.country].filter(Boolean).join(", ");
  };

  // Add a new blank structured day
  const addStructuredItinerary = () => {
    addExtraDate();
  };

  // Update a specific day in the structured itinerary
  const updateDay = (dayIndex, field, value) => {
    const currentStructured = [...(formik.values.structuredItinerary || [])];
    if (!currentStructured[dayIndex]) return;

    currentStructured[dayIndex] = {
      ...currentStructured[dayIndex],
      [field]: value,
    };

    formik.setFieldValue("structuredItinerary", currentStructured);
  };

  // Add a stop to a specific day
  const addStop = (dayIndex) => {
    const currentStructured = [...(formik.values.structuredItinerary || [])];
    if (!currentStructured[dayIndex]) return;

    const currentStops = [...(currentStructured[dayIndex].stops || [])];
    currentStops.push({
      name: "",
      time: "",
      place: {
        country: "",
        state: "",
        city: "",
        full: "",
      },
      activityType: "concert",
      description: "",
      additionalCost: "",
      image: null,
    });

    currentStructured[dayIndex] = {
      ...currentStructured[dayIndex],
      stops: currentStops,
    };

    formik.setFieldValue("structuredItinerary", currentStructured);
  };

  // Update a specific stop in a day
  const updateStop = (dayIndex, stopIndex, field, value) => {
    const currentStructured = [...(formik.values.structuredItinerary || [])];
    if (!currentStructured[dayIndex]) return;

    const currentStops = [...(currentStructured[dayIndex].stops || [])];
    if (!currentStops[stopIndex]) return;

    currentStops[stopIndex] = {
      ...currentStops[stopIndex],
      [field]: value,
    };

    currentStructured[dayIndex] = {
      ...currentStructured[dayIndex],
      stops: currentStops,
    };

    formik.setFieldValue("structuredItinerary", currentStructured);
  };

  // Handle country change
  const handleCountryChange = (countryCode, dayIndex, stopIndex) => {
    const country = countries.find(c => c.isoCode === countryCode);
    if (country) {
      const states = State.getStatesOfCountry(country.isoCode);
      setStates(states);
      setCities([]);
      
      const currentStructured = [...(formik.values.structuredItinerary || [])];
      if (!currentStructured[dayIndex] || !currentStructured[dayIndex].stops[stopIndex]) return;

      currentStructured[dayIndex].stops[stopIndex].place = {
        country: country.name,
        state: "",
        city: "",
        full: country.name,
      };

      formik.setFieldValue("structuredItinerary", currentStructured);
    }
  };

  // Handle state change
  const handleStateChange = (stateCode, countryCode, dayIndex, stopIndex) => {
    const state = states.find(s => s.isoCode === stateCode);
    if (state) {
      const cities = City.getCitiesOfState(countryCode, state.isoCode);
      setCities(cities);
      
      const currentStructured = [...(formik.values.structuredItinerary || [])];
      if (!currentStructured[dayIndex] || !currentStructured[dayIndex].stops[stopIndex]) return;

      const place = currentStructured[dayIndex].stops[stopIndex].place;
      currentStructured[dayIndex].stops[stopIndex].place = {
        ...place,
        state: state.name,
        full: `${state.name}, ${place.country}`,
      };

      formik.setFieldValue("structuredItinerary", currentStructured);
    }
  };

  // Handle city change
  const handleCityChange = (cityName, dayIndex, stopIndex) => {
    const currentStructured = [...(formik.values.structuredItinerary || [])];
    if (!currentStructured[dayIndex] || !currentStructured[dayIndex].stops[stopIndex]) return;

    const place = currentStructured[dayIndex].stops[stopIndex].place;
    currentStructured[dayIndex].stops[stopIndex].place = {
      ...place,
      city: cityName,
      full: `${cityName}, ${place.state}, ${place.country}`,
    };

    formik.setFieldValue("structuredItinerary", currentStructured);
  };

  // Remove a stop from a day
  const removeStop = (dayIndex, stopIndex) => {
    const currentStructured = [...(formik.values.structuredItinerary || [])];
    if (!currentStructured[dayIndex]) return;

    const currentStops = [...(currentStructured[dayIndex].stops || [])];
    currentStops.splice(stopIndex, 1);

    currentStructured[dayIndex] = {
      ...currentStructured[dayIndex],
      stops: currentStops,
    };

    formik.setFieldValue("structuredItinerary", currentStructured);
  };

  return (
    <div className="mb-8 p-4 border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Detailed Itinerary</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleItineraryTypeChange("freeText")}
          className={`px-4 py-2 rounded-md ${
            itineraryType === "freeText"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Free Text
        </button>
        <button
          type="button"
          onClick={() => handleItineraryTypeChange("structured")}
          className={`px-4 py-2 rounded-md ${
            itineraryType === "structured"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Structured
        </button>
      </div>
      
      {/* Free text itinerary */}
      {itineraryType === "freeText" && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Free Text Itinerary*
          </label>
          <textarea
            name="itinerary"
            onChange={formik.handleChange}
            value={formik.values.itinerary}
            rows="5"
            className="w-full p-2 border border-gray-300 rounded"
            required
          ></textarea>
        </div>
      )}
      {/* Structured itinerary */}
      {itineraryType === "structured" && (
        <div className="space-y-4">
          {allDates.map((dateKey, dayIndex) => {
            const dayFromFormik = formik.values.structuredItinerary?.[
              dayIndex
            ] || {
              day: dayIndex + 1,
              date: dateKey,
              title: `Day ${dayIndex + 1}`,
              overview: "",
              stops: [],
              completed: false,
            };

            const isCollapsed = collapsedDays[dateKey] ?? true;

            return (
              <div
                key={dateKey + "-" + dayIndex}
                className={`p-4 border rounded-md ${
                  dayFromFormik.completed
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                {/* Day header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                  <div className="flex items-center">
                    <h3 className="font-medium">
                      {dayFromFormik.title ||
                        `Day ${dayFromFormik.day}: Untitled Day`}
                      {formatDateLabel(dateKey, dayIndex)}
                      {dayFromFormik.completed && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Completed
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateDay(
                          dayIndex,
                          "completed",
                          !dayFromFormik.completed
                        )
                      }
                      className={`px-2 py-1 text-xs rounded ${
                        dayFromFormik.completed
                          ? "bg-gray-200 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {dayFromFormik.completed
                        ? "Mark Incomplete"
                        : "Mark Complete"}
                    </button>
                    {!dayFromFormik.completed && (
                      <button
                        type="button"
                        onClick={() => toggleDayCollapsed(dateKey)}
                        className="text-gray-500 text-sm"
                      >
                        {isCollapsed ? (
                          <span className="bg-red-500 rounded-md py-1 px-3 text-white">
                            EDIT
                          </span>
                        ) : (
                          <span className="bg-green-500 rounded-md py-1 px-3 text-white border border-gray-100">
                            SAVE
                          </span>
                        )}
                      </button>
                    )}
                    {dayIndex >= tripDates.length && (
                      <button
                        type="button"
                        onClick={() =>
                          removeExtraDateAt(dayIndex - tripDates.length)
                        }
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Preview section */}
                <div className="bg-gray-50 p-4 rounded-md mt-4">
                  <h4 className="font-medium mb-2">
                    Preview -{" "}
                    {dayFromFormik.title ||
                      `Day ${dayFromFormik.day}: Untitled`}
                    {formatDateLabel(dateKey, dayIndex)}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {dayFromFormik.overview || "No overview provided"}
                  </p>

                  {dayFromFormik.stops?.length > 0 ? (
                    <div className="space-y-2">
                      {dayFromFormik.stops.map((stop, stopIndex) => (
                        <div
                          key={stopIndex}
                          className="text-sm border-l-2 border-blue-500 pl-2"
                        >
                          <div className="flex flex-wrap items-baseline">
                            <span className="font-medium mr-2">
                              {stop.time ? stop.time : "Time TBA"}
                            </span>
                            <span className="mr-2">→</span>
                            <span className="font-medium">
                              {stop.name || "Unnamed Stop"}
                            </span>
                            {stop.place && (
                              <span className="ml-2 text-gray-600">
                                ({formatPlace(stop.place)})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            <span
                              className={`inline-block text-xs px-2 py-1 rounded-md mr-2 capitalize ${
                                stop.activityType === "event"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {stop.activityType || "activity"}
                            </span>
                            <span>{stop.description || "No description"}</span>
                          </div>
                          {stop.image && (
                            <img
                              src={stop.image}
                              alt={stop.name}
                              className="w-24 h-24 object-cover rounded-md mt-2"
                            />
                          )}
                          {stop.additionalCost > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                              Additional Cost: ₹{stop.additionalCost}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No stops added for this day yet.
                    </p>
                  )}
                </div>

                {/* Editor section */}
                {!isCollapsed && !dayFromFormik.completed && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-600 text-sm">
                          Date
                        </label>
                        <input
                          type="text"
                          value={
                            tripDates.find((d) => d.date === dateKey)?.label ??
                            dateKey
                          }
                          readOnly
                          className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 text-sm">
                          Title/Theme
                        </label>
                        <input
                          type="text"
                          value={dayFromFormik.title || ""}
                          onChange={(e) =>
                            updateDay(dayIndex, "title", e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                          placeholder="Day theme/title"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 text-sm">
                          Overview
                        </label>
                        <input
                          type="text"
                          value={dayFromFormik.overview || ""}
                          onChange={(e) =>
                            updateDay(dayIndex, "overview", e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                          placeholder="Brief day overview"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Stops for this day</h4>
                      {(dayFromFormik.stops || []).map((stop, stopIndex) => (
                        <div
                          key={stopIndex}
                          className="p-3 border border-gray-200 rounded-md mb-2 relative"
                        >
                          <button
                            type="button"
                            onClick={() => removeStop(dayIndex, stopIndex)}
                            className="absolute top-2 right-2 text-red-500"
                          >
                            ×
                          </button>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <div>
                              <label className="block text-gray-600 text-sm">
                                Event name
                              </label>
                              <input
                                type="text"
                                value={stop.name || ""}
                                onChange={(e) =>
                                  updateStop(
                                    dayIndex,
                                    stopIndex,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                placeholder="Eg: new year eve"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 text-sm">
                                Time
                              </label>
                              <input
                                type="time"
                                value={stop.time || ""}
                                onChange={(e) =>
                                  updateStop(
                                    dayIndex,
                                    stopIndex,
                                    "time",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 text-sm">
                                Activity Type
                              </label>
                              <select
                                value={stop.activityType || "concert"}
                                onChange={(e) =>
                                  updateStop(
                                    dayIndex,
                                    stopIndex,
                                    "activityType",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                              >
                                <option value="travel">Travel</option>
                                <option value="Sky jumping">Sky jumping</option>
                                <option value="Trekking">Trekking</option>
                                <option value="Jeep">Jeep</option>
                                <option value="concert">concert</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-gray-600 text-sm">
                                Description
                              </label>
                              <input
                                type="text"
                                value={stop.description || ""}
                                onChange={(e) =>
                                  updateStop(
                                    dayIndex,
                                    stopIndex,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                placeholder="Description"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 text-sm">
                                Additional Cost
                              </label>
                              <input
                                type="number"
                                value={stop.additionalCost || ""}
                                onChange={(e) =>
                                  updateStop(
                                    dayIndex,
                                    stopIndex,
                                    "additionalCost",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                placeholder="Additional cost"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 text-sm">
                                Image
                              </label>
                              <input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      updateStop(
                                        dayIndex,
                                        stopIndex,
                                        "image",
                                        event.target.result
                                      );
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                              />
                            </div>
                            {/* Location Selector */}
                            <div className="col-span-1 sm:col-span-4">
                              <label className="block text-gray-600 text-sm mb-1">
                                Location
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <select
                                    value={
                                      countries.find(c => c.name === stop.place?.country)?.isoCode || ""
                                    }
                                    onChange={(e) =>
                                      handleCountryChange(e.target.value, dayIndex, stopIndex)
                                    }
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                  >
                                    <option value="">Country</option>
                                    {countries.map((country) => (
                                      <option key={country.isoCode} value={country.isoCode}>
                                        {country.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <select
                                    value={
                                      states.find(s => s.name === stop.place?.state)?.isoCode || ""
                                    }
                                    onChange={(e) => {
                                      const countryCode = countries.find(c => c.name === stop.place?.country)?.isoCode;
                                      if (countryCode) {
                                        handleStateChange(e.target.value, countryCode, dayIndex, stopIndex);
                                      }
                                    }}
                                    disabled={!stop.place?.country}
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                                  >
                                    <option value="">State</option>
                                    {states.map((state) => (
                                      <option key={state.isoCode} value={state.isoCode}>
                                        {state.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <select
                                    value={stop.place?.city || ""}
                                    onChange={(e) =>
                                      handleCityChange(e.target.value, dayIndex, stopIndex)
                                    }
                                    disabled={!stop.place?.state}
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                                  >
                                    <option value="">City</option>
                                    {cities.map((city) => (
                                      <option key={city.name} value={city.name}>
                                        {city.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addStop(dayIndex)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition text-sm"
                      >
                        + Add Event To This Day
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={addStructuredItinerary}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            + Add Day
          </button>
        </div>
      )}
    </div>
  );
}