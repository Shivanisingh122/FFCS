const express = require('express');
const router = express.Router();
const { verify } = require('../../middlewares/fetchUser'); 

const {
    getDashboard,
    getLogout,
    getTimetable,
    getCourseList,
    getMyCourses,
    enrollCourse
  
  
  } = require('../../controllers/student/studentController');


const ensureStudent = verify(['student']); 

router.get('/dashboard', ensureStudent, getDashboard);

router.get('/timetable', ensureStudent, getTimetable);

router.get('/course-list' ,ensureStudent, getCourseList );

router.get('/my-courses' ,ensureStudent, getMyCourses );

router.post('/enroll', ensureStudent, enrollCourse);

// router.post('/course-list' ,ensureStudent, getCourseList );










router.get('/logout', getLogout);

module.exports = router;