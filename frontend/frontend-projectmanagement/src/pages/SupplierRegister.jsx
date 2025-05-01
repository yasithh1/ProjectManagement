import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/SupplierRegister.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SupplierRegisterSteps = () => {
  const navigate = useNavigate();  // Initialize useNavigate hook
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    supplierType: '',
    firstName: '', 
    lastName: '',
    businessName: '',
    email: '',
    businessCategory: '',
    phoneNumber: '',
    productCategory: '',
    No: '',
    contactEmail: '',
    officeEmail: '',
    hotlineNumber: '',
    street: '',
    city: '',
    telephone: '',
    website: '',
    productName: '',
    productDescription: '',
    password: '',
    confirmPassword: ''
  });

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const fullAddress = `${formData.No}, ${formData.street}, ${formData.city}`;
    const payload = {
      ...formData,
      address: fullAddress,
    };

    try {
      const response = await fetch('http://localhost:8080/api/supplier/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Supplier added successfully:', data);
        toast.success('Supplier added successfully!');
        navigate('/sign-in/supplier');  // Navigate to sign-in page on success
      } else {
        console.error('Error submitting supplier data:', response.statusText);
        toast.error('Error submitting supplier data.');
      }
    } catch (error) {
      console.error('Error submitting supplier data:', error);
      toast.error('Error submitting supplier data.');
    }
  };

  return (
    <div className="container">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1>Keells Supplier</h1>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-line" style={{ width: `${(currentStep - 1) * 31.3}%` }}></div>
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`progress-step ${currentStep >= step ? 'active' : ''} ${
              currentStep > step ? 'completed' : ''
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="progress-labels">
        <span>Business Information</span>
        <span>Contact Information</span>
        <span>Product Details</span>
        <span>Verification</span>
      </div>

      {/* Dynamic Form */}
      <div className="form-content">
        {currentStep === 1 && (
          <>
            <h3>Fill in your business information</h3>
            <div className="form-row">
              <label>Supplier Type</label>
            </div>
            <div className="form-row radio-row">
              <label>
                Direct
                <input
                  type="radio"
                  name="supplierType"
                  value="Direct"
                  checked={formData.supplierType === 'Direct'}
                  onChange={handleChange}
                />
              </label>
              <label>
                Indirect
                <input
                  type="radio"
                  name="supplierType"
                  value="Indirect"
                  checked={formData.supplierType === 'Indirect'}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="form-row">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label>Business Name</label>
              <input
                type="text"
                name="businessName"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleChange}
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label>Business Category</label>
              <input
                type="text"
                name="businessCategory"
                placeholder="Business Category"
                value={formData.businessCategory}
                onChange={handleChange}
              />
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <label>Product Category</label>
            <input
              type="text"
              name="productCategory"
              placeholder="Product Category"
              value={formData.productCategory}
              onChange={handleChange}
            />
          </>
        )}
        {currentStep === 2 && (
          <>
            <h3>Enter your contact details</h3>
            <h4>Head Office Address</h4>
            <div className="form-row">
              <label>No</label>
              <input
                type="text"
                name="No"
                placeholder="No"
                value={formData.No}
                onChange={handleChange}
              />
              <label>Office Email</label>
              <input
                type="email"
                name="officeEmail"
                placeholder="Office Email"
                value={formData.officeEmail}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label>Street</label>
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={formData.street}
                onChange={handleChange}
              />
              <label>Hotline Number</label>
              <input
                type="text"
                name="hotlineNumber"
                placeholder="Hotline Number"
                value={formData.hotlineNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
              <label>Telephone</label>
              <input
                type="text"
                name="telephone"
                placeholder="Telephone"
                value={formData.telephone}
                onChange={handleChange}
              />
            </div>
            <div className="form-row-last">
              <label>Website</label>
              <input
                type="text"
                name="website"
                placeholder="Website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        {currentStep === 3 && (
          <>
            <h3>Add product details</h3>
            <div className="form-row">
              <label>Product Name</label>
              <input
                type="text"
                name="productName"
                placeholder="Product Name"
                value={formData.productName}
                onChange={handleChange}
              />
              <label>Product Description</label>
              <textarea
                rows="5"
                cols="10"
                name="productDescription"
                placeholder="Product Description"
                value={formData.productDescription}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        {currentStep === 4 && (
          <>
            <h3>Complete the verification</h3>
            <div className="form-row">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <label>Re-Enter Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-Enter Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="button-group">
        {currentStep > 1 && (
          <button className="prev-button" onClick={handlePreviousStep}>
            Previous
          </button>
        )}
        {currentStep < 4 && (
          <button className="next-button" onClick={handleNextStep}>
            Next
          </button>
        )}
        {currentStep === 4 && (
          <button className="submit-button" onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default SupplierRegisterSteps;
