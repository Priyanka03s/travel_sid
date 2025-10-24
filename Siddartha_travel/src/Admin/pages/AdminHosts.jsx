import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminHosts() {
  const [hosts, setHosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredHosts, setFilteredHosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showQuestionManager, setShowQuestionManager] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedHost, setSelectedHost] = useState(null);
  const [activeTab, setActiveTab] = useState("allHosts");

  useEffect(() => {
    fetchHosts();
    fetchUsers();
    fetchQuestions();
  }, []);

  const fetchHosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      const filtered = res.data.filter((u) => u.role === "host");
      setHosts(filtered);
      setFilteredHosts(filtered);
    } catch (err) {
      console.error("❌ Error fetching hosts:", err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Error fetching users:", err.message);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/additional-questions"
      );
      setQuestions(res.data);
    } catch (err) {
      console.error("❌ Error fetching questions:", err.message);
    }
  };

  const toggleApproval = async (hostId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${hostId}/approval`, {
        approved: !currentStatus,
      });
      fetchHosts();
      alert(
        `Host ${!currentStatus ? "approved" : "disapproved"} successfully`
      );
    } catch (err) {
      console.error("❌ Error updating approval:", err.message);
      alert("Failed to update approval status");
    }
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, { question: newQuestion, type: "text" }]);
      setNewQuestion("");
    }
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const saveQuestions = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/additional-questions", {
        questions,
      });
      alert("Questions saved successfully!");
      setShowQuestionManager(false);
    } catch (err) {
      console.error("❌ Error saving questions:", err.message);
      alert("Failed to save questions.");
    }
  };

  const renderFile = (filePath, label) => {
    if (!filePath) return "N/A";
    return (
      <a
        href={`http://localhost:5000${filePath}`}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline text-sm"
      >
        View {label}
      </a>
    );
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFilteredHosts(hosts);
    } else {
      setFilteredHosts(
        hosts.filter((h) =>
          `${h.firstName} ${h.lastName}`.toLowerCase().includes(term)
        )
      );
    }
  };

  const viewHostDetails = (host) => {
    setSelectedHost(host);
  };

  const closeHostDetails = () => {
    setSelectedHost(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">With Documents</p>
              <p className="text-2xl font-bold">
                {users.filter(user => user.aadharDoc || user.drivingLicenseDoc || user.passportDoc).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">No Documents</p>
              <p className="text-2xl font-bold">
                {users.filter(user => !user.aadharDoc && !user.drivingLicenseDoc && !user.passportDoc).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🧑‍🤝‍🧑 Registered Hosts</h2>

        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="border px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />

          <button
            onClick={() => setShowQuestionManager(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 ml-2"
          >
            Manage Questions
          </button>
        </div>
      </div>

      {/* Tabs for filtering */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === "allHosts" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("allHosts")}
        >
          All Hosts
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "approved" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("approved")}
        >
          Approved
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "pending" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Approval
        </button>
      </div>

      {/* Hosts Cards View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHosts
          .filter(host => {
            if (activeTab === "approved") return host.approved;
            if (activeTab === "pending") return !host.approved;
            return true;
          })
          .map((host) => (
          <div key={host._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{host.firstName} {host.lastName}</h3>
                <p className="text-gray-600 text-sm">{host.email || host.userId}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  host.approved
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {host.approved ? "Approved" : "Pending"}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div>
                <p className="text-gray-500">Phone</p>
                <p>{host.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Location</p>
                <p>{host.location || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Profession</p>
                <p>{host.profession || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Trips Hosted</p>
                <p>{host.tripsHosted || 0}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={() => viewHostDetails(host)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Details
              </button>
              <button
                onClick={() => toggleApproval(host._id, host.approved)}
                className={`px-3 py-1 rounded text-sm ${
                  host.approved
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {host.approved ? "Disapprove" : "Approve"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Question Manager Modal */}
      {showQuestionManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Manage Additional Questions
            </h3>

            <div className="mb-4">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter new question"
                className="w-full p-2 border rounded mb-2"
              />
              <button
                onClick={addQuestion}
                className="bg-green-600 text-white px-3 py-2 rounded w-full"
              >
                Add Question
              </button>
            </div>

            <div className="mb-4 max-h-64 overflow-y-auto">
              {questions.length > 0 ? (
                questions.map((q, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2 p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">{q.question}</span>
                    <button
                      onClick={() => removeQuestion(index)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No questions added yet</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowQuestionManager(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveQuestions}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save Questions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Host Details Modal */}
      {selectedHost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">
                {selectedHost.firstName} {selectedHost.lastName}'s Details
              </h3>
              <button onClick={closeHostDetails} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h4 className="font-bold text-lg mb-4 text-blue-700">Personal Information</h4>
                  <div className="space-y-3">
                    <p><span className="font-medium">Email:</span> {selectedHost.email || selectedHost.userId}</p>
                    <p><span className="font-medium">Phone:</span> {selectedHost.phone || "N/A"}</p>
                    <p><span className="font-medium">Gender:</span> {selectedHost.gender || "N/A"}</p>
                    <p><span className="font-medium">DOB:</span> {selectedHost.dob ? new Date(selectedHost.dob).toLocaleDateString() : "N/A"}</p>
                    <p><span className="font-medium">Blood Group:</span> {selectedHost.bloodGroup || "N/A"}</p>
                    <p><span className="font-medium">Emergency Contact:</span> {selectedHost.emergencyContact || "N/A"}</p>
                  </div>
                </div>
                
                {/* Professional Information */}
                <div>
                  <h4 className="font-bold text-lg mb-4 text-blue-700">Professional Information</h4>
                  <div className="space-y-3">
                    <p><span className="font-medium">Profession:</span> {selectedHost.profession || "N/A"}</p>
                    <p><span className="font-medium">Company:</span> {selectedHost.currentCompany || "N/A"}</p>
                    <p><span className="font-medium">Experience:</span> {selectedHost.experience || "N/A"}</p>
                    <p><span className="font-medium">Skills:</span> {selectedHost.skills || "N/A"}</p>
                    <p><span className="font-medium">Language:</span> {selectedHost.language || "N/A"}</p>
                    <p><span className="font-medium">Location:</span> {selectedHost.location || "N/A"}</p>
                  </div>
                </div>
                
                {/* Trip Information */}
                <div>
                  <h4 className="font-bold text-lg mb-4 text-blue-700">Trip Information</h4>
                  <div className="space-y-3">
                    <p><span className="font-medium">Category:</span> {selectedHost.tripCategory || "N/A"}</p>
                    <p><span className="font-medium">Trips Hosted:</span> {selectedHost.tripsHosted || 0}</p>
                    <p><span className="font-medium">Followers:</span> {selectedHost.followersCount || 0}</p>
                    <p><span className="font-medium">Next Trip:</span> {selectedHost.nextTripDate || "N/A"}</p>
                    <p><span className="font-medium">Duration:</span> {selectedHost.tripDuration || "N/A"} days</p>
                    <p><span className="font-medium">Fee Range:</span> {selectedHost.minFee || "N/A"} - {selectedHost.maxFee || "N/A"}</p>
                  </div>
                </div>
                
                {/* Documents */}
                <div>
                  <h4 className="font-bold text-lg mb-4 text-blue-700">Documents</h4>
                  <div className="space-y-3">
                    <p><span className="font-medium">Aadhar:</span> {selectedHost.aadhar || "N/A"}</p>
                    <p><span className="font-medium">Aadhar Document:</span> {renderFile(selectedHost.aadharDoc, "Aadhar")}</p>
                    <p><span className="font-medium">Driving License:</span> {selectedHost.drivingLicense || "N/A"}</p>
                    <p><span className="font-medium">DL Document:</span> {renderFile(selectedHost.drivingLicenseDoc, "DL")}</p>
                    <p><span className="font-medium">Passport:</span> {selectedHost.passportId || "N/A"}</p>
                    <p><span className="font-medium">Passport Document:</span> {renderFile(selectedHost.passportDoc, "Passport")}</p>
                  </div>
                </div>
                
                {/* Payment Details */}
                <div className="md:col-span-2">
                  <h4 className="font-bold text-lg mb-4 text-blue-700">Payment Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded">
                      <h5 className="font-medium mb-2">Bank Information</h5>
                      <p><span className="font-medium">Bank Name:</span> {selectedHost.bankName || "N/A"}</p>
                      <p><span className="font-medium">Account Number:</span> {selectedHost.accountNumber || "N/A"}</p>
                      <p><span className="font-medium">Account Holder:</span> {selectedHost.accountHolder || "N/A"}</p>
                      <p><span className="font-medium">IFSC Code:</span> {selectedHost.ifsc || "N/A"}</p>
                      <p><span className="font-medium">Account Type:</span> {selectedHost.accountType || "N/A"}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded">
                      <h5 className="font-medium mb-2">Tax & Business Information</h5>
                      <p><span className="font-medium">PAN Number:</span> {selectedHost.panNumber || "N/A"}</p>
                      <p><span className="font-medium">GST Number:</span> {selectedHost.gst || "N/A"}</p>
                      <p><span className="font-medium">Business Type:</span> {selectedHost.businessType || "N/A"}</p>
                      <p><span className="font-medium">CIN Number:</span> {selectedHost.cin || "N/A"}</p>
                      <p><span className="font-medium">UPI ID:</span> {selectedHost.upi || "N/A"}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded md:col-span-2">
                      <h5 className="font-medium mb-2">Additional Information</h5>
                      <p><span className="font-medium">Products/Services:</span> {selectedHost.products || "N/A"}</p>
                      <p><span className="font-medium">Business Address:</span> {selectedHost.address || "N/A"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Questions */}
                {questions.length > 0 && (
                  <div className="md:col-span-2">
                    <h4 className="font-bold text-lg mb-4 text-blue-700">Additional Questions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {questions.map((q, index) => {
                        const answer = selectedHost.additionalQuestions?.find(
                          aq => aq.question === q.question
                        )?.answer || "N/A";
                        return (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <p className="font-medium text-sm">{q.question}</p>
                            <p>{answer}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => toggleApproval(selectedHost._id, selectedHost.approved)}
                  className={`px-4 py-2 rounded ${
                    selectedHost.approved
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {selectedHost.approved ? "Disapprove" : "Approve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}