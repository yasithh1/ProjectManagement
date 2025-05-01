import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is installed
import "../style/ProfilePage.css";

const ProfilePage = () => {
  const defaultProfilePic = "https://via.placeholder.com/150?text=Default+Profile"; // Default profile picture URL

  // Get user data from localStorage
  const profilePic = localStorage.getItem("profilePic") || defaultProfilePic;
  const email = localStorage.getItem("email") || "";
  const firstName = localStorage.getItem("firstName") || "Not available";
  const lastName = localStorage.getItem("lastName") || "Not available";
  const position = localStorage.getItem("position") || "Not available";
  const empId = localStorage.getItem("empId") || ""; // Assuming empId is also saved

  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(profilePic);

  useEffect(() => {
    // Check if the profile pic URL needs to be updated from localStorage
    const storedProfilePic = localStorage.getItem("profilePic");
    if (storedProfilePic) {
      setProfilePicUrl(`data:image/jpeg;base64,${storedProfilePic}`);
    }
  }, []); // Empty dependency array ensures it runs once when the component mounts

  const fileChangeHandler = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image")) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => setProfilePicUrl(fileReader.result);
      fileReader.readAsDataURL(file);
    } else {
      setError("Please select a valid image file.");
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:8081/api/employee/${empId}/upload-image`, 
        formData
      );
      const updatedEmployer = response.data;
      localStorage.setItem("profilePic", updatedEmployer.profilePic);
      setProfilePicUrl(updatedEmployer.profilePic); // Update preview with new profile pic URL
      setError(""); // Clear error message
    } catch (error) {
      setError("Error uploading image.");
    }

    setLoading(false);
  };

  const toggleEmailEditing = () => {
    setIsEditingEmail(!isEditingEmail);
  };

  const handleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };

  const handleSaveEmail = () => {
    localStorage.setItem("email", newEmail);
    setIsEditingEmail(false);
  };

  return (
    <div className="profile-card">
      <div className="profile-picture-container">
        <img
          src={profilePicUrl}
          alt="Profile"
          className="profile-picture"
        />
        <input
          type="file"
          accept="image/*"
          onChange={fileChangeHandler}
          className="file-input"
        />
        <button
          className="upload-button"
          onClick={handleProfilePictureUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Picture"}
        </button>
        {error && <div className="error">{error}</div>}
      </div>

      <div className="profile-details">
        <div className="profile-info-item">
          <strong>First Name:</strong> {firstName || "Not available"}
        </div>
        <div className="profile-info-item">
          <strong>Last Name:</strong> {lastName || "Not available"}
        </div>
        <div className="profile-info-item">
          <strong>Position:</strong> {position || "Not available"}
        </div>

        <div className="profile-info-item">
          <strong>Email:</strong>
          {isEditingEmail ? (
            <div className="editable-email">
              <input
                type="email"
                value={newEmail}
                onChange={handleEmailChange}
                className="edit-email-input"
              />
              <button className="save-button" onClick={handleSaveEmail}>
                Save
              </button>
            </div>
          ) : (
            <div className="email-display">
              {newEmail || "Not available"}
              <button className="edit-button" onClick={toggleEmailEditing}>
                ✏️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
