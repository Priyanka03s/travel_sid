const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['fieldConfigurations', 'trips', 'users']
  },
  data: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

const Backup = mongoose.model('Backup', backupSchema);

module.exports = Backup;