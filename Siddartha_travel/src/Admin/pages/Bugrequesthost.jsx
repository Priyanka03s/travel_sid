import React, { useState } from "react";

const Bugrequesthost = () => {
  const [activeTab, setActiveTab] = useState("new"); // 'new' or 'responded'
  const [tickets, setTickets] = useState([
    {
      id: 1,
      trip: "Mountain Adventure",
      type: "Bug",
      subCategory: "Trip Itinerary",
      details: "Wrong date showing in itinerary section",
      createdDate: "2025-10-10",
      product: "Adventure",
      status: "Pending",
      response: "",
    },
    {
      id: 2,
      trip: "Music Event",
      type: "Enhancement",
      subCategory: "Event",
      details: "Need option to upload event poster",
      createdDate: "2025-10-08",
      product: "Event",
      status: "Pending",
      response: "",
    },
  ]);

  const handleResponse = (id, comment, status) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: status, response: comment } : t
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-6">
        {/* Header Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("new")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "new"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            New Bug Tickets
          </button>
          <button
            onClick={() => setActiveTab("responded")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "responded"
                ? "bg-green-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Responded Tickets
          </button>
        </div>

        {/* NEW BUG TICKETS SECTION */}
        {activeTab === "new" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              New Bug / Enhancement Requests
            </h2>

            {tickets.filter((t) => t.status === "Pending").length === 0 ? (
              <p className="text-gray-600">No new tickets to respond.</p>
            ) : (
              tickets
                .filter((t) => t.status === "Pending")
                .map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm"
                  >
                    <p className="text-sm text-gray-600 mb-1">
                      Ticket ID: #{ticket.id}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Trip/Event:
                      </span>{" "}
                      {ticket.trip}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Request Type:
                      </span>{" "}
                      {ticket.type}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Sub Category:
                      </span>{" "}
                      {ticket.subCategory}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Issue Details:
                      </span>{" "}
                      {ticket.details}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Created Date:
                      </span>{" "}
                      {ticket.createdDate}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Product:
                      </span>{" "}
                      {ticket.product}
                    </p>

                    {/* Admin Response Form */}
                    <div className="mt-4">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Add Response
                      </label>
                      <textarea
                        id={`response-${ticket.id}`}
                        placeholder="Write your response here..."
                        className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-300"
                      ></textarea>

                      <label className="block text-gray-700 font-semibold mt-3 mb-2">
                        Status
                      </label>
                      <select
                        id={`status-${ticket.id}`}
                        className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-300"
                      >
                        <option>Resolved</option>
                        <option>In Progress</option>
                        <option>Rejected</option>
                      </select>

                      <button
                        onClick={() => {
                          const comment = document.getElementById(
                            `response-${ticket.id}`
                          ).value;
                          const status = document.getElementById(
                            `status-${ticket.id}`
                          ).value;
                          handleResponse(ticket.id, comment, status);
                        }}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition shadow"
                      >
                        Submit Response
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* RESPONDED TICKETS SECTION */}
        {activeTab === "responded" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Responded Tickets
            </h2>

            {tickets.filter((t) => t.status !== "Pending").length === 0 ? (
              <p className="text-gray-600">No responded tickets yet.</p>
            ) : (
              tickets
                .filter((t) => t.status !== "Pending")
                .map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border rounded-lg p-4 mb-4 bg-green-50 shadow-sm"
                  >
                    <p className="text-sm text-gray-600 mb-1">
                      Ticket ID: #{ticket.id}
                    </p>
                    <p className="font-semibold text-gray-800">
                      Trip/Event: {ticket.trip}
                    </p>
                    <p className="text-gray-700 mt-1">
                      <span className="font-semibold">Status:</span>{" "}
                      {ticket.status}
                    </p>
                    <p className="mt-2 text-gray-700">
                      <span className="font-semibold">Admin Response:</span>{" "}
                      {ticket.response}
                    </p>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bugrequesthost;
