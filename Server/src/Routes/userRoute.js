const express = require('express');
const { registerUser, authUser, allUsers } = require('../Controllers/userController');
const multer = require("multer");
const {protect} = require('../Middleware/authMildware');

// Configuration for Multer for File Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Define the destination for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Use the original filename
  },
});

// Create a Multer instance with the defined storage
const upload = multer({ storage });

const router = express.Router();

// Login route
router.route('/login')
  .post(authUser);

// Signup route with single file upload handling
router.route('/signup')
  .post(upload.single('pic'), registerUser); // Use Multer middleware to handle file upload

// Getting all users except the userauthenticated himself via keyword 
router.route('/')
  .get(protect,allUsers);

  

module.exports = router;
