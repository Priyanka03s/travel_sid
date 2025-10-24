// server.js or index.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const path = require("path");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
try {
  app.use("/api/field-configurations", require("./Routes/fieldConfigurationRoutes"));
  app.use("/api/users", require("./Routes/userRoutes"));
  app.use("/api/trips", require("./Routes/tripRoutes"));
  app.use("/api/events", require("./Routes/eventRoutes"));
  app.use("/api/adventure-schools", require("./Routes/adventureSchoolRoutes"));
  app.use("/api/payments", require("./Routes/paymentRoutes"));
  app.use("/api/bookings", require("./Routes/bookingRoutes")); // Ensure this line is present
} catch (error) {
  console.error("Error loading routes:", error);
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: 'Travel running!' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});