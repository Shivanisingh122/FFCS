const User = require("../../models/user/userModel");
const Course = require("../../models/academics/courseAllotment");
const Slot = require('../../models/academics/slotModel');
const CourseEnrollment = require("../../models/student/courseEnrollment");


exports.getDashboard = (req, res) => {
  const studentName = req.user.name; // user info from token
  res.render("student/studentDashboard", {
    studentName,
    currentPage: "dashboard",
    pageTitle: "Dashboard Overview",
    totalCourses: 0, // Replace with actual data
    activeStudents: 0, // Replace with actual data
    totalTeachers: 0, // Replace with actual data
    courseAllotments: 0, // Replace with actual data
  });
};

exports.getTimetable = (req, res) => {
  const studentName = req.user.name;
  res.render("student/studentDashboard", {
    studentName,
    currentPage: "timetable",
  });
};

exports.getLogout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};






exports.getCourseList = async (req, res) => {
  try {
    const studentId = req.user._id;

    const studentName = req.user.name; // Assuming the logged-in student's name is available in req.user
    const courses = await Course.find()
      .populate({
        path: "course",
        select: "courseCode courseName", // Select only the necessary fields
      })
      .populate({
        path: "faculty",
        select: "name", // Select only the faculty's name
      })
      .populate({
        path: "slot",
        select: "_id code day startTime endTime", // Select relevant slot details
      })
      .populate({
        path: "room",
        select: "roomNumber block", // Select room details
      });

      console.log(courses);
    // Map the courses to format them properly for the template
    const formattedCourses = courses.map((course) => ({
      _id: course._id,

      courseCode: course.course?.courseCode || "N/A", // Default to "N/A" if courseCode is missing
      courseName: course.course?.courseName || "N/A",
      faculty: course.faculty?.name || "N/A", // If no faculty assigned, default to "N/A"
      slot: course.slot
        ? {
            id: course.slot._id, // Include the slot ID
            details: `${course.slot.code} - ${course.slot.day} ${course.slot.startTime}-${course.slot.endTime}`
          }
        : { id: null, details: 'N/A' },
      room: course.room
        ? `${course.room.roomNumber} - ${course.room.block}`
        : "N/A", // Handle missing room gracefully
    }));

    const message = req.query.message || '';
    res.render("student/studentDashboard", {
      studentName,
      studentId,
      currentPage: "course-list",
      courses: formattedCourses,
      message, // Send the formatted course list to the view
    });
  } catch (error) {
    console.error("Error fetching course list:", error);
    res.status(500).render("error", { message: "Error fetching course list" });
  }
};








exports.enrollCourse = async (req, res) => {
  const { studentId, courseId, slotId } = req.body;
  console.log("Enrollment attempt:", { studentId, courseId, slotId });

  try {
    if (!studentId || !courseId || !slotId) {
      return res.status(400).send("All fields are required.");
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    console.log(course);
    if (!course) {
      console.error(`Course not found for ID: ${courseId}`);
      return res.status(404).send("Course not found");
    }

    // Check if the slot exists
    const slot = await Slot.findById(slotId);
    if (!slot) {
      console.error(`Slot not found for ID: ${slotId}`);
      return res.status(404).send("Slot not found");
    }

    // Create the enrollment
    const enrollment = new CourseEnrollment({
      student: studentId,
      course: courseId,
      slot: slotId,
    });

    await enrollment.save();
    // console.log("Enrollment created:", enrollment);

    // Update the user's enrolledCourses array
    const updatedUser = await User.findByIdAndUpdate(
      studentId,
      { $push: { enrolledCourses: enrollment._id } },
      { new: true }
    );

    if (!updatedUser) {
      // console.error(`Failed to update user with ID: ${studentId}`);
      await CourseEnrollment.findByIdAndDelete(enrollment._id);
      return res.status(500).send("Failed to update user enrollment");
    }

    // console.log("User updated with new enrollment:", updatedUser);

    res.redirect('/student/course-list?message=success');
  } catch (err) {
    console.error("Error in enrollCourse:", err);
    if (err.name === "CourseEnrollmentConflict") {
      res.status(400).send(err.message);
    } else if (err.code === 11000) {
      res.status(400).send("You are already enrolled in this course.");
    } else {
      console.error(err);
      res.status(500).send("Server error");
    }

    // If an error occurred during enrollment, we should clean up
    if (enrollment && enrollment._id) {
      await CourseEnrollment.findByIdAndDelete(enrollment._id);
    }
  }
};






// Route to display enrolled courses

exports.getMyCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Fetch the student and populate the enrolledCourses field
    const student = await User.findById(studentId).populate({
      path: "enrolledCourses",
      populate: [
        { path: "course", select: "courseCode courseName" },
        { path: "slot", select: "code day startTime endTime" },
      ],
    }).exec();

    if (!student) {
      console.error(`Student not found for ID: ${studentId}`);
      return res.status(404).send("Student not found");
    }

    console.log("Fetched student data:", JSON.stringify(student, null, 2));

    // Map the populated courses for rendering, with error handling
    const courses = student.enrolledCourses.map((enrollment) => {
      if (!enrollment) {
        console.error(`Null enrollment found for student ${studentId}`);
        return null;
      }
      if (!enrollment.course) {
        console.error(`Enrollment ${enrollment._id} has null course reference`);
        return {
          _id: enrollment._id,
          courseCode: "Unknown",
          courseName: "Course Reference Missing",
          slot: enrollment.slot
            ? `${enrollment.slot.code} - ${enrollment.slot.day} ${enrollment.slot.startTime}-${enrollment.slot.endTime}`
            : "N/A",
        };
      }
      return {
        _id: enrollment.course._id,
        courseCode: enrollment.course.courseCode || "N/A",
        courseName: enrollment.course.courseName || "N/A",
        slot: enrollment.slot
          ? `${enrollment.slot.code} - ${enrollment.slot.day} ${enrollment.slot.startTime}-${enrollment.slot.endTime}`
          : "N/A",
      };
    }).filter(course => course !== null);

    console.log("Mapped courses:", JSON.stringify(courses, null, 2));

    res.render("student/studentDashboard", {
      studentName: req.user.name,
      currentPage: "my-courses",
      courses,
    });
  } catch (err) {
    console.error("Error fetching student courses:", err);
    console.error("Error stack:", err.stack);
    res.status(500).render("error", { message: "Server error" });
  }
};