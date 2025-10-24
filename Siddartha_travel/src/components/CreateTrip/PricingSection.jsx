import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const DEFAULT_PRICING = {
  accommodation: 0,
  transportation: 0,
  activities: 0,
  bufferPercentage: 0,
  yourFee: 0,
  accommodationItems: [],
  transportationItems: [],
  activityItems: [],
};

export default function PricingSection({ tripData, updateTripData }) {
  const [currency, setCurrency] = useState("INR");
  const [toggleEnabled, setToggleEnabled] = useState(false);
  const [accommodationPrices, setAccommodationPrices] = useState({
    shared: { price: 0, name: "" },
    private: { price: 0, name: "" },
    camping: { price: 0, name: "" },
    glamping: { price: 0, name: "" }
  });

  // Calculate number of nights from trip dates
  const calculateNights = () => {
    const tripDates = tripData.tripDates || [];
    const structuredItinerary = tripData.structuredItinerary || [];
    
    // Combine dates from both sources and remove duplicates
    const allDates = [
      ...tripDates,
      ...structuredItinerary.map(day => day.date)
    ].filter(Boolean);
    
    // Get unique dates
    const uniqueDates = [...new Set(allDates)];
    
    // Number of nights is number of days minus 1
    return uniqueDates.length > 0 ? uniqueDates.length - 1 : 0;
  };

  const numberOfNights = calculateNights();

  // Update accommodation prices and names when tripData changes
  useEffect(() => {
    if (tripData.accommodation) {
      const newPrices = {
        shared: { 
          price: tripData.accommodation.sharedPrice || 0,
          name: tripData.accommodation.sharedName || ""
        },
        private: { 
          price: tripData.accommodation.privatePrice || 0,
          name: tripData.accommodation.privateName || ""
        },
        camping: { 
          price: tripData.accommodation.campingPrice || 0,
          name: tripData.accommodation.campingName || ""
        },
        glamping: { 
          price: tripData.accommodation.glampingPrice || 0,
          name: tripData.accommodation.glampingName || ""
        }
      };
      
      setAccommodationPrices(newPrices);
      
      // Auto-open calculator if any accommodation price is entered
      const hasAnyPrice = Object.values(newPrices).some(acc => acc.price > 0);
      if (hasAnyPrice && !toggleEnabled) {
        setToggleEnabled(true);
      }
    }
  }, [tripData.accommodation, toggleEnabled]);

  const pricing = tripData.pricing || { ...DEFAULT_PRICING };

  const sumItems = (items = []) =>
    (items || []).reduce((sum, it) => sum + (Number(it?.cost) || 0), 0);

  // Calculate total accommodation cost including base prices and additional days
  const calculateTotalAccommodationCost = () => {
    // Base costs for day 1
    const baseCost = 
      accommodationPrices.shared.price + 
      accommodationPrices.private.price + 
      accommodationPrices.camping.price + 
      accommodationPrices.glamping.price;
    
    // Additional days costs for all types
    const additionalDaysCost = 
      (tripData.accommodation?.sharedDays || []).reduce((sum, day) => sum + (day.price || 0), 0) +
      (tripData.accommodation?.privateDays || []).reduce((sum, day) => sum + (day.price || 0), 0) +
      (tripData.accommodation?.campingDays || []).reduce((sum, day) => sum + (day.price || 0), 0) +
      (tripData.accommodation?.glampingDays || []).reduce((sum, day) => sum + (day.price || 0), 0);
    
    // Additional accommodation stays
    const additionalStaysCost = sumItems(pricing.accommodationItems || []);
    
    return baseCost + additionalDaysCost + additionalStaysCost;
  };
  
  const accommodationSum = Number(pricing.accommodation) || calculateTotalAccommodationCost();
  const transportationSum =
    Number(pricing.transportation) ||
    sumItems(pricing.transportationItems || []);
  const activitiesSum =
    Number(pricing.activities) || sumItems(pricing.activityItems || []);
  const bufferPercentage =
    Number(pricing.bufferPercentage) || DEFAULT_PRICING.bufferPercentage;
  const yourFee = Number(pricing.yourFee) || 0;

  // Calculate subtotal and buffer amount
  const subtotal = accommodationSum + transportationSum + activitiesSum;
  const bufferAmount = subtotal * (bufferPercentage / 100);
  
  // Total calculation based on toggle state
  const total = toggleEnabled ? subtotal + bufferAmount + yourFee : yourFee;

  const handleFeeChange = (e) => {
    const value = Number(e.target.value) || 0;
    updateTripData("pricing", { ...(tripData.pricing || {}), yourFee: value, basePrice: 0 }); 
  };

  const handleBufferChange = (e) => {
    const value = Number(e.target.value);
    updateTripData("pricing", {
      ...(tripData.pricing || {}),
      bufferPercentage: isNaN(value) ? 0 : value, basePrice: 0
    });
  };

  const resetPricing = () => {
    updateTripData("pricing", { ...DEFAULT_PRICING ,basePrice: 0 });
  };

  const updateItemList = (key, updatedList) => {
    updateTripData("pricing", {
      ...(tripData.pricing || {}),
      [key]: updatedList,
      accommodation:
        key === "accommodationItems" ? sumItems(updatedList) : pricing.accommodation,
      transportation:
        key === "transportationItems" ? sumItems(updatedList) : pricing.transportation,
      activities:
        key === "activityItems" ? sumItems(updatedList) : pricing.activities,
    });
  };

  // Update accommodation name
  const updateAccommodationName = (type, name) => {
    updateTripData("accommodation", {
      ...(tripData.accommodation || {}),
      [`${type}Name`]: name
    });
  };

  // Update accommodation item name
  const updateAccommodationItemName = (index, name) => {
    const updated = [...(pricing.accommodationItems || [])];
    updated[index] = { ...(updated[index] || {}), name };
    updateItemList("accommodationItems", updated);
  };

  // Add a new accommodation stay
  const addAccommodationStay = (type) => {
    const currentItems = pricing.accommodationItems || [];
    const newItem = {
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Stay`,
      cost: 0,
      type: type
    };
    updateItemList("accommodationItems", [...currentItems, newItem]);
  };

  // Update accommodation day price
  const updateAccommodationDayPrice = (type, price) => {
    updateTripData("accommodation", {
      ...(tripData.accommodation || {}),
      [`${type}Price`]: Number(price)
    });
    
    // Auto-open calculator when price is entered
    if (Number(price) > 0 && !toggleEnabled) {
      setToggleEnabled(true);
    }
  };

  // Add additional accommodation day
  const addAccommodationDay = (type) => {
    const currentDays = tripData.accommodation?.[`${type}Days`] || [];
    const nextDayNumber = currentDays.length + 2; // Day 1 is already there, so next is Day 2
    
    if (nextDayNumber > numberOfNights + 1) {
      alert(`You cannot add more than ${numberOfNights + 1} days.`);
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
      
      // Auto-open calculator when price is entered
      if (field === 'price' && Number(value) > 0 && !toggleEnabled) {
        setToggleEnabled(true);
      }
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

  // Calculate total accommodation cost for a type
  const calculateAccommodationTotal = (type) => {
    const day1Price = tripData.accommodation?.[`${type}Price`] || 0;
    const additionalDays = tripData.accommodation?.[`${type}Days`] || [];
    const additionalDaysTotal = additionalDays.reduce((sum, day) => sum + (day.price || 0), 0);
    return day1Price + additionalDaysTotal;
  };

  // Toggle calculator function
  const toggleCalculator = () => {
    setToggleEnabled(!toggleEnabled);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Cost per TripMate</h2>

      {/* Amount Input - Always visible */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">
          {toggleEnabled ? "Your Fee" : "Total Cost per TripMate"}
        </h4>
        <div className="flex items-center">
          <input
            type="number"
            value={pricing.yourFee ?? ""}
            onChange={handleFeeChange}
            className="w-24 px-3 py-2 border border-gray-300 rounded-l-md"
            placeholder="0"
            min="0"
          />
          <span className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-r-md">
            {currency}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {toggleEnabled 
            ? "This amount is added to the calculated total" 
            : "This is the total cost per TripMate"}
        </p>
      </div>

      {/* Calculator Toggle - Only visible when calculator is enabled */}
      {toggleEnabled && (
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Cost Calculator</h3>
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium">Enabled</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={toggleEnabled}
                  onChange={toggleCalculator}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Cost breakdown - only shown when calculator is enabled */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{currency} {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Buffer ({bufferPercentage}%):</span>
              <span>{currency} {bufferAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Your Fee:</span>
              <span>{currency} {yourFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span>Total:</span>
            <span className="font-bold text-xl">
              {currency} {total.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Enable Calculator Button - Only visible when calculator is disabled */}
      {!toggleEnabled && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={() => setToggleEnabled(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            Enable Cost Calculator
          </button>
        </div>
      )}

      {/* Calculator Form - Only visible when calculator is enabled */}
      {toggleEnabled && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Cost calculator</h3>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800"
              onClick={resetPricing}
            >
              RESET
            </button>
          </div>

          {/* Trip Duration Info */}
          <div className="mb-6 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">Trip Duration:</span>
              <span className="font-medium">
                {numberOfNights > 0 ? `${numberOfNights} night${numberOfNights !== 1 ? 's' : ''}` : 'No dates added'}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-600">Note: Accommodation calculated for all days</span>
            </div>
          </div>

          {/* Accommodation Prices from Itinerary */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Accommodation (Day 1)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Shared Room */}
              <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="flex-1 font-medium">Shared Room:</span>
                  <span className="font-medium">{currency} {accommodationPrices.shared.price.toFixed(2)} / night</span>
                </div>
                <input
                  type="text"
                  value={accommodationPrices.shared.name}
                  onChange={(e) => updateAccommodationName('shared', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2"
                  placeholder="Accommodation name"
                />
                <button
                  type="button"
                  onClick={() => addAccommodationStay('shared')}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center mb-2"
                >
                  <span className="mr-1">+</span> Add Stay
                </button>
                
                {/* Additional Days for Shared */}
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Additional Days:</span>
                    <button
                      type="button"
                      onClick={() => addAccommodationDay('shared')}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Add Day
                    </button>
                  </div>
                  {(tripData.accommodation?.sharedDays || []).map((day, index) => (
                    <div key={index} className="flex items-center mt-1">
                      <span className="text-xs w-12">Day {day.day}:</span>
                      <input
                        type="text"
                        value={day.name || ""}
                        onChange={(e) => updateAccommodationDay('shared', index, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs mx-1"
                        placeholder="Name"
                      />
                      <input
                        type="number"
                        value={day.price || 0}
                        onChange={(e) => updateAccommodationDay('shared', index, 'price', e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                        placeholder="Price"
                      />
                      <button
                        type="button"
                        onClick={() => removeAccommodationDay('shared', index)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 text-sm font-medium text-blue-700">
                  Total: {currency} {calculateAccommodationTotal('shared').toFixed(2)}
                </div>
              </div>
              
              {/* Private Room */}
              <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="flex-1 font-medium">Private Room:</span>
                  <span className="font-medium">{currency} {accommodationPrices.private.price.toFixed(2)} / night</span>
                </div>
                <input
                  type="text"
                  value={accommodationPrices.private.name}
                  onChange={(e) => updateAccommodationName('private', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2"
                  placeholder="Accommodation name"
                />
                <button
                  type="button"
                  onClick={() => addAccommodationStay('private')}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center mb-2"
                >
                  <span className="mr-1">+</span> Add Stay
                </button>
                
                {/* Additional Days for Private */}
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Additional Days:</span>
                    <button
                      type="button"
                      onClick={() => addAccommodationDay('private')}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Add Day
                    </button>
                  </div>
                  {(tripData.accommodation?.privateDays || []).map((day, index) => (
                    <div key={index} className="flex items-center mt-1">
                      <span className="text-xs w-12">Day {day.day}:</span>
                      <input
                        type="text"
                        value={day.name || ""}
                        onChange={(e) => updateAccommodationDay('private', index, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs mx-1"
                        placeholder="Name"
                      />
                      <input
                        type="number"
                        value={day.price || 0}
                        onChange={(e) => updateAccommodationDay('private', index, 'price', e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                        placeholder="Price"
                      />
                      <button
                        type="button"
                        onClick={() => removeAccommodationDay('private', index)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 text-sm font-medium text-blue-700">
                  Total: {currency} {calculateAccommodationTotal('private').toFixed(2)}
                </div>
              </div>
              
              {/* Camping */}
              <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="flex-1 font-medium">Camping:</span>
                  <span className="font-medium">{currency} {accommodationPrices.camping.price.toFixed(2)} / night</span>
                </div>
                <input
                  type="text"
                  value={accommodationPrices.camping.name}
                  onChange={(e) => updateAccommodationName('camping', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2"
                  placeholder="Accommodation name"
                />
                <button
                  type="button"
                  onClick={() => addAccommodationStay('camping')}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center mb-2"
                >
                  <span className="mr-1">+</span> Add Stay
                </button>
                
                {/* Additional Days for Camping */}
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Additional Days:</span>
                    <button
                      type="button"
                      onClick={() => addAccommodationDay('camping')}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Add Day
                    </button>
                  </div>
                  {(tripData.accommodation?.campingDays || []).map((day, index) => (
                    <div key={index} className="flex items-center mt-1">
                      <span className="text-xs w-12">Day {day.day}:</span>
                      <input
                        type="text"
                        value={day.name || ""}
                        onChange={(e) => updateAccommodationDay('camping', index, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs mx-1"
                        placeholder="Name"
                      />
                      <input
                        type="number"
                        value={day.price || 0}
                        onChange={(e) => updateAccommodationDay('camping', index, 'price', e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                        placeholder="Price"
                      />
                      <button
                        type="button"
                        onClick={() => removeAccommodationDay('camping', index)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 text-sm font-medium text-blue-700">
                  Total: {currency} {calculateAccommodationTotal('camping').toFixed(2)}
                </div>
              </div>
              
              {/* Glamping */}
              <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="flex-1 font-medium">Glamping:</span>
                  <span className="font-medium">{currency} {accommodationPrices.glamping.price.toFixed(2)} / night</span>
                </div>
                <input
                  type="text"
                  value={accommodationPrices.glamping.name}
                  onChange={(e) => updateAccommodationName('glamping', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2"
                  placeholder="Accommodation name"
                />
                <button
                  type="button"
                  onClick={() => addAccommodationStay('glamping')}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center mb-2"
                >
                  <span className="mr-1">+</span> Add Stay
                </button>
                
                {/* Additional Days for Glamping */}
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Additional Days:</span>
                    <button
                      type="button"
                      onClick={() => addAccommodationDay('glamping')}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Add Day
                    </button>
                  </div>
                  {(tripData.accommodation?.glampingDays || []).map((day, index) => (
                    <div key={index} className="flex items-center mt-1">
                      <span className="text-xs w-12">Day {day.day}:</span>
                      <input
                        type="text"
                        value={day.name || ""}
                        onChange={(e) => updateAccommodationDay('glamping', index, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs mx-1"
                        placeholder="Name"
                      />
                      <input
                        type="number"
                        value={day.price || 0}
                        onChange={(e) => updateAccommodationDay('glamping', index, 'price', e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                        placeholder="Price"
                      />
                      <button
                        type="button"
                        onClick={() => removeAccommodationDay('glamping', index)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 text-sm font-medium text-blue-700">
                  Total: {currency} {calculateAccommodationTotal('glamping').toFixed(2)}
                </div>
              </div>
            </div>
            
            {/* Additional Accommodation Stays */}
            <div className="mt-4">
              <h5 className="font-medium mb-3">Additional Stays</h5>
              <div className="space-y-3">
                {(pricing.accommodationItems || []).map((item, index) => (
                  <div key={index} className="flex flex-col p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item.name || ""}
                          onChange={(e) => updateAccommodationItemName(index, e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-medium"
                          placeholder="Accommodation name"
                        />
                      </div>
                      <div className="text-sm text-gray-600 ml-2">{item.type}</div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={item.cost ?? ""}
                        onChange={(e) => {
                          const updated = [...(pricing.accommodationItems || [])];
                          updated[index] = { ...(updated[index] || {}), cost: Number(e.target.value) || 0 };
                          updateItemList("accommodationItems", updated);
                        }}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-l-md"
                        placeholder="Cost"
                      />
                      <span className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-r-md">
                        {currency}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(pricing.accommodationItems || [])];
                          updated.splice(index, 1);
                          updateItemList("accommodationItems", updated);
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-gray-100 rounded-lg">
              <div className="flex justify-between">
                <span>Subtotal (all days):</span>
                <span className="font-medium">
                  {currency} {calculateTotalAccommodationCost().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Transportation */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Transportation (per TripMate)</h4>
            <div className="space-y-3">
              {(pricing.transportationItems || []).map((item, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={item.name || ""}
                    onChange={(e) => {
                      const updated = [...(pricing.transportationItems || [])];
                      updated[index] = { ...(updated[index] || {}), name: e.target.value };
                      updateItemList("transportationItems", updated);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                    placeholder="Route (e.g., FROM → TO)"
                  />
                  <input
                    type="number"
                    value={item.cost ?? ""}
                    onChange={(e) => {
                      const updated = [...(pricing.transportationItems || [])];
                      updated[index] = { ...(updated[index] || {}), cost: Number(e.target.value) || 0 };
                      updateItemList("transportationItems", updated);
                    }}
                    className="w-24 px-3 py-2 border-t border-b border-gray-300"
                    placeholder="Cost"
                  />
                  <span className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-r-md">
                    {currency}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(pricing.transportationItems || [])];
                      updated.splice(index, 1);
                      updateItemList("transportationItems", updated);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const currentItems = pricing.transportationItems || [];
                  updateItemList("transportationItems", [...currentItems, { name: "", cost: 0 }]);
                }}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <span className="mr-1">+</span> ADD COST
              </button>
            </div>
          </div>

          {/* Activities */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Other Activities (per TripMate)</h4>
            <div className="space-y-3">
              {(pricing.activityItems || []).map((item, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={item.name || ""}
                    onChange={(e) => {
                      const updated = [...(pricing.activityItems || [])];
                      updated[index] = { ...(updated[index] || {}), name: e.target.value };
                      updateItemList("activityItems", updated);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                    placeholder="Activity name"
                  />
                  <input
                    type="number"
                    value={item.cost ?? ""}
                    onChange={(e) => {
                      const updated = [...(pricing.activityItems || [])];
                      updated[index] = { ...(updated[index] || {}), cost: Number(e.target.value) || 0 };
                      updateItemList("activityItems", updated);
                    }}
                    className="w-24 px-3 py-2 border-t border-b border-gray-300"
                    placeholder="Cost"
                  />
                  <span className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-r-md">
                    {currency}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(pricing.activityItems || [])];
                      updated.splice(index, 1);
                      updateItemList("activityItems", updated);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const currentItems = pricing.activityItems || [];
                  updateItemList("activityItems", [...currentItems, { name: "", cost: 0 }]);
                }}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <span className="mr-1">+</span> ADD COST
              </button>
            </div>
          </div>

          {/* Buffer */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Buffer (%)</h4>
            <div className="flex items-center">
              <input
                type="number"
                value={pricing.bufferPercentage ?? 0}
                onChange={handleBufferChange}
                className="w-24 px-3 py-2 border border-gray-300 rounded-l-md"
                min="0"
                max="100"
              />
              <span className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-r-md">
                %
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Buffer amount: {currency} {bufferAmount.toFixed(2)}</p>
          </div>

          {/* Your Fee (duplicate of header section but kept for UX) */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Your Fee</h4>
            <div className="flex items-center">
              <input
                type="number"
                value={pricing.yourFee ?? ""}
                onChange={handleFeeChange}
                className="w-24 px-3 py-2 border border-gray-300 rounded-l-md"
                placeholder="0"
                min="0"
              />
              <span className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-r-md">
                {currency}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">You can add an extra fee</p>
          </div>
        </div>
      )}
    </div>
  );
}

PricingSection.propTypes = {
  tripData: PropTypes.object.isRequired,
  updateTripData: PropTypes.func.isRequired,
};