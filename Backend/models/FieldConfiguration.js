const mongoose = require('mongoose');

const fieldConfigurationSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  component: {
    type: String,
    required: true,
    enum: ['BasicDetails', 'ItineraryDetails', 'LogisticsSection', 'PricingSection', 'ReviewPublish']
  },
  inputType: {
    type: String,
    required: true,
    enum: ['text', 'textarea', 'select', 'checkbox', 'radio', 'date', 'file', 'number', 'complex', 'button'] // Added 'button'
  },
  enabled: {
    type: Boolean,
    default: true
  },
  required: {
    type: Boolean,
    default: false
  },
  defaultValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  options: [{
    type: String
  }],
  validation: {
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    pattern: {
      type: String,
      default: null
    }
  },
  order: {
    type: Number,
    default: 0
  },
  // Soft delete fields
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

const FieldConfiguration = mongoose.model('FieldConfiguration', fieldConfigurationSchema);

module.exports = FieldConfiguration;