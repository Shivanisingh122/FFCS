const express = require("express");
const app = express();
const path = require("path");
const { connectToMongoDB } = require("./connection");
const cookieParser = require("cookie-parser");
const loginRouter = require("./routes/loginRoute");
const adminRoutes = require("./routes/admin/adminRoutes");
const studentRoutes = require("./routes/student/studentRoutes");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// Setting static files and views
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// MongoDB connection
connectToMongoDB("mongodb://127.0.0.1:27017/ffcs");

// Routes
app.get("/", (req, res) => {
  res.render("login", { error: null });
});
app.use("/", loginRouter);
app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);

// Listen on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
