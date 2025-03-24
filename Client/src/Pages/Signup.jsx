import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';  // Import useToast from Chakra UI
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Sign.css';
import "../Styles/LoginPage.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();  // Initialize toast

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords Do Not Match',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    if (profilePicture) {
      formData.append("pic", profilePicture);
    }

    const loadingToast = toast({
      title: 'Submitting registration...',
      description: 'Please wait',
      status: 'info',
      duration: null,
      isClosable: true,
    });

    try {
      const response = await axios.post("api/user/signup", formData, {
        headers: { "Content-Type": "multipart/form-data"
         },
      });

      toast({
        title: 'User registered successfully!',
        description: "You're all set!",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/login');
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      toast.close(loadingToast);
    }
  };

  return (
    <div className='outer-sign'>
      <div className='signup-block'>
        <h1 className="signup-header">SIGN UP</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="input-container">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="signup-input"
            />
          </div>

          {/* Email Field */}
          <div className="input-container">
            <FaEnvelope className="icon" />
            <input
              type="text"
              placeholder="Email or Phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signup-input"
            />
          </div>

          {/* Password Field */}
          <div className="input-container">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup-input"
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash className="icon" /> : <FaEye className="icon" />}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div className="input-container">
            <FaLock className="icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="signup-input"
            />
            <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash className="icon" /> : <FaEye className="icon" />}
            </span>
          </div>

          {/* Profile Picture Upload */}
          <div className="input-container profile-upload">
            <FaUser className="icon" />
            <label className="file-label">
              {profilePicture ? profilePicture.name : "No picture chosen"}
              <input type="file" onChange={handleProfileUpload} accept='image/*' />
            </label>
          </div>

          <button type="submit" className="dark-mode-button">SIGN UP</button>
        </form>
        <div className="signup-text">
          <span>Already a member?</span> <a href="/login">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
