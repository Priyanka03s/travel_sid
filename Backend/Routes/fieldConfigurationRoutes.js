const express = require('express');
const router = express.Router();
const fieldConfigurationController = require('../Controller/fieldConfigurationController');

// Get all field configurations
router.get('/', fieldConfigurationController.getAllFieldConfigurations);

// Initialize default field configurations
router.post('/initialize', fieldConfigurationController.initializeFieldConfigurations);

// Backup and restoration routes - specific routes first
router.post('/backup', fieldConfigurationController.createBackup);
router.get('/backups', fieldConfigurationController.getBackups);
router.post('/restore/:backupId', fieldConfigurationController.restoreFromBackup);
router.post('/restore-missing', fieldConfigurationController.restoreMissingDefaults);

// Parameterized routes - after specific routes
router.get('/:id', fieldConfigurationController.getFieldConfigurationById);
router.post('/', fieldConfigurationController.createFieldConfiguration);
router.put('/:id', fieldConfigurationController.updateFieldConfiguration);
router.patch('/:id', fieldConfigurationController.updateFieldConfiguration);
router.delete('/:id', fieldConfigurationController.deleteFieldConfiguration);

module.exports = router;