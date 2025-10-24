import React, { useState } from "react";

export default function BugRequestForm() {
  const [activeTab, setActiveTab] = useState("ticket"); // 'ticket' or 'response'
  const [subCategory, setSubCategory] = useState(""); // for dynamic sub-category
  const [customSubCategory, setCustomSubCategory] = useState(""); // for "Others" input

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6">
        {/* Header Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("ticket")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "ticket"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Ticket Raise
          </button>
          <button
            onClick={() => setActiveTab("response")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "response"
                ? "bg-green-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Response
          </button>
        </div>

        {/* TICKET RAISE SECTION */}
        {activeTab === "ticket" && (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trip / Event */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Trip / Event
              </label>
              <input
                type="text"
                placeholder="Enter trip or event name"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Request Type */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Request Type
              </label>
              <select className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300">
                <option>Bug</option>
                <option>Enhancement</option>
              </select>
            </div>

            {/* Sub Category */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Sub Category
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              >
                <option value="">Select Sub Category</option>
                <option value="Trip Itinerary">Trip Itinerary</option>
                <option value="Event">Event</option>
                <option value="Adventure">Adventure</option>
                <option value="Profile">Profile</option>
                <option value="Others">Others</option>
              </select>

              {/* If user selects "Others", show text input */}
              {subCategory === "Others" && (
                <input
                  type="text"
                  placeholder="Enter your issue / custom category"
                  value={customSubCategory}
                  onChange={(e) => setCustomSubCategory(e.target.value)}
                  className="mt-3 w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                />
              )}
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Internal Notes
              </label>
              <textarea
                placeholder="Add internal notes"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              ></textarea>
            </div>

            {/* Issue Details */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Issue Details
              </label>
              <textarea
                placeholder="Describe the issue in detail"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                rows="3"
              ></textarea>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Upload Image
              </label>
              <input
                type="file"
                className="w-full border rounded-lg px-3 py-2 text-gray-700"
              />
            </div>

            {/* Comment Box */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Comment Box
              </label>
              <select className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300">
                <option>Internal</option>
                <option>External</option>
              </select>
            </div>

            {/* Created Date */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Created Date
              </label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Product */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Product (Trip/Event/Adventure)
              </label>
              <input
                type="text"
                placeholder="Enter related product"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                placeholder="Enter product description"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              ></textarea>
            </div>

            {/* Additional Comments */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Additional Comment
              </label>
              <textarea
                placeholder="Enter any additional comment"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
              ></textarea>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        )}

        {/* RESPONSE SECTION */}
        {activeTab === "response" && (
          <div className="p-4 text-gray-700">
            <h2 className="text-2xl font-bold mb-4">Admin Responses</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600 mb-1">Ticket ID: #12345</p>
                <p className="font-semibold">Status: Resolved ✅</p>
                <p className="mt-2">Admin Comment: Issue fixed in latest patch.</p>
              </div>
              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600 mb-1">Ticket ID: #12346</p>
                <p className="font-semibold">Status: Pending ⏳</p>
                <p className="mt-2">Admin Comment: Under review by the QA team.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
