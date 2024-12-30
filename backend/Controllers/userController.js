const User = require('../Models/userModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../Config/generateToken');




// Register User Function
const registerUser = asyncHandler(async (req, res) => {

  const { name, email, password } = req.body; // Accessing name, email, and password
  const pic = req.file ? req.file.path : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"; // Access the file path from req.file if it exists

  
    console.log("Body:", req.body); // Log body to see if name, email, and password are coming through
    console.log("File:", req.file); // Log file to check if the image is uploaded

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic, // Store the path of the profile picture
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});






// Authenticate User Function
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({"error" :"Please Enter all the Fields" });
    throw new Error("Please Enter all the Fields");
  }




const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({"error" : "Invalid Email or Password"});
    throw new Error("Invalid Email or Password");
  }
});


// Finding all users with keyword except the authenticated user himself
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, authUser,allUsers };
