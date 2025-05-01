import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/ProposeLocation.css';
import SmallTile from '../components/SmallTile';

function ProposeLocation() {
  const [locations, setLocations] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [formData, setFormData] = useState({
    longitude: '',
    latitude: '',
    locationType: '',
    proposedBy: '',
    details: '',
    district: '',
    province: '',
    outletName: '',
    profitStatus: '',
    rentOrPurchased: '',
  });
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [editingOutletId, setEditingOutletId] = useState(null);
  const [activeForm, setActiveForm] = useState('location'); // Track the active form ('location' or 'outlet')

  // Fetch user ID from local storage
  const empId = localStorage.getItem('empId');
  console.log(empId);

  // Fetch locations and outlets
  useEffect(() => {
    fetchLocations();
    fetchOutlets();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api3/${empId}`);
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchOutlets = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api3/outlet');
      setOutlets(response.data);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    }
  };

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for both location and outlet
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const parsedData = {
      ...formData,
      longitude: parseFloat(formData.longitude),
      latitude: parseFloat(formData.latitude),
      proposedBy: empId, // Add empId to the request payload
      date: new Date().toISOString(), // Add the current date to the request payload
    };
  
    try {
      if (activeForm === 'location') {
        // Structure the locationData to match the desired format
        const locationData = {
          location: {
            longitude: parsedData.longitude,
            latitude: parsedData.latitude,
            district: parsedData.district,
            province: parsedData.province,
          },
          type: parsedData.locationType,
          details: parsedData.details,
          proposedBy: parsedData.proposedBy,  // Use the empId from localStorage
          date: parsedData.date,
        };
  
        if (editingLocationId) {
          await axios.put(`http://localhost:8081/api3/propose/${editingLocationId}`, locationData);
        } else {
          await axios.post('http://localhost:8081/api3/propose', locationData);
        }
        fetchLocations();
      } else if (activeForm === 'outlet') {
        // Structure outletData with location data nested
        const outletData = {
          location: {
            longitude: parsedData.longitude,
            latitude: parsedData.latitude,
            district: parsedData.district,
            province: parsedData.province,
          },
          outletname: parsedData.outletName,
          profitStatus: parsedData.profitStatus,
          rentPurchased: parsedData.rentOrPurchased,
        };
  
        if (editingOutletId) {
          await axios.put(`http://localhost:8081/api3/outlet/${editingOutletId}`, outletData);
        } else {
          await axios.post('http://localhost:8081/api3/outlet', outletData);
        }
        fetchOutlets();
      }
  
      // Reset form after submission
      setFormData({
        longitude: '',
        latitude: '',
        locationType: '',
        proposedBy: '',
        details: '',
        district: '',
        province: '',
        outletName: '',
        profitStatus: '',
        rentOrPurchased: '',
      });
      setEditingLocationId(null);
      setEditingOutletId(null);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  
  // Handle Edit for both Location and Outlet
const handleEdit = (data, type) => {
  if (type === 'location') {
    // Populate form fields with location data
    setFormData({
      longitude: data.location.longitude,
      latitude: data.location.latitude,
      locationType: data.type,
      proposedBy: data.proposedBy,  // Assuming it's coming from backend
      details: data.details,
      district: data.location.district,
      province: data.location.province,
      outletName: '',
      profitStatus: '',
      rentOrPurchased: '',
    });
    setEditingLocationId(data.proposeId); // Set the ID of the location to edit
    setActiveForm('location'); // Switch to location form
  } else if (type === 'outlet') {
    // Populate form fields with outlet data
    setFormData({
      longitude: data.location.longitude,
      latitude: data.location.latitude,
      locationType: '', // Empty for outlet, since it doesn't use location type
      proposedBy: '',  // Outlet does not need this field
      details: '',
      district: data.location.district,
      province: data.location.province,
      outletName: data.outletname,
      profitStatus: data.profitStatus,
      rentOrPurchased: data.rentPurchased,
    });
    setEditingOutletId(data.outletId); // Set the ID of the outlet to edit
    setActiveForm('outlet'); // Switch to outlet form
  }
};

  return (
    <div className="propose-location-container">
      {/* Tiles for Switching between Forms */}
      <div className="small-tiles-containers">
        <SmallTile 
          tile={{ name: 'Propose Location', icon: 'location_on', color: '#5BC0EB' }} 
          onClick={() => setActiveForm('location')} 
        />
        <SmallTile 
          tile={{ name: 'Register Outlet', icon: 'store', color: '#F7B2AD' }} 
          onClick={() => setActiveForm('outlet')} 
        />
      </div>

      {/* Form */}
      <div className="form-container">
        <h2>{activeForm === 'location' ? (editingLocationId ? 'Edit Location' : 'Propose a Location') : (editingOutletId ? 'Edit Outlet' : 'Register an Outlet')}</h2>
        <form onSubmit={handleSubmit} className="location-form">
          <div className="form-group">
            <label>Longitude:</label>
            <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} required />
          </div>

          <div className="form-group">
  <label>Latitude:</label>
  <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} required />
</div>

{/* Select Dropdowns for District and Province */}
<div className="form-group">
  <label>Province:</label>
  <select name="province" value={formData.province} onChange={handleChange} required>
    <option value="">Select Province</option>
    <option value="Western">Western Province</option>
    <option value="Central">Central Province</option>
    <option value="Southern">Southern Province</option>
    <option value="Northern">Northern Province</option>
    <option value="Eastern">Eastern Province</option>
    <option value="North Western">North Western Province</option>
    <option value="North Central">North Central Province</option>
    <option value="Uva">Uva Province</option>
    <option value="Sabaragamuwa">Sabaragamuwa Province</option>
  </select>
