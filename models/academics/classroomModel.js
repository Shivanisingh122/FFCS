const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  block: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Classroom', 'Lab'],
    required: true
  },
  facilities: [String] // Optional: e.g., ['Projector', 'Whiteboard']
}, { timestamps: true });

// Compound index for efficient querying
classroomSchema.index({ classroomNumber: 1, block: 1 });

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;
