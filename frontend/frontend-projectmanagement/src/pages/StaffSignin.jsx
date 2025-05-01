import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import emailIcon from '../assets/email.jpg';
import passwordIcon from '../assets/password.png';
import eyeOpen from '../assets/eyeopen.png';
import eyeClose from '../assets/eyeclose.png';
import '../style/StaffSignin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useEnterSubmit from '../hooks/useEnterSubmit';

function StaffSignin({ setRole }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8081/api/login', {
        email,
        password,
      });

      const { firstName, lastName, profilePic, id, position, empId } = response.data;
      setRole(position);

      // Saving user details to localStorage
      localStorage.setItem("role", position);
      localStorage.setItem("id", id);
      localStorage.setItem("empId", empId);  // Save empId
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      localStorage.setItem("profilePic", profilePic);
      localStorage.setItem("email", email);  // Save email

      navigate('/home', {
        state: { firstName, lastName, profilePic, id, position },
      });
    } catch (error) {
      toast.error("Invalid email or password. Please try again.");
    }
  };
  useEnterSubmit(handleLogin);
  return (
    <div className="staff-sign-in-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2>Staff Signin</h2>
      <div className="staff-input-container">
        <div className="input-staff">
          <img src={emailIcon} alt="email" className="staff-input-icon" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-staff">
          <img src={passwordIcon} alt="password" className="staff-input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <img
            src={showPassword ? eyeOpen : eyeClose}
            alt="toggle visibility"
            className="staff-toggle-password"
            onClick={togglePasswordVisibility}
          />
        </div>
        <a onClick={() => navigate('/send-otp')} className="staff-forgot-pass">
          Forgot password?
        </a>
        <button onClick={handleLogin} className="staff-login">Login</button>
      </div>
    </div>
  );
}

export default StaffSignin;
