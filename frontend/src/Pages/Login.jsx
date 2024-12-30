import React, { useState } from 'react';
import { Form } from 'react-router-dom';
import "../Styles/LoginPage.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider'; // Import context

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { setUser } = ChatState(); // Access setUser from context

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { email, password };

    const loadingToast = toast({
      title: 'Logging in...',
      description: 'Please wait a moment.',
      status: 'info',
      duration: null,
      isClosable: true,
    });

    try {
      const response = await axios.post("api/user/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const userInfo = response.data;

      // Save user info to local storage
      localStorage.setItem("user-info", JSON.stringify(userInfo));

      // Update context
      setUser(userInfo);

      toast({
        title: 'Login Successful!',
        description: "You're all set.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/chats');
    } catch (error) {
      console.error("Signin error:", error);

      toast({
        title: 'Signin Failed',
        description: error.response?.data?.error || 'An error occurred, please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      toast.close(loadingToast);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-header">LOGIN</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <FaEnvelope className="icon" />
          <input
            type="text"
            placeholder="Email or Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
        </div>
        <div className="input-container">
          <FaLock className="icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash className="icon" /> : <FaEye className="icon" />}
          </span>
        </div>
        <button type="submit" className="dark-mode-button">LOGIN</button>
        <div className="signup-text">
          <span>Not a member?</span> <a href="/signup">Signup now</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
