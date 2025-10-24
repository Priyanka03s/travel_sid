const Trip = require("../models/Trip");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

// Helper function to handle file uploads
const handleFileUpload = (file, folder) => {
  if (!file) return null;
  
  const uploadDir = path.join(__dirname, "../uploads", folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname);
  const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
  const filepath = path.join(uploadDir, filename);
  
  try {
    const fileData = fs.readFileSync(file.path);
    fs.writeFileSync(filepath, fileData);
    fs.unlinkSync(file.path);
    
    return `/uploads/${folder}/${filename}`;
  } catch (err) {
    console.error("Error saving file:", err);
    return null;
  }
};

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    let tripData = req.body;
    const createdBy = req.user.id; // From auth middleware
    
    // Remove _id if present to avoid duplicate key error
    if (tripData._id) {
      delete tripData._id;
    }
    
    // Validate required fields
    if (!tripData.tripCategory) {
      return res.status(400).json({ message: "Trip category is required" });
    }
    
    // Fix privateSharingOption
    if (tripData.groupType === 'private') {
      if (!tripData.privateSharingOption || !['individual', 'group'].includes(tripData.privateSharingOption)) {
        tripData.privateSharingOption = 'individual'; // Default value
      }
    } else {
      delete tripData.privateSharingOption; // Remove if not private
    }
    
    // Handle banner image upload
    if (req.files && req.files.bannerImage) {
      tripData.bannerImage = handleFileUpload(req.files.bannerImage[0], "trips");
    }
    
    // Handle accommodation images
    const accommodationImages = ['sharedImage', 'privateImage', 'campingImage', 'glampingImage'];
    accommodationImages.forEach(imgType => {
      if (req.files && req.files[imgType]) {
        if (!tripData.accommodation) tripData.accommodation = {};
        tripData.accommodation[imgType] = handleFileUpload(req.files[imgType][0], "accommodation");
      }
    });
    
    // Create the trip
    const trip = new Trip({
      ...tripData,
      createdBy
    });
    await trip.save();
    res.status(201).json({ 
      message: "Trip created successfully", 
      trip,
      id: trip._id 
    });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all trips (with filtering)
exports.getTrips = async (req, res) => {
  try {
    const { status, createdBy, groupType, tripCategory } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (createdBy) filter.createdBy = createdBy;
    if (groupType) filter.groupType = groupType;
    if (tripCategory) filter.tripCategory = tripCategory;

    const trips = await Trip.find(filter)
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });
      
    res.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single trip by ID
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("createdBy", "firstName lastName email");
      
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    
    res.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a trip
exports.updateTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    console.log("Updating trip with ID:", tripId);
    
    // Check if the trip exists and the user is the creator
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (trip.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this trip" });
    }
    
    // Validate required fields
    if (!req.body.tripCategory) {
      return res.status(400).json({ message: "Trip category is required" });
    }
    
    // Fix privateSharingOption
    if (req.body.groupType === 'private') {
      if (!req.body.privateSharingOption || !['individual', 'group'].includes(req.body.privateSharingOption)) {
        req.body.privateSharingOption = 'individual'; // Default value
      }
    } else {
      delete req.body.privateSharingOption; // Remove if not private
    }
    
    // Handle banner image update if a new file is uploaded
    if (req.files && req.files.bannerImage) {
      // Delete old banner image if it exists
      if (trip.bannerImage) {
        const oldImagePath = path.join(__dirname, "..", trip.bannerImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      req.body.bannerImage = handleFileUpload(req.files.bannerImage[0], "trips");
    }
    
    // Handle accommodation images
    const accommodationImages = ['sharedImage', 'privateImage', 'campingImage', 'glampingImage'];
    accommodationImages.forEach(imgType => {
      if (req.files && req.files[imgType]) {
        if (!req.body.accommodation) req.body.accommodation = {};
        
        // Delete old image if it exists
        if (trip.accommodation && trip.accommodation[imgType]) {
          const oldImagePath = path.join(__dirname, "..", trip.accommodation[imgType]);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        req.body.accommodation[imgType] = handleFileUpload(req.files[imgType][0], "accommodation");
      }
    });
    
    // Remove _id and __v from updateData to prevent duplicate key error
    const { _id, __v, ...dataToUpdate } = req.body;
    
    console.log("Data to update:", dataToUpdate);
    
    // Update the trip
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId, 
      dataToUpdate, 
      { new: true, runValidators: true }
    );
    
    console.log("Updated trip:", updatedTrip);
    
    res.json({ message: "Trip updated successfully", trip: updatedTrip });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this trip" });
    }

    // Delete associated images if any
    if (trip.bannerImage) {
      const imagePath = path.join(__dirname, "..", trip.bannerImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete accommodation images
    if (trip.accommodation) {
      const accommodationImages = ['sharedImage', 'privateImage', 'campingImage', 'glampingImage'];
      accommodationImages.forEach(imgType => {
        if (trip.accommodation[imgType]) {
          const imagePath = path.join(__dirname, "..", trip.accommodation[imgType]);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      });
    }

    await Trip.findByIdAndDelete(tripId);

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Publish a trip (change status to published and set publishedDate)
exports.publishTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to publish this trip" });
    }

    // Validate required fields before publishing
    if (!trip.tripTitle || !trip.description || !trip.destination || !trip.tripCategory) {
      return res.status(400).json({ message: "Please fill all required fields before publishing" });
    }

    // Validate pricing
    const pricing = trip.pricing || {};
    const hasBasePrice = trip.basePrice > 0;
    const computedTotal = 
      (pricing.accommodation || 0) + 
      (pricing.transportation || 0) + 
      (pricing.activities || 0) + 
      ((pricing.accommodation || 0) * (pricing.bufferPercentage || 10) / 100) + 
      (pricing.yourFee || 0);
    
    if (!hasBasePrice && computedTotal <= 0) {
      return res.status(400).json({ message: "Please set a valid price before publishing" });
    }

    trip.status = "published";
    trip.publishedDate = new Date();
    await trip.save();

    res.json({ message: "Trip published successfully", trip });
  } catch (error) {
    console.error("Error publishing trip:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get trips by user (for dashboard)
exports.getTripsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const trips = await Trip.find({ createdBy: userId })
      .sort({ createdAt: -1 });
      
    res.json(trips);
  } catch (error) {
    console.error("Error fetching user trips:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get trip statistics for dashboard
exports.getTripStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const totalTrips = await Trip.countDocuments({ createdBy: userId });
    const publishedTrips = await Trip.countDocuments({ 
      createdBy: userId, 
      status: "published" 
    });
    
    const trips = await Trip.find({ createdBy: userId });
    const totalBookings = trips.reduce((sum, trip) => sum + (trip.bookings || 0), 0);
    const totalRevenue = trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0);
    
    const now = new Date();
    const upcomingTrips = trips.filter(trip => 
      trip.status === "published" && 
      trip.tripStartDate && 
      new Date(trip.tripStartDate) > now
    ).length;

    res.json({
      totalTrips,
      publishedTrips,
      totalBookings,
      totalRevenue,
      upcomingTrips
    });
  } catch (error) {
    console.error("Error fetching trip stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};