// const express = require("express");
// const {
//   registerUser,
//   getUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   addPaymentDetails,
//   loginUser,
//   getAdditionalQuestions,
//   updateAdditionalQuestions,
// } = require("../Controller/userController");

// const router = express.Router();

// // For file uploads
// const multer = require("multer");
// const upload = multer({ 
//   dest: "uploads/temp/",
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   }
// });

// // Routes
// router.post("/register", upload.fields([
//   { name: "aadharDoc", maxCount: 1 },
//   { name: "drivingLicenseDoc", maxCount: 1 },
//   { name: "passportDoc", maxCount: 1 }
// ]), registerUser);

// router.get("/", getUsers);
// router.get("/:id", getUserById);
// router.put("/:id", updateUser);
// router.delete("/:id", deleteUser);
// // router.post("/payment", addPaymentDetails);
// router.post("/login", loginUser);

// // Additional question endpoints
// router.get("/additional-questions", getAdditionalQuestions);
// router.post("/additional-questions", updateAdditionalQuestions);

// module.exports = router;


const express = require("express");
const {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getAdditionalQuestions,
  updateAdditionalQuestions,
  toggleHostApproval,
  addPaymentDetails // Add this import
} = require("../Controller/userController");

const router = express.Router();

// For file uploads
const multer = require("multer");
const upload = multer({ 
  dest: "uploads/temp/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

// Routes
router.post("/register", upload.fields([
  { name: "aadharDoc", maxCount: 1 },
  { name: "drivingLicenseDoc", maxCount: 1 },
  { name: "passportDoc", maxCount: 1 }
]), registerUser);

// Static routes first
router.get("/additional-questions", getAdditionalQuestions);
router.post("/additional-questions", updateAdditionalQuestions);

// Payment details route
router.post("/payment", addPaymentDetails); // Add this route

// Host approval route
router.patch("/:hostId/approval", toggleHostApproval);

// Dynamic routes after static ones
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Other routes
router.get("/", getUsers);
router.post("/login", loginUser);

module.exports = router;