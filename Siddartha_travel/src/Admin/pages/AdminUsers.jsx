
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:5000/api/users");
        const filtered = res.data.filter((u) => u.role === "user");
        setUsers(filtered);
        setFilteredUsers(filtered);
      } catch (err) {
        console.error("❌ Error fetching users:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle search functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((u) =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(term)
        )
      );
    }
  };

  // Filter users based on active tab
  const getFilteredUsers = () => {
    if (activeTab === "all") return filteredUsers;
    if (activeTab === "withDocs") {
      return filteredUsers.filter(user => user.aadharDoc || user.drivingLicenseDoc || user.passportDoc);
    }
    if (activeTab === "withoutDocs") {
      return filteredUsers.filter(user => !user.aadharDoc && !user.drivingLicenseDoc && !user.passportDoc);
    }
    return filteredUsers;
  };

  // ✅ Helper to render file link/preview
  const renderFile = (filePath, label) => {
    if (!filePath) return <span className="text-red-500 text-sm">Not uploaded</span>;

    const fullUrl = `http://localhost:5000${filePath}`;

    if (filePath.endsWith(".pdf")) {
      return (
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm inline-flex items-center hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2v-3a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          View {label}
        </a>
      );
    }

    return (
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block group relative"
      >
        <img
          src={fullUrl}
          alt={label}
          className="w-16 h-16 object-cover rounded border hover:shadow-md transition-all"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded"></div>
      </a>
    );
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  // Count verified documents for a user
  const countVerifiedDocuments = (user) => {
    let count = 0;
    if (user.aadharDoc) count++;
    if (user.drivingLicenseDoc) count++;
    if (user.passportDoc) count++;
    return count;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👤 Registered Users</h2>
          <p className="text-gray-600 text-sm mt-1">Manage and view all user accounts</p>
        </div>

        <div className="w-full md:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.4143-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={handleSearch}
              className="border pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

      {/* Tabs for filtering */}
      <div className="flex border-b mb-6 bg-white rounded-lg shadow-sm p-1">
        <button
          className={`py-2 px-4 font-medium rounded-md ${activeTab === "all" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("all")}
        >
          All Users
        </button>
        <button
          className={`py-2 px-4 font-medium rounded-md ${activeTab === "withDocs" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("withDocs")}
        >
          With Documents
        </button>
        <button
          className={`py-2 px-4 font-medium rounded-md ${activeTab === "withoutDocs" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("withoutDocs")}
        >
          No Documents
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Users Cards View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredUsers().length > 0 ? (
              getFilteredUsers().map((user) => (
                <div key={user._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3 text-white font-semibold">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{user.firstName} {user.lastName}</h3>
                      <p className="text-gray-600 text-sm truncate">{user.email || user.userId}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Phone</p>
                      <p className="truncate">{user.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Location</p>
                      <p className="truncate">{user.location || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Profession</p>
                      <p className="truncate">{user.profession || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Documents</p>
                      <p className={countVerifiedDocuments(user) > 0 ? "text-green-600 font-medium" : "text-yellow-600"}>
                        {countVerifiedDocuments(user)}/3
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => viewUserDetails(user)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <svg xmlns="http://www.w3.org/2000/s" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-lg mt-4">No users found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">
                {selectedUser.firstName} {selectedUser.lastName}'s Details
              </h3>
              <button onClick={closeUserDetails} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h4 className="font-bold text-lg mb-4 text-blue-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="font-medium w-40">Email:</span>
                      <span className="truncate">{selectedUser.email || selectedUser.userId}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-40">Phone:</span>
                      <span>{selectedUser.phone || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-40">Gender:</span>
                      <span>{selectedUser.gender || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-40">DOB:</span>
                      <span>{formatDate(selectedUser.dob)}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-40">Blood Group:</span>
                      <span>{selectedUser.bloodGroup || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-40">Emergency Contact:</span>
                      <span>{selectedUser.emergencyContact || "N/A"}</span>
                    </div>
                  </div>
                </div>
                
                {/* Professional Information */}
                <div>
                  <h4 className="font-bold text-lg mb-4 text-blue-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    Professional Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="font-medium w-40">Profession:</span>
                      <span>{selectedUser.profession || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-40">Company:</span>
                      <span>{selectedUser.currentCompany || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-40">Skills:</span>
                      <span>{selectedUser.skills || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-40">Language:</span>
                      <span>{selectedUser.language || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-40">Location:</span>
                      <span>{selectedUser.location || "N/A"}</span>
                    </div>
                  </div>
                </div>
                
                {/* Documents */}
                <div className="md:col-span-2">
                  <h4 className="font-bold text-lg mb-4 text-blue-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Documents
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded border">
                      <h5 className="font-medium mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Aadhar Card
                      </h5>
                      <p className="mb-2 text-sm">{selectedUser.aadhar || "Not provided"}</p>
                      <div>{renderFile(selectedUser.aadharDoc, "Aadhar")}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded border">
                      <h5 className="font-medium mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Driving License
                      </h5>
                      <p className="mb-2 text-sm">{selectedUser.drivingLicense || "Not provided"}</p>
                      <div>{renderFile(selectedUser.drivingLicenseDoc, "DL")}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded border">
                      <h5 className="font-medium mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Passport
                      </h5>
                      <p className="mb-2 text-sm">{selectedUser.passportId || "Not provided"}</p>
                      <div>{renderFile(selectedUser.passportDoc, "Passport")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}