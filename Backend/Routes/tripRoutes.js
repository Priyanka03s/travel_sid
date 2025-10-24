const express = require("express");
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  publishTrip,
  getTripsByUser,
  getTripStats
} = require("../Controller/tripController");
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
  { name: "bannerImage", maxCount: 1 },
  { name: "sharedImage", maxCount: 1 },
  { name: "privateImage", maxCount: 1 },
  { name: "campingImage", maxCount: 1 },
  { name: "glampingImage", maxCount: 1 }
]), createTrip);

router.get("/", getTrips);
router.get("/user", getTripsByUser);
router.get("/stats", getTripStats);
router.get("/:id", getTripById);
router.put("/:id", upload.fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "sharedImage", maxCount: 1 },
  { name: "privateImage", maxCount: 1 },
  { name: "campingImage", maxCount: 1 },
  { name: "glampingImage", maxCount: 1 }
]), updateTrip);
router.delete("/:id", deleteTrip);
router.patch("/:id/publish", publishTrip);

module.exports = router;