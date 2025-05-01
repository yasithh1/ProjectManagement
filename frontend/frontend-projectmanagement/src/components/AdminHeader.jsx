import React, { useState } from "react";
import "./AdminHeader.css";
import profilePicture from "../assets/defaultuser.png";
import logoutIcon from "../assets/email.jpg";

const AdminHeader = ({ onLogout }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleProfileClick = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <header className="header">
      <div className="profile-section">
        <img
          src={profilePicture}
          alt="Profile"
          className="profile-pic"
          onClick={handleProfileClick}
        />
        {isPopupOpen && (
          <div className="profile-popup">
            <h3>User Details</h3>
            <p>Name: Admin</p>
            <p>Email: admin@example.com</p>
            <p>Role: Administrator</p>
          </div>
        )}
      </div>
      <div className="search-section">
        <input
          type="text"
          placeholder="Search Employee..."
          className="search-bar"
        />
      </div>
      <div className="logout-section">
        <button onClick={onLogout} className="logout-btn">
          <img src={logoutIcon} alt="Logout" className="logout-icon" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader
