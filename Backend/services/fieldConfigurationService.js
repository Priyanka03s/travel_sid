const FieldConfiguration = require('../models/FieldConfiguration');

class FieldConfigurationService {
  async getAllFieldConfigurations() {
    try {
      return await FieldConfiguration.find().sort({ component: 1, order: 1 });
    } catch (error) {
      throw new Error(`Error fetching field configurations: ${error.message}`);
    }
  }

  async getFieldConfigurationById(id) {
    try {
      const configuration = await FieldConfiguration.findById(id);
      if (!configuration) {
        throw new Error('Field configuration not found');
      }
      return configuration;
    } catch (error) {
      throw new Error(`Error fetching field configuration: ${error.message}`);
    }
  }

  async createFieldConfiguration(fieldData) {
    try {
      const configuration = new FieldConfiguration(fieldData);
      const savedConfiguration = await configuration.save();
      return savedConfiguration;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Field name must be unique');
      }
      throw new Error(`Error creating field configuration: ${error.message}`);
    }
  }

  async updateFieldConfiguration(id, fieldData) {
    try {
      const configuration = await FieldConfiguration.findByIdAndUpdate(
        id,
        fieldData,
        { new: true, runValidators: true }
      );
      if (!configuration) {
        throw new Error('Field configuration not found');
      }
      return configuration;
    } catch (error) {
      throw new Error(`Error updating field configuration: ${error.message}`);
    }
  }

  async deleteFieldConfiguration(id) {
    try {
      const configuration = await FieldConfiguration.findByIdAndDelete(id);
      if (!configuration) {
        throw new Error('Field configuration not found');
      }
      return { message: 'Field configuration deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting field configuration: ${error.message}`);
    }
  }

  async initializeFieldConfigurations() {
    try {
      // First, delete all existing configurations
      await FieldConfiguration.deleteMany({});
      
      // Default configurations for each component
      const defaultConfigurations = [
        // BasicDetails
        {
          fieldName: "tripTitle",
          label: "Trip Title",
          component: "BasicDetails",
          inputType: "text",
          enabled: true,
          required: true,
          order: 1
        },
        {
          fieldName: "bannerImage",
          label: "Banner Image",
          component: "BasicDetails",
          inputType: "file",
          enabled: true,
          required: true,
          order: 2
        },
        {
          fieldName: "tripCategory",
          label: "Trip Category",
          component: "BasicDetails",
          inputType: "select",
          enabled: true,
          required: true,
          options: ["adventure", "cultural", "beach", "wildlife", "trekking", "roadtrip", "spiritual", "family", "luxury"],
          order: 3
        },
        {
          fieldName: "groupType",
          label: "Group Type",
          component: "BasicDetails",
          inputType: "radio",
          enabled: true,
          required: true,
          options: ["public", "private"],
          order: 4
        },
        {
          fieldName: "bookingProcess",
          label: "Booking Process",
          component: "BasicDetails",
          inputType: "radio",
          enabled: true,
          required: true,
          options: ["instant", "approval"],
          order: 5
        },
        {
          fieldName: "tripStartDate",
          label: "Start Date",
          component: "BasicDetails",
          inputType: "date",
          enabled: true,
          required: true,
          order: 6
        },
        {
          fieldName: "tripEndDate",
          label: "End Date",
          component: "BasicDetails",
          inputType: "date",
          enabled: true,
          required: true,
          order: 7
        },
        {
          fieldName: "meetingLocation",
          label: "Pick-up Location",
          component: "BasicDetails",
          inputType: "text",
          enabled: true,
          required: true,
          order: 8
        },
        {
          fieldName: "destination",
          label: "Drop Location",
          component: "BasicDetails",
          inputType: "text",
          enabled: true,
          required: true,
          order: 9
        },
        {
          fieldName: "description",
          label: "Trip Description",
          component: "BasicDetails",
          inputType: "textarea",
          enabled: true,
          required: true,
          order: 10
        },
        
        // ItineraryDetails
        {
          fieldName: "itineraryType",
          label: "Itinerary Type",
          component: "ItineraryDetails",
          inputType: "radio",
          enabled: true,
          required: true,
          options: ["freeText", "structured"],
          order: 1
        },
        {
          fieldName: "itineraryText",
          label: "Detailed Itinerary",
          component: "ItineraryDetails",
          inputType: "textarea",
          enabled: true,
          required: true,
          order: 2
        },
        {
          fieldName: "accommodation",
          label: "Accommodation Options",
          component: "ItineraryDetails",
          inputType: "complex",
          enabled: true,
          required: true,
          order: 3
        },
        {
          fieldName: "mealPlans",
          label: "Meal Plans",
          component: "ItineraryDetails",
          inputType: "complex",
          enabled: true,
          required: true,
          order: 4
        },
        {
          fieldName: "inclusions",
          label: "Inclusions",
          component: "ItineraryDetails",
          inputType: "complex",
          enabled: true,
          required: true,
          order: 5
        },
        {
          fieldName: "exclusions",
          label: "Exclusions",
          component: "ItineraryDetails",
          inputType: "complex",
          enabled: true,
          required: true,
          order: 6
        },
        {
          fieldName: "faqs",
          label: "FAQs",
          component: "ItineraryDetails",
          inputType: "complex",
          enabled: true,
          required: true,
          order: 7
        },
        {
          fieldName: "tripTags",
          label: "Trip Tags",
          component: "ItineraryDetails",
          inputType: "complex",
          enabled: true,
          required: true,
          order: 8
        },
        
        // LogisticsSection
        {
          fieldName: "minParticipants",
          label: "Minimum Participants",
          component: "LogisticsSection",
          inputType: "number",
          enabled: true,
          required: true,
          validation: { min: 1 },
          order: 1
        },
        {
          fieldName: "maxParticipants",
          label: "Maximum Participants",
          component: "LogisticsSection",
          inputType: "number",
          enabled: true,
          required: true,
          validation: { min: 1 },
          order: 2
        },
        {
          fieldName: "bookingDeadline",
          label: "Booking Deadline",
          component: "LogisticsSection",
          inputType: "date",
          enabled: true,
          required: true,
          order: 3
        },
        {
          fieldName: "paymentType",
          label: "Payment Type",
          component: "LogisticsSection",
          inputType: "radio",
          enabled: true,
          required: true,
          options: ["full", "partial", "both"],
          order: 4
        },
        {
          fieldName: "cancellationEnabled",
          label: "Enable Cancellation Policy",
          component: "LogisticsSection",
          inputType: "checkbox",
          enabled: true,
          required: false,
          order: 5
        },
        {
          fieldName: "visaRequired",
          label: "Visa Required",
          component: "LogisticsSection",
          inputType: "checkbox",
          enabled: true,
          required: false,
          order: 6
        },
        {
          fieldName: "transportOptions",
          label: "Transport Options",
          component: "LogisticsSection",
          inputType: "complex",
          enabled: true,
          required: true,
          order: 7
        },
        {
          fieldName: "additionalFields",
          label: "Additional Fields",
          component: "LogisticsSection",
          inputType: "complex",
          enabled: true,
          required: false,
          order: 8
        },
        
        // PricingSection
        {
          fieldName: "pricing",
          label: "Pricing Details",
          component: "PricingSection",
          inputType: "complex",
          enabled: true,
          required: true,
          order: 1
        },
        
        // ReviewPublish
        {
          fieldName: "review",
          label: "Review & Publish",
          component: "ReviewPublish",
          inputType: "complex",
          enabled: true,
          required: true,
          order: 1
        }
      ];
      
      await FieldConfiguration.insertMany(defaultConfigurations);
      return { message: 'Field configurations initialized successfully' };
    } catch (error) {
      throw new Error(`Error initializing field configurations: ${error.message}`);
    }
  }
}

module.exports = new FieldConfigurationService();