const AdventureSchool = require("../models/AdventureSchool");
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

// Create a new adventure school
exports.createAdventureSchool = async (req, res) => {
  try {
    let schoolData = req.body;
    const createdBy = req.user.id; // From auth middleware
    
    // Remove _id if present to avoid duplicate key error
    if (schoolData._id) {
      delete schoolData._id;
    }
    
    // Handle file uploads
    if (req.files) {
      // School images
      if (req.files.schoolImages) {
        schoolData.schoolImages = req.files.schoolImages.map(file => 
          handleFileUpload(file, "schools")
        ).filter(url => url !== null);
      }
      
      // Accreditation files
      if (req.files.accreditationFiles) {
        schoolData.accreditationFiles = req.files.accreditationFiles.map(file => 
          handleFileUpload(file, "accreditations")
        ).filter(url => url !== null);
      }
      
      // ID proof
      if (req.files.idProof) {
        schoolData.idProof = handleFileUpload(req.files.idProof[0], "id-proofs");
      }
      
      // Package images
      if (req.files.packageImages) {
        // Assuming packageImages is an array of files with package index in the name
        const packageImages = {};
        req.files.packageImages.forEach(file => {
          const parts = file.fieldname.split('-');
          if (parts.length >= 2) {
            const pkgIndex = parts[1];
            if (!packageImages[pkgIndex]) packageImages[pkgIndex] = [];
            packageImages[pkgIndex].push(file);
          }
        });
        
        // Update packages with images
        if (schoolData.packages) {
          schoolData.packages.forEach((pkg, index) => {
            if (packageImages[index]) {
              pkg.images = packageImages[index].map(file => 
                handleFileUpload(file, "packages")
              ).filter(url => url !== null);
            }
          });
        }
      }
    }
    
    // Create the adventure school
    const school = new AdventureSchool({
      ...schoolData,
      createdBy
    });
    
    await school.save();
    res.status(201).json({ 
      message: "Adventure school created successfully", 
      school,
      id: school._id 
    });
  } catch (error) {
    console.error("Error creating adventure school:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all adventure schools (with filtering)
exports.getAdventureSchools = async (req, res) => {
  try {
    const { status, createdBy, adventureType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (createdBy) filter.createdBy = createdBy;
    if (adventureType) filter.adventureTypes = { $in: [adventureType] };

    const schools = await AdventureSchool.find(filter)
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });
      
    res.json(schools);
  } catch (error) {
    console.error("Error fetching adventure schools:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single adventure school by ID
exports.getAdventureSchoolById = async (req, res) => {
  try {
    const school = await AdventureSchool.findById(req.params.id)
      .populate("createdBy", "firstName lastName email");
      
    if (!school) {
      return res.status(404).json({ message: "Adventure school not found" });
    }
    
    res.json(school);
  } catch (error) {
    console.error("Error fetching adventure school:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an adventure school
exports.updateAdventureSchool = async (req, res) => {
  try {
    const schoolId = req.params.id;
    
    // Check if the school exists and the user is the creator
    const school = await AdventureSchool.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "Adventure school not found" });
    }
    if (school.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this school" });
    }
    
    // Handle file uploads
    if (req.files) {
      // School images
      if (req.files.schoolImages) {
        // Delete old images if they exist
        if (school.schoolImages && school.schoolImages.length > 0) {
          school.schoolImages.forEach(imagePath => {
            const oldImagePath = path.join(__dirname, "..", imagePath);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          });
        }
        
        req.body.schoolImages = req.files.schoolImages.map(file => 
          handleFileUpload(file, "schools")
        ).filter(url => url !== null);
      }
      
      // Accreditation files
      if (req.files.accreditationFiles) {
        // Delete old files if they exist
        if (school.accreditationFiles && school.accreditationFiles.length > 0) {
          school.accreditationFiles.forEach(filePath => {
            const oldFilePath = path.join(__dirname, "..", filePath);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          });
        }
        
        req.body.accreditationFiles = req.files.accreditationFiles.map(file => 
          handleFileUpload(file, "accreditations")
        ).filter(url => url !== null);
      }
      
      // ID proof
      if (req.files.idProof) {
        // Delete old file if it exists
        if (school.idProof) {
          const oldFilePath = path.join(__dirname, "..", school.idProof);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        
        req.body.idProof = handleFileUpload(req.files.idProof[0], "id-proofs");
      }
      
      // Package images
      if (req.files.packageImages) {
        const packageImages = {};
        req.files.packageImages.forEach(file => {
          const parts = file.fieldname.split('-');
          if (parts.length >= 2) {
            const pkgIndex = parts[1];
            if (!packageImages[pkgIndex]) packageImages[pkgIndex] = [];
            packageImages[pkgIndex].push(file);
          }
        });
        
        // Update packages with images
        if (req.body.packages) {
          req.body.packages.forEach((pkg, index) => {
            if (packageImages[index]) {
              // Delete old images if they exist
              if (school.packages[index] && school.packages[index].images) {
                school.packages[index].images.forEach(imagePath => {
                  const oldImagePath = path.join(__dirname, "..", imagePath);
                  if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                  }
                });
              }
              
              pkg.images = packageImages[index].map(file => 
                handleFileUpload(file, "packages")
              ).filter(url => url !== null);
            }
          });
        }
      }
    }
    
    // Remove _id and __v from updateData to prevent duplicate key error
    const { _id, __v, ...dataToUpdate } = req.body;
    
    // Update lastUpdated timestamp
    dataToUpdate.lastUpdated = new Date();
    
    // Update the adventure school
    const updatedSchool = await AdventureSchool.findByIdAndUpdate(
      schoolId, 
      dataToUpdate, 
      { new: true, runValidators: true }
    );
    
    res.json({ message: "Adventure school updated successfully", school: updatedSchool });
  } catch (error) {
    console.error("Error updating adventure school:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete an adventure school
exports.deleteAdventureSchool = async (req, res) => {
  try {
    const schoolId = req.params.id;

    const school = await AdventureSchool.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "Adventure school not found" });
    }

    if (school.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this school" });
    }

    // Delete associated files if any
    if (school.schoolImages && school.schoolImages.length > 0) {
      school.schoolImages.forEach(imagePath => {
        const pathToDelete = path.join(__dirname, "..", imagePath);
        if (fs.existsSync(pathToDelete)) {
          fs.unlinkSync(pathToDelete);
        }
      });
    }

    if (school.accreditationFiles && school.accreditationFiles.length > 0) {
      school.accreditationFiles.forEach(filePath => {
        const pathToDelete = path.join(__dirname, "..", filePath);
        if (fs.existsSync(pathToDelete)) {
          fs.unlinkSync(pathToDelete);
        }
      });
    }

    if (school.idProof) {
      const pathToDelete = path.join(__dirname, "..", school.idProof);
      if (fs.existsSync(pathToDelete)) {
        fs.unlinkSync(pathToDelete);
      }
    }

    // Delete package images
    if (school.packages && school.packages.length > 0) {
      school.packages.forEach(pkg => {
        if (pkg.images && pkg.images.length > 0) {
          pkg.images.forEach(imagePath => {
            const pathToDelete = path.join(__dirname, "..", imagePath);
            if (fs.existsSync(pathToDelete)) {
              fs.unlinkSync(pathToDelete);
            }
          });
        }
      });
    }

    await AdventureSchool.findByIdAndDelete(schoolId);

    res.json({ message: "Adventure school deleted successfully" });
  } catch (error) {
    console.error("Error deleting adventure school:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Publish an adventure school (change status to published and set publishedDate)
exports.publishAdventureSchool = async (req, res) => {
  try {
    const schoolId = req.params.id;

    const school = await AdventureSchool.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "Adventure school not found" });
    }

    if (school.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to publish this school" });
    }

    // Validate required fields before publishing
    if (!school.schoolName || !school.schoolDescription || !school.contactEmail) {
      return res.status(400).json({ message: "Please fill all required fields before publishing" });
    }

    school.status = "published";
    school.publishedDate = new Date();
    school.lastUpdated = new Date();
    await school.save();

    res.json({ message: "Adventure school published successfully", school });
  } catch (error) {
    console.error("Error publishing adventure school:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get adventure schools by user (for dashboard) - Fixed
exports.getAdventureSchoolsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching schools for user:", userId);
    
    const schools = await AdventureSchool.find({ createdBy: userId })
      .sort({ createdAt: -1 });
      
    console.log("Found schools:", schools.length);
    res.json(schools);
  } catch (error) {
    console.error("Error fetching user adventure schools:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get adventure school statistics for dashboard
exports.getAdventureSchoolStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const totalSchools = await AdventureSchool.countDocuments({ createdBy: userId });
    const publishedSchools = await AdventureSchool.countDocuments({ 
      createdBy: userId, 
      status: "published" 
    });
    
    const schools = await AdventureSchool.find({ createdBy: userId });
    
    // Calculate total packages across all schools
    const totalPackages = schools.reduce((sum, school) => 
      sum + (school.packages ? school.packages.length : 0), 0
    );
    
    // Calculate average rating across all testimonials
    let totalRating = 0;
    let testimonialCount = 0;
    
    schools.forEach(school => {
      if (school.testimonials && school.testimonials.length > 0) {
        school.testimonials.forEach(testimonial => {
          totalRating += testimonial.rating;
          testimonialCount++;
        });
      }
    });
    
    const averageRating = testimonialCount > 0 ? totalRating / testimonialCount : 0;

    res.json({
      totalSchools,
      publishedSchools,
      totalPackages,
      averageRating: averageRating.toFixed(1)
    });
  } catch (error) {
    console.error("Error fetching adventure school stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};