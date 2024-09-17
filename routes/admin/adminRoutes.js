const express = require('express');
const router = express.Router();
const { verify } = require('../../middlewares/fetchUser'); // JWT middleware

// Import controller functions
const {
  getDashboard,
  getLogout,
  getAddUserForm,
  postAddUserForm,
  getUserSearch,
  getCourseSearch,
  getAddCourseForm,
  postAddCourseForm,
  getSlots,
  getAddSlotForm,
  postAddSlotForm,
  getClassrooms,
  getAddClassroomForm,
  postAddClassroomForm,
  getCourseAllotment,
  getAddCourseAllotmentForm,
  postAddCourseAllotmentForm,


} = require('../../controllers/admin/adminController');

// Middleware to ensure the user is authenticated as admin
const ensureAdmin = verify(['admin']); // Allow only 'admin' type users

// Admin Dashboard Route
router.get('/dashboard', ensureAdmin, getDashboard);

//gwt users-list
router.get('/users', ensureAdmin, getUserSearch);

//get courses-list
router.get('/courses', ensureAdmin, getCourseSearch);

//get slots -list
router.get('/slots', ensureAdmin, getSlots);


//get classroom-list
router.get('/classrooms', ensureAdmin, getClassrooms);

//get course-allotment list 
router.get('/course-allotment', ensureAdmin, getCourseAllotment);


//Add User
router.get('/add-user', ensureAdmin, getAddUserForm);
router.post('/add-user',ensureAdmin, postAddUserForm);

//add courses

router.get('/add-course', ensureAdmin, getAddCourseForm);
router.post('/add-course',ensureAdmin, postAddCourseForm);

// add slots 
router.get('/add-slot', ensureAdmin, getAddSlotForm);
router.post('/add-slot',ensureAdmin, postAddSlotForm);

// add classrooms
router.get('/add-classroom', ensureAdmin, getAddClassroomForm);
router.post('/add-classroom',ensureAdmin, postAddClassroomForm);


// add course allotment
router.get('/add-course-allotment', ensureAdmin, getAddCourseAllotmentForm);
router.post('/add-course-allotment',ensureAdmin, postAddCourseAllotmentForm);










// Logout Route
router.get('/logout', getLogout);

module.exports = router;