import React, { useState, useEffect } from 'react';
import axios from 'axios';
import'../style/Designs.css';

function Designs() {
  const [designs, setDesigns] = useState([]);
  const [image, setImage] = useState(null);
  const [newDesign, setNewDesign] = useState({
    designName: '',
    locationId: '',
    updatedBy: '',
    status: 'Pending',
    file: null
  });
  const [editDesign, setEditDesign] = useState(null);
  const [outlets, setOutlets] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');

  const empId = localStorage.getItem('empId');

  // Fetch all designs
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get('http://localhost:8081/design/all');
        setDesigns(response.data || []);
      } catch (error) {
        console.error("Error fetching designs", error);
        setError("Error fetching designs");
      }
    };
    fetchDesigns();
  }, []);

  // Fetch outlets
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api3/outlet');
        setOutlets(response.data || []);
        console.log(response.data); // Log the outlets to check the structure
      } catch (error) {
        console.error("Error fetching outlets", error);
        setError("Error fetching outlets");
      }
    };
    fetchOutlets();
  }, []);
  
  // Update the updatedBy field when the component loads
  useEffect(() => {
    if (empId) {
      setNewDesign(prevState => ({
        ...prevState,
        updatedBy: empId
      }));
    }
  }, [empId]);

  // Handle file input change for new design
  const handleFileChange = (e) => {
    if (editDesign) {
      setEditDesign({
        ...editDesign,
        file: e.target.files[0],
      });
    } else {
      setNewDesign({
        ...newDesign,
        file: e.target.files[0],
      });
    }
  };

  // Handle outlet selection
  const handleOutletChange = (e) => {
    const selectedOutlet = outlets.find(outlet => outlet.outletId === parseInt(e.target.value));
    console.log("Selected outlet ID:", selectedOutlet);

    if (selectedOutlet) {
      if (editDesign) {
        setEditDesign({
          ...editDesign,
          designName: selectedOutlet.outletname,
          locationId: selectedOutlet.location.locationId,
        });
      } else {
        setNewDesign({
          ...newDesign,
          designName: selectedOutlet.outletname,
          locationId: selectedOutlet.location.locationId,
        });
      }
    }
  };

  // Handle design upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!newDesign.designName || !newDesign.file) {
      setError("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("designName", newDesign.designName);
    formData.append("location_id", newDesign.locationId);
    formData.append("updatedBy", newDesign.updatedBy);
    formData.append("status", newDesign.status);
    formData.append("design", newDesign.file);
    formData.append("updatedTime", new Date().toISOString().split('T')[0]);

    try {
      const response = await axios.post('http://localhost:8081/design/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDesigns([...designs, response.data]);
      setNewDesign({
        designName: '',
        locationId: '',
        updatedBy: empId,
        status: 'Pending',
        file: null
      });
    } catch (error) {
      console.error("Error uploading design", error);
      setError("Error uploading design");
    }
  };

  // Handle design update
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editDesign.designName || !editDesign.file) {
      setError("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("designName", editDesign.designName);
    formData.append("location_id", editDesign.locationId);
    formData.append("updatedBy", editDesign.updatedBy);
    formData.append("status", "Pending");
    formData.append("design", editDesign.file);
    formData.append("updatedTime", new Date().toISOString().split('T')[0]);

    try {
      const response = await axios.put(`http://localhost:8081/design/update/${editDesign.designId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDesigns(designs.map(design => design.designId === response.data.designId ? response.data : design));
      setEditDesign(null);
    } catch (error) {
      console.error("Error updating design", error);
      setError("Error updating design");
    }
  };

  // Handle design download
  const handleDownload = async (designId) => {
    try {
      const response = await axios.get(`http://localhost:8081/design/view-image/${designId}`, { responseType: 'arraybuffer' });
      const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'design.jpg';
      link.click();

      const updatedDesign = {
        status: 'Downloaded',
        updatedBy: empId
      };

      await axios.put(`http://localhost:8081/design/update/${designId}`, null, {
        params: updatedDesign
      });

      // Refresh the designs data
      const refreshedDesigns = await axios.get('http://localhost:8081/design/all');
      setDesigns(refreshedDesigns.data || []);
    } catch (error) {
      console.error("Error downloading image", error);
      setError("Error downloading image");
    }
  };

  // Handle view design
  const handleView = async (designId) => {
    try {
      const response = await axios.get(`http://localhost:8081/design/view-image/${designId}`, { responseType: 'arraybuffer' });
      const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImage(imageUrl);
    } catch (error) {
      console.error("Error viewing image", error);
      setError("Error viewing image");
    }
  };

  // Handle notifying the user
  const handleNotify = (updatedBy) => {
    setNotification(`Please contact ${updatedBy} to download the design.`);
  };

  // Handle edit button click
  const handleEdit = (design) => {
    setEditDesign({
      ...design,
      updatedBy: empId,
      status: 'Pending',
      file: null // Reset the file
    });
  };

  return (
    <div className="designs-container">
      <h2 className="designs-title">Designs</h2>
      <div className="designs-form-container">
        <h3 className="designs-form-title">{editDesign ? 'Edit Design' : 'Upload a New Design'}</h3>
        <form onSubmit={editDesign ? handleUpdate : handleUpload} className="designs-form">
          <label htmlFor="outletSelect" className="designs-label">Outlet</label>
          <select
            id="outletSelect"
            name="locationId"
            value={editDesign ? editDesign.locationId : newDesign.locationId}
            onChange={handleOutletChange}
            className="designs-select"
          >
            <option value="">Select Outlet</option>
            {outlets.map((outlet) => (
              <option key={outlet.outletId} value={outlet.outletId}>
                {outlet.outletname}
              </option>
            ))}
          </select>

          <label htmlFor="updatedBy" className="designs-label">Updated By</label>
          <input
            type="text"
            id="updatedBy"
            name="updatedBy"
            value={editDesign ? editDesign.updatedBy : newDesign.updatedBy}
            readOnly
            placeholder="Updated By"
            className="designs-input"
          />

          <input
            type="text"
            id="designName"
            name="designName"
            value={editDesign ? editDesign.designName : newDesign.designName}
            readOnly
            placeholder="Design Name"
            className="designs-input"
          />
          
          <input
            type="text"
            id="locationId"
            name="locationId"
            value={editDesign ? editDesign.locationId : newDesign.locationId}
            readOnly
            placeholder="Location ID"
            className="designs-input"
          />
          <label htmlFor="file" className="designs-label">Design File</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            required
            className="designs-input"
          />
          
          <button type="submit" className="designs-button">{editDesign ? 'Update Design' : 'Upload Design'}</button>
          {error && <p className="designs-error">{error}</p>}
        </form>
      </div>

      <div className="designs-table-container">
        <h3 className="designs-table-title">All Designs</h3>
        <table className="designs-table">
          <thead>
            <tr>
              <th>Outlet Name</th>
              <th>Updated By / Downloaded By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {designs.map((design) => (
              <tr key={design.designId}>
                <td>{design.designName}</td>
                <td>{design.status === 'Downloaded' ? 'Download' : 'Update'}: {design.updatedBy}</td>
                <td>{design.status}</td>
                <td>
                  <button onClick={() => handleView(design.designId)} className="designs-button">View</button>
                  <button onClick={() => handleDownload(design.designId)} disabled={design.updatedBy && design.updatedBy !== empId} className="designs-button">
                    Download
                  </button>
                  {design.updatedBy === empId && design.status === 'Downloaded' && (
                    <button onClick={() => handleEdit(design)} className="designs-button">Edit</button>
                  )}
                  <button onClick={() => handleNotify(design.updatedBy)} disabled={design.updatedBy && design.updatedBy === empId} className="designs-button">
                    Notify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="designs-divider"></div>

      <div className="designs-image-container">
        {image && <img src={image} alt="Design" className="designs-image" />}
        {error && <p className="designs-error">{error}</p>}
        {notification && <p className="designs-notification">{notification}</p>}
      </div>
    </div>
  );
}

export default Designs;

