import React, { useState } from "react";
import UpdateModal from '../components/UpdateForm';
import "../style/SProfilePage.css";

const ProfilePage = () => {
  // Get user data from localStorage
  const profilePic = localStorage.getItem("profilePic") || "https://via.placeholder.com/120";
  const email = localStorage.getItem("email") || "example@example.com";
  const firstName = localStorage.getItem("firstName") || "Johnatan";
  const lastName = localStorage.getItem("lastName") || "Smith";
  const fullName = `${firstName} ${lastName}`;
  const telephone = localStorage.getItem("Telephone") || "(097) 234-5678";
  const phoneNumber = localStorage.getItem("PhoneNumber") || "(098) 765-4321";
  const address = localStorage.getItem("address") || "Bay Area, San Francisco, CA";
  const businessName = localStorage.getItem("businessName") || "Your Business Name";
  const businessCategory = localStorage.getItem("businessCategory") || "Business Category";
  const headOfficeAddress = localStorage.getItem("headOfficeAddress") || "Head Office Address";
  const hotlineNumber = localStorage.getItem("hotlineNumber") || "Hotline Number";
  const officialEmail = localStorage.getItem("officialEmail") || "Official Email";
  const website = localStorage.getItem("website") || "Website URL";
  const id = localStorage.getItem("id"); // Add user ID to local storage

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = (updatedData) => {
    localStorage.setItem("firstName", updatedData.firstName);
    localStorage.setItem("lastName", updatedData.lastName);
    localStorage.setItem("email", updatedData.email);
    localStorage.setItem("telephone", updatedData.telephone);
    localStorage.setItem("phoneNumber", updatedData.PhoneNumber);
    localStorage.setItem("address", updatedData.address);

    // Updating business information
    localStorage.setItem("businessName", updatedData.businessName);
    localStorage.setItem("businessCategory", updatedData.businessCategory);
    localStorage.setItem("headOfficeAddress", updatedData.headOfficeAddress);
    localStorage.setItem("hotlineNumber", updatedData.hotlineNumber);
    localStorage.setItem("officialEmail", updatedData.officialEmail);
    localStorage.setItem("website", updatedData.website);

    setIsModalOpen(false);
    window.location.reload(); // Reload the page to reflect the updated details
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Card */}
        <div className="profile-card">
          <img
            src={profilePic}
            alt="Profile"
            className="profile-picture"
          />
          <h2>{fullName}</h2>
          <p className="designation">Supplier 01</p>
          <p className="location">{address}</p>
          <div className="profile-actions">
            <button className="follow-button" onClick={handleOpenModal}>Update</button>
          </div>
        </div>

        {/* Contact Details */}
        <div className="contact-details">
          <table>
            <tbody>
              <tr>
                <td>Full Name</td>
                <td>{fullName}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{email}</td>
              </tr>
              <tr>
                <td>Telephone</td>
                <td>{telephone}</td>
              </tr>
              <tr>
                <td>Phone Number</td>
                <td>{phoneNumber}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>{address}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Business Info */}
        <div className="business-info">
          <table>
            <tbody>
              <tr>
                <td>Business Name</td>
                <td>{businessName}</td>
              </tr>
              <tr>
                <td>Business Category</td>
                <td>{businessCategory}</td>
              </tr>
              <tr>
                <td>Head Office Address</td>
                <td>{headOfficeAddress}</td>
              </tr>
              <tr>
                <td>Hotline Number</td>
                <td>{hotlineNumber}</td>
              </tr>
              <tr>
                <td>Official Email</td>
                <td>{officialEmail}</td>
              </tr>
              <tr>
                <td>Website</td>
                <td>{website}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Project Status */}
        <div className="project-status">
          <div className="status-card">
            <h4>assignment Project Status</h4>
            <p>Web Design</p>
            <progress value="80" max="100"></progress>
            <p>Website Markup</p>
            <progress value="72" max="100"></progress>
          </div>
          <div className="status-card">
            <h4>assignment Project Status</h4>
            <p>Web Design</p>
            <progress value="80" max="100"></progress>
            <p>Website Markup</p>
            <progress value="72" max="100"></progress>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      <UpdateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={{ id, firstName, lastName, email, telephone, phoneNumber, address, businessName, businessCategory, headOfficeAddress, hotlineNumber, officialEmail, website }}
        onSave={handleUpdate}
      />
    </div>
  );
};

export default ProfilePage;
