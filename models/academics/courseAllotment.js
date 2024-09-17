const mongoose = require('mongoose');

const courseAllotmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  }
}, { timestamps: true });

// Validation for ensuring no conflicts:
courseAllotmentSchema.pre('save', async function(next) {
  try {
    const currentFaculty = this.faculty;
    const currentSlot = this.slot;

    // 1. Check if the faculty is already teaching another subject in the same slot
    const conflictingAllotment = await this.constructor.findOne({
      faculty: currentFaculty,
      slot: currentSlot,
      _id: { $ne: this._id }
    });

    if (conflictingAllotment) {
      const error = new Error('Faculty cannot teach two subjects at the same time.');
      error.name = 'CourseAllotmentConflict';
      return next(error); // Pass error to the next middleware
    }

    // 2. Check if the room is already allotted to another class in the same slot
    const conflictingRoomAllotment = await this.constructor.findOne({
      room: this.room,
      slot: this.slot,
      _id: { $ne: this._id }
    });

    if (conflictingRoomAllotment) {
      const error = new Error('Room cannot be allotted for two different classes at the same time.');
      error.name = 'CourseAllotmentConflict';
      return next(error); // Pass error to the next middleware
    }

    next(); // Continue with save operation
  } catch (err) {
    next(err); // Pass any unexpected error to the next middleware
  }
});

// Compound index for efficient querying
courseAllotmentSchema.index({ faculty: 1, slot: 1 });
courseAllotmentSchema.index({ room: 1, slot: 1 });

const CourseAllotment = mongoose.model('CourseAllotment', courseAllotmentSchema);

module.exports = CourseAllotment;
