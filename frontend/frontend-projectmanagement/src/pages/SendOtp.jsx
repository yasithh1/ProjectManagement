import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/SendOtp.css';

function SendOtp() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-fill the email 
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  //Create asynchronous function to manage network request
  const sendOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post('http://localhost:8081/api/send-otp', { email });
      alert('OTP sent to your email.');
      navigate('/enter-otp', { state: { email } });
    } catch (error) {
      alert('Error sending OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="send-otp-container">
      <h2>Send OTP</h2>
      <p>Enter your registered email to receive a verification code.</p>
      <div className="input-container">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
        />
        <button className="send-otp-button" onClick={sendOtp} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send OTP'}
        </button>
      </div>
    </div>
  )
}

export default SendOtp;
