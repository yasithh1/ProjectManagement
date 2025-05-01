import React, { useState } from 'react';
import './UpdateForm.css';
const supplierId = localStorage.getItem('supplierId');
const UpdateForm = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    telephone: user.telephone,
    phoneNumber: user.phoneNumber,
    address: user.address,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:8080/api/supplier/update/${supplierId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const updatedData = await response.json();
      onSave(updatedData);
    } else {
      console.error('Error updating supplier');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Details</h2>
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          </label>
          <label>
            Last Name:
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <label>
            Telephone:
            <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} />
          </label>
          <label>
            Phone Number:
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </label>
          <label>
            Address:
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </label>
          <div className="modal-buttons">
            <button type="submit" className="save-button">Save</button>
            <button type="button" className="close-button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateForm;
