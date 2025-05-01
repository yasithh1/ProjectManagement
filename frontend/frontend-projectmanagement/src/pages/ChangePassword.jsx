import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../style/ChangePassword.css';

function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate(); 
  const email = location.state?.email;
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8080/api/change-password', {
        email,
        newPassword,
      });
      setError(''); 
      alert('Password changed successfully.');
      navigate('/sign-in/staff');
    } catch (error) {
      setError('Error changing password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="input-container">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="password-input"
        />
      </div>
      <div className="input-container">
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="password-input"
        />
      </div>
      <button 
        className="change-password-button" 
        onClick={handleChangePassword} 
        disabled={loading}
      >
        {loading ? 'Changing...' : 'Change Password'}
      </button>
    </div>
  );
}

export default ChangePassword;
