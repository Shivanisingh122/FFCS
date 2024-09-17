const mongoose = require('mongoose');

const courseEnrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model (only students)
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },
}, { timestamps: true });

// Validation for ensuring no conflicts:
courseEnrollmentSchema.pre('save', async function(next) {
  try {
    const currentStudent = this.student;
    const currentSlot = this.slot;

    // 1. Check if the student is already enrolled in the same course
    const conflictingEnrollment = await this.constructor.findOne({
      student: currentStudent,
      course: this.course,
      _id: { $ne: this._id }
    });

    if (conflictingEnrollment) {
      const error = new Error('Student is already enrolled in this course.');
      error.name = 'CourseEnrollmentConflict';
      return next(error); // Pass error to the next middleware
    }

    // 2. Check if the student is already enrolled in another course in the same slot
    const conflictingSlotEnrollment = await this.constructor.findOne({
      student: currentStudent,
      slot: currentSlot,
      _id: { $ne: this._id }
    });

    if (conflictingSlotEnrollment) {
      const error = new Error('Student cannot enroll in two courses with the same slot.');
      error.name = 'CourseEnrollmentConflict';
      return next(error); // Pass error to the next middleware
    }

    next(); // Continue with save operation
  } catch (err) {
    next(err); // Pass any unexpected error to the next middleware
  }
});

// Compound index for efficient querying
courseEnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
courseEnrollmentSchema.index({ student: 1, slot: 1 });

const CourseEnrollment = mongoose.model('CourseEnrollment', courseEnrollmentSchema);

module.exports = CourseEnrollment;
