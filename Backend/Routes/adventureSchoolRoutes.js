const express = require("express");
const {
  createAdventureSchool,
  getAdventureSchools,
  getAdventureSchoolById,
  updateAdventureSchool,
  deleteAdventureSchool,
  publishAdventureSchool,
  getAdventureSchoolsByUser,
  getAdventureSchoolStats
} = require("../Controller/adventureSchoolController");
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

// Define fields for file uploads
const fileUploadFields = [
  { name: 'schoolImages', maxCount: 10 },
  { name: 'accreditationFiles', maxCount: 5 },
  { name: 'idProof', maxCount: 1 },
  { name: 'packageImages', maxCount: 50 }
];

router.post("/", upload.fields(fileUploadFields), createAdventureSchool);
router.get("/", getAdventureSchools);
router.get("/user", getAdventureSchoolsByUser);
router.get("/stats", getAdventureSchoolStats);
router.get("/:id", getAdventureSchoolById);
router.put("/:id", upload.fields(fileUploadFields), updateAdventureSchool);
router.delete("/:id", deleteAdventureSchool);
router.patch("/:id/publish", publishAdventureSchool);

module.exports = router;