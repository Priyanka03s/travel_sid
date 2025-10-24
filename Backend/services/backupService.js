// services/backupService.js
const mongoose = require('mongoose');
const FieldConfiguration = require('../models/FieldConfiguration');
const defaultConfigurations = require('../config/defaultFieldConfigurations');

class BackupService {
  // Create a backup of current field configurations
  async createBackup() {
    try {
      const configurations = await FieldConfiguration.find();
      const backup = {
        timestamp: new Date(),
        configurations: configurations
      };
      
      // Save backup to a separate collection
      await mongoose.connection.db.collection('field_configuration_backups').insertOne(backup);
      return { success: true, message: 'Backup created successfully' };
    } catch (error) {
      throw new Error(`Error creating backup: ${error.message}`);
    }
  }

  // Restore field configurations from a specific backup
  async restoreFromBackup(backupId) {
    try {
      const backup = await mongoose.connection.db.collection('field_configuration_backups').findOne({ _id: new mongoose.Types.ObjectId(backupId) });
      
      if (!backup) {
        throw new Error('Backup not found');
      }
      
      // Clear current configurations
      await FieldConfiguration.deleteMany({});
      
      // Restore configurations from backup
      await FieldConfiguration.insertMany(backup.configurations);
      
      return { success: true, message: 'Field configurations restored successfully' };
    } catch (error) {
      throw new Error(`Error restoring from backup: ${error.message}`);
    }
  }

  // Get all available backups
  async getBackups() {
    try {
      const backups = await mongoose.connection.db.collection('field_configuration_backups')
        .find({})
        .sort({ timestamp: -1 })
        .toArray();
      
      return backups;
    } catch (error) {
      throw new Error(`Error fetching backups: ${error.message}`);
    }
  }

  // Restore missing default fields
  async restoreMissingDefaults() {
    try {
      const currentConfigs = await FieldConfiguration.find();
      const currentFieldNames = currentConfigs.map(config => config.fieldName);

      const missingConfigs = defaultConfigurations.filter(
        config => !currentFieldNames.includes(config.fieldName)
      );

      if (missingConfigs.length === 0) {
        return { success: true, message: 'No missing fields to restore' };
      }

      await FieldConfiguration.insertMany(missingConfigs);

      return { 
        success: true, 
        message: `Restored ${missingConfigs.length} missing field configurations`,
        restoredFields: missingConfigs.map(config => config.fieldName)
      };
    } catch (error) {
      throw new Error(`Error restoring missing defaults: ${error.message}`);
    }
  }
}

module.exports = new BackupService();