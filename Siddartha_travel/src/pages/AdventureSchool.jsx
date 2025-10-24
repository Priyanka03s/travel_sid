// src/pages/AdventureSchool.js
import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { 
  FiImage, 
  FiUpload, 
  FiX, 
  FiPlus, 
  FiTrash2, 
  FiChevronDown, 
  FiChevronUp, 
  FiMapPin, 
  FiCalendar, 
  FiUsers, 
  FiDollarSign, 
  FiStar,
  FiHome,
  FiBook,  
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiCheck,
  FiAlertCircle,
  FiVideo,
  FiActivity,
  FiTrendingUp,
  FiClock
} from "react-icons/fi";
import api from "../services/api";

const AdventureSchoolForm = () => {
  const navigate = useNavigate();
  const { schoolId } = useParams();
  const location = useLocation();
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState([]);
  const [selectedSubServiceTypes, setSelectedSubServiceTypes] = useState([]);
  const [selectedAdventureTypes, setSelectedAdventureTypes] = useState([]);
  const [otherServices, setOtherServices] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSubDropdown, setShowSubDropdown] = useState(false);
  const [showAdventureDropdown, setShowAdventureDropdown] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  
  // Refs for dropdown containers
  const serviceDropdownRef = useRef(null);
  const subServiceDropdownRef = useRef(null);
  const adventureDropdownRef = useRef(null);

  // Bike rental pricing state
  const [selectedBikeTypes, setSelectedBikeTypes] = useState([]);
  const [pricingDuration, setPricingDuration] = useState("hour");
  const [bikePrice, setBikePrice] = useState("");
  const [bikeRentalPrices, setBikeRentalPrices] = useState({});
  const [showBikePricing, setShowBikePricing] = useState(false);
  
  // Bike rental timing state
  const [bikeRentalTimings, setBikeRentalTimings] = useState({
    operatingHours: {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: false },
      saturday: { open: "09:00", close: "18:00", closed: false },
      sunday: { open: "09:00", close: "18:00", closed: false }
    },
    advanceBookingRequired: false,
    minAdvanceHours: "",
    sameDayReturn: true,
    overnightAllowed: false,
    overnightFee: ""
  });
  
  // Adventure Schools Pricing
  const [adventureSchoolPricing, setAdventureSchoolPricing] = useState({
    basePrice: "",
    groupDiscount: "",
    minGroupSize: "",
    seasonalPricing: {
      peak: false,
      offPeak: false
    },
    bulkPricing: []
  });
  
  // Stay Rooms Pricing
  const [stayRoomsPricing, setStayRoomsPricing] = useState({
    basePrice: "",
    weeklyDiscount: "",
    monthlyDiscount: "",
    extraPersonFee: "",
    additionalFees: {
      cleaning: false,
      resort: false
    },
    bulkPricing: []
  });
  
  // Food Providers Pricing
  const [foodProvidersPricing, setFoodProvidersPricing] = useState({
    basePrice: "",
    comboDiscount: "",
    deliveryFee: "",
    specialPricing: {
      happyHour: false,
      earlyBird: false
    },
    bulkDiscount: {
      fivePlus: "",
      tenPlus: "",
      twentyPlus: ""
    },
    bulkPricing: []
  });

  // Service types configuration with subcategories and adventure types
  const serviceTypes = [
    {
      id: "adventureSchools",
      name: "Adventure Schools",
      subCategories: [
        { 
          id: "landAdventures", 
          name: "Land Adventures",
          adventureTypes: [
            { id: "trekking", name: "Trekking / Hiking" },
            { id: "camping", name: "Camping" },
            { id: "rock-climbing", name: "Rock Climbing / Bouldering" },
            { id: "mountaineering", name: "Mountaineering" },
            { id: "ziplining", name: "Ziplining / Rope Courses" },
            { id: "cycling", name: "Cycling / Mountain Biking" }
          ]
        },
        { 
          id: "waterAdventures", 
          name: "Water Adventures",
          adventureTypes: [
            { id: "surfing", name: "Surfing" },
            { id: "scuba", name: "Scuba Diving" },
            { id: "snorkeling", name: "Snorkeling" },
            { id: "kayaking", name: "Kayaking" },
            { id: "rafting", name: "Rafting" },
            { id: "canoeing", name: "Canoeing" },
            { id: "sailing", name: "Sailing" },
            { id: "jet-skiing", name: "Jet Skiing" }
          ]
        },
        { 
          id: "airAdventures", 
          name: "Air Adventures",
          adventureTypes: [
            { id: "paragliding", name: "Paragliding" },
            { id: "parasailing", name: "Parasailing" },
            { id: "hot-air-ballooning", name: "Hot Air Ballooning" },
            { id: "skydiving", name: "Skydiving" },
            { id: "microlight-flying", name: "Microlight Flying" }
          ]
        },
        { 
          id: "mixedAdventures", 
          name: "Mixed / Others",
          adventureTypes: [
            { id: "wildlife-safari", name: "Wildlife Safari" },
            { id: "desert-safari", name: "Desert Safari" },
            { id: "adventure-parks", name: "Adventure Parks / Obstacle Courses" }
          ]
        }
      ]
    },
    {
      id: "bikeRentals",
      name: "Bike Rentals",
      subCategories: [
        { 
          id: "motorbikes", 
          name: "Motorbikes",
          adventureTypes: [
            { id: "cruiser", name: "Cruiser (e.g., Royal Enfield, Harley)" },
            { id: "sports-bikes", name: "Sports Bikes" },
            { id: "dirt-bikes", name: "Dirt / Off-road Bikes" },
            { id: "scooters", name: "Scooters / Mopeds" },
            { id: "adventure-touring", name: "Adventure Touring Bikes" }
          ]
        },
        { 
          id: "bicycles", 
          name: "Bicycles",
          adventureTypes: [
            { id: "mountain-bikes", name: "Mountain Bikes (MTB)" },
            { id: "road-bikes", name: "Road Bikes" },
            { id: "hybrid-bikes", name: "Hybrid Bikes" },
            { id: "fat-bikes", name: "Fat Bikes" },
            { id: "tandem-bikes", name: "Tandem / Specialty Bikes" }
          ]
        },
        { 
          id: "electricVehicles", 
          name: "Electric Vehicles",
          adventureTypes: [
            { id: "e-bikes", name: "E-Bikes" },
            { id: "e-scooters", name: "E-Scooters" }
          ]
        }
      ]
    },
    {
      id: "stayRooms",
      name: "Stay Rooms",
      subCategories: [
        { 
          id: "budgetStay", 
          name: "Budget Stay",
          adventureTypes: [
            { id: "hostels", name: "Hostels" },
            { id: "guest-houses", name: "Guest Houses" },
            { id: "homestays", name: "Homestays" }
          ]
        },
        { 
          id: "premiumStay", 
          name: "Premium Stay",
          adventureTypes: [
            { id: "hotels", name: "Hotels" },
            { id: "resorts", name: "Resorts" },
            { id: "boutique-stays", name: "Boutique Stays" },
            { id: "serviced-apartments", name: "Serviced Apartments" }
          ]
        },
        { 
          id: "uniqueStay", 
          name: "Unique / Alternative Stay",
          adventureTypes: [
            { id: "farm-stays", name: "Farm Stays" },
            { id: "treehouses", name: "Treehouses" },
            { id: "cottages", name: "Cottages" },
            { id: "camping-tents", name: "Camping Tents" },
            { id: "glamping-domes", name: "Glamping Domes" },
            { id: "houseboats", name: "Houseboats" }
          ]
        }
      ]
    },
    {
      id: "foodProviders",
      name: "Food Providers",
      subCategories: [
        { 
          id: "restaurantsCafes", 
          name: "Restaurants & Cafes",
          adventureTypes: [
            { id: "fine-dining", name: "Fine Dining" },
            { id: "casual-dining", name: "Casual Dining" },
            { id: "cafes", name: "Cafés / Coffee Shops" },
            { id: "street-food", name: "Street Food Vendors" }
          ]
        },
        { 
          id: "specialtyCuisine", 
          name: "Specialty Cuisine",
          adventureTypes: [
            { id: "vegetarian", name: "Vegetarian / Vegan" },
            { id: "seafood", name: "Seafood" },
            { id: "regional-cuisine", name: "Regional Cuisine (South Indian, North Indian, etc.)" },
            { id: "international", name: "International (Italian, Chinese, Continental, etc.)" }
          ]
        },
        { 
          id: "foodExperiences", 
          name: "Food Experiences",
          adventureTypes: [
            { id: "food-festivals", name: "Food Festivals" },
            { id: "cooking-classes", name: "Cooking Classes" },
            { id: "farm-to-table", name: "Farm-to-Table Experiences" },
            { id: "wine-tasting", name: "Wine / Beer Tasting" }
          ]
        },
        { 
          id: "cloudDelivery", 
          name: "Cloud / Delivery Only",
          adventureTypes: [
            { id: "cloud-kitchens", name: "Cloud Kitchens" },
            { id: "tiffin-services", name: "Tiffin / Meal Subscriptions" }
          ]
        }
      ]
    }
  ];

  // Helper function to get all bike types
  const getAllBikeTypes = () => {
    const bikeRentalsService = serviceTypes.find(t => t.id === 'bikeRentals');
    if (!bikeRentalsService) return [];
    
    let bikeTypes = [];
    bikeRentalsService.subCategories.forEach(sub => {
      bikeTypes = [...bikeTypes, ...sub.adventureTypes];
    });
    return bikeTypes;
  };

  // Function to get the provider name dynamically
  const getProviderName = () => {
    if (selectedServiceTypes.length === 0) return "Service Provider";
    
    const serviceNames = selectedServiceTypes.map(typeId => {
      const service = serviceTypes.find(t => t.id === typeId);
      return service ? service.name : "";
    }).filter(name => name);
    
    return serviceNames.length > 0 ? serviceNames.join(", ") : "Service Provider";
  };

  // Initialize packages based on selected service types
  const initializePackages = () => {
    const basePackage = {
      id: `pkg-${Date.now()}`,
      title: "",
      shortDescription: "",
      images: [],
      price: "",
      priceUnit: "perPerson",
      faqs: [{ question: "", answer: "" }],
      serviceType: selectedServiceTypes.length > 0 ? selectedServiceTypes[0] : "",
      subServiceType: "",
      adventureType: ""
    };

    return [basePackage];
  };

  const [packages, setPackages] = useState(initializePackages());

  // Update packages when service types change
  useEffect(() => {
    setPackages(initializePackages());
  }, [selectedServiceTypes]);

  // Get current subcategories based on selected service types
  const getCurrentSubCategories = () => {
    if (selectedServiceTypes.length === 0) return [];
    
    const allSubCategories = [];
    selectedServiceTypes.forEach(typeId => {
      const service = serviceTypes.find(t => t.id === typeId);
      if (service) {
        allSubCategories.push(...service.subCategories);
      }
    });
    
    return allSubCategories;
  };

  // Get current adventure types based on selected subcategories
  const getCurrentAdventureTypes = () => {
    if (selectedSubServiceTypes.length === 0) return [];
    
    const allAdventureTypes = [];
    selectedSubServiceTypes.forEach(subId => {
      serviceTypes.forEach(service => {
        const sub = service.subCategories.find(s => s.id === subId);
        if (sub) {
          allAdventureTypes.push(...sub.adventureTypes);
        }
      });
    });
    
    return allAdventureTypes;
  };

  // Normalize package data to ensure all required properties exist
  const normalizePackage = (pkg, serviceType, adventureType) => {
    const basePackage = {
      ...pkg,
      id: pkg.id || `pkg-${Date.now()}-${Math.random()}`,
      title: pkg.title || "",
      shortDescription: pkg.shortDescription || "",
      images: pkg.images ? pkg.images.map(img => 
        typeof img === 'string' ? { url: img, name: 'Image' } : img
      ) : [],
      price: pkg.price || "",
      faqs: pkg.faqs || [{ question: "", answer: "" }],
      serviceType: pkg.serviceType || serviceType,
      subServiceType: pkg.subServiceType || "",
      adventureType: pkg.adventureType || adventureType
    };

    switch(pkg.serviceType) {
      case "adventureSchools":
        return {
          ...basePackage,
          adventureType: pkg.adventureType || adventureType,
          detailedItinerary: pkg.detailedItinerary || "",
          skillLevel: pkg.skillLevel || "beginner",
          duration: pkg.duration || "",
          durationUnit: pkg.durationUnit || "hours",
          minParticipants: pkg.minParticipants || "",
          maxParticipants: pkg.maxParticipants || "",
          minAge: pkg.minAge || "",
          maxAge: pkg.maxAge || "",
          season: pkg.season || [],
          startLocation: pkg.startLocation || "",
          endLocation: pkg.endLocation || "",
          accommodation: pkg.accommodation || "",
          foodDetails: pkg.foodDetails || "",
          gearProvided: pkg.gearProvided || "",
          whatToBring: pkg.whatToBring || "",
          safetyInfo: pkg.safetyInfo || "",
          insuranceOptions: pkg.insuranceOptions || "",
          cancellationPolicy: pkg.cancellationPolicy || "",
          bookingType: pkg.bookingType || "instant"
        };
      
      case "bikeRentals":
        return {
          ...basePackage,
          bikeType: pkg.bikeType || adventureType,
          rentalDuration: pkg.rentalDuration || "",
          rentalUnit: pkg.rentalUnit || "hours",
          inclusions: pkg.inclusions || [],
          requirements: pkg.requirements || "",
          securityDeposit: pkg.securityDeposit || "",
          mileageLimit: pkg.mileageLimit || "",
          priceUnit: pkg.priceUnit || "perHour",
          pickupTime: pkg.pickupTime || "",
          returnTime: pkg.returnTime || ""
        };
      
      case "stayRooms":
        return {
          ...basePackage,
          roomType: pkg.roomType || adventureType,
          amenities: pkg.amenities || [],
          occupancy: pkg.occupancy || "",
          foodIncluded: pkg.foodIncluded || "",
          checkInTime: pkg.checkInTime || "",
          checkOutTime: pkg.checkOutTime || "",
          priceUnit: pkg.priceUnit || "perNight"
        };
      
      case "foodProviders":
        return {
          ...basePackage,
          foodType: pkg.foodType || adventureType,
          portionSize: pkg.portionSize || "",
          dietaryOptions: pkg.dietaryOptions || [],
          availability: pkg.availability || [],
          preparationTime: pkg.preparationTime || "",
          priceUnit: pkg.priceUnit || "perItem"
        };
      
      default:
        return basePackage;
    }
  };

  const formik = useFormik({
    initialValues: {
      schoolName: "",
      schoolDescription: "",
      yearEstablished: "",
      accreditationFiles: [],
      adventureTypes: [],
      website: "",
      socialLinks: {
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
      },
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      address: {
        location: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
      },
      mapLocation: "",
      idProof: null,
      schoolImages: [],
      testimonials: [],
      selectedServiceTypes: [],
      selectedSubServiceTypes: [],
      selectedAdventureTypes: [],
      otherServices: "",
      videoFile: null,
      videoLink: "",
      totalActivities: "",
      monthlyVolume: "",
      yearlyVolume: ""
    },
    validate: (values) => {
      const errors = {};
      
      if (!values.schoolName) errors.schoolName = "School name is required";
      if (!values.contactEmail) {
        errors.contactEmail = "Contact email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contactEmail)) {
        errors.contactEmail = "Invalid email format";
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        // Convert accreditationFiles to array of strings (urls/base64)
        const accreditationFiles = (values.accreditationFiles || []).map(file =>
          typeof file === "string" ? file : file.url
        );

        // Convert idProof to string (url/base64)
        const idProof =
          values.idProof && typeof values.idProof === "object"
            ? values.idProof.url
            : values.idProof || "";

        // Convert videoFile to string (url/base64)
        const videoFile =
          values.videoFile && typeof values.videoFile === "object"
            ? values.videoFile.url
            : values.videoFile || "";

        // Prepare the school data with proper format for the backend
        const schoolData = {
          ...values,
          accreditationFiles,
          idProof,
          videoFile,
          videoLink: videoLink,
          selectedServiceTypes,
          selectedSubServiceTypes,
          selectedAdventureTypes,
          otherServices,
          bikeRentalPrices: selectedServiceTypes.includes('bikeRentals') ? bikeRentalPrices : null,
          bikeRentalTimings: selectedServiceTypes.includes('bikeRentals') ? bikeRentalTimings : null,
          adventureSchoolPricing: selectedServiceTypes.includes('adventureSchools') ? adventureSchoolPricing : null,
          stayRoomsPricing: selectedServiceTypes.includes('stayRooms') ? stayRoomsPricing : null,
          foodProvidersPricing: selectedServiceTypes.includes('foodProviders') ? foodProvidersPricing : null,
          packages: packages.map(pkg => ({
            ...pkg,
            images: pkg.images.map(img => typeof img === 'string' ? img : img.url)
          }))
        };

        let response;
        if (isEditMode) {
          response = await api.put(`/adventure-schools/${schoolId}`, schoolData);
        } else {
          response = await api.post("/adventure-schools", schoolData);
        }

        navigate("/dashboard", {
          state: {
            schoolPublished: !isEditMode,
            schoolUpdated: isEditMode,
            schoolName: schoolData.schoolName,
          },
        });
      } catch (error) {
        console.error("Error saving school:", error);
        alert("Failed to save school. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (schoolId) {
      const fetchSchool = async () => {
        try {
          setIsLoading(true);
          const response = await api.get(`/adventure-schools/${schoolId}`);
          const school = response.data;
          
          setIsEditMode(true);
          
          if (school.selectedServiceTypes && Array.isArray(school.selectedServiceTypes)) {
            setSelectedServiceTypes(school.selectedServiceTypes);
          }
          
          if (school.selectedSubServiceTypes && Array.isArray(school.selectedSubServiceTypes)) {
            setSelectedSubServiceTypes(school.selectedSubServiceTypes);
          }
          
          if (school.selectedAdventureTypes && Array.isArray(school.selectedAdventureTypes)) {
            setSelectedAdventureTypes(school.selectedAdventureTypes);
          }
          
          if (school.otherServices) {
            setOtherServices(school.otherServices);
          }
          
          if (school.videoLink) {
            setVideoLink(school.videoLink);
          }
          
          if (school.bikeRentalPrices) {
            setBikeRentalPrices(school.bikeRentalPrices);
          }
          
          if (school.bikeRentalTimings) {
            setBikeRentalTimings(school.bikeRentalTimings);
          }
          
          if (school.adventureSchoolPricing) {
            setAdventureSchoolPricing(school.adventureSchoolPricing);
          }
          
          if (school.stayRoomsPricing) {
            setStayRoomsPricing(school.stayRoomsPricing);
          }
          
          if (school.foodProvidersPricing) {
            setFoodProvidersPricing(school.foodProvidersPricing);
          }
          
          formik.setValues({
            ...formik.initialValues,
            ...school,
          });
          
          if (school.schoolImages && school.schoolImages.length > 0) {
            setImagePreview(school.schoolImages[0]);
          }
          
          if (school.videoFile) {
            setVideoPreview(school.videoFile);
          }
          
          if (school.packages && Array.isArray(school.packages) && school.packages.length > 0) {
            const formattedPackages = school.packages.map(pkg => 
              normalizePackage(pkg, school.selectedServiceTypes, school.selectedAdventureTypes)
            );
            setPackages(formattedPackages);
          }
        } catch (e) {
          console.error("Error loading school for editing:", e);
          alert("Failed to load school data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSchool();
    }
  }, [schoolId]);

  // Handle clicks outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is on a checkbox or label inside a dropdown
      const isCheckboxClick = event.target.type === 'checkbox' || 
                             (event.target.closest('label') && event.target.closest('label').querySelector('input[type="checkbox"]'));
      
      if (!isCheckboxClick) {
        if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
          setShowDropdown(false);
        }
        if (subServiceDropdownRef.current && !subServiceDropdownRef.current.contains(event.target)) {
          setShowSubDropdown(false);
        }
        if (adventureDropdownRef.current && !adventureDropdownRef.current.contains(event.target)) {
          setShowAdventureDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle bike price changes
  const handleBikePriceChange = () => {
    if (selectedBikeTypes.length === 0 || !pricingDuration || !bikePrice) return;
    
    setBikeRentalPrices(prev => {
      const newPrices = { ...prev };
      
      selectedBikeTypes.forEach(bikeTypeId => {
        if (!newPrices[bikeTypeId]) {
          newPrices[bikeTypeId] = {};
        }
        
        newPrices[bikeTypeId][pricingDuration] = bikePrice;
      });
      
      return newPrices;
    });
    
    // Reset form
    setBikePrice("");
  };

  // Handle bike type selection
  const handleBikeTypeChange = (bikeTypeId) => {
    if (selectedBikeTypes.includes(bikeTypeId)) {
      setSelectedBikeTypes(selectedBikeTypes.filter(type => type !== bikeTypeId));
    } else {
      setSelectedBikeTypes([...selectedBikeTypes, bikeTypeId]);
    }
  };

  // Handle select all bike types
  const handleSelectAllBikeTypes = () => {
    const allBikeTypes = getAllBikeTypes();
    const allBikeTypeIds = allBikeTypes.map(bike => bike.id);
    
    if (selectedBikeTypes.length === allBikeTypeIds.length) {
      setSelectedBikeTypes([]);
    } else {
      setSelectedBikeTypes(allBikeTypeIds);
    }
  };

  // Handle bike rental timing changes
  const handleBikeRentalTimingsChange = (field, value) => {
    setBikeRentalTimings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setBikeRentalTimings(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Check total images after adding
    const currentImages = formik.values.schoolImages || [];
    if (currentImages.length + files.length > 10) {
      alert(`You can only upload up to 10 images. Currently you have ${currentImages.length} images.`);
      return;
    }
    
    const newImages = [];
    let processedCount = 0;
    
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        newImages.push(base64String);
        processedCount++;
        
        // When all files are processed, update the state
        if (processedCount === files.length) {
          formik.setFieldValue("schoolImages", [...currentImages, ...newImages]);
          // Set the first image as preview if there's no preview
          if (!imagePreview && newImages.length > 0) {
            setImagePreview(newImages[0]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAccreditationFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        newFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: base64String,
          file: file,
        });
        
        const currentFiles = formik.values.accreditationFiles || [];
        formik.setFieldValue("accreditationFiles", [...currentFiles, ...newFiles]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAccreditationFile = (index) => {
    const currentFiles = [...formik.values.accreditationFiles];
    currentFiles.splice(index, 1);
    formik.setFieldValue("accreditationFiles", currentFiles);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        alert("File is too large. Maximum size is 50MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const videoObj = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: reader.result
        };
        
        formik.setFieldValue("videoFile", videoObj);
        setVideoPreview(videoObj.url);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeVideo = () => {
    formik.setFieldValue("videoFile", null);
    setVideoPreview(null);
  };

  const handleVideoLinkChange = (e) => {
    const link = e.target.value;
    setVideoLink(link);
    formik.setFieldValue("videoLink", link);
  };

  const getEmbedUrl = (url) => {
    // For YouTube videos
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(youtubeRegex);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    // For Vimeo videos
    const vimeoRegex = /vimeo\.com\/(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    // Return original URL if not recognized
    return url;
  };

  const handleServiceTypeChange = (typeId) => {
    if (selectedServiceTypes.includes(typeId)) {
      setSelectedServiceTypes(selectedServiceTypes.filter(type => type !== typeId));
      // Also remove any subcategories and adventure types that belong to this service type
      const service = serviceTypes.find(t => t.id === typeId);
      if (service) {
        const subIdsToRemove = service.subCategories.map(sub => sub.id);
        setSelectedSubServiceTypes(selectedSubServiceTypes.filter(subId => !subIdsToRemove.includes(subId)));
        
        // Also remove adventure types that belong to any of these subcategories
        const adventureIdsToRemove = service.subCategories.flatMap(sub => 
          sub.adventureTypes.map(adv => adv.id)
        );
        setSelectedAdventureTypes(selectedAdventureTypes.filter(advId => !adventureIdsToRemove.includes(advId)));
      }
    } else {
      setSelectedServiceTypes([...selectedServiceTypes, typeId]);
    }
    // Don't close dropdown after selection to allow multiple selections
  };

  const handleSubServiceTypeChange = (subId) => {
    if (selectedSubServiceTypes.includes(subId)) {
      setSelectedSubServiceTypes(selectedSubServiceTypes.filter(sub => sub !== subId));
      // Also remove adventure types that belong to this subcategory
      serviceTypes.forEach(service => {
        const sub = service.subCategories.find(s => s.id === subId);
        if (sub) {
          const adventureIdsToRemove = sub.adventureTypes.map(adv => adv.id);
          setSelectedAdventureTypes(selectedAdventureTypes.filter(advId => !adventureIdsToRemove.includes(advId)));
        }
      });
    } else {
      setSelectedSubServiceTypes([...selectedSubServiceTypes, subId]);
    }
    // Don't close dropdown after selection to allow multiple selections
  };

  const handleAdventureTypeChange = (advId) => {
    if (selectedAdventureTypes.includes(advId)) {
      setSelectedAdventureTypes(selectedAdventureTypes.filter(adv => adv !== advId));
    } else {
      setSelectedAdventureTypes([...selectedAdventureTypes, advId]);
    }
    // Don't close dropdown after selection to allow multiple selections
  };

  const addPackage = () => {
    setPackages([...packages, initializePackages()[0]]);
  };

  const removePackage = (index) => {
    const updatedPackages = [...packages];
    updatedPackages.splice(index, 1);
    setPackages(updatedPackages);
  };

  const updatePackage = (index, field, value) => {
    const updatedPackages = [...packages];
    updatedPackages[index] = { ...updatedPackages[index], [field]: value };
    setPackages(updatedPackages);
  };

  const addPackageFaq = (pkgIndex) => {
    const updatedPackages = [...packages];
    updatedPackages[pkgIndex].faqs = [
      ...updatedPackages[pkgIndex].faqs,
      { question: "", answer: "" }
    ];
    setPackages(updatedPackages);
  };

  const updatePackageFaq = (pkgIndex, faqIndex, field, value) => {
    const updatedPackages = [...packages];
    updatedPackages[pkgIndex].faqs[faqIndex] = {
      ...updatedPackages[pkgIndex].faqs[faqIndex],
      [field]: value
    };
    setPackages(updatedPackages);
  };

  const removePackageFaq = (pkgIndex, faqIndex) => {
    const updatedPackages = [...packages];
    updatedPackages[pkgIndex].faqs.splice(faqIndex, 1);
    setPackages(updatedPackages);
  };

  const handleSeasonChange = (pkgIndex, month) => {
    const updatedPackages = [...packages];
    const currentSeasons = updatedPackages[pkgIndex].season || [];
    
    if (currentSeasons.includes(month)) {
      updatedPackages[pkgIndex].season = currentSeasons.filter(m => m !== month);
    } else {
      updatedPackages[pkgIndex].season = [...currentSeasons, month];
    }
    
    setPackages(updatedPackages);
  };

  const handlePackageImageChange = (pkgIndex, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const updatedPackages = [...packages];
    const currentImages = updatedPackages[pkgIndex].images || [];
    
    if (currentImages.length + files.length > 10) {
      alert(`You can only upload up to 10 images per package. Currently you have ${currentImages.length} images.`);
      return;
    }
    
    const newImages = [];
    let processedCount = 0;
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageObj = {
          name: file.name,
          url: reader.result
        };
        
        newImages.push(imageObj);
        processedCount++;
        
        if (processedCount === files.length) {
          updatedPackages[pkgIndex].images = [...currentImages, ...newImages];
          setPackages([...updatedPackages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePackageImage = (pkgIndex, imgIndex) => {
    const updatedPackages = [...packages];
    updatedPackages[pkgIndex].images.splice(imgIndex, 1);
    setPackages(updatedPackages);
  };

  const addTestimonial = () => {
    formik.setFieldValue("testimonials", [
      ...formik.values.testimonials,
      {
        customerName: "",
        rating: 5,
        comment: "",
        date: new Date().toISOString().split('T')[0]
      }
    ]);
  };

  const updateTestimonial = (index, field, value) => {
    const updatedTestimonials = [...formik.values.testimonials];
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
    formik.setFieldValue("testimonials", updatedTestimonials);
  };

  const removeTestimonial = (index) => {
    const updatedTestimonials = [...formik.values.testimonials];
    updatedTestimonials.splice(index, 1);
    formik.setFieldValue("testimonials", updatedTestimonials);
  };

  // Handle Adventure Schools Pricing changes
  const handleAdventureSchoolPricingChange = (field, value) => {
    setAdventureSchoolPricing(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdventureSchoolSeasonalPricingChange = (field, value) => {
    setAdventureSchoolPricing(prev => ({
      ...prev,
      seasonalPricing: {
        ...prev.seasonalPricing,
        [field]: value
      }
    }));
  };

  // Handle Adventure Schools Bulk Pricing
  const addAdventureSchoolBulkPricing = () => {
    setAdventureSchoolPricing(prev => ({
      ...prev,
      bulkPricing: [
        ...prev.bulkPricing,
        { minPeople: "", discountPercentage: "", description: "" }
      ]
    }));
  };

  const updateAdventureSchoolBulkPricing = (index, field, value) => {
    setAdventureSchoolPricing(prev => {
      const newBulkPricing = [...prev.bulkPricing];
      newBulkPricing[index] = { ...newBulkPricing[index], [field]: value };
      return {
        ...prev,
        bulkPricing: newBulkPricing
      };
    });
  };

  const removeAdventureSchoolBulkPricing = (index) => {
    setAdventureSchoolPricing(prev => {
      const newBulkPricing = [...prev.bulkPricing];
      newBulkPricing.splice(index, 1);
      return {
        ...prev,
        bulkPricing: newBulkPricing
      };
    });
  };

  // Handle Stay Rooms Pricing changes
  const handleStayRoomsPricingChange = (field, value) => {
    setStayRoomsPricing(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStayRoomsAdditionalFeesChange = (field, value) => {
    setStayRoomsPricing(prev => ({
      ...prev,
      additionalFees: {
        ...prev.additionalFees,
        [field]: value
      }
    }));
  };

  // Handle Stay Rooms Bulk Pricing
  const addStayRoomsBulkPricing = () => {
    setStayRoomsPricing(prev => ({
      ...prev,
      bulkPricing: [
        ...prev.bulkPricing,
        { minNights: "", discountPercentage: "", description: "" }
      ]
    }));
  };

  const updateStayRoomsBulkPricing = (index, field, value) => {
    setStayRoomsPricing(prev => {
      const newBulkPricing = [...prev.bulkPricing];
      newBulkPricing[index] = { ...newBulkPricing[index], [field]: value };
      return {
        ...prev,
        bulkPricing: newBulkPricing
      };
    });
  };

  const removeStayRoomsBulkPricing = (index) => {
    setStayRoomsPricing(prev => {
      const newBulkPricing = [...prev.bulkPricing];
      newBulkPricing.splice(index, 1);
      return {
        ...prev,
        bulkPricing: newBulkPricing
      };
    });
  };

  // Handle Food Providers Pricing changes
  const handleFoodProvidersPricingChange = (field, value) => {
    setFoodProvidersPricing(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFoodProvidersSpecialPricingChange = (field, value) => {
    setFoodProvidersPricing(prev => ({
      ...prev,
      specialPricing: {
        ...prev.specialPricing,
        [field]: value
      }
    }));
  };

  const handleFoodProvidersBulkDiscountChange = (field, value) => {
    setFoodProvidersPricing(prev => ({
      ...prev,
      bulkDiscount: {
        ...prev.bulkDiscount,
        [field]: value
      }
    }));
  };

  // Handle Food Providers Bulk Pricing
  const addFoodProvidersBulkPricing = () => {
    setFoodProvidersPricing(prev => ({
      ...prev,
      bulkPricing: [
        ...prev.bulkPricing,
        { minQuantity: "", discountPercentage: "", description: "" }
      ]
    }));
  };

  const updateFoodProvidersBulkPricing = (index, field, value) => {
    setFoodProvidersPricing(prev => {
      const newBulkPricing = [...prev.bulkPricing];
      newBulkPricing[index] = { ...newBulkPricing[index], [field]: value };
      return {
        ...prev,
        bulkPricing: newBulkPricing
      };
    });
  };

  const removeFoodProvidersBulkPricing = (index) => {
    setFoodProvidersPricing(prev => {
      const newBulkPricing = [...prev.bulkPricing];
      newBulkPricing.splice(index, 1);
      return {
        ...prev,
        bulkPricing: newBulkPricing
      };
    });
  };

  // Handle Bike Rentals Bulk Pricing
  const addBikeRentalBulkPricing = () => {
    setBikeRentalPrices(prev => {
      const newBulkPricing = prev.bulkPricing || [];
      return {
        ...prev,
        bulkPricing: [
          ...newBulkPricing,
          { minBikes: "", minDays: "", discountPercentage: "", description: "" }
        ]
      };
    });
  };

  const updateBikeRentalBulkPricing = (index, field, value) => {
    setBikeRentalPrices(prev => {
      const newBulkPricing = [...(prev.bulkPricing || [])];
      newBulkPricing[index] = { ...newBulkPricing[index], [field]: value };
      return {
        ...prev,
        bulkPricing: newBulkPricing
      };
    });
  };

  const removeBikeRentalBulkPricing = (index) => {
    setBikeRentalPrices(prev => {
      const newBulkPricing = [...(prev.bulkPricing || [])];
      newBulkPricing.splice(index, 1);
      return {
        ...prev,
        bulkPricing: newBulkPricing
      };
    });
  };

  // Render service-specific package fields
  const renderServiceSpecificFields = (pkg, pkgIndex) => {
    switch(pkg.serviceType) {
      case "adventureSchools":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Skill Level</label>
                <select
                  value={pkg.skillLevel || "beginner"}
                  onChange={(e) => updatePackage(pkgIndex, "skillLevel", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Duration</label>
                <div className="flex">
                  <input
                    type="number"
                    value={pkg.duration || ""}
                    onChange={(e) => updatePackage(pkgIndex, "duration", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-l"
                    min="1"
                  />
                  <select
                    value={pkg.durationUnit || "hours"}
                    onChange={(e) => updatePackage(pkgIndex, "durationUnit", e.target.value)}
                    className="p-2 border border-gray-300 rounded-r"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Min Participants</label>
                <input
                  type="number"
                  value={pkg.minParticipants || ""}
                  onChange={(e) => updatePackage(pkgIndex, "minParticipants", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Max Participants</label>
                <input
                  type="number"
                  value={pkg.maxParticipants || ""}
                  onChange={(e) => updatePackage(pkgIndex, "maxParticipants", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Price</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={pkg.price || ""}
                    onChange={(e) => updatePackage(pkgIndex, "price", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-r"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Min Age</label>
                <input
                  type="number"
                  value={pkg.minAge || ""}
                  onChange={(e) => updatePackage(pkgIndex, "minAge", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Max Age</label>
                <input
                  type="number"
                  value={pkg.maxAge || ""}
                  onChange={(e) => updatePackage(pkgIndex, "maxAge", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="1"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Season / Availability</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(month => (
                  <label key={month} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={(pkg.season || []).includes(month)}
                      onChange={() => handleSeasonChange(pkgIndex, month)}
                      className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{month.substring(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Start Location</label>
                <input
                  type="text"
                  value={pkg.startLocation || ""}
                  onChange={(e) => updatePackage(pkgIndex, "startLocation", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Starting point of the adventure"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">End Location</label>
                <input
                  type="text"
                  value={pkg.endLocation || ""}
                  onChange={(e) => updatePackage(pkgIndex, "endLocation", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Ending point of the adventure"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Detailed Itinerary / Inclusions</label>
              <textarea
                value={pkg.detailedItinerary || ""}
                onChange={(e) => updatePackage(pkgIndex, "detailedItinerary", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded min-h-[120px]"
                placeholder="Detailed itinerary and what's included"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Accommodation / Food Details</label>
              <textarea
                value={pkg.accommodation || ""}
                onChange={(e) => updatePackage(pkgIndex, "accommodation", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded min-h-[80px]"
                placeholder="Details about accommodation and food arrangements"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Gear / Equipment Provided</label>
              <textarea
                value={pkg.gearProvided || ""}
                onChange={(e) => updatePackage(pkgIndex, "gearProvided", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded min-h-[80px]"
                placeholder="List of gear and equipment provided"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">What to Bring</label>
              <textarea
                value={pkg.whatToBring || ""}
                onChange={(e) => updatePackage(pkgIndex, "whatToBring", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded min-h-[80px]"
                placeholder="List of items participants should bring"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Safety Information / Insurance Options</label>
              <textarea
                value={pkg.safetyInfo || ""}
                onChange={(e) => updatePackage(pkgIndex, "safetyInfo", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded min-h-[80px]"
                placeholder="Safety measures and insurance options"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Cancellation / Refund Policy</label>
              <textarea
                value={pkg.cancellationPolicy || ""}
                onChange={(e) => updatePackage(pkgIndex, "cancellationPolicy", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded min-h-[80px]"
                placeholder="Cancellation and refund policy for this package"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Booking Type</label>
              <select
                value={pkg.bookingType || "instant"}
                onChange={(e) => updatePackage(pkgIndex, "bookingType", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="instant">Instant Booking</option>
                <option value="request">Request to Book</option>
              </select>
            </div>
          </>
        );
      
      case "bikeRentals":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Rental Duration</label>
                <div className="flex">
                  <input
                    type="number"
                    value={pkg.rentalDuration || ""}
                    onChange={(e) => updatePackage(pkgIndex, "rentalDuration", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-l"
                    min="1"
                  />
                  <select
                    value={pkg.rentalUnit || "hours"}
                    onChange={(e) => updatePackage(pkgIndex, "rentalUnit", e.target.value)}
                    className="p-2 border border-gray-300 rounded-r"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Price</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={pkg.price || ""}
                    onChange={(e) => updatePackage(pkgIndex, "price", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-r"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            {/* Bike Rental Timing Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2 flex items-center">
                  <FiClock className="mr-2" /> Pickup Time
                </label>
                <input
                  type="time"
                  value={pkg.pickupTime || ""}
                  onChange={(e) => updatePackage(pkgIndex, "pickupTime", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 flex items-center">
                  <FiClock className="mr-2" /> Return Time
                </label>
                <input
                  type="time"
                  value={pkg.returnTime || ""}
                  onChange={(e) => updatePackage(pkgIndex, "returnTime", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Inclusions</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Helmet", "Gloves", "Jacket", "Lock", "Tool Kit", "Rain Gear"].map(item => (
                  <label key={item} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(pkg.inclusions || []).includes(item)}
                      onChange={(e) => {
                        const currentInclusions = [...(pkg.inclusions || [])];
                        if (e.target.checked) {
                          updatePackage(pkgIndex, "inclusions", [...currentInclusions, item]);
                        } else {
                          updatePackage(pkgIndex, "inclusions", currentInclusions.filter(i => i !== item));
                        }
                      }}
                      className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Security Deposit</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={pkg.securityDeposit || ""}
                    onChange={(e) => updatePackage(pkgIndex, "securityDeposit", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-r"
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Mileage Limit (km)</label>
                <input
                  type="number"
                  value={pkg.mileageLimit || ""}
                  onChange={(e) => updatePackage(pkgIndex, "mileageLimit", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="0"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Requirements</label>
              <textarea
                value={pkg.requirements || ""}
                onChange={(e) => updatePackage(pkgIndex, "requirements", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded min-h-[80px]"
                placeholder="License requirements, age restrictions, etc."
              />
            </div>
          </>
        );
      
      case "stayRooms":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Occupancy</label>
                <select
                  value={pkg.occupancy || ""}
                  onChange={(e) => updatePackage(pkgIndex, "occupancy", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select occupancy</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                  <option value="dorm">Dormitory</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Price</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={pkg.price || ""}
                    onChange={(e) => updatePackage(pkgIndex, "price", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-r"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["WiFi", "AC", "TV", "Parking", "Breakfast", "Swimming Pool", "Gym", "Laundry"].map(item => (
                  <label key={item} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(pkg.amenities || []).includes(item)}
                      onChange={(e) => {
                        const currentAmenities = [...(pkg.amenities || [])];
                        if (e.target.checked) {
                          updatePackage(pkgIndex, "amenities", [...currentAmenities, item]);
                        } else {
                          updatePackage(pkgIndex, "amenities", currentAmenities.filter(a => a !== item));
                        }
                      }}
                      className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Check-in Time</label>
                <input
                  type="time"
                  value={pkg.checkInTime || ""}
                  onChange={(e) => updatePackage(pkgIndex, "checkInTime", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Check-out Time</label>
                <input
                  type="time"
                  value={pkg.checkOutTime || ""}
                  onChange={(e) => updatePackage(pkgIndex, "checkOutTime", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Food Included</label>
              <textarea
                value={pkg.foodIncluded || ""}
                onChange={(e) => updatePackage(pkgIndex, "foodIncluded", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded min-h-[80px]"
                placeholder="Details about food included in the stay"
              />
            </div>
          </>
        );
      
      case "foodProviders":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Portion Size</label>
                <select
                  value={pkg.portionSize || ""}
                  onChange={(e) => updatePackage(pkgIndex, "portionSize", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select portion size</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="family">Family</option>
                  <option value="group">Group</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Price</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={pkg.price || ""}
                    onChange={(e) => updatePackage(pkgIndex, "price", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-r"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Dietary Options</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Nut-Free", "Keto"].map(item => (
                  <label key={item} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(pkg.dietaryOptions || []).includes(item)}
                      onChange={(e) => {
                        const currentOptions = [...(pkg.dietaryOptions || [])];
                        if (e.target.checked) {
                          updatePackage(pkgIndex, "dietaryOptions", [...currentOptions, item]);
                        } else {
                          updatePackage(pkgIndex, "dietaryOptions", currentOptions.filter(o => o !== item));
                        }
                      }}
                      className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Availability</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(pkg.availability || []).includes(day)}
                      onChange={(e) => {
                        const currentAvailability = [...(pkg.availability || [])];
                        if (e.target.checked) {
                          updatePackage(pkgIndex, "availability", [...currentAvailability, day]);
                        } else {
                          updatePackage(pkgIndex, "availability", currentAvailability.filter(a => a !== day));
                        }
                      }}
                      className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Preparation Time (minutes)</label>
              <input
                type="number"
                value={pkg.preparationTime || ""}
                onChange={(e) => updatePackage(pkgIndex, "preparationTime", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                min="1"
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold text-green-600">
          {isEditMode ? "Edit Service Provider" : "Register New Service Provider"}
        </h1>
        
        <div className="flex flex-wrap gap-2">
          {/* Service Type Dropdown with Checkboxes */}
          <div className="relative" ref={serviceDropdownRef}>
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {selectedServiceTypes.length === 0 
                ? "Select Service Types" 
                : selectedServiceTypes.length === serviceTypes.length 
                  ? "All Service Types" 
                  : `${selectedServiceTypes.length} Selected`}
              <FiChevronDown className="ml-2 h-5 w-5" />
            </button>
            
            {showDropdown && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  <div className="px-4 py-2 border-b">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedServiceTypes.length === serviceTypes.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServiceTypes(serviceTypes.map(t => t.id));
                          } else {
                            setSelectedServiceTypes([]);
                          }
                        }}
                        className="rounded text-green-600 focus:ring-green-500 mr-2"
                      />
                      <span>Select All</span>
                    </label>
                  </div>
                  {serviceTypes.map((type) => (
                    <label key={type.id} className="flex items-center px-4 py-2 hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={selectedServiceTypes.includes(type.id)}
                        onChange={() => handleServiceTypeChange(type.id)}
                        className="rounded text-green-600 focus:ring-green-500 mr-2"
                      />
                      <span>{type.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Subcategory Dropdown with Checkboxes */}
          {selectedServiceTypes.length > 0 && (
            <div className="relative" ref={subServiceDropdownRef}>
              <button
                type="button"
                onClick={() => setShowSubDropdown(!showSubDropdown)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {selectedSubServiceTypes.length === 0 
                  ? "Select Subcategories" 
                  : selectedSubServiceTypes.length === getCurrentSubCategories().length 
                    ? "All Subcategories" 
                    : `${selectedSubServiceTypes.length} Selected`}
                <FiChevronDown className="ml-2 h-5 w-5" />
              </button>
              
              {showSubDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 max-h-60 overflow-y-auto">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSubServiceTypes.length === getCurrentSubCategories().length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubServiceTypes(getCurrentSubCategories().map(s => s.id));
                            } else {
                              setSelectedSubServiceTypes([]);
                            }
                          }}
                          className="rounded text-green-600 focus:ring-green-500 mr-2"
                        />
                        <span>Select All</span>
                      </label>
                    </div>
                    {getCurrentSubCategories().map((sub) => (
                      <label key={sub.id} className="flex items-center px-4 py-2 hover:bg-gray-100">
                        <input
                          type="checkbox"
                          checked={selectedSubServiceTypes.includes(sub.id)}
                          onChange={() => handleSubServiceTypeChange(sub.id)}
                          className="rounded text-green-600 focus:ring-green-500 mr-2"
                        />
                        <span>{sub.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Adventure Type Dropdown with Checkboxes */}
          {selectedSubServiceTypes.length > 0 && (
            <div className="relative" ref={adventureDropdownRef}>
              <button
                type="button"
                onClick={() => setShowAdventureDropdown(!showAdventureDropdown)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {selectedAdventureTypes.length === 0 
                  ? "Select Adventure Types" 
                  : selectedAdventureTypes.length === getCurrentAdventureTypes().length 
                    ? "All Adventure Types" 
                    : `${selectedAdventureTypes.length} Selected`}
                <FiChevronDown className="ml-2 h-5 w-5" />
              </button>
              
              {showAdventureDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 max-h-60 overflow-y-auto">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedAdventureTypes.length === getCurrentAdventureTypes().length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAdventureTypes(getCurrentAdventureTypes().map(a => a.id));
                            } else {
                              setSelectedAdventureTypes([]);
                            }
                          }}
                          className="rounded text-green-600 focus:ring-green-500 mr-2"
                        />
                        <span>Select All</span>
                      </label>
                    </div>
                    {getCurrentAdventureTypes().map((adv) => (
                      <label key={adv.id} className="flex items-center px-4 py-2 hover:bg-gray-100">
                        <input
                          type="checkbox"
                          checked={selectedAdventureTypes.includes(adv.id)}
                          onChange={() => handleAdventureTypeChange(adv.id)}
                          className="rounded text-green-600 focus:ring-green-500 mr-2"
                        />
                        <span>{adv.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <form onSubmit={formik.handleSubmit}>
        {/* School Registration Details */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            {getProviderName()} Registration Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Provider Name *</label>
              <input
                type="text"
                name="schoolName"
                onChange={formik.handleChange}
                value={formik.values.schoolName || ""}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formik.errors.schoolName && (
                <div className="text-red-500 text-sm">{formik.errors.schoolName}</div>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Year Established</label>
              <input
                type="number"
                name="yearEstablished"
                onChange={formik.handleChange}
                value={formik.values.yearEstablished || ""}
                className="w-full p-2 border border-gray-300 rounded"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">About / Description *</label>
            <textarea
              name="schoolDescription"
              onChange={formik.handleChange}
              value={formik.values.schoolDescription || ""}
              className="w-full p-2 border border-gray-300 rounded min-h-[120px]"
              placeholder="Provide a detailed description of your service provider..."
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Provider Logo / Banner</label>
            {imagePreview && (
              <div className="mb-4 relative">
                <img
                  src={imagePreview}
                  alt="Provider preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    formik.setFieldValue("schoolImages", []);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FiX />
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB each, up to 10 images)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                />
              </label>
            </div>
            
            {formik.values.schoolImages && formik.values.schoolImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formik.values.schoolImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`School image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...formik.values.schoolImages];
                          newImages.splice(index, 1);
                          formik.setFieldValue("schoolImages", newImages);
                          if (imagePreview === img && newImages.length > 0) {
                            setImagePreview(newImages[0]);
                          } else if (newImages.length === 0) {
                            setImagePreview(null);
                          }
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Accreditations / Certifications</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 5MB each)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleAccreditationFilesChange}
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
            </div>
            
            {formik.values.accreditationFiles && formik.values.accreditationFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                <ul className="space-y-2">
                  {formik.values.accreditationFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <FiUpload className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAccreditationFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiX />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Video Upload Section */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Promotional Video</label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video Upload */}
              <div>
                <h3 className="text-md font-medium mb-2">Upload Video</h3>
                <div className="flex items-center justify-center w-full mb-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiVideo className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">MP4, MOV, AVI (MAX. 50MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleVideoChange}
                      accept="video/*"
                    />
                  </label>
                </div>
                
                {videoPreview && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Video Preview:</h4>
                    <div className="relative">
                      <video controls className="w-full h-48 object-cover rounded-lg border border-gray-300">
                        <source src={videoPreview} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Video Link */}
              <div>
                <h3 className="text-md font-medium mb-2">Or Add Video Link</h3>
                <div className="mb-4">
                  <input
                    type="url"
                    value={videoLink}
                    onChange={handleVideoLinkChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                
                {videoLink && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Video Preview:</h4>
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={getEmbedUrl(videoLink)}
                        className="w-full h-48 rounded-lg border border-gray-300"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Video preview"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Website</label>
              <input
                type="url"
                name="website"
                onChange={formik.handleChange}
                value={formik.values.website || ""}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="https://example.com"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Contact Person Name</label>
              <input
                type="text"
                name="contactPerson"
                onChange={formik.handleChange}
                value={formik.values.contactPerson || ""}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Contact Email *</label>
              <input
                type="email"
                name="contactEmail"
                onChange={formik.handleChange}
                value={formik.values.contactEmail || ""}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {formik.errors.contactEmail && (
                <div className="text-red-500 text-sm">{formik.errors.contactEmail}</div>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                onChange={formik.handleChange}
                value={formik.values.contactPhone || ""}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Address</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="address.location"
                  onChange={(e) => formik.setFieldValue("address.location", e.target.value)}
                  value={formik.values.address?.location || ""}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  placeholder="Street Address"
                />
                <input
                  type="text"
                  name="address.city"
                  onChange={(e) => formik.setFieldValue("address.city", e.target.value)}
                  value={formik.values.address?.city || ""}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  placeholder="City"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="address.state"
                  onChange={(e) => formik.setFieldValue("address.state", e.target.value)}
                  value={formik.values.address?.state || ""}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  placeholder="State/Province"
                />
                <input
                  type="text"
                  name="address.country"
                  onChange={(e) => formik.setFieldValue("address.country", e.target.value)}
                  value={formik.values.address?.country || ""}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  placeholder="Country"
                />
                <input
                  type="text"
                  name="address.pinCode"
                  onChange={(e) => formik.setFieldValue("address.pinCode", e.target.value)}
                  value={formik.values.address?.pinCode || ""}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Postal Code"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Map Location (Google Maps Link)</label>
            <input
              type="url"
              name="mapLocation"
              onChange={formik.handleChange}
              value={formik.values.mapLocation || ""}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="https://maps.google.com/..."
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Upload ID / License Proof</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        formik.setFieldValue("idProof", {
                          name: file.name,
                          url: reader.result
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
            </div>
            
            {formik.values.idProof && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Document:</h4>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <FiUpload className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">{formik.values.idProof.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("idProof", null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Social Links</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Facebook</label>
                <input
                  type="url"
                  name="socialLinks.facebook"
                  onChange={(e) => formik.setFieldValue("socialLinks.facebook", e.target.value)}
                  value={formik.values.socialLinks?.facebook || ""}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Instagram</label>
                <input
                  type="url"
                  name="socialLinks.instagram"
                  onChange={(e) => formik.setFieldValue("socialLinks.instagram", e.target.value)}
                  value={formik.values.socialLinks?.instagram || ""}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Twitter</label>
                <input
                  type="url"
                  name="socialLinks.twitter"
                  onChange={(e) => formik.setFieldValue("socialLinks.twitter", e.target.value)}
                  value={formik.values.socialLinks?.twitter || ""}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">YouTube</label>
                <input
                  type="url"
                  name="socialLinks.youtube"
                  onChange={(e) => formik.setFieldValue("socialLinks.youtube", e.target.value)}
                  value={formik.values.socialLinks?.youtube || ""}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Type of Services Offered - IMPROVED VERSION */}
        <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Type of Services Offered</h2>
          
          {/* Service Types */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-gray-700 font-medium text-lg">Service Types</label>
              <div className="flex items-center">
                <label className="flex items-center mr-4 bg-white px-3 py-1 rounded border border-gray-200">
                  <input
                    type="checkbox"
                    checked={selectedServiceTypes.length === serviceTypes.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedServiceTypes(serviceTypes.map(t => t.id));
                      } else {
                        setSelectedServiceTypes([]);
                      }
                    }}
                    className="rounded text-green-600 focus:ring-green-500 mr-2"
                  />
                  <span className="text-sm text-gray-600">Select All</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-green-600 hover:text-green-800 flex items-center bg-white px-3 py-1 rounded border border-gray-200"
                >
                  {showDropdown ? <FiChevronUp className="mr-1" /> : <FiChevronDown className="mr-1" />}
                  {showDropdown ? "Hide" : "Show"} Options
                </button>
              </div>
            </div>
            
            {/* Selected Service Types as Chips */}
            <div className="flex flex-wrap gap-3 mb-4 min-h-[60px] p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              {selectedServiceTypes.length === 0 ? (
                <span className="text-gray-500 text-sm italic">No service types selected</span>
              ) : (
                selectedServiceTypes.map(typeId => {
                  const service = serviceTypes.find(t => t.id === typeId);
                  return (
                    <div key={typeId} className="flex items-center bg-green-100 text-green-800 rounded-full px-4 py-2 shadow-sm">
                      <span className="font-medium">{service?.name}</span>
                      <button
                        type="button"
                        onClick={() => handleServiceTypeChange(typeId)}
                        className="ml-2 text-green-800 hover:text-green-900"
                      >
                        <FiX />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Service Types Dropdown */}
            {showDropdown && (
              <div className="border-2 border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {serviceTypes.map((type) => (
                    <label key={type.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedServiceTypes.includes(type.id)}
                        onChange={() => handleServiceTypeChange(type.id)}
                        className="rounded text-green-600 focus:ring-green-500 mr-3 h-5 w-5"
                      />
                      <span className="font-medium">{type.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Subcategories */}
          {selectedServiceTypes.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-gray-700 font-medium text-lg">Subcategories</label>
                <div className="flex items-center">
                  <label className="flex items-center mr-4 bg-white px-3 py-1 rounded border border-gray-200">
                    <input
                      type="checkbox"
                      checked={selectedSubServiceTypes.length === getCurrentSubCategories().length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubServiceTypes(getCurrentSubCategories().map(s => s.id));
                        } else {
                          setSelectedSubServiceTypes([]);
                        }
                      }}
                      className="rounded text-green-600 focus:ring-green-500 mr-2"
                    />
                    <span className="text-sm text-gray-600">Select All</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSubDropdown(!showSubDropdown)}
                    className="text-green-600 hover:text-green-800 flex items-center bg-white px-3 py-1 rounded border border-gray-200"
                  >
                    {showSubDropdown ? <FiChevronUp className="mr-1" /> : <FiChevronDown className="mr-1" />}
                    {showSubDropdown ? "Hide" : "Show"} Options
                  </button>
                </div>
              </div>
              
              {/* Selected Subcategories as Chips */}
              <div className="flex flex-wrap gap-3 mb-4 min-h-[60px] p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                {selectedSubServiceTypes.length === 0 ? (
                  <span className="text-gray-500 text-sm italic">No subcategories selected</span>
                ) : (
                  selectedSubServiceTypes.map(subId => {
                    let subName = "";
                    serviceTypes.forEach(service => {
                      const sub = service.subCategories.find(s => s.id === subId);
                      if (sub) subName = sub.name;
                    });
                    return (
                      <div key={subId} className="flex items-center bg-green-100 text-green-800 rounded-full px-4 py-2 shadow-sm">
                        <span className="font-medium">{subName}</span>
                        <button
                          type="button"
                          onClick={() => handleSubServiceTypeChange(subId)}
                          className="ml-2 text-green-800 hover:text-green-900"
                        >
                          <FiX />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Subcategories Dropdown */}
              {showSubDropdown && (
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-white shadow-sm max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getCurrentSubCategories().map((sub) => (
                      <label key={sub.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedSubServiceTypes.includes(sub.id)}
                          onChange={() => handleSubServiceTypeChange(sub.id)}
                          className="rounded text-green-600 focus:ring-green-500 mr-3 h-5 w-5"
                        />
                        <span className="font-medium">{sub.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Adventure Types */}
          {selectedSubServiceTypes.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-gray-700 font-medium text-lg">Adventure Types</label>
                <div className="flex items-center">
                  <label className="flex items-center mr-4 bg-white px-3 py-1 rounded border border-gray-200">
                    <input
                      type="checkbox"
                      checked={selectedAdventureTypes.length === getCurrentAdventureTypes().length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAdventureTypes(getCurrentAdventureTypes().map(a => a.id));
                        } else {
                          setSelectedAdventureTypes([]);
                        }
                      }}
                      className="rounded text-green-600 focus:ring-green-500 mr-2"
                    />
                    <span className="text-sm text-gray-600">Select All</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAdventureDropdown(!showAdventureDropdown)}
                    className="text-green-600 hover:text-green-800 flex items-center bg-white px-3 py-1 rounded border border-gray-200"
                  >
                    {showAdventureDropdown ? <FiChevronUp className="mr-1" /> : <FiChevronDown className="mr-1" />}
                    {showAdventureDropdown ? "Hide" : "Show"} Options
                  </button>
                </div>
              </div>
              
              {/* Selected Adventure Types as Chips */}
              <div className="flex flex-wrap gap-3 mb-4 min-h-[60px] p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                {selectedAdventureTypes.length === 0 ? (
                  <span className="text-gray-500 text-sm italic">No adventure types selected</span>
                ) : (
                  selectedAdventureTypes.map(advId => {
                    let advName = "";
                    serviceTypes.forEach(service => {
                      service.subCategories.forEach(sub => {
                        const adv = sub.adventureTypes.find(a => a.id === advId);
                        if (adv) advName = adv.name;
                      });
                    });
                    return (
                      <div key={advId} className="flex items-center bg-green-100 text-green-800 rounded-full px-4 py-2 shadow-sm">
                        <span className="font-medium">{advName}</span>
                        <button
                          type="button"
                          onClick={() => handleAdventureTypeChange(advId)}
                          className="ml-2 text-green-800 hover:text-green-900"
                        >
                          <FiX />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Adventure Types Dropdown */}
              {showAdventureDropdown && (
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-white shadow-sm max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getCurrentAdventureTypes().map((adv) => (
                      <label key={adv.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedAdventureTypes.includes(adv.id)}
                          onChange={() => handleAdventureTypeChange(adv.id)}
                          className="rounded text-green-600 focus:ring-green-500 mr-3 h-5 w-5"
                        />
                        <span className="font-medium">{adv.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Pricing Configuration */}
          {selectedServiceTypes.length > 0 && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Pricing Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Adventure Schools Pricing */}
                {selectedServiceTypes.includes('adventureSchools') && (
                  <div className="p-4 border border-gray-200 rounded-lg bg-blue-50">
                    <h3 className="text-lg font-medium mb-4 text-blue-800 flex items-center">
                      <FiStar className="mr-2" /> Adventure Schools Pricing
                    </h3>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Base Price (₹)</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={adventureSchoolPricing.basePrice}
                          onChange={(e) => handleAdventureSchoolPricingChange('basePrice', e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-r"
                          min="0"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Group Discount (%)</label>
                        <input
                          type="number"
                          value={adventureSchoolPricing.groupDiscount}
                          onChange={(e) => handleAdventureSchoolPricingChange('groupDiscount', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                          min="0"
                          max="100"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Min Group Size</label>
                        <input
                          type="number"
                          value={adventureSchoolPricing.minGroupSize}
                          onChange={(e) => handleAdventureSchoolPricingChange('minGroupSize', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                          min="2"
                          placeholder="5"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Seasonal Pricing</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={adventureSchoolPricing.seasonalPricing.peak}
                            onChange={(e) => handleAdventureSchoolSeasonalPricingChange('peak', e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                          />
                          <span>Peak Season (+20%)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={adventureSchoolPricing.seasonalPricing.offPeak}
                            onChange={(e) => handleAdventureSchoolSeasonalPricingChange('offPeak', e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                          />
                          <span>Off-Peak (-15%)</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Adventure Schools Bulk Pricing */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-md font-medium text-blue-800">Bulk / Group Pricing</h4>
                        <button
                          type="button"
                          onClick={addAdventureSchoolBulkPricing}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <FiPlus className="mr-1" /> Add Tier
                        </button>
                      </div>
                      
                      {adventureSchoolPricing.bulkPricing.map((tier, index) => (
                        <div key={index} className="mb-4 p-3 border border-gray-200 rounded-lg bg-white">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">Tier {index + 1}</h5>
                            {adventureSchoolPricing.bulkPricing.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeAdventureSchoolBulkPricing(index)}
                                className="text-red-500 hover:text-red-700 flex items-center"
                              >
                                <FiTrash2 className="mr-1" /> Remove
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-2">
                            <div>
                              <label className="block text-gray-600 text-sm mb-1">Min People</label>
                              <input
                                type="number"
                                value={tier.minPeople}
                                onChange={(e) => updateAdventureSchoolBulkPricing(index, 'minPeople', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                min="1"
                                placeholder="10"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 text-sm mb-1">Discount (%)</label>
                              <input
                                type="number"
                                value={tier.discountPercentage}
                                onChange={(e) => updateAdventureSchoolBulkPricing(index, 'discountPercentage', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                min="0"
                                max="100"
                                placeholder="15"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-gray-600 text-sm mb-1">Description</label>
                            <input
                              type="text"
                              value={tier.description}
                              onChange={(e) => updateAdventureSchoolBulkPricing(index, 'description', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded"
                              placeholder="e.g., Corporate groups, School trips"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Stay Rooms Pricing */}
                {selectedServiceTypes.includes('stayRooms') && (
                  <div className="p-4 border border-gray-200 rounded-lg bg-purple-50">
                    <h3 className="text-lg font-medium mb-4 text-purple-800 flex items-center">
                      <FiHome className="mr-2" /> Stay Rooms Pricing
                    </h3>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Base Price (₹/night)</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={stayRoomsPricing.basePrice}
                          onChange={(e) => handleStayRoomsPricingChange('basePrice', e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-r"
                          min="0"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Weekly Discount (%)</label>
                        <input
                          type="number"
                          value={stayRoomsPricing.weeklyDiscount}
                          onChange={(e) => handleStayRoomsPricingChange('weeklyDiscount', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                          min="0"
                          max="100"
                          placeholder="10"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Monthly Discount (%)</label>
                        <input
                          type="number"
                          value={stayRoomsPricing.monthlyDiscount}
                          onChange={(e) => handleStayRoomsPricingChange('monthlyDiscount', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                          min="0"
                          max="100"
                          placeholder="20"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Extra Person Fee (₹)</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={stayRoomsPricing.extraPersonFee}
                          onChange={(e) => handleStayRoomsPricingChange('extraPersonFee', e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-r"
                          min="0"
                          placeholder="500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Additional Fees</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={stayRoomsPricing.additionalFees.cleaning}
                            onChange={(e) => handleStayRoomsAdditionalFeesChange('cleaning', e.target.checked)}
                            className="rounded text-purple-600 focus:ring-purple-500 mr-2"
                          />
                          <span>Cleaning Fee (₹200)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={stayRoomsPricing.additionalFees.resort}
                            onChange={(e) => handleStayRoomsAdditionalFeesChange('resort', e.target.checked)}
                            className="rounded text-purple-600 focus:ring-purple-500 mr-2"
                          />
                          <span>Resort Fee (₹300)</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Stay Rooms Bulk Pricing */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-md font-medium text-purple-800">Bulk / Long Stay Pricing</h4>
                        <button
                          type="button"
                          onClick={addStayRoomsBulkPricing}
                          className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                        >
                          <FiPlus className="mr-1" /> Add Tier
                        </button>
                      </div>
                      
                      {stayRoomsPricing.bulkPricing.map((tier, index) => (
                        <div key={index} className="mb-4 p-3 border border-gray-200 rounded-lg bg-white">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">Tier {index + 1}</h5>
                            {stayRoomsPricing.bulkPricing.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeStayRoomsBulkPricing(index)}
                                className="text-red-500 hover:text-red-700 flex items-center"
                              >
                                <FiTrash2 className="mr-1" /> Remove
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-2">
                            <div>
                              <label className="block text-gray-600 text-sm mb-1">Min Nights</label>
                              <input
                                type="number"
                                value={tier.minNights}
                                onChange={(e) => updateStayRoomsBulkPricing(index, 'minNights', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                min="1"
                                placeholder="7"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 text-sm mb-1">Discount (%)</label>
                              <input
                                type="number"
                                value={tier.discountPercentage}
                                onChange={(e) => updateStayRoomsBulkPricing(index, 'discountPercentage', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                min="0"
                                max="100"
                                placeholder="15"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-gray-600 text-sm mb-1">Description</label>
                            <input
                              type="text"
                              value={tier.description}
                              onChange={(e) => updateStayRoomsBulkPricing(index, 'description', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded"
                              placeholder="e.g., Weekly stays, Monthly packages"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Food Providers Pricing */}
                {selectedServiceTypes.includes('foodProviders') && (
                  <div className="p-4 border border-gray-200 rounded-lg bg-yellow-50">
                    <h3 className="text-lg font-medium mb-4 text-yellow-800 flex items-center">
                      <FiBook className="mr-2" /> Food Providers Pricing
                    </h3>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Base Price (₹)</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={foodProvidersPricing.basePrice}
                          onChange={(e) => handleFoodProvidersPricingChange('basePrice', e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-r"
                          min="0"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Combo Discount (%)</label>
                        <input
                          type="number"
                          value={foodProvidersPricing.comboDiscount}
                          onChange={(e) => handleFoodProvidersPricingChange('comboDiscount', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                          min="0"
                          max="100"
                          placeholder="15"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Delivery Fee (₹)</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={foodProvidersPricing.deliveryFee}
                            onChange={(e) => handleFoodProvidersPricingChange('deliveryFee', e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-r"
                            min="0"
                            placeholder="50"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Special Pricing</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={foodProvidersPricing.specialPricing.happyHour}
                            onChange={(e) => handleFoodProvidersSpecialPricingChange('happyHour', e.target.checked)}
                            className="rounded text-yellow-600 focus:ring-yellow-500 mr-2"
                          />
                          <span>Happy Hour (30% off 4-6 PM)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={foodProvidersPricing.specialPricing.earlyBird}
                            onChange={(e) => handleFoodProvidersSpecialPricingChange('earlyBird', e.target.checked)}
                            className="rounded text-yellow-600 focus:ring-yellow-500 mr-2"
                          />
                          <span>Early Bird (20% off before 12 PM)</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Bulk Order Discount</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-sm text-gray-600">5+ items</label>
                          <input
                            type="number"
                            value={foodProvidersPricing.bulkDiscount.fivePlus}
                            onChange={(e) => handleFoodProvidersBulkDiscountChange('fivePlus', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            min="0"
                            max="100"
                            placeholder="10"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">10+ items</label>
                          <input
                            type="number"
                            value={foodProvidersPricing.bulkDiscount.tenPlus}
                            onChange={(e) => handleFoodProvidersBulkDiscountChange('tenPlus', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            min="0"
                            max="100"
                            placeholder="15"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">20+ items</label>
                          <input
                            type="number"
                            value={foodProvidersPricing.bulkDiscount.twentyPlus}
                            onChange={(e) => handleFoodProvidersBulkDiscountChange('twentyPlus', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            min="0"
                            max="100"
                            placeholder="25"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Food Providers Bulk Pricing */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-md font-medium text-yellow-800">Event / Bulk Catering Pricing</h4>
                        <button
                          type="button"
                          onClick={addFoodProvidersBulkPricing}
                          className="text-sm text-yellow-600 hover:text-yellow-800 flex items-center"
                        >
                          <FiPlus className="mr-1" /> Add Tier
                        </button>
                      </div>
                      
                      {foodProvidersPricing.bulkPricing.map((tier, index) => (
                        <div key={index} className="mb-4 p-3 border border-gray-200 rounded-lg bg-white">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">Tier {index + 1}</h5>
                            {foodProvidersPricing.bulkPricing.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFoodProvidersBulkPricing(index)}
                                className="text-red-500 hover:text-red-700 flex items-center"
                              >
                                <FiTrash2 className="mr-1" /> Remove
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-2">
                            <div>
                              <label className="block text-gray-600 text-sm mb-1">Min Quantity</label>
                              <input
                                type="number"
                                value={tier.minQuantity}
                                onChange={(e) => updateFoodProvidersBulkPricing(index, 'minQuantity', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                min="1"
                                placeholder="50"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 text-sm mb-1">Discount (%)</label>
                              <input
                                type="number"
                                value={tier.discountPercentage}
                                onChange={(e) => updateFoodProvidersBulkPricing(index, 'discountPercentage', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                min="0"
                                max="100"
                                placeholder="20"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-gray-600 text-sm mb-1">Description</label>
                            <input
                              type="text"
                              value={tier.description}
                              onChange={(e) => updateFoodProvidersBulkPricing(index, 'description', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded"
                              placeholder="e.g., Corporate events, Weddings, Parties"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Bike Rentals Pricing */}
                {selectedServiceTypes.includes('bikeRentals') && (
                  <div className="p-4 border border-gray-200 rounded-lg bg-green-50">
                    <h3 className="text-lg font-medium mb-4 text-green-800">Bike Rental Pricing</h3>
                    
                    {/* Bike Type Selection with Checkboxes */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-gray-700 font-medium">Select Bike Types</label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedBikeTypes.length === getAllBikeTypes().length}
                            onChange={handleSelectAllBikeTypes}
                            className="rounded text-green-600 focus:ring-green-500 mr-2"
                          />
                          <span className="text-sm text-gray-600">Select All</span>
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 p-3 border border-gray-200 rounded-lg bg-white max-h-40 overflow-y-auto">
                        {getAllBikeTypes().map(bikeType => (
                          <label key={bikeType.id} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedBikeTypes.includes(bikeType.id)}
                              onChange={() => handleBikeTypeChange(bikeType.id)}
                              className="rounded text-green-600 focus:ring-green-500 mr-2"
                            />
                            <span className="text-sm">{bikeType.name}</span>
                          </label>
                        ))}
                      </div>
                      
                      {/* Selected Bike Types as Chips */}
                      <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] p-2 border border-gray-200 rounded-lg bg-gray-50">
                        {selectedBikeTypes.length === 0 ? (
                          <span className="text-gray-500 text-sm">No bike types selected</span>
                        ) : (
                          selectedBikeTypes.map(bikeTypeId => {
                            const bikeType = getAllBikeTypes().find(b => b.id === bikeTypeId);
                            return (
                              <div key={bikeTypeId} className="flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1">
                                <span className="text-sm">{bikeType?.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleBikeTypeChange(bikeTypeId)}
                                  className="ml-2 text-green-800 hover:text-green-900"
                                >
                                  <FiX />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                    
                    {/* Pricing Form */}
                    {selectedBikeTypes.length > 0 && (
                      <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-white">
                        <h4 className="font-medium mb-3">Set Pricing</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-gray-700 mb-2">Rental Duration</label>
                            <select
                              value={pricingDuration}
                              onChange={(e) => setPricingDuration(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded"
                            >
                              <option value="hour">Per Hour</option>
                              <option value="day">Per Day</option>
                              <option value="week">Per Week</option>
                              <option value="month">Per Month</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 mb-2">Price (₹)</label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                ₹
                              </span>
                              <input
                                type="number"
                                value={bikePrice}
                                onChange={(e) => setBikePrice(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-r"
                                min="0"
                                placeholder="0"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={handleBikePriceChange}
                              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                              disabled={!bikePrice}
                            >
                              Apply Price
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          This price will be applied to all selected bike types for the {pricingDuration} duration.
                        </div>
                      </div>
                    )}
                    
                    {/* Bike Rental Timings Section */}
                    <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-white">
                      <h4 className="font-medium mb-3 flex items-center">
                        <FiClock className="mr-2" /> Bike Rental Timings
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-gray-700 mb-2">Default Pickup Time</label>
                          <input
                            type="time"
                            value={bikeRentalTimings.defaultPickupTime || "09:00"}
                            onChange={(e) => handleBikeRentalTimingsChange('defaultPickupTime', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-2">Default Return Time</label>
                          <input
                            type="time"
                            value={bikeRentalTimings.defaultReturnTime || "18:00"}
                            onChange={(e) => handleBikeRentalTimingsChange('defaultReturnTime', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Operating Hours</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.keys(bikeRentalTimings.operatingHours).map(day => (
                            <div key={day} className="flex items-center space-x-2 mb-2">
                              <label className="flex items-center w-24">
                                <input
                                  type="checkbox"
                                  checked={bikeRentalTimings.operatingHours[day].closed}
                                  onChange={(e) => handleOperatingHoursChange(day, 'closed', e.target.checked)}
                                  className="rounded text-green-600 focus:ring-green-500 mr-2"
                                />
                                <span className="text-sm capitalize">{day}</span>
                              </label>
                              
                              {!bikeRentalTimings.operatingHours[day].closed ? (
                                <>
                                  <input
                                    type="time"
                                    value={bikeRentalTimings.operatingHours[day].open}
                                    onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                                    className="w-24 p-1 border border-gray-300 rounded text-sm"
                                  />
                                  <span className="text-sm">to</span>
                                  <input
                                    type="time"
                                    value={bikeRentalTimings.operatingHours[day].close}
                                    onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                                    className="w-24 p-1 border border-gray-300 rounded text-sm"
                                  />
                                </>
                              ) : (
                                <span className="text-sm text-gray-500">Closed</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={bikeRentalTimings.advanceBookingRequired}
                              onChange={(e) => handleBikeRentalTimingsChange('advanceBookingRequired', e.target.checked)}
                              className="rounded text-green-600 focus:ring-green-500 mr-2"
                            />
                            <span className="text-sm">Advance Booking Required</span>
                          </label>
                          
                          {bikeRentalTimings.advanceBookingRequired && (
                            <div className="mt-2">
                              <label className="block text-gray-600 text-sm mb-1">Min Advance Hours</label>
                              <input
                                type="number"
                                value={bikeRentalTimings.minAdvanceHours}
                                onChange={(e) => handleBikeRentalTimingsChange('minAdvanceHours', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                min="1"
                                placeholder="2"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={bikeRentalTimings.sameDayReturn}
                              onChange={(e) => handleBikeRentalTimingsChange('sameDayReturn', e.target.checked)}
                              className="rounded text-green-600 focus:ring-green-500 mr-2"
                            />
                            <span className="text-sm">Same Day Return Required</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={bikeRentalTimings.overnightAllowed}
                              onChange={(e) => handleBikeRentalTimingsChange('overnightAllowed', e.target.checked)}
                              className="rounded text-green-600 focus:ring-green-500 mr-2"
                            />
                            <span className="text-sm">Overnight Rentals Allowed</span>
                          </label>
                        </div>
                        
                        {bikeRentalTimings.overnightAllowed && (
                          <div>
                            <label className="block text-gray-600 text-sm mb-1">Overnight Fee (₹)</label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                ₹
                              </span>
                              <input
                                type="number"
                                value={bikeRentalTimings.overnightFee}
                                onChange={(e) => handleBikeRentalTimingsChange('overnightFee', e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-r"
                                min="0"
                                placeholder="500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Display current prices */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-md font-medium text-green-800">Current Pricing</h4>
                        <button
                          type="button"
                          onClick={() => setShowBikePricing(!showBikePricing)}
                          className="text-sm text-green-600 hover:text-green-800 flex items-center"
                        >
                          {showBikePricing ? <FiChevronUp className="mr-1" /> : <FiChevronDown className="mr-1" />}
                          {showBikePricing ? "Hide" : "Show"} Pricing Table
                        </button>
                      </div>
                      
                      {showBikePricing && (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bike Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Hour</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Day</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Week</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Month</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {getAllBikeTypes().map(bikeType => (
                                <tr key={bikeType.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {bikeType.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {bikeRentalPrices[bikeType.id]?.hour ? `₹${bikeRentalPrices[bikeType.id].hour}` : '-'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {bikeRentalPrices[bikeType.id]?.day ? `₹${bikeRentalPrices[bikeType.id].day}` : '-'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {bikeRentalPrices[bikeType.id]?.week ? `₹${bikeRentalPrices[bikeType.id].week}` : '-'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {bikeRentalPrices[bikeType.id]?.month ? `₹${bikeRentalPrices[bikeType.id].month}` : '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    
                    {/* Bike Rentals Bulk Pricing */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-md font-medium text-green-800">Bulk / Fleet Rental Pricing</h4>
                        <button
                          type="button"
                          onClick={addBikeRentalBulkPricing}
                          className="text-sm text-green-600 hover:text-green-800 flex items-center"
                        >
                          <FiPlus className="mr-1" /> Add Tier
                        </button>
                      </div>
                      
                      {(bikeRentalPrices.bulkPricing || []).map((tier, index) => (
                        <div key={index} className="mb-4 p-3 border border-gray-200 rounded-lg bg-white">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">Tier {index + 1}</h5>
                            {(bikeRentalPrices.bulkPricing || []).length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBikeRentalBulkPricing(index)}
                                className="text-red-500 hover:text-red-700 flex items-center"
                              >
                                <FiTrash2 className="mr-1" /> Remove
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-2">
                            <div>
                              <label className="block text-gray-600 text-sm mb-1">Min Bikes</label>
                              <input
                                type="number"
                                value={tier.minBikes}
                                onChange={(e) => updateBikeRentalBulkPricing(index, 'minBikes', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                min="1"
                                placeholder="5"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 text-sm mb-1">Min Days</label>
                              <input
                                type="number"
                                value={tier.minDays}
                                onChange={(e) => updateBikeRentalBulkPricing(index, 'minDays', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                min="1"
                                placeholder="3"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-2">
                            <div>
                              <label className="block text-gray-600 text-sm mb-1">Discount (%)</label>
                              <input
                                type="number"
                                value={tier.discountPercentage}
                                onChange={(e) => updateBikeRentalBulkPricing(index, 'discountPercentage', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                min="0"
                                max="100"
                                placeholder="15"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 text-sm mb-1">Description</label>
                              <input
                                type="text"
                                value={tier.description}
                                onChange={(e) => updateBikeRentalBulkPricing(index, 'description', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="e.g., Group tours, Corporate events"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Business Metrics Section */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiTrendingUp className="mr-2" /> Business Metrics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 flex items-center">
                  <FiActivity className="mr-2" /> Total Number of Activities
                </label>
                <input
                  type="number"
                  name="totalActivities"
                  onChange={formik.handleChange}
                  value={formik.values.totalActivities || ""}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="0"
                  placeholder="Enter total activities"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 flex items-center">
                  <FiCalendar className="mr-2" /> Monthly Volume
                </label>
                <input
                  type="number"
                  name="monthlyVolume"
                  onChange={formik.handleChange}
                  value={formik.values.monthlyVolume || ""}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="0"
                  placeholder="Enter monthly volume"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 flex items-center">
                  <FiTrendingUp className="mr-2" /> Yearly Volume
                </label>
                <input
                  type="number"
                  name="yearlyVolume"
                  onChange={formik.handleChange}
                  value={formik.values.yearlyVolume || ""}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="0"
                  placeholder="Enter yearly volume"
                />
              </div>
            </div>
          </div>
          
          {/* Other Services */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Other Services (if any)</label>
            <input
              type="text"
              value={otherServices}
              onChange={(e) => setOtherServices(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Describe any other services you offer"
            />
          </div>
        </div>
        
        {/* Service-specific Packages */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Service Packages
            </h2>
            <button
              type="button"
              onClick={addPackage}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <FiPlus className="mr-2" /> Add Package
            </button>
          </div>
          
          {packages.map((pkg, pkgIndex) => (
            <div key={pkg.id} className="mb-8 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Package {pkgIndex + 1}
                </h3>
                {packages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePackage(pkgIndex)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <FiTrash2 className="mr-1" /> Remove Package
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Service Type</label>
                  <select
                    value={pkg.serviceType || ""}
                    onChange={(e) => {
                      updatePackage(pkgIndex, "serviceType", e.target.value);
                      // Reset subServiceType and adventureType when serviceType changes
                      updatePackage(pkgIndex, "subServiceType", "");
                      updatePackage(pkgIndex, "adventureType", "");
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select a service type</option>
                    {selectedServiceTypes.map(serviceTypeId => {
                      const service = serviceTypes.find(t => t.id === serviceTypeId);
                      return (
                        <option key={serviceTypeId} value={serviceTypeId}>
                          {service?.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Subcategory</label>
                  <select
                    value={pkg.subServiceType || ""}
                    onChange={(e) => {
                      updatePackage(pkgIndex, "subServiceType", e.target.value);
                      // Reset adventureType when subServiceType changes
                      updatePackage(pkgIndex, "adventureType", "");
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled={!pkg.serviceType}
                  >
                    <option value="">Select a subcategory</option>
                    {pkg.serviceType && serviceTypes.find(t => t.id === pkg.serviceType)?.subCategories.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {pkg.subServiceType && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Adventure Type</label>
                  <select
                    value={pkg.adventureType || ""}
                    onChange={(e) => updatePackage(pkgIndex, "adventureType", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select an adventure type</option>
                    {serviceTypes
                      .find(t => t.id === pkg.serviceType)
                      ?.subCategories.find(s => s.id === pkg.subServiceType)
                      ?.adventureTypes.map(adv => (
                        <option key={adv.id} value={adv.id}>
                          {adv.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Package Title *</label>
                  <input
                    type="text"
                    value={pkg.title || ""}
                    onChange={(e) => updatePackage(pkgIndex, "title", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Short Description</label>
                  <textarea
                    value={pkg.shortDescription || ""}
                    onChange={(e) => updatePackage(pkgIndex, "shortDescription", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded min-h-[80px]"
                    placeholder="Brief description of the package"
                  />
                </div>
              </div>
              
              {/* Service-specific fields */}
              {pkg.serviceType && renderServiceSpecificFields(pkg, pkgIndex)}
              
              {/* Common fields for all package types */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Package Images</label>
                <div className="flex items-center justify-center w-full mb-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB each, up to 10 images)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handlePackageImageChange(pkgIndex, e)}
                      multiple
                      accept="image/*"
                    />
                  </label>
                </div>
                
                {pkg.images && pkg.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {pkg.images.map((img, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removePackageImage(pkgIndex, imgIndex)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700">FAQs</label>
                  <button
                    type="button"
                    onClick={() => addPackageFaq(pkgIndex)}
                    className="text-sm text-green-600 hover:text-green-800 flex items-center"
                  >
                    <FiPlus className="mr-1" /> Add FAQ
                  </button>
                </div>
                
                {pkg.faqs.map((faq, faqIndex) => (
                  <div key={faqIndex} className="mb-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">FAQ {faqIndex + 1}</h4>
                      {pkg.faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePackageFaq(pkgIndex, faqIndex)}
                          className="text-red-500 hover:text-red-700 flex items-center"
                        >
                          <FiTrash2 className="mr-1" /> Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-2">
                      <input
                        type="text"
                        value={faq.question || ""}
                        onChange={(e) => updatePackageFaq(pkgIndex, faqIndex, "question", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Question"
                      />
                    </div>
                    
                    <div>
                      <textarea
                        value={faq.answer || ""}
                        onChange={(e) => updatePackageFaq(pkgIndex, faqIndex, "answer", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded min-h-[80px]"
                        placeholder="Answer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (isEditMode ? "Update Provider" : "Register Provider")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdventureSchoolForm;