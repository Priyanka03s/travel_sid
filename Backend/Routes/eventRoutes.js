// routes/eventRoutes.js
const express = require("express");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  publishEvent,
  getEventsByUser,
  getEventStats
} = require("../Controller/eventController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// For file uploads
const multer = require("multer");
const upload = multer({ 
  dest: "uploads/temp/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// All routes require authentication
router.use(protect);

router.post("/", upload.fields([
  { name: "eventImage", maxCount: 1 },
  { name: "sharedRoomImage", maxCount: 1 },
  { name: "privateRoomImage", maxCount: 1 }
]), createEvent);

router.get("/", getEvents);
router.get("/user", getEventsByUser);
router.get("/stats", getEventStats);
router.get("/:id", getEventById);
router.put("/:id", upload.fields([
  { name: "eventImage", maxCount: 1 },
  { name: "sharedRoomImage", maxCount: 1 },
  { name: "privateRoomImage", maxCount: 1 }
]), updateEvent);
router.delete("/:id", deleteEvent);
router.patch("/:id/publish", publishEvent);

module.exports = router;