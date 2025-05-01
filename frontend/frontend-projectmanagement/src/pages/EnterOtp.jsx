import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/EnterOtp.css';

function EnterOtp() {
  const [otp, setOtp] = useState(['', '', '', '']); // An array for the four digits
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    } else if (!value && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }

    setOtp(newOtp);
  };

  const verifyOtp = async () => {
    const otpString = otp.join(''); // Join the OTP array into a single string
    try {
      await axios.post('http://localhost:8080/api/verify-otp', { email, otp: otpString });
      alert('OTP verified successfully.');
      navigate('/change-password', { state: { email } });
    } catch (error) {
      setError('Invalid OTP. Please try again.');
      setOtp(['', '', '', '']); // Reset the OTP input
    }
  };

  return (
    <div className="otp-container">
      <h2>Enter OTP</h2>
      <p>Please enter the 4-digit code sent to your email.</p>
      {error && <p className="error-message">{error}</p>}
      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            maxLength="1"
            className="otp-input"
          />
        ))}
      </div>
      <button className="submit-button" onClick={verifyOtp}>
        Verify OTP
      </button>
    </div>
  )
}

export default EnterOtp;
