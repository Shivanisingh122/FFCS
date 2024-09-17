const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  credit: { type: Number, required: true },
  allocatedSeats: { type: Number, required: true },
  courseType: { type: String, required: true },

});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;