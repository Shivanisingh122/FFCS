const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Theory', 'Lab'],
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

// Compound index for efficient querying
slotSchema.index({ day: 1, startTime: 1, type: 1 });

// Validate that endTime is after startTime
slotSchema.path('endTime').validate(function(value) {
  return this.startTime < value;
}, 'End time must be after start time');

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;