import React, { useState, useEffect, useMemo } from "react";
import { format, parseISO, addDays, differenceInDays } from "date-fns";

const DEFAULT_PRICING = {
  accommodation: 0,
  transport: 0,
  visaRegFee: 0,
  customField: 0,
  commission: 0,
  pgCharges: 0,
  bufferPercentage: 10,
  yourFee: 0,
  accommodationItems: [],
  transportationItems: [],
  activityItems: [],
  totalPrice: 0,
  settleToVendor: false,
  collectPGCharges: false,
};

export default function PricingCalculation({ formik }) {
  const [currency] = useState("INR");
  const [showCalculator, setShowCalculator] = useState(false);
  const [pricingInitialized, setPricingInitialized] = useState(false);

  // Initialize pricing from formik values
  useEffect(() => {
    if (formik.values.pricing && !pricingInitialized) {
      console.log("Initializing pricing from formik values:", formik.values.pricing);
      setPricingInitialized(true);
    }
  }, [formik.values.pricing, pricingInitialized]);

  const pricing = useMemo(() => {
    // Ensure we have a pricing object with all required fields
    const currentPricing = formik.values.pricing || {};
    
    return {
      ...DEFAULT_PRICING,
      ...currentPricing,
      accommodationItems: currentPricing.accommodationItems || [],
      transportationItems: currentPricing.transportationItems || [],
      activityItems: currentPricing.activityItems || [],
    };
  }, [formik.values.pricing]);

  const settleToVendor = pricing.settleToVendor || false;
  const collectPGCharges = pricing.collectPGCharges || false;

  const sumItems = (items = []) =>
    (items || []).reduce((sum, it) => sum + (Number(it?.cost) || 0), 0);

  const accommodationSum = sumItems(pricing.accommodationItems);
  const transportationSum = sumItems(pricing.transportationItems);
  const activitiesSum = sumItems(pricing.activityItems);
  const bufferPercentage = pricing.bufferPercentage || 10;
  const yourFee = pricing.yourFee || 0;
  const visaRegFee = pricing.visaRegFee || 0;
  const customField = pricing.customField || 0;
  const commission = pricing.commission || 0;
  const pgCharges = pricing.pgCharges || 0;

  const calculateBaseTotal = () => {
    return accommodationSum + transportationSum + activitiesSum + visaRegFee + customField;
  };

  const calculateCommission = () => {
    const baseTotal = calculateBaseTotal();
    return baseTotal * (commission / 100);
  };

  const handleSettleToVendorChange = (checked) => {
    formik.setFieldValue("pricing.settleToVendor", checked);
  };

  const handleCollectPGChargesChange = (checked) => {
    formik.setFieldValue("pricing.collectPGCharges", checked);
  };

  const calculatePGCharges = () => {
    if (!collectPGCharges) return 0;
    const baseTotal = calculateBaseTotal();
    return baseTotal * (pgCharges / 100);
  };

  const calculateBuffer = () => {
    const baseTotal = calculateBaseTotal();
    return baseTotal * (bufferPercentage / 100);
  };

  const calculateTotal = () => {
    const baseTotal = calculateBaseTotal();
    const bufferAmount = calculateBuffer();
    const commissionAmount = calculateCommission();
    const pgChargesAmount = calculatePGCharges();

    return (
      baseTotal + bufferAmount + yourFee + commissionAmount + pgChargesAmount
    );
  };

  const handleInputChange = (field, value) => {
    console.log(`Updating pricing field ${field} to ${value}`);
    formik.setFieldValue(`pricing.${field}`, value);
  };

  const updateItemList = (key, updatedList) => {
    console.log(`Updating pricing ${key} with:`, updatedList);
    formik.setFieldValue(`pricing.${key}`, updatedList);
  };

  const resetPricing = () => {
    console.log("Resetting pricing to default");
    formik.setFieldValue("pricing", { ...DEFAULT_PRICING });
    setPricingInitialized(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalPrice = calculateTotal();
    console.log("Final calculated total price:", totalPrice);
    
    // Update the total price in formik
    formik.setFieldValue("pricing.totalPrice", totalPrice);
    
    // Submit the form
    formik.handleSubmit(e);
  };

  return (
    <div className="mb-8 p-4 border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Pricing Calculation*</h2>

      {/* Basic Pricing Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">
            Visa Registration Fee
          </label>
          <input
            type="number"
            value={pricing.visaRegFee || ""}
            onChange={(e) =>
              handleInputChange("visaRegFee", Number(e.target.value) || 0)
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">
            Platform Commission (%)
          </label>
          <input
            type="number"
            value={pricing.commission || ""}
            onChange={(e) =>
              handleInputChange("commission", Number(e.target.value) || 0)
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={settleToVendor}
          onChange={(e) => handleSettleToVendorChange(e.target.checked)}
          className="mr-2"
        />
        <span>Settle to vendor</span>
      </div>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={collectPGCharges}
          onChange={(e) => handleCollectPGChargesChange(e.target.checked)}
          className="mr-2"
        />
        <span>Collect PG charges (Settlement charges) from customer</span>
      </div>

      {collectPGCharges && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">PG Charges (%)</label>
          <input
            type="number"
            value={pricing.pgCharges || ""}
            onChange={(e) =>
              handleInputChange("pgCharges", Number(e.target.value) || 0)
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      )}
      
      {/* Toggle Calculator Button */}
      <button
        type="button"
        onClick={() => setShowCalculator(!showCalculator)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        {showCalculator ? "Hide Calculator" : "Open Calculator"}
      </button>
      
      {showCalculator && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Cost Calculator</h3>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800"
              onClick={resetPricing}
            >
              RESET
            </button>
          </div>
          
          {/* Accommodation Items */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Accommodation (per TripMate)</h4>
            {pricing.accommodationItems?.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={(e) => {
                    const updated = [...pricing.accommodationItems];
                    updated[index] = {
                      ...updated[index],
                      name: e.target.value,
                    };
                    updateItemList("accommodationItems", updated);
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  placeholder="Location"
                />
                <input
                  type="number"
                  value={item.cost || ""}
                  onChange={(e) => {
                    const updated = [...pricing.accommodationItems];
                    updated[index] = {
                      ...updated[index],
                      cost: Number(e.target.value) || 0,
                    };
                    updateItemList("accommodationItems", updated);
                  }}
                  className="ml-2 w-24 p-2 border border-gray-300 rounded"
                  placeholder="Cost"
                />
                <span className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-r-md ml-2">
                  {currency}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = pricing.accommodationItems.filter(
                      (_, i) => i !== index
                    );
                    updateItemList("accommodationItems", updated);
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
                const updated = [
                  ...(pricing.accommodationItems || []),
                  { name: "", cost: 0 },
                ];
                updateItemList("accommodationItems", updated);
              }}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <span className="mr-1">+</span> ADD ACCOMMODATION
            </button>
          </div>
          
          {/* Transportation Items */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Transportation (per TripMate)</h4>
            {pricing.transportationItems?.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={(e) => {
                    const updated = [...pricing.transportationItems];
                    updated[index] = {
                      ...updated[index],
                      name: e.target.value,
                    };
                    updateItemList("transportationItems", updated);
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  placeholder="Route (e.g., FROM → TO)"
                />
                <input
                  type="number"
                  value={item.cost || ""}
                  onChange={(e) => {
                    const updated = [...pricing.transportationItems];
                    updated[index] = {
                      ...updated[index],
                      cost: Number(e.target.value) || 0,
                    };
                    updateItemList("transportationItems", updated);
                  }}
                  className="ml-2 w-24 p-2 border border-gray-300 rounded"
                  placeholder="Cost"
                />
                <span className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-r-md ml-2">
                  {currency}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = pricing.transportationItems.filter(
                      (_, i) => i !== index
                    );
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
                const updated = [
                  ...(pricing.transportationItems || []),
                  { name: "", cost: 0 },
                ];
                updateItemList("transportationItems", updated);
              }}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <span className="mr-1">+</span> ADD TRANSPORTATION
            </button>
          </div>
          
          {/* Activities Items */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Activities (per TripMate)</h4>
            {pricing.activityItems?.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={(e) => {
                    const updated = [...pricing.activityItems];
                    updated[index] = {
                      ...updated[index],
                      name: e.target.value,
                    };
                    updateItemList("activityItems", updated);
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  placeholder="Activity name"
                />
                <input
                  type="number"
                  value={item.cost || ""}
                  onChange={(e) => {
                    const updated = [...pricing.activityItems];
                    updated[index] = {
                      ...updated[index],
                      cost: Number(e.target.value) || 0,
                    };
                    updateItemList("activityItems", updated);
                  }}
                  className="ml-2 w-24 p-2 border border-gray-300 rounded"
                  placeholder="Cost"
                />
                <span className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-r-md ml-2">
                  {currency}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = pricing.activityItems.filter(
                      (_, i) => i !== index
                    );
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
                const updated = [
                  ...(pricing.activityItems || []),
                  { name: "", cost: 0 },
                ];
                updateItemList("activityItems", updated);
              }}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <span className="mr-1">+</span> ADD ACTIVITY
            </button>
          </div>
          
          {/* Buffer Percentage */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Buffer (%)</h4>
            <div className="flex items-center">
              <input
                type="number"
                value={bufferPercentage}
                onChange={(e) =>
                  handleInputChange("bufferPercentage", Number(e.target.value))
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-l-md"
                min="0"
                max="100"
              />
              <span className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-r-md">
                %
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Cover unexpected costs (10% recommended)
            </p>
          </div>
          
          {/* Your Fee */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Your Fee</h4>
            <div className="flex items-center">
              <input
                type="number"
                value={yourFee}
                onChange={(e) =>
                  handleInputChange("yourFee", Number(e.target.value) || 0)
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-l-md"
                placeholder="0"
                min="0"
              />
              <span className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-r-md">
                {currency}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              You can add an extra fee
            </p>
          </div>
        </div>
      )}
      
      {/* Summary Section */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <h3 className="font-bold text-lg mb-2">Cost Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>
              Base Cost (Accommodation + Transport + Activities + Visa + Custom):
            </span>
            <span>
              {currency} {calculateBaseTotal().toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Buffer ({bufferPercentage}%):</span>
            <span>
              {currency} {calculateBuffer().toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Your Fee:</span>
            <span>
              {currency} {yourFee.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Platform Commission ({commission}%):</span>
            <span>
              {currency} {calculateCommission().toFixed(2)}
            </span>
          </div>
          {collectPGCharges && (
            <div className="flex justify-between">
              <span>PG Charges ({pgCharges}%):</span>
              <span>
                {currency} {calculatePGCharges().toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-xl">
              {currency} {calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
          <p><strong>Debug Info:</strong></p>
          <p>Base Total: {calculateBaseTotal().toFixed(2)}</p>
          <p>Buffer: {calculateBuffer().toFixed(2)}</p>
          {/* <p>Commission: {calculateCommission().toFixed(2)}</p> */}
          <p>PG Charges: {calculatePGCharges().toFixed(2)}</p>
          <p>Your Fee: {yourFee.toFixed(2)}</p>
          <p>Calculated Total: {calculateTotal().toFixed(2)}</p>
          <p>Stored Total: {pricing.totalPrice?.toFixed(2) || 'N/A'}</p>
        </div>
      )}
    </div>
  );
}