</div>

<div className="form-group">
  <label>District:</label>
  <select 
    name="district" 
    value={formData.district} 
    onChange={handleChange} 
    disabled={!formData.province} // Disable district dropdown if no province is selected
    required={formData.province}  // Require district if province is selected
  >
    <option value="">Select District</option>
    {formData.province === "Western" && (
      <>
        <option value="Colombo">Colombo</option>
        <option value="Gampaha">Gampaha</option>
        <option value="Kalutara">Kalutara</option>
      </>
    )}
    {formData.province === "Central" && (
      <>
        <option value="Kandy">Kandy</option>
        <option value="Matale">Matale</option>
        <option value="Nuwara Eliya">Nuwara Eliya</option>
      </>
    )}
    {formData.province === "Southern" && (
      <>
        <option value="Galle">Galle</option>
        <option value="Matara">Matara</option>
        <option value="Hambantota">Hambantota</option>
      </>
    )}
    {formData.province === "Northern" && (
      <>
        <option value="Jaffna">Jaffna</option>
        <option value="Kilinochchi">Kilinochchi</option>
        <option value="Mannar">Mannar</option>
        <option value="Vavuniya">Vavuniya</option>
        <option value="Mullaitivu">Mullaitivu</option>
      </>
    )}
    {formData.province === "Eastern" && (
      <>
        <option value="Trincomalee">Trincomalee</option>
        <option value="Batticaloa">Batticaloa</option>
        <option value="Ampara">Ampara</option>
      </>
    )}
    {formData.province === "North Western" && (
      <>
        <option value="Kurunegala">Kurunegala</option>
        <option value="Puttalam">Puttalam</option>
      </>
    )}
    {formData.province === "North Central" && (
      <>
        <option value="Anuradhapura">Anuradhapura</option>
        <option value="Polonnaruwa">Polonnaruwa</option>
      </>
    )}
    {formData.province === "Uva" && (
      <>
        <option value="Badulla">Badulla</option>
        <option value="Moneragala">Moneragala</option>
      </>
    )}
    {formData.province === "Sabaragamuwa" && (
      <>
        <option value="Ratnapura">Ratnapura</option>
        <option value="Kegalle">Kegalle</option>
      </>
    )}
  </select>
</div>


          {activeForm === 'location' && (
            <>
              <div className="form-group">
                <label>Location Type:</label>
                <select name="locationType" value={formData.locationType} onChange={handleChange} required>
                  <option value="">Select Type</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                  <option value="Suburban">Suburban</option>
                </select>
              </div>
              <div className="form-group">
                <label>Details:</label>
                <textarea name="details" value={formData.details} onChange={handleChange} rows="4" required />
              </div>
            </>
          )}

          {activeForm === 'outlet' && (
            <>
              <div className="form-group">
                <label>Outlet Name:</label>
                <input type="text" name="outletName" value={formData.outletName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Profit Status:</label>
                <select name="profitStatus" value={formData.profitStatus} onChange={handleChange} required>
                  <option value="">Select Status</option>
                  <option value="Profitable">Profitable</option>
                  <option value="Medium">Not Profitable</option>
                  <option value="Low">Not Profitable</option>
                </select>
              </div>
              <div className="form-group">
                <label>Rent or Purchased:</label>
                <select name="rentOrPurchased" value={formData.rentOrPurchased} onChange={handleChange} required>
                  <option value="">Select Option</option>
                  <option value="Rent">Rent</option>
                  <option value="Purchased">Purchased</option>
                </select>
              </div>
            </>
          )}

          <button type="submit">{editingLocationId || editingOutletId ? 'Save Changes' : 'Submit'}</button>
        </form>
      </div>

      {/* Table for Locations */}
      {activeForm === 'location' && (
        <div className="table-container">
          <h3>Registered Locations</h3>
          <table className="location-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Location Type</th>
                <th>Longitude</th>
                <th>Latitude</th>
                
                <th>District</th>
                <th>Province</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.proposeid}>
                  <td>{location.proposeId}</td>
                  <td>{location.type}</td>
                  <td>{location.location.longitude}</td>
                  <td>{location.location.latitude}</td>
                  
                  <td>{location.location.district}</td>
                  <td>{location.location.province}</td>
                  <td>
                    <button onClick={() => handleEdit(location, 'location')}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table for Outlets */}
      {activeForm === 'outlet' && (
        <div className="table-container">
          <h3>Registered Outlets</h3>
          <table className="location-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Longitude</th>
                <th>Latitude</th>
                <th>Outlet Name</th>
                <th>Profit Status</th>
                <th>Status</th>
                <th>District</th>
                <th>Province</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {outlets.map((outlet) => (
                <tr key={outlet.outletLocationId}>
                  <td>{outlet.outletId}</td>
                  <td>{outlet.location.longitude}</td>
                  <td>{outlet.location.latitude}</td>
                  <td>{outlet.outletname}</td>
                  <td>{outlet.profitStatus}</td>
                  <td>{outlet.rentPurchased}</td>
                  <td>{outlet.location.district}</td>
                  <td>{outlet.location.province}</td>
                  <td>
                  <div className="edit-button"><button onClick={() => handleEdit(outlet, 'outlet')}>Edit</button>    </div>              </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProposeLocation;
