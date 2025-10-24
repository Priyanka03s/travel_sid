const User = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const AdditionalQuestion = require("../models/AdditionalQuestion");
const jwt = require('jsonwebtoken');

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

exports.registerUser = async (req, res) => {
  try {
    const {
      role,
      loginMethod,
      email,
      userId,
      firstName,
      lastName,
      phone,
      gender,
      dob,
      age,
      password,
      aadhar,
      drivingLicense,
      passportId,
      language,
      profession,
      location,
      bloodGroup,
      emergencyContact,
      skills,
      currentCompany,
      groupName,
      bio,
      experience,
      tripsHosted,
      followersCount,
      tripCategory,
      nextTripDate,
      itinerary,
      tripDuration,
      setupPercentage,
      frequency,
      minFee,
      maxFee,
      additionalQuestions,
      instagram,
      youtube,
      facebook,
    } = req.body;

    // Handle file uploads
    const aadharDoc = req.files?.aadharDoc
      ? handleFileUpload(req.files.aadharDoc[0], "aadhar")
      : null;

    const drivingLicenseDoc = req.files?.drivingLicenseDoc
      ? handleFileUpload(req.files.drivingLicenseDoc[0], "driving")
      : null;

    const passportDoc = req.files?.passportDoc
      ? handleFileUpload(req.files.passportDoc[0], "passport")
      : null;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse additional questions
    let parsedQuestions = [];
    try {
      parsedQuestions = additionalQuestions ? JSON.parse(additionalQuestions) : [];
    } catch (e) {
      console.error("Error parsing additional questions:", e);
    }

    // Create user
    const newUser = new User({
      role,
      loginMethod,
      email,
      userId,
      firstName,
      lastName,
      phone,
      gender,
      dob,
      age,
      password: hashedPassword,
      aadhar,
      drivingLicense,
      passportId,
      language,
      profession,
      location,
      bloodGroup,
      emergencyContact,
      skills,
      currentCompany,
      aadharDoc,
      drivingLicenseDoc,
      passportDoc,
      groupName,
      bio,
      experience,
      tripsHosted,
      followersCount,
      tripCategory,
      nextTripDate,
      itinerary,
      tripDuration,
      setupPercentage,
      frequency,
      minFee,
      maxFee,
      additionalQuestions: parsedQuestions,
      socialLinks: {
        instagram,
        youtube,
        facebook,
      },
      // Hosts are not approved by default
      approved: role === "user" // Users auto-approved, hosts need approval
    });

    await newUser.save();

    res.status(201).json({ 
      message: "User registered successfully", 
      user: newUser,
      requiresApproval: role === "host" // Inform frontend if approval is needed
    });
  } catch (error) {
    console.error("❌ Error in registerUser:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Users (Admin Panel)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN CONTROLLER with approval check
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "❌ Invalid email" });
    }
    
    // Check if host is approved
    if (user.role === "host" && !user.approved) {
      return res.status(403).json({ 
        message: "❌ Your host account is pending approval from admin. Please contact support." 
      });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Invalid password" });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
    
    // Success response with token
    res.json({
      message: "✅ Login successful",
      token, // Add this line
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        approved: user.approved
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update User (including approval status)
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        // Business fields
        panNumber: req.body.panNumber,
        gst: req.body.gst,
        bankName: req.body.bankName,
        accountNumber: req.body.accountNumber,
        ifsc: req.body.ifsc,
        accountHolder: req.body.accountHolder,
        upi: req.body.upi,
        accountType: req.body.accountType,
        businessType: req.body.businessType,
        cin: req.body.cin,
        products: req.body.products,
        address: req.body.address,
        
        // Approval status (for admin)
        approved: req.body.approved
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Additional Questions Configuration
exports.getAdditionalQuestions = async (req, res) => {
  try {
    const questions = await AdditionalQuestion.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Additional Questions Configuration
exports.updateAdditionalQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    await AdditionalQuestion.deleteMany({});
    const inserted = await AdditionalQuestion.insertMany(questions);

    res.json({ message: "Questions updated", questions: inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle host approval (specific endpoint)
exports.toggleHostApproval = async (req, res) => {
  try {
    const { hostId } = req.params;
    const { approved } = req.body;

    const user = await User.findById(hostId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "host") {
      return res.status(400).json({ error: "User is not a host" });
    }

    user.approved = approved;
    await user.save();

    res.json({ 
      message: `Host ${approved ? 'approved' : 'disapproved'} successfully`,
      user 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.addPaymentDetails = async (req, res) => {
  try {
    const {
      userId,
      panNumber,
      gst,
      bankName,
      accountNumber,
      ifsc,
      accountHolder,
      upi,
      accountType,
      businessType,
      cin,
      products,
      address
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update payment details
    user.panNumber = panNumber;
    user.gst = gst;
    user.bankName = bankName;
    user.accountNumber = accountNumber;
    user.ifsc = ifsc;
    user.accountHolder = accountHolder;
    user.upi = upi;
    user.accountType = accountType;
    user.businessType = businessType;
    user.cin = cin;
    user.products = products;
    user.address = address;

    await user.save();

    res.json({ message: "Payment details added successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};