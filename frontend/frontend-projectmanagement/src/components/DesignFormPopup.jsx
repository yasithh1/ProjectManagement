import React, { useState, useEffect } from "react";
import axios from "axios";

const DesignFormPopup = ({ closePopup }) => {
  const [designType, setDesignType] = useState("");
  const [outletData, setOutletData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [contractData, setContractData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [daysFromToday, setDaysFromToday] = useState(0);
  const [formData, setFormData] = useState({
    outletName: "",
    outletId: "",
    locationId: "",
    designName: "",
    expectedTime: "",
    designer: "", // Initially empty
  });
  const [designerId, setDesignerId] = useState("");

  // Fetch the designer ID from localStorage when the component mounts
  useEffect(() => {
    const designer = localStorage.getItem("empId");
    if (designer) {
      setDesignerId(designer); // Store designer ID in the state
    }
  }, []); // Empty dependency array ensures this runs once on component mount

  // Fetch outlet data when "current design" is selected
  const fetchOutletData = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api3/outlet");
      setOutletData(response.data);
    } catch (error) {
      console.error("Error fetching outlet data", error);
    }
  };

  // Fetch contract data for new outlet design
  const fetchContractData = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api4/contract");
      setContractData(response.data);
    } catch (error) {
      console.error("Error fetching contract data", error);
    }
  };

  // Fetch location data based on contract selection
  const fetchLocationData = async (contractId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api4/location/${contractId}`);
      setLocationData(response.data);
    } catch (error) {
      console.error("Error fetching location data", error);
    }
  };

  useEffect(() => {
    if (designType === "current") {
      fetchOutletData();
    } else if (designType === "new") {
      fetchContractData();
    }
  }, [designType]);

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle date selection and calculate days from today
  const handleDateChange = (e) => {
    const selected = new Date(e.target.value);
    const today = new Date();
    const differenceInTime = selected - today;
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    setSelectedDate(e.target.value);
    setDaysFromToday(differenceInDays);
    setFormData((prevState) => ({
      ...prevState,
      expectedTime: differenceInDays,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      designName: formData.designName,
      expectedTime: selectedDate,
      designType: designType,
      designId: formData.outletId,
      status: "ongoing",
      designer: designerId, // Send designer ID directly from the state
    };

    try {
      await axios.post("http://localhost:8081/api7/ongoing/design", data);
      alert("Design saved successfully!");
      closePopup();
    } catch (error) {
      console.error("Error saving design", error);
    }
  };

  return (
    <div className="popup-container">
      <form onSubmit={handleSubmit} className="popup-form">
        <h2>Create Design</h2>
        <label>
          Select Design Type:
          <select
            name="designType"
            value={designType}
            onChange={(e) => setDesignType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="new">New Design</option>
            <option value="current">Current Design</option>
          </select>
        </label>

        {/* Current Design Section */}
        {designType === "current" && (
          <>
            <label>
              Outlet Name:
              <select
                name="outletName"
                onChange={handleChange}
                value={formData.outletName}
              >
                <option value="">Select Outlet</option>
                {outletData.map((outlet) => (
                  <option key={outlet.outletId} value={outlet.outletname}>
                    {outlet.outletname}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {/* New Design Section */}
        {designType === "new" && (
          <>
            <label>
              Select Contract ID:
              <select
                name="contractId"
                onChange={(e) => {
                  fetchLocationData(e.target.value);
                }}
              >
                <option value="">Select Contract</option>
                {contractData.map((contract) => (
                  <option key={contract.contractId} value={contract.contractId}>
                    {contract.contractId}
                  </option>
                ))}
              </select>
            </label>

            {/* Location Selection */}
            {locationData.length > 0 && (
              <label>
                Location ID:
                <select
                  name="locationId"
                  value={formData.locationId}
                  onChange={handleChange}
                >
                  <option value="">Select Location</option>
                  {locationData.map((location) => (
                    <option key={location.locationId} value={location.locationId}>
                      {location.locationId} - {location.province} - {location.district}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </>
        )}

        {/* Date Selection and Display */}
        <label>
          Expected Date:
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            required
          />
        </label>
        {selectedDate && <p>Days from today: {daysFromToday}</p>}

        <label>
          Design Name:
          <input
            type="text"
            name="designName"
            value={formData.designName}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Save Design</button>
        <button type="button" onClick={closePopup}>Close</button>
      </form>
    </div>
  );
};

export default DesignFormPopup;
