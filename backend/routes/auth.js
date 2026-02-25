const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerUser, loginUser } = require('../controllers/authController');

// Configure multer to store files in /uploads with original filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Add timestamp to avoid filename collisions
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Registration with photo upload
router.post('/register', upload.single('photo'), registerUser);

// Login route
router.post('/login', loginUser);

module.exports = router;