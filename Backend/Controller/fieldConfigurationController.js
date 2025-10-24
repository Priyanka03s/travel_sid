// controllers/fieldConfigurationController.js
const FieldConfiguration = require("../models/FieldConfiguration");
const BackupService = require("../services/backupService");
const defaultConfigurations = require("../config/defaultFieldConfigurations");

// ✅ Helper: merge DB configs with defaults
async function getMergedConfigurations() {
  const dbConfigs = await FieldConfiguration.find().lean();
  const merged = [...dbConfigs];

  // Ensure every default field exists
  for (const def of defaultConfigurations) {
    const exists = dbConfigs.find((c) => c.fieldName === def.fieldName);
    if (!exists) {
      merged.push(def); // add missing default
    }
  }

  return merged.sort((a, b) => {
    if (a.component === b.component) return a.order - b.order;
    return a.component.localeCompare(b.component);
  });
}

// Get all field configurations (merged with defaults)
exports.getAllFieldConfigurations = async (req, res) => {
  try {
    const configurations = await getMergedConfigurations();
    res.status(200).json(configurations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single field configuration by ID
exports.getFieldConfigurationById = async (req, res) => {
  try {
    const configuration = await FieldConfiguration.findById(req.params.id);
    if (!configuration) {
      return res.status(404).json({ message: "Field configuration not found" });
    }
    res.status(200).json(configuration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new field configuration
exports.createFieldConfiguration = async (req, res) => {
  try {
    const configuration = new FieldConfiguration(req.body);
    const savedConfiguration = await configuration.save();
    res.status(201).json(savedConfiguration);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Field name must be unique" });
    }
    res.status(400).json({ message: error.message });
  }
};

// Update a field configuration
exports.updateFieldConfiguration = async (req, res) => {
  try {
    const configuration = await FieldConfiguration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!configuration) {
      return res
        .status(404)
        .json({ message: "Field configuration not found" });
    }
    res.status(200).json(configuration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a field configuration
exports.deleteFieldConfiguration = async (req, res) => {
  try {
    const configuration = await FieldConfiguration.findByIdAndDelete(
      req.params.id
    );
    if (!configuration) {
      return res
        .status(404)
        .json({ message: "Field configuration not found" });
    }
    res
      .status(200)
      .json({ message: "Field configuration deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Initialize default field configurations
exports.initializeFieldConfigurations = async (req, res) => {
  try {
    await FieldConfiguration.deleteMany({});
    await FieldConfiguration.insertMany(defaultConfigurations);
    res
      .status(200)
      .json({ message: "Field configurations initialized successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a backup of current configurations
exports.createBackup = async (req, res) => {
  try {
    const result = await BackupService.createBackup();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Restore configurations from backup
exports.restoreFromBackup = async (req, res) => {
  try {
    const { backupId } = req.params;
    const result = await BackupService.restoreFromBackup(backupId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all available backups
exports.getBackups = async (req, res) => {
  try {
    const backups = await BackupService.getBackups();
    res.status(200).json(backups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Restore missing default fields directly into DB
exports.restoreMissingDefaults = async (req, res) => {
  try {
    let inserted = 0;
    for (const def of defaultConfigurations) {
      const exists = await FieldConfiguration.findOne({
        fieldName: def.fieldName,
      });
      if (!exists) {
        await FieldConfiguration.create(def);
        inserted++;
      }
    }
    res
      .status(200)
      .json({ message: "Defaults restored successfully", inserted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
