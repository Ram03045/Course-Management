const express = require("express");
const multer = require("multer");
const path = require("path");
const Course = require("../models/courseModel");

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get all courses
router.get("/", async (req, res) => {
  const courses = await Course.find();
  res.render("courses/index", { courses });
});

// Show form to create a new course
router.get("/new", (req, res) => {
  res.render("courses/new");
});

// Create a new course
router.post("/", upload.single("image"), async (req, res) => {
  const { courseName, price, duration, courseStartDate } = req.body;
  await Course.create({
    courseName,
    price,
    image: `/uploads/${req.file.filename}`,
    duration,
    courseStartDate,
  });
  res.redirect("/courses");
});

// Show single course
router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render("courses/show", { course });
});

// Show form to edit course (courseName cannot be changed)
router.get("/:id/edit", async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render("courses/edit", { course });
});

// Update course
router.put("/:id", upload.single("image"), async (req, res) => {
  const { price, duration, courseStartDate } = req.body;
  const updateData = { price, duration, courseStartDate };

  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

  await Course.findByIdAndUpdate(req.params.id, updateData);
  res.redirect(`/courses/${req.params.id}`);
});

// Delete course
router.delete("/:id", async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.redirect("/courses");
});

module.exports = router;
