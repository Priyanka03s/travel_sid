const Event = require("../models/Event");
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

// Helper function to handle stop images in structured itinerary
const handleStopImages = (structuredItinerary) => {
  if (!structuredItinerary) return structuredItinerary;
  return structuredItinerary.map(day => {
    if (!day.stops) return day;
    day.stops = day.stops.map(stop => {
      if (stop.image && stop.image.startsWith('data:image')) {
        const base64Data = stop.image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const uploadDir = path.join(__dirname, "../uploads", "stop-images");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = stop.image.match(/image\/(\w+)/)[1];
        const filename = `stop-${uniqueSuffix}.${ext}`;
        const filepath = path.join(uploadDir, filename);
        try {
          fs.writeFileSync(filepath, buffer);
          stop.image = `/uploads/stop-images/${filename}`;
        } catch (err) {
          console.error("Error saving stop image:", err);
          stop.image = null;
        }
      }
      return stop;
    });
    return day;
  });
};

// Helper function to handle accommodation images
const handleAccommodationImages = (req, eventData) => {
  if (!eventData.accommodationOptions) return eventData;
  
  // Handle shared room image
  if (req.files && req.files.sharedRoomImage) {
    if (!eventData.accommodationOptions.sharedRoom) {
      eventData.accommodationOptions.sharedRoom = {};
    }
    eventData.accommodationOptions.sharedRoom.image = handleFileUpload(
      req.files.sharedRoomImage[0], 
      "accommodation"
    );
  }
  
  // Handle private room image
  if (req.files && req.files.privateRoomImage) {
    if (!eventData.accommodationOptions.privateRoom) {
      eventData.accommodationOptions.privateRoom = {};
    }
    eventData.accommodationOptions.privateRoom.image = handleFileUpload(
      req.files.privateRoomImage[0], 
      "accommodation"
    );
  }
  
  // Handle camping image
  if (req.files && req.files.campingImage) {
    if (!eventData.accommodationOptions.camping) {
      eventData.accommodationOptions.camping = {};
    }
    eventData.accommodationOptions.camping.image = handleFileUpload(
      req.files.campingImage[0], 
      "accommodation"
    );
  }
  
  // Handle glamping image
  if (req.files && req.files.glampingImage) {
    if (!eventData.accommodationOptions.glamping) {
      eventData.accommodationOptions.glamping = {};
    }
    eventData.accommodationOptions.glamping.image = handleFileUpload(
      req.files.glampingImage[0], 
      "accommodation"
    );
  }
  
  return eventData;
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    let eventData = req.body;
    const createdBy = req.user.id; // From auth middleware
    
    // Remove _id if present to avoid duplicate key error
    if (eventData._id) {
      delete eventData._id;
    }
    
    // Handle event image upload
    if (req.files && req.files.eventImage) {
      eventData.eventImage = handleFileUpload(req.files.eventImage[0], "events");
    }
    
    // Handle accommodation images
    eventData = handleAccommodationImages(req, eventData);
    
    // Convert date strings to Date objects
    if (eventData.startDate) {
      eventData.startDate = new Date(eventData.startDate);
    }
    if (eventData.endDate) {
      eventData.endDate = new Date(eventData.endDate);
    }
    
    // Parse structured itinerary if it exists
    if (eventData.structuredItinerary) {
      try {
        // Check if structuredItinerary is already an object
        if (typeof eventData.structuredItinerary === 'string') {
          eventData.structuredItinerary = JSON.parse(eventData.structuredItinerary);
        }
        
        // Handle stop images
        eventData.structuredItinerary = handleStopImages(eventData.structuredItinerary);
        
        // Convert date strings to Date objects in structured itinerary
        eventData.structuredItinerary = eventData.structuredItinerary.map(day => {
          if (day.date) {
            day.date = new Date(day.date);
          }
          return day;
        });
      } catch (err) {
        console.error("Error parsing structured itinerary:", err);
        console.error("Received structuredItinerary:", eventData.structuredItinerary);
        return res.status(400).json({ 
          message: "Invalid structured itinerary format",
          error: err.message 
        });
      }
    }
    
    // Create the event
    const event = new Event({
      ...eventData,
      createdBy
    });
    await event.save();
    res.status(201).json({ 
      message: "Event created successfully", 
      event,
      id: event._id 
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all events (with filtering)
exports.getEvents = async (req, res) => {
  try {
    const { status, createdBy, groupType, eventCategory } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (createdBy) filter.createdBy = createdBy;
    if (groupType) filter.groupType = groupType;
    if (eventCategory) filter.eventCategory = eventCategory;

    const events = await Event.find(filter)
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });
      
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "firstName lastName email");
      
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Check if the event exists and the user is the creator
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this event" });
    }
    
    // Handle event image update if a new file is uploaded
    if (req.files && req.files.eventImage) {
      // Delete old event image if it exists
      if (event.eventImage) {
        const oldImagePath = path.join(__dirname, "..", event.eventImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      req.body.eventImage = handleFileUpload(req.files.eventImage[0], "events");
    }
    
    // Handle accommodation images
    req.body = handleAccommodationImages(req, req.body);
    
    // Remove _id and __v from updateData to prevent duplicate key error
    const { _id, __v, ...dataToUpdate } = req.body;
    
    // Convert date strings to Date objects
    if (dataToUpdate.startDate) {
      dataToUpdate.startDate = new Date(dataToUpdate.startDate);
    }
    if (dataToUpdate.endDate) {
      dataToUpdate.endDate = new Date(dataToUpdate.endDate);
    }
    
    // Parse structured itinerary if it exists
    if (dataToUpdate.structuredItinerary) {
      try {
        // Check if structuredItinerary is already an object
        if (typeof dataToUpdate.structuredItinerary === 'string') {
          dataToUpdate.structuredItinerary = JSON.parse(dataToUpdate.structuredItinerary);
        }
        
        // Handle stop images
        dataToUpdate.structuredItinerary = handleStopImages(dataToUpdate.structuredItinerary);
        
        // Convert date strings to Date objects in structured itinerary
        dataToUpdate.structuredItinerary = dataToUpdate.structuredItinerary.map(day => {
          if (day.date) {
            day.date = new Date(day.date);
          }
          return day;
        });
      } catch (err) {
        console.error("Error parsing structured itinerary:", err);
        console.error("Received structuredItinerary:", dataToUpdate.structuredItinerary);
        return res.status(400).json({ 
          message: "Invalid structured itinerary format",
          error: err.message 
        });
      }
    }
    
    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId, 
      dataToUpdate, 
      { new: true, runValidators: true }
    );
    
    res.json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    // Delete associated images if any
    if (event.eventImage) {
      const imagePath = path.join(__dirname, "..", event.eventImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete accommodation images
    if (event.accommodationOptions) {
      const accommodationOptions = event.accommodationOptions;
      
      if (accommodationOptions.sharedRoom && accommodationOptions.sharedRoom.image) {
        const imagePath = path.join(__dirname, "..", accommodationOptions.sharedRoom.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      if (accommodationOptions.privateRoom && accommodationOptions.privateRoom.image) {
        const imagePath = path.join(__dirname, "..", accommodationOptions.privateRoom.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      if (accommodationOptions.camping && accommodationOptions.camping.image) {
        const imagePath = path.join(__dirname, "..", accommodationOptions.camping.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      if (accommodationOptions.glamping && accommodationOptions.glamping.image) {
        const imagePath = path.join(__dirname, "..", accommodationOptions.glamping.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    // Delete stop images
    if (event.structuredItinerary) {
      event.structuredItinerary.forEach(day => {
        if (day.stops) {
          day.stops.forEach(stop => {
            if (stop.image && !stop.image.startsWith('data:image')) {
              const imagePath = path.join(__dirname, "..", stop.image);
              if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
              }
            }
          });
        }
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Publish an event (change status to published and set publishedDate)
exports.publishEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to publish this event" });
    }

    // Validate required fields before publishing
    if (!event.eventTitle || !event.eDescription) {
      return res.status(400).json({ message: "Please fill all required fields before publishing" });
    }

    // Validate pricing
    const pricing = event.pricing || {};
    const hasBasePrice = pricing.basePrice > 0;
    
    const accommodationSum = pricing.accommodationItems?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;
    const transportationSum = pricing.transportationItems?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;
    const activitiesSum = pricing.activityItems?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;
    
    const computedTotal = 
      accommodationSum + 
      transportationSum + 
      activitiesSum + 
      (pricing.visaRegFee || 0) + 
      (pricing.customField || 0) + 
      (pricing.commission || 0) + 
      (pricing.pgCharges || 0) +
      ((accommodationSum + transportationSum + activitiesSum + (pricing.visaRegFee || 0) + (pricing.customField || 0)) * (pricing.bufferPercentage || 0) / 100) + 
      (pricing.yourFee || 0);
    
    if (!hasBasePrice && computedTotal <= 0) {
      return res.status(400).json({ message: "Please set a valid price before publishing" });
    }

    event.status = "published";
    event.publishedDate = new Date();
    await event.save();

    res.json({ message: "Event published successfully", event });
  } catch (error) {
    console.error("Error publishing event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get events by user (for dashboard)
exports.getEventsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Event.find({ createdBy: userId })
      .sort({ createdAt: -1 });
      
    res.json(events);
  } catch (error) {
    console.error("Error fetching user events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get event statistics for dashboard
exports.getEventStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const totalEvents = await Event.countDocuments({ createdBy: userId });
    const publishedEvents = await Event.countDocuments({ 
      createdBy: userId, 
      status: "published" 
    });
    
    const events = await Event.find({ createdBy: userId });
    const totalBookings = events.reduce((sum, event) => sum + (event.bookings || 0), 0);
    const totalRevenue = events.reduce((sum, event) => sum + (event.revenue || 0), 0);
    
    const now = new Date();
    const upcomingEvents = events.filter(event => 
      event.status === "published" && 
      event.startDate && 
      new Date(event.startDate) > now
    ).length;

    res.json({
      totalEvents,
      publishedEvents,
      totalBookings,
      totalRevenue,
      upcomingEvents
    });
  } catch (error) {
    console.error("Error fetching event stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};