const User = require("../../models/user/userModel");
const Course = require("../../models/academics/courseModel");
const Slot = require("../../models/academics/slotModel");
const Classroom = require("../../models/academics/classroomModel");
const CourseAllotment = require('../../models/academics/courseAllotment'); 

exports.getDashboard = (req, res) => {
  const adminName = req.user.name; // user info from token
  res.render("admin/adminDashboard", {
    adminName,
    currentPage: "dashboard",
    pageTitle: "Dashboard Overview",
    totalCourses: 0, // Replace with actual data
    activeStudents: 0, // Replace with actual data
    totalTeachers: 0, // Replace with actual data
    courseAllotments: 0, // Replace with actual data
  });
};

exports.getAddUserForm = (req, res) => {
  res.render("admin/adminDashboard", {
    adminName: req.user.name,
    currentPage: "addUser",
    title: "Add New User",
  });
};

exports.postAddUserForm = async (req, res) => {
  try {
    const { name, systemId, email, password, type } = req.body;
    const newUser = new User({ name, systemId, email, password, type });
    await newUser.save();
    res.redirect("/admin/users"); // Redirect to the user list page or wherever you want
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getUserSearch = async (req, res) => {
  try {
    // Fetch users from your database
    const users = await User.find({}); // Assuming you're using Mongoose

    res.render("admin/adminDashboard", {
      currentPage: "users",
      adminName: req.user.name, // Make sure this is set during login
      users: users, // Pass the users data here
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
};

exports.getCourseSearch = async (req, res) => {
  try {
    // Fetch users from your database
    const courses = await Course.find({}); // Assuming you're using Mongoose

    res.render("admin/adminDashboard", {
      currentPage: "courses",
      adminName: req.user.name, // Make sure this is set during login
      courses: courses,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
};

exports.getAddCourseForm = (req, res) => {
  res.render("admin/adminDashboard", {
    adminName: req.user.name,
    currentPage: "addCourse",
    title: "Add New Course",
  });
};

exports.postAddCourseForm = async (req, res) => {
  try {
    const { courseCode, courseName, credit, allocatedSeats, courseType } =
      req.body;
    const newCourse = new Course({
      courseCode,
      courseName,
      credit,
      allocatedSeats,
      courseType,
    });
    await newCourse.save();
    res.redirect("/admin/courses"); // Redirect to the course list page
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getSlots = async (req, res) => {
  try {
    // Fetch users from your database
    const slots = await Slot.find({}); // Assuming you're using Mongoose

    res.render("admin/adminDashboard", {
      currentPage: "slots",
      adminName: req.user.name, // Make sure this is set during login
      slots: slots,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
};

// Get Add Slot Form
exports.getAddSlotForm = (req, res) => {
  res.render("admin/adminDashboard", {
    adminName: req.user.name,
    currentPage: "addSlot",
    title: "Add New Slot",
  });
};

// Post Add Slot Form
exports.postAddSlotForm = async (req, res) => {
  try {
    const { day, startTime, endTime, type, code } = req.body;

    // Create a new slot instance
    const newSlot = new Slot({
      day,
      startTime,
      endTime,
      type,
      code,
    });

    // Save the new slot to the database
    await newSlot.save();

    // Redirect to the slot list page or another appropriate page
    res.redirect("/admin/slots");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getClassrooms = async (req, res) => {
  try {
    // Fetch classrooms from your database
    const classrooms = await Classroom.find({}); // Assuming you're using Mongoose

    res.render("admin/adminDashboard", {
      currentPage: "classrooms",
      adminName: req.user.name, // Make sure this is set during login
      classrooms: classrooms, // Pass the classrooms data here
    });
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    res.status(500).send("Error fetching classrooms");
  }
};

exports.getAddClassroomForm = (req, res) => {
  res.render("admin/adminDashboard", {
    adminName: req.user.name,
    currentPage: "addClassroom",
    title: "Add New Classroom",
  });
};

exports.postAddClassroomForm = async (req, res) => {
  try {
    const { roomNumber, block, capacity, type, facilities } = req.body;

    // Create a new classroom instance
    const newClassroom = new Classroom({
      roomNumber,
      block,
      capacity,
      type,
      facilities,
    });

    // Save the new classroom to the database
    await newClassroom.save();

    // Redirect to the classroom list page or another appropriate page
    res.redirect("/admin/classrooms");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};





exports.getCourseAllotment = async (req, res) => {
  try {
    // Fetch course allotments from your database
    const courseAllotments = await CourseAllotment.find({})
      .populate('course', 'courseName courseCode')       // Populate course field with course name
      .populate('faculty', 'name')      // Populate faculty field with faculty name
      .populate('slot', 'code day startTime endTime type')         // Populate slot field with slot time
      .populate('room', 'roomNumber block'); // Populate room field with room number and block

    res.render("admin/adminDashboard", {
      currentPage: "course-allotment",
      adminName: req.user.name, // Make sure this is set during login
      courseAllotments: courseAllotments, // Pass the course allotments data here
    });
  } catch (error) {
    console.error("Error fetching course allotments:", error);
    res.status(500).send("Error fetching course allotments");
  }
};


exports.getAddCourseAllotmentForm = async (req, res) => {
  try {
    
    const courses = await Course.find({});
    

    const facultyList = await User.find({ type: 'faculty' });

    const slots = await Slot.find({});
    

    const rooms = await Classroom.find({});

    
    res.render('admin/adminDashboard', {
      adminName: req.user.name,
      currentPage: 'addCourseAllotment',
      title: 'Add New Course Allotment',
      courses,  // Passing both courseCode and courseName from this query
      facultyList, // Faculty data
      slots,      // Slot data (including day, startTime, etc.)
      rooms       // Room data
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


// Post Form Function
exports.postAddCourseAllotmentForm = async (req, res) => {
  try {
    const { course, faculty, slot, room } = req.body;

    // Check if all selected values are valid
    const selectedCourse = await Course.findById(course);
    const selectedFaculty = await User.findById(faculty);
    const selectedSlot = await Slot.findById(slot);
    const selectedRoom = await Classroom.findById(room);

    if (!selectedCourse || !selectedFaculty || !selectedSlot || !selectedRoom) {
      return res.status(400).send('Invalid input. Ensure all fields are correctly selected.');
    }

    // Create a new course allotment document
    const newCourseAllotment = new CourseAllotment({
      course: selectedCourse._id,
      faculty: selectedFaculty._id,
      slot: selectedSlot._id,
      room: selectedRoom._id
    });

    // Save the course allotment
    await newCourseAllotment.save();

    // Redirect back to the course allotment page upon success
    res.redirect('/admin/course-allotment');
  } catch (error) {
    console.error("Error saving course allotment:", error);
    
    // Check for specific conflict errors
    if (error.name === 'CourseAllotmentConflict') {
      // Redirect back to the form with an error alert
      return res.status(400).render('admin/adminDashboard', {
        adminName: req.user.name,
        currentPage: 'addCourseAllotment',
        errorMessage: error.message, // Pass the error message to the view
        title: 'Add New Course Allotment',
        courses: await Course.find({}),
        facultyList: await User.find({ type: 'faculty' }),
        slots: await Slot.find({}),
        rooms: await Classroom.find({})
      });
    }

    res.status(500).send('Server Error');
  }
};



exports.getLogout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};
