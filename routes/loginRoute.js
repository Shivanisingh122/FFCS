const express = require("express");
const router = express.Router();    
const userController = require("../controllers/loginController"); // Assuming common userController for login
const { verify } = require("../middlewares/fetchUser");

// Public routes for login
router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin); // Handle login for admin, faculty, and student


module.exports = router;
