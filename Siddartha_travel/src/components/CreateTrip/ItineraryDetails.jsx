import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Country, State, City } from "country-state-city";

export default function ItineraryDetails({
  tripData,
  updateTripData,
  addArrayField,
}) {
  // removed unused newStop and unused imports
  const [collapsedDays, setCollapsedDays] = useState({});
  const [extraDates, setExtraDates] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [newMeal, setNewMeal] = useState({
    day: "",
    type: "breakfast",
    details: "",
  });
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newTag, setNewTag] = useState("");

  // Location data state
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Initialize countries on component mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  const safeCopy = (arr) => (Array.isArray(arr) ? arr.slice() : []);

  // Returns an existing index if found, otherwise ensures a day entry exists at an index
  const getOrCreateDayIndex = (updated, existingDayIndex, dayIndex, date) => {
    if (existingDayIndex >= 0) return existingDayIndex;

    if (dayIndex < updated.length) {
      updated[dayIndex] = {
        day: dayIndex + 1,
        date: date || "",
        title: updated[dayIndex]?.title || "",
        overview: updated[dayIndex]?.overview || "",
        stops: updated[dayIndex]?.stops || [],
        travelMode: updated[dayIndex]?.travelMode || "", // Added travel mode
        completed: !!updated[dayIndex]?.completed,
      };
      return dayIndex;
    }

    const newDay = {
      day: updated.length + 1,
      date: date || "",
      title: "",
      overview: "",
      stops: [],
      travelMode: "", // Added travel mode
      completed: false,
    };
    updated.push(newDay);
    return updated.length - 1;
  };

  const safeUpdateStructured = (updater) => {
    const updated = safeCopy(tripData.structuredItinerary);
    updater(updated);
    updateTripData("structuredItinerary", updated);
  };

  const ensureStopArray = (dayObj) => {
    if (!Array.isArray(dayObj.stops)) dayObj.stops = [];
  };

  // Format place for display
  const formatPlace = (place) => {
    if (!place) return "";
    if (typeof place === "string") return place;
    return [place.city, place.state, place.country].filter(Boolean).join(", ");
  };

  // Make sure a stop object exists at stopIndex
  const ensureStopExists = (dayObj, stopIndex) => {
    ensureStopArray(dayObj);
    if (!dayObj.stops[stopIndex]) {
      // create default stop if missing
      dayObj.stops[stopIndex] = {
        name: "",
        time: "",
        place: {
          country: "",
          state: "",
          city: "",
          full: "",
        },
        activityType: "sightseeing",
        description: "",
        image: "",
        isMicroTrip: false,
        microTripPrice: 0,
      };
    } else {
      // Convert string place to object if needed
      if (typeof dayObj.stops[stopIndex].place === "string") {
        dayObj.stops[stopIndex].place = {
          country: "",
          state: "",
          city: "",
          full: dayObj.stops[stopIndex].place,
        };
      }
      // Ensure place object exists
      if (!dayObj.stops[stopIndex].place) {
        dayObj.stops[stopIndex].place = {
          country: "",
          state: "",
          city: "",
          full: "",
        };
      }
    }
  };

  const removeStructuredDayIfExists = (existingDayIndex) => {
    if (existingDayIndex >= 0) {
      const updated = safeCopy(tripData.structuredItinerary);
      updated.splice(existingDayIndex, 1);
      updated.forEach((d, i) => (d.day = i + 1));
      updateTripData("structuredItinerary", updated);
    }
  };

  // Collapse/expand keyed by date (safer than using index)
  const expandDay = (date) => {
    const completed = tripData.structuredItinerary?.find(
      (d) => d.date === date
    )?.completed;
    if (completed) return;
    setCollapsedDays((prev) => ({ ...prev, [date]: false }));
  };

  const collapseDay = (date) => {
    setCollapsedDays((prev) => ({ ...prev, [date]: true }));
  };

  const handleAddFaq = () => {
    if (newFaq.question && newFaq.answer) {
      addArrayField("faqs", newFaq);
      setNewFaq({ question: "", answer: "" });
    }
  };

  const handleAddMeal = () => {
    if (newMeal.day && newMeal.details) {
      addArrayField("mealPlans", newMeal);
      setNewMeal({ day: "", type: "breakfast", details: "" });
    } else {
      alert("Please choose a date and enter meal details");
    }
  };

  const handleAddInclusion = () => {
    if (newInclusion) {
      addArrayField("inclusions", newInclusion);
      setNewInclusion("");
    }
  };

  const handleAddExclusion = () => {
    if (newExclusion) {
      addArrayField("exclusions", newExclusion);
      setNewExclusion("");
    }
  };

  const handleAddTag = () => {
    if (newTag && newTag.trim() !== "") {
      const currentTags = tripData.tripTags || [];
      const trimmedTag = newTag.trim();
      
      if (!currentTags.includes(trimmedTag)) {
        updateTripData("tripTags", [...currentTags, trimmedTag]);
        setNewTag("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = tripData.tripTags || [];
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    updateTripData("tripTags", updatedTags);
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "";
    const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
    if (!isoMatch) return dateStr;
    try {
      const d = new Date(dateStr + "T00:00:00");
      return ` ${d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })}`;
    } catch {
      return dateStr;
    }
  };

  const toggleDayCompleted = (date) => {
    const updated = safeCopy(tripData.structuredItinerary);
    const existingDayIndex = updated.findIndex((d) => d.date === date);
    if (existingDayIndex < 0) return;
    updated[existingDayIndex].completed = !updated[existingDayIndex].completed;
    updateTripData("structuredItinerary", updated);

    if (updated[existingDayIndex].completed) {
      setCollapsedDays((prev) => ({ ...prev, [date]: true }));
    }
  };

  const addExtraDate = () => {
    const newDate = prompt("Enter an extra date (YYYY-MM-DD format):");

    if (newDate && /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
      const allCurrentDates = [
        ...(tripData.tripDates || []),
        ...extraDates,
        // also include dates already present in structuredItinerary (prevent duplicate)
        ...(tripData.structuredItinerary || [])
          .map((d) => d.date)
          .filter(Boolean),
      ];

      if (allCurrentDates.includes(newDate)) {
        alert("This date already exists in your plan");
        return;
      }

      setExtraDates((prev) => [...prev, newDate]);

      if (tripData.itineraryType === "structured") {
        const newDayNumber = (tripData.structuredItinerary?.length || 0) + 1;
        const newDay = {
          day: newDayNumber,
          date: newDate,
          title: "",
          overview: "",
          stops: [],
          travelMode: "", // Added travel mode
          completed: false,
        };
        addArrayField("structuredItinerary", newDay);
      }
    } else {
      alert("Please enter a valid date in YYYY-MM-DD format");
    }
  };

  const allDates = (() => {
    const structuredDates = (tripData.structuredItinerary || [])
      .map((d) => d.date)
      .filter(Boolean);

    const source = [
      ...(tripData.tripDates || []),
      ...(tripData.extraDates || []), // persisted extras
      ...extraDates, // local extras (if any)
      ...structuredDates,
    ];

    return source.filter((d, i) => source.indexOf(d) === i);
  })();

  // Calculate number of nights (days - 1)
  const numberOfNights = allDates.length > 0 ? allDates.length - 1 : 0;

  // Handle country change
  const handleCountryChange = (countryCode, dayIndex, stopIndex) => {
    const country = countries.find(c => c.isoCode === countryCode);
    if (country) {
      const states = State.getStatesOfCountry(country.isoCode);
      setStates(states);
      setCities([]);
      
      safeUpdateStructured((updated) => {
        const finalIndex = getOrCreateDayIndex(
          updated,
          updated.findIndex(d => d.date === allDates[dayIndex]),
          dayIndex,
          allDates[dayIndex]
        );
        ensureStopExists(updated[finalIndex], stopIndex);
        updated[finalIndex].stops[stopIndex].place = {
          country: country.name,
          state: "",
          city: "",
          full: country.name,
        };
      });
    }
  };

  // Handle state change
  const handleStateChange = (stateCode, countryCode, dayIndex, stopIndex) => {
    const state = states.find(s => s.isoCode === stateCode);
    if (state) {
      const cities = City.getCitiesOfState(countryCode, state.isoCode);
      setCities(cities);
      
      safeUpdateStructured((updated) => {
        const finalIndex = getOrCreateDayIndex(
          updated,
          updated.findIndex(d => d.date === allDates[dayIndex]),
          dayIndex,
          allDates[dayIndex]
        );
        ensureStopExists(updated[finalIndex], stopIndex);
        const place = updated[finalIndex].stops[stopIndex].place;
        updated[finalIndex].stops[stopIndex].place = {
          ...place,
          state: state.name,
          full: `${state.name}, ${place.country}`,
        };
      });
    }
  };

  // Handle city change
  const handleCityChange = (cityName, dayIndex, stopIndex) => {
    safeUpdateStructured((updated) => {
      const finalIndex = getOrCreateDayIndex(
        updated,
        updated.findIndex(d => d.date === allDates[dayIndex]),
        dayIndex,
        allDates[dayIndex]
      );
      ensureStopExists(updated[finalIndex], stopIndex);
      const place = updated[finalIndex].stops[stopIndex].place;
      updated[finalIndex].stops[stopIndex].place = {
        ...place,
        city: cityName,
        full: `${cityName}, ${place.state}, ${place.country}`,
      };
    });
  };

  // Suggested tags for quick selection
  const suggestedTags = [
    "adventure",
    "cultural",
    "beach",
    "wildlife",
    "trekking",
    "roadtrip",
    "spiritual",
    "family",
    "luxury"
  ];

  const handleSuggestedTagClick = (tag) => {
    const currentTags = tripData.tripTags || [];
    if (!currentTags.includes(tag)) {
      updateTripData("tripTags", [...currentTags, tag]);
    }
  };

  // Get travel mode icon
  const getTravelModeIcon = (mode) => {
    switch (mode) {
      case "bus": return "🚌";
      case "car": return "🚗";
      case "train": return "🚆";
      case "flight": return "✈️";
      case "walking": return "🚶";
      case "bike": return "🚲";
      case "boat": return "🚤";
      default: return "🚌";
    }
  };

  // Travel Transition Component
  const TravelTransition = ({ fromDay, toDay, mode }) => {
    if (!mode) return null;
    
    return (
      <div className="flex flex-col items-center my-6">
        <div className="flex items-center justify-center w-full">
          <div className="h-px bg-gray-300 flex-grow"></div>
          <div className="mx-4 flex items-center bg-blue-100 rounded-full px-4 py-2 shadow-sm">
            <span className="text-2xl mr-2">{getTravelModeIcon(mode)}</span>
            <div className="text-center">
              <div className="text-xs text-gray-600">Day {fromDay} → Day {toDay}</div>
              <div className="text-sm font-medium text-blue-800">
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-300 flex-grow"></div>
        </div>
      </div>
    );
  };

  // Update accommodation day 1 price
  const updateAccommodationDay1Price = (type, price) => {
    updateTripData("accommodation", {
      ...(tripData.accommodation || {}),
      [`${type}Price`]: Number(price)
    });
  };

  // Update accommodation day 1 name
  const updateAccommodationDay1Name = (type, name) => {
    updateTripData("accommodation", {
      ...(tripData.accommodation || {}),
      [`${type}Name`]: name
    });
  };

  // Add additional accommodation day
  const addAccommodationDay = (type) => {
    const currentDays = tripData.accommodation?.[`${type}Days`] || [];
    const nextDayNumber = currentDays.length + 2; // Day 1 is already there, so next is Day 2
    
    if (nextDayNumber > allDates.length) {
      alert(`You cannot add more than ${allDates.length} days.`);
      return;
    }
    
    const newDay = {
      day: nextDayNumber,
      price: 0,
      name: `Day ${nextDayNumber}`
    };
    
    updateTripData("accommodation", {
      ...(tripData.accommodation || {}),
      [`${type}Days`]: [...currentDays, newDay]
    });
  };

  // Update additional accommodation day
  const updateAccommodationDay = (type, index, field, value) => {
    const currentDays = [...(tripData.accommodation?.[`${type}Days`] || [])];
    if (currentDays[index]) {
      currentDays[index] = {
        ...currentDays[index],
        [field]: field === 'price' ? Number(value) : value
      };
      
      updateTripData("accommodation", {
        ...(tripData.accommodation || {}),
        [`${type}Days`]: currentDays
      });
    }
  };

  // Remove additional accommodation day
  const removeAccommodationDay = (type, index) => {
    const currentDays = [...(tripData.accommodation?.[`${type}Days`] || [])];
    currentDays.splice(index, 1);
    
    updateTripData("accommodation", {
      ...(tripData.accommodation || {}),
      [`${type}Days`]: currentDays
    });
  };

  // Calculate total accommodation cost
  const calculateAccommodationTotal = (type) => {
    const day1Price = tripData.accommodation?.[`${type}Price`] || 0;
    const additionalDays = tripData.accommodation?.[`${type}Days`] || [];
    const additionalDaysTotal = additionalDays.reduce((sum, day) => sum + (day.price || 0), 0);
    return day1Price + additionalDaysTotal;
  };

  // Get accommodation name for display
  const getAccommodationName = (type) => {
    const day1Name = tripData.accommodation?.[`${type}Name`] || "";
    return day1Name;
  };

  // Update accommodation name dynamically
  const updateAccommodationName = (type, name) => {
    updateTripData("accommodation", {
      ...(tripData.accommodation || {}),
      [`${type}Name`]: name
    });
  };

  return (
    <div className="px-2 py-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Itinerary & Details</h2>
      <p className="text-gray-600 mb-8">Plan your adventure day by day</p>

      <div className="space-y-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Detailed Itinerary *
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={() => updateTripData("itineraryType", "freeText")}
              className={`px-4 py-2 rounded-md ${
                tripData.itineraryType === "freeText"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Free Text
            </button>
            <button
              type="button"
              onClick={() => updateTripData("itineraryType", "structured")}
              className={`px-4 py-2 rounded-md ${
                tripData.itineraryType === "structured"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Structured
            </button>
          </div>

          {tripData.itineraryType === "freeText" ? (
            <textarea
              value={tripData.itineraryText || ""}
              onChange={(e) => updateTripData("itineraryText", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={8}
              placeholder="Paste your complete itinerary here with day-by-day breakdown"
              required
            />
          ) : (
            <div className="space-y-6">
              {allDates.map((date, dayIndex) => {
                const existingDayIndex =
                  tripData.structuredItinerary?.findIndex(
                    (day) => day.date === date
                  ) ?? -1;

                const dayData =
                  existingDayIndex >= 0
                    ? tripData.structuredItinerary[existingDayIndex]
                    : {
                        day: dayIndex + 1,
                        date: date,
                        title: "",
                        overview: "",
                        stops: [],
                        travelMode: "", // Added travel mode
                        completed: false,
                      };

                const actualKey = date || `day-${dayIndex}`;
                const isCollapsed = collapsedDays[actualKey] ?? true;

                // Get the previous day's data for travel transition
                const prevDayData = dayIndex > 0 
                  ? tripData.structuredItinerary?.find(
                      (day) => day.date === allDates[dayIndex - 1]
                    )
                  : null;

                return (
                  <React.Fragment key={actualKey}>
                    {/* Travel Transition Component - shown between days */}
                    {dayIndex > 0 && (
                      <TravelTransition 
                        fromDay={dayIndex} 
                        toDay={dayIndex + 1} 
                        mode={dayData.travelMode} 
                      />
                    )}
                    
                    {/* Day Card */}
                    <div
                      className={`border rounded-xl overflow-hidden shadow-sm transition-all duration-200 ${
                        dayData.completed
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      {/* Day Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                            {dayData.day}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">
                              {dayData.title || "Untitled Day"}
                              <span className="text-gray-500 font-normal ml-2">
                                {formatDateLabel(date)}
                              </span>
                            </h3>
                            {dayData.completed && (
                              <span className="inline-flex items-center mt-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Completed
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => toggleDayCompleted(date)}
                            className={`px-3 py-1 text-xs rounded-full flex items-center ${
                              dayData.completed
                                ? "bg-gray-200 text-gray-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {dayData.completed ? "Mark Incomplete" : "Mark Complete"}
                          </button>

                          {!dayData.completed && (
                            <button
                              type="button"
                              onClick={() =>
                                isCollapsed ? expandDay(date) : collapseDay(date)
                              }
                              className="px-3 py-1 text-xs rounded-full flex items-center bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                            >
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              {isCollapsed ? "EDIT" : "SAVE"}
                            </button>
                          )}

                          {dayIndex >= (tripData.tripDates?.length || 0) && (
                            <button
                              type="button"
                              onClick={() => {
                                const offset = tripData.tripDates?.length || 0;
                                const removeIndex = dayIndex - offset;
                                const updatedExtraDates = [...extraDates];
                                updatedExtraDates.splice(removeIndex, 1);
                                setExtraDates(updatedExtraDates);

                                if (existingDayIndex >= 0) {
                                  removeStructuredDayIfExists(existingDayIndex);
                                }
                              }}
                              className="px-3 py-1 text-xs rounded-full flex items-center bg-red-100 text-red-700 hover:bg-red-200 transition"
                            >
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Remove
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Day Content */}
                      <div className="p-4">
                        {isCollapsed ? (
                          /* Preview Mode */
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Overview</h4>
                              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {dayData.overview || "No overview provided"}
                              </p>
                            </div>
                            
                            {/* Travel Mode Display */}
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Travel Mode</h4>
                              {dayData.travelMode ? (
                                <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                                  <span className="text-2xl mr-3">{getTravelModeIcon(dayData.travelMode)}</span>
                                  <span className="font-medium text-blue-700">
                                    {dayData.travelMode.charAt(0).toUpperCase() + dayData.travelMode.slice(1)}
                                  </span>
                                </div>
                              ) : (
                                <div className="text-gray-500 bg-gray-50 p-3 rounded-lg italic">
                                  No travel mode specified
                                </div>
                              )}
                            </div>

                            {/* Stops */}
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Stops</h4>
                              {dayData.stops?.length > 0 ? (
                                <div className="space-y-3">
                                  {dayData.stops.map((stop, stopIndex) => (
                                    <div key={stopIndex} className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                                      <div className="flex justify-between items-start">
                                        <div className="flex items-center">
                                          <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                                            {stopIndex + 1}
                                          </div>
                                          <div>
                                            <div className="font-medium">{stop.name || "Unnamed Stop"}</div>
                                            <div className="text-sm text-gray-500 flex items-center">
                                              <span className="mr-2">{stop.time || "Time TBA"}</span>
                                              {stop.place && (
                                                <span>• {formatPlace(stop.place)}</span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
                                          {stop.activityType || "activity"}
                                        </span>
                                      </div>
                                      {stop.description && (
                                        <p className="mt-2 text-gray-600 text-sm">{stop.description}</p>
                                      )}
                                      {stop.image && (
                                        <img
                                          src={stop.image}
                                          alt={stop.name}
                                          className="w-24 h-24 object-cover rounded-md mt-2"
                                        />
                                      )}
                                      {stop.isMicroTrip && (
                                        <div className="mt-2 inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                          </svg>
                                          Micro Trip: ₹{stop.microTripPrice}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-gray-500 bg-gray-50 p-3 rounded-lg italic">
                                  No stops added for this day yet.
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* Edit Mode */
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                  Date
                                </label>
                                <input
                                  type="text"
                                  value={date}
                                  readOnly
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                  Title/Theme
                                </label>
                                <input
                                  type="text"
                                  value={dayData.title || ""}
                                  onChange={(e) =>
                                    safeUpdateStructured((updated) => {
                                      const finalIndex = getOrCreateDayIndex(
                                        updated,
                                        existingDayIndex,
                                        dayIndex,
                                        date
                                      );
                                      updated[finalIndex].title = e.target.value;
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Day theme/title"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                  Overview
                                </label>
                                <textarea
                                  value={dayData.overview || ""}
                                  onChange={(e) =>
                                    safeUpdateStructured((updated) => {
                                      const finalIndex = getOrCreateDayIndex(
                                        updated,
                                        existingDayIndex,
                                        dayIndex,
                                        date
                                      );
                                      updated[finalIndex].overview = e.target.value;
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  rows={2}
                                  placeholder="Brief day overview"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                  Travel Mode
                                </label>
                                <select
                                  value={dayData.travelMode || ""}
                                  onChange={(e) =>
                                    safeUpdateStructured((updated) => {
                                      const finalIndex = getOrCreateDayIndex(
                                        updated,
                                        existingDayIndex,
                                        dayIndex,
                                        date
                                      );
                                      updated[finalIndex].travelMode = e.target.value;
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select travel mode</option>
                                  <option value="bus">🚌 Bus</option>
                                  <option value="car">🚗 Car</option>
                                  <option value="train">🚆 Train</option>
                                  <option value="flight">✈️ Flight</option>
                                  <option value="walking">🚶 Walking</option>
                                  <option value="bike">🚲 Bike</option>
                                  <option value="boat">🚤 Boat</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium text-gray-700">Stops</h4>
                                <button
                                  type="button"
                                  onClick={() =>
                                    safeUpdateStructured((updated) => {
                                      const finalIndex = getOrCreateDayIndex(
                                        updated,
                                        existingDayIndex,
                                        dayIndex,
                                        date
                                      );
                                      ensureStopArray(updated[finalIndex]);
                                      updated[finalIndex].stops.push({
                                        name: "",
                                        time: "",
                                        place: {
                                          country: "",
                                          state: "",
                                          city: "",
                                          full: "",
                                        },
                                        activityType: "sightseeing",
                                        description: "",
                                        image: "",
                                        isMicroTrip: false,
                                        microTripPrice: 0,
                                      });
                                    })
                                  }
                                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                  </svg>
                                  Add Stop
                                </button>
                              </div>

                              <div className="space-y-4">
                                {dayData.stops?.map((stop, stopIndex) => (
                                  <div
                                    key={`edit-stop-${stopIndex}`}
                                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                                  >
                                    <div className="flex justify-between items-start mb-3">
                                      <h5 className="font-medium text-gray-700">Stop #{stopIndex + 1}</h5>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          safeUpdateStructured((updated) => {
                                            const finalIndex = getOrCreateDayIndex(
                                              updated,
                                              existingDayIndex,
                                              dayIndex,
                                              date
                                            );
                                            ensureStopArray(updated[finalIndex]);
                                            if (
                                              updated[finalIndex].stops &&
                                              updated[finalIndex].stops.length >
                                                stopIndex
                                            ) {
                                              updated[finalIndex].stops.splice(
                                                stopIndex,
                                                1
                                              );
                                            }
                                          })
                                        }
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-gray-600 text-sm mb-1">
                                          Stop Name
                                        </label>
                                        <input
                                          type="text"
                                          value={stop.name || ""}
                                          onChange={(e) =>
                                            safeUpdateStructured((updated) => {
                                              const finalIndex = getOrCreateDayIndex(
                                                updated,
                                                existingDayIndex,
                                                dayIndex,
                                                date
                                              );
                                              ensureStopExists(
                                                updated[finalIndex],
                                                stopIndex
                                              );
                                              updated[finalIndex].stops[
                                                stopIndex
                                              ].name = e.target.value;
                                            })
                                          }
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="Stop name"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-gray-600 text-sm mb-1">
                                          Time
                                        </label>
                                        <input
                                          type="time"
                                          value={stop.time || ""}
                                          onChange={(e) =>
                                            safeUpdateStructured((updated) => {
                                              const finalIndex = getOrCreateDayIndex(
                                                updated,
                                                existingDayIndex,
                                                dayIndex,
                                                date
                                              );
                                              ensureStopExists(
                                                updated[finalIndex],
                                                stopIndex
                                              );
                                              updated[finalIndex].stops[
                                                stopIndex
                                              ].time = e.target.value;
                                            })
                                          }
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>
                                      
                                      {/* Location Selector */}
                                      <div className="md:col-span-2">
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
                                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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

                                      <div>
                                        <label className="block text-gray-600 text-sm mb-1">
                                          Activity Type
                                        </label>
                                        <select
                                          value={stop.activityType || "sightseeing"}
                                          onChange={(e) =>
                                            safeUpdateStructured((updated) => {
                                              const finalIndex = getOrCreateDayIndex(
                                                updated,
                                                existingDayIndex,
                                                dayIndex,
                                                date
                                              );
                                              ensureStopExists(
                                                updated[finalIndex],
                                                stopIndex
                                              );
                                              updated[finalIndex].stops[
                                                stopIndex
                                              ].activityType = e.target.value;
                                            })
                                          }
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                          <option value="travel">Travel</option>
                                          <option value="sightseeing">
                                            Sightseeing
                                          </option>
                                          <option value="meal">Meal</option>
                                          <option value="activity">Activity</option>
                                          <option value="free-time">Free Time</option>
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block text-gray-600 text-sm mb-1">
                                          Description
                                        </label>
                                        <input
                                          type="text"
                                          value={stop.description || ""}
                                          onChange={(e) =>
                                            safeUpdateStructured((updated) => {
                                              const finalIndex = getOrCreateDayIndex(
                                                updated,
                                                existingDayIndex,
                                                dayIndex,
                                                date
                                              );
                                              ensureStopExists(
                                                updated[finalIndex],
                                                stopIndex
                                              );
                                              updated[finalIndex].stops[
                                                stopIndex
                                              ].description = e.target.value;
                                            })
                                          }
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="Description"
                                        />
                                      </div>

                                      <div className="flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={stop.isMicroTrip || false}
                                          onChange={(e) =>
                                            safeUpdateStructured((updated) => {
                                              const finalIndex = getOrCreateDayIndex(
                                                updated,
                                                existingDayIndex,
                                                dayIndex,
                                                date
                                              );
                                              ensureStopExists(
                                                updated[finalIndex],
                                                stopIndex
                                              );
                                              updated[finalIndex].stops[
                                                stopIndex
                                              ].isMicroTrip = e.target.checked;
                                              if (!e.target.checked) {
                                                updated[finalIndex].stops[
                                                  stopIndex
                                                ].microTripPrice = 0;
                                              }
                                            })
                                          }
                                          className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <label className="text-gray-700 text-sm">
                                          Micro Trip
                                        </label>
                                      </div>

                                      {stop.isMicroTrip && (
                                        <div>
                                          <label className="block text-gray-600 text-sm mb-1">
                                            Micro Trip Price (₹)
                                          </label>
                                          <input
                                            type="number"
                                            value={stop.microTripPrice || 0}
                                            onChange={(e) =>
                                              safeUpdateStructured((updated) => {
                                                const finalIndex =
                                                  getOrCreateDayIndex(
                                                    updated,
                                                    existingDayIndex,
                                                    dayIndex,
                                                    date
                                                  );
                                                ensureStopExists(
                                                  updated[finalIndex],
                                                  stopIndex
                                                );
                                                updated[finalIndex].stops[
                                                  stopIndex
                                                ].microTripPrice =
                                                  parseFloat(e.target.value) || 0;
                                              })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter price"
                                          />
                                        </div>
                                      )}

                                      <div className="md:col-span-2">
                                        <label className="block text-gray-600 text-sm mb-1">
                                          Image
                                        </label>
                                        <div className="flex items-center">
                                          {stop.image ? (
                                            <div className="relative">
                                              <img
                                                src={stop.image}
                                                alt="Stop preview"
                                                className="w-16 h-16 object-cover rounded-md mr-3"
                                              />
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  safeUpdateStructured((updated) => {
                                                    const finalIndex =
                                                      getOrCreateDayIndex(
                                                        updated,
                                                        existingDayIndex,
                                                        dayIndex,
                                                        date
                                                      );
                                                    ensureStopExists(
                                                      updated[finalIndex],
                                                      stopIndex
                                                    );
                                                    updated[finalIndex].stops[
                                                      stopIndex
                                                    ].image = "";
                                                  })
                                                }
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                              >
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center mr-3">
                                              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                              </svg>
                                            </div>
                                          )}
                                          <label className="cursor-pointer">
                                            <input
                                              type="file"
                                              accept="image/*"
                                              onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                if (!file.type.match("image.*")) {
                                                  alert("Please upload an image file");
                                                  return;
                                                }
                                                if (file.size > 5 * 1024 * 1024) {
                                                  alert(
                                                    "Image size should be less than 5MB"
                                                  );
                                                  return;
                                                }

                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                  safeUpdateStructured((updated) => {
                                                    const finalIndex =
                                                      getOrCreateDayIndex(
                                                        updated,
                                                        existingDayIndex,
                                                        dayIndex,
                                                        date
                                                      );
                                                    ensureStopExists(
                                                      updated[finalIndex],
                                                      stopIndex
                                                    );
                                                    updated[finalIndex].stops[
                                                      stopIndex
                                                    ].image = event.target.result;
                                                  });
                                                };
                                                reader.readAsDataURL(file);
                                              }}
                                              className="hidden"
                                            />
                                            <span className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition">
                                              Upload Image
                                            </span>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-600">
                  <span className="font-medium">{allDates.length}</span> day{allDates.length !== 1 ? "s" : ""} in Your Plan
                  {allDates.length > 0 && (
                    <span className="ml-2">({numberOfNights} night{numberOfNights !== 1 ? 's' : ''})</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={addExtraDate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Extra Date
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center mb-4">
            <label className="block text-gray-700 font-medium mr-4">
              Accommodation Options *
            </label>
            <div className="text-sm text-gray-500 ml-auto">
              {allDates.length > 0 ? (
                <span>Trip Duration: {allDates.length} days ({numberOfNights} nights)</span>
              ) : (
                <span>Add dates to calculate accommodation costs</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Shared Rooms */}
            <div className="p-4 border border-gray-200 rounded-md flex flex-col h-full">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">👥</span>
                <span className="font-medium">Shared Rooms</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Multiple beds per room - great for making friends
              </p>

              <div className="mb-4 flex-grow">
                {tripData.accommodation?.sharedImage ? (
                  <div className="relative">
                    <img
                      src={tripData.accommodation.sharedImage}
                      alt="Shared room preview"
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateTripData("accommodation", {
                          ...(tripData.accommodation || {}),
                          sharedImage: null,
                        })
                      }
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center h-40 flex flex-col items-center justify-center">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!file.type.match("image.*")) {
                            alert("Please upload an image file");
                            return;
                          }
                          if (file.size > 5 * 1024 * 1024) {
                            alert("Image size should be less than 5MB");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            updateTripData("accommodation", {
                              ...(tripData.accommodation || {}),
                              sharedImage: event.target.result,
                            });
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-8 h-8 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          Upload shared room image
                        </span>
                        <span className="text-xs text-gray-500">
                          Recommended: 800x600px
                        </span>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Dynamic Accommodation Name */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Accommodation Name
                </label>
                <input
                  type="text"
                  value={getAccommodationName("shared")}
                  onChange={(e) => updateAccommodationName("shared", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter accommodation name"
                />
              </div>

              {/* Day 1 Price */}
              <div className="mb-4">
                <h5 className="font-medium text-gray-700 mb-2">Day 1</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={tripData.accommodation?.sharedPrice || ""}
                      onChange={(e) => updateAccommodationDay1Price("shared", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Days */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  {/* <h5 className="font-medium text-gray-700">Additional Days</h5> */}
                  {/* <button
                    type="button"
                    onClick={() => addAccommodationDay("shared")}
                    className="px-2 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                  >
                    Add Day
                  </button> */}
                </div>
                {(tripData.accommodation?.sharedDays || []).map((day, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-2">
                    <div className="sm:col-span-3">
                      <label className="block text-gray-600 text-sm mb-1">Day</label>
                      <div className="px-2 py-1 border border-gray-300 rounded-md bg-gray-100">
                        {day.day}
                      </div>
                    </div>
                    <div className="sm:col-span-5">
                      <label className="block text-gray-600 text-sm mb-1">Accommodation Name</label>
                      <input
                        type="text"
                        value={day.name || ""}
                        onChange={(e) => updateAccommodationDay("shared", index, "name", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        placeholder="Accommodation name"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-gray-600 text-sm mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={day.price || ""}
                        onChange={(e) => updateAccommodationDay("shared", index, "price", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        min="0"
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-end">
                      <button
                        type="button"
                        onClick={() => removeAccommodationDay("shared", index)}
                        className="w-full px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <div className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-2 rounded-md">
                  Total: ₹{calculateAccommodationTotal("shared")}
                </div>
              </div>
            </div>

            {/* Private Rooms */}
            <div className="p-4 border border-gray-200 rounded-md flex flex-col h-full">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">🏠</span>
                <span className="font-medium">Private Rooms</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Individual rooms for privacy and comfort
              </p>

              <div className="mb-4 flex-grow">
                {tripData.accommodation?.privateImage ? (
                  <div className="relative">
                    <img
                      src={tripData.accommodation.privateImage}
                      alt="Private room preview"
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateTripData("accommodation", {
                          ...(tripData.accommodation || {}),
                          privateImage: null,
                        })
                      }
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center h-40 flex flex-col items-center justify-center">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!file.type.match("image.*")) {
                            alert("Please upload an image file");
                            return;
                          }
                          if (file.size > 5 * 1024 * 1024) {
                            alert("Image size should be less than 5MB");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            updateTripData("accommodation", {
                              ...(tripData.accommodation || {}),
                              privateImage: event.target.result,
                            });
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-8 h-8 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          Upload private room image
                        </span>
                        <span className="text-xs text-gray-500">
                          Recommended: 800x600px
                        </span>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Dynamic Accommodation Name */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Accommodation Name
                </label>
                <input
                  type="text"
                  value={getAccommodationName("private")}
                  onChange={(e) => updateAccommodationName("private", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter accommodation name"
                />
              </div>

              {/* Day 1 Price */}
              <div className="mb-4">
                <h5 className="font-medium text-gray-700 mb-2">Day 1</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={tripData.accommodation?.privatePrice || ""}
                      onChange={(e) => updateAccommodationDay1Price("private", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Days */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  {/* <h5 className="font-medium text-gray-700">Additional Days</h5> */}
                  {/* <button
                    type="button"
                    onClick={() => addAccommodationDay("private")}
                    className="px-2 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                  >
                    Add Day
                  </button> */}
                </div>
                {(tripData.accommodation?.privateDays || []).map((day, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-2">
                    <div className="sm:col-span-3">
                      <label className="block text-gray-600 text-sm mb-1">Day</label>
                      <div className="px-2 py-1 border border-gray-300 rounded-md bg-gray-100">
                        {day.day}
                      </div>
                    </div>
                    <div className="sm:col-span-5">
                      <label className="block text-gray-600 text-sm mb-1">Name</label>
                      <input
                        type="text"
                        value={day.name || ""}
                        onChange={(e) => updateAccommodationDay("private", index, "name", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        placeholder="Accommodation name"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-gray-600 text-sm mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={day.price || ""}
                        onChange={(e) => updateAccommodationDay("private", index, "price", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        min="0"
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-end">
                      <button
                        type="button"
                        onClick={() => removeAccommodationDay("private", index)}
                        className="w-full px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <div className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-2 rounded-md">
                  Total: ₹{calculateAccommodationTotal("private")}
                </div>
              </div>
            </div>

            {/* Camping */}
            <div className="p-4 border border-gray-200 rounded-md flex flex-col h-full">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">⛺</span>
                <span className="font-medium">Camping</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Traditional camping in tents - connect with nature
              </p>

              <div className="mb-4 flex-grow">
                {tripData.accommodation?.campingImage ? (
                  <div className="relative">
                    <img
                      src={tripData.accommodation.campingImage}
                      alt="Camping preview"
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateTripData("accommodation", {
                          ...(tripData.accommodation || {}),
                          campingImage: null,
                        })
                      }
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center h-40 flex flex-col items-center justify-center">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!file.type.match("image.*")) {
                            alert("Please upload an image file");
                            return;
                          }
                          if (file.size > 5 * 1024 * 1024) {
                            alert("Image size should be less than 5MB");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            updateTripData("accommodation", {
                              ...(tripData.accommodation || {}),
                              campingImage: event.target.result,
                            });
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-8 h-8 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          Upload camping image
                        </span>
                        <span className="text-xs text-gray-500">
                          Recommended: 800x600px
                        </span>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Dynamic Accommodation Name */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Accommodation Name
                </label>
                <input
                  type="text"
                  value={getAccommodationName("camping")}
                  onChange={(e) => updateAccommodationName("camping", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter accommodation name"
                />
              </div>

              {/* Day 1 Price */}
              <div className="mb-4">
                <h5 className="font-medium text-gray-700 mb-2">Day 1</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={tripData.accommodation?.campingPrice || ""}
                      onChange={(e) => updateAccommodationDay1Price("camping", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Days */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  {/* <h5 className="font-medium text-gray-700">Additional Days</h5> */}
                  {/* <button
                    type="button"
                    onClick={() => addAccommodationDay("camping")}
                    className="px-2 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                  >
                    Add Day
                  </button> */}
                </div>
                {(tripData.accommodation?.campingDays || []).map((day, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-2">
                    <div className="sm:col-span-3">
                      <label className="block text-gray-600 text-sm mb-1">Day</label>
                      <div className="px-2 py-1 border border-gray-300 rounded-md bg-gray-100">
                        {day.day}
                      </div>
                    </div>
                    <div className="sm:col-span-5">
                      <label className="block text-gray-600 text-sm mb-1">Name</label>
                      <input
                        type="text"
                        value={day.name || ""}
                        onChange={(e) => updateAccommodationDay("camping", index, "name", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        placeholder="Accommodation name"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-gray-600 text-sm mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={day.price || ""}
                        onChange={(e) => updateAccommodationDay("camping", index, "price", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        min="0"
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-end">
                      <button
                        type="button"
                        onClick={() => removeAccommodationDay("camping", index)}
                        className="w-full px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <div className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-2 rounded-md">
                  Total: ₹{calculateAccommodationTotal("camping")}
                </div>
              </div>
            </div>

            {/* Glamping */}
            <div className="p-4 border border-gray-200 rounded-md flex flex-col h-full">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">🏕️</span>
                <span className="font-medium">Glamping</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Luxury camping with premium amenities - comfort in nature
              </p>

              <div className="mb-4 flex-grow">
                {tripData.accommodation?.glampingImage ? (
                  <div className="relative">
                    <img
                      src={tripData.accommodation.glampingImage}
                      alt="Glamping preview"
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateTripData("accommodation", {
                          ...(tripData.accommodation || {}),
                          glampingImage: null,
                        })
                      }
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center h-40 flex flex-col items-center justify-center">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!file.type.match("image.*")) {
                            alert("Please upload an image file");
                            return;
                          }
                          if (file.size > 5 * 1024 * 1024) {
                            alert("Image size should be less than 5MB");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            updateTripData("accommodation", {
                              ...(tripData.accommodation || {}),
                              glampingImage: event.target.result,
                            });
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-8 h-8 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          Upload glamping image
                        </span>
                        <span className="text-xs text-gray-500">
                          Recommended: 800x600px
                        </span>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Dynamic Accommodation Name */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Accommodation Name
                </label>
                <input
                  type="text"
                  value={getAccommodationName("glamping")}
                  onChange={(e) => updateAccommodationName("glamping", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter accommodation name"
                />
              </div>

              {/* Day 1 Price */}
              <div className="mb-4">
                <h5 className="font-medium text-gray-700 mb-2">Day 1</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={tripData.accommodation?.glampingPrice || ""}
                      onChange={(e) => updateAccommodationDay1Price("glamping", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Days */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  {/* <h5 className="font-medium text-gray-700">Additional Days</h5> */}
                  {/* <button
                    type="button"
                    onClick={() => addAccommodationDay("glamping")}
                    className="px-2 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                  >
                    Add Day
                  </button> */}
                </div>
                {(tripData.accommodation?.glampingDays || []).map((day, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-2">
                    <div className="sm:col-span-3">
                      <label className="block text-gray-600 text-sm mb-1">Day</label>
                      <div className="px-2 py-1 border border-gray-300 rounded-md bg-gray-100">
                        {day.day}
                      </div>
                    </div>
                    <div className="sm:col-span-5">
                      <label className="block text-gray-600 text-sm mb-1">Name</label>
                      <input
                        type="text"
                        value={day.name || ""}
                        onChange={(e) => updateAccommodationDay("glamping", index, "name", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        placeholder="Accommodation name"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-gray-600 text-sm mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={day.price || ""}
                        onChange={(e) => updateAccommodationDay("glamping", index, "price", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        min="0"
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-end">
                      <button
                        type="button"
                        onClick={() => removeAccommodationDay("glamping", index)}
                        className="w-full px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <div className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-2 rounded-md">
                  Total: ₹{calculateAccommodationTotal("glamping")}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="settleToVendor"
              checked={tripData.accommodation?.settleToVendor || false}
              onChange={(e) =>
                updateTripData("accommodation", {
                  ...(tripData.accommodation || {}),
                  settleToVendor: e.target.checked,
                })
              }
              className="mr-2"
            />
            <label htmlFor="settleToVendor" className="text-gray-700">
              Settle accommodation payment directly to vendor
            </label>
          </div>
        </div>

        {Array.isArray(allDates) && allDates.length > 0 && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Meal Plan *
            </label>
            <div className="space-y-4">
              {(tripData.mealPlans || []).map((meal, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-md"
                >
                  <div className="flex flex-col sm:flex-row justify-between">
                    <h3 className="font-medium">
                      {formatDateLabel(meal.day)} - {meal.type}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(tripData.mealPlans || [])];
                        updated.splice(index, 1);
                        updateTripData("mealPlans", updated);
                      }}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                  <p className="mt-2">{meal.details}</p>
                </div>
              ))}

              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <h3 className="font-medium mb-4">Add Meal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-600 mb-1">Dates *</label>
                    <select
                      value={newMeal.day}
                      onChange={(e) =>
                        setNewMeal({ ...newMeal, day: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Choose a date</option>
                      {allDates.map((d) => (
                        <option key={d} value={d}>
                          {formatDateLabel(d)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">
                      Meal Type *
                    </label>
                    <select
                      value={newMeal.type}
                      onChange={(e) =>
                        setNewMeal({ ...newMeal, type: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snacks">Snacks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">
                      Details *
                    </label>
                    <input
                      type="text"
                      value={newMeal.details}
                      onChange={(e) =>
                        setNewMeal({ ...newMeal, details: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      placeholder="Meal details"
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddMeal}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Add Meal
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Inclusions *
            </label>
            <div className="space-y-2 mb-4">
              {(tripData.inclusions || []).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 bg-gray-50 rounded"
                >
                  <span className="mr-2">✓</span>
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(tripData.inclusions || [])];
                      updated.splice(index, 1);
                      updateTripData("inclusions", updated);
                    }}
                    className="ml-auto text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row">
              <input
                type="text"
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add inclusion"
              />
              <button
                type="button"
                onClick={handleAddInclusion}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition mt-2 sm:mt-0"
              >
                Add
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Exclusions *
            </label>
            <div className="space-y-2 mb-4">
              {(tripData.exclusions || []).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 bg-gray-50 rounded"
                >
                  <span className="mr-2">✗</span>
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(tripData.exclusions || [])];
                      updated.splice(index, 1);
                      updateTripData("exclusions", updated);
                    }}
                    className="ml-auto text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row">
              <input
                type="text"
                value={newExclusion}
                onChange={(e) => setNewExclusion(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add exclusion"
              />
              <button
                type="button"
                onClick={handleAddExclusion}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition mt-2 sm:mt-0"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Frequently Asked Questions *
          </label>
          <div className="space-y-4">
            {(tripData.faqs || []).map((faq, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-md"
              >
                <div className="flex flex-col sm:flex-row justify-between">
                  <h3 className="font-medium">{faq.question}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(tripData.faqs || [])];
                      updated.splice(index, 1);
                      updateTripData("faqs", updated);
                    }}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </div>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              </div>
            ))}

            <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <h3 className="font-medium mb-4">Add New FAQ</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={newFaq.question}
                    onChange={(e) =>
                      setNewFaq({ ...newFaq, question: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What's a common question travelers might ask?"
                    required
                  />
                </div>
                <div>
                  <textarea
                    value={newFaq.answer}
                    onChange={(e) =>
                      setNewFaq({ ...newFaq, answer: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Provide a helpful and detailed answer..."
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Add FAQ
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Trip Tags *
          </label>
          
          {/* Current tags display */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(tripData.tripTags || []).map((tag, index) => (
              <div 
                key={index} 
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                <span className="capitalize">{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-blue-800 hover:text-blue-900"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          {/* Suggested tags */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Suggested tags:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestedTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    (tripData.tripTags || []).includes(tag)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          {/* Add new tag */}
          <div className="flex">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag();
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a custom tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ItineraryDetails.propTypes = {
  tripData: PropTypes.object.isRequired,
  updateTripData: PropTypes.func.isRequired,
  addArrayField: PropTypes.func.isRequired,
};