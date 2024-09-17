const User = require('../models/user/userModel');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'Abc!1234%$#@';  // Use environment variable for the secret

// Function to create default admin user
const createDefaultAdmin = async () => {
  try {
    let admin = await User.findOne({ systemId: 'admin001', type: 'admin' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('12345', 10);

      admin = new User({
        name: 'Admin',
        systemId: 'admin001',
        email: 'admin@example.com',
        password: hashedPassword,
        type: 'admin'
      });

      await admin.save();
      console.log('Default admin created: systemId: admin001, password: 12345');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

createDefaultAdmin();

// GET login page
exports.getLogin = (req, res) => {
  res.render('login', { error: null });
};

// POST login form
exports.postLogin = async (req, res) => {
  try {
    const { systemId, password, type } = req.body;

    // Find the user by systemId and type
    const user = await User.findOne({ systemId, type });
    if (!user) {
      return res.render("login", { error: "Invalid system ID or user type" });
    }

    // Compare the provided password with the stored hashed password
    const matchPassword =  bcrypt.compare(password, user.password);  // Await bcrypt comparison
    
    if (matchPassword) {
      const token = jwt.sign(
        { 
          _id: user._id,
          systemId: user.systemId,
          name: user.name,
          type: user.type  // Use 'type' consistently
        }, 
        secret, 
        { expiresIn: "1h" }
      );

      res.cookie("token", token, { httpOnly: true });  // Secure cookie storage for token

      // Redirect based on user type
      switch (user.type) {
        case 'admin':
          return res.redirect("/admin/dashboard");
        case 'faculty':
          return res.redirect("/faculty/dashboard");
        case 'student':
          return res.redirect("/student/dashboard");
        default:
          return res.render("login", { error: "Invalid user type" });
      }
    } else {
      return res.render("login", { error: "Invalid password" });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).render("login", { error: "An error occurred. Please try again." });
  }
};

module.exports = {
  getLogin: exports.getLogin,
  postLogin: exports.postLogin,
};
