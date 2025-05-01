import React, { useState, useEffect } from 'react';

function ManageDesigns() {
  const [designs, setDesigns] = useState([]);
  const [approvedDesigns, setApprovedDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);

  const fetchDesigns = async () => {
    try {
      const response = await fetch('http://localhost:8081/api7/ongoing/for-approval');
      if (response.ok) {
        const data = await response.json();
        setDesigns(data);
        console.log('Fetched designs for approval:', data);
      } else {
        console.error('Failed to fetch designs');
      }
    } catch (error) {
      console.error('Error fetching designs:', error);
    }
  };

  const fetchApprovedDesigns = async () => {
    try {
      const response = await fetch('http://localhost:8081/api7/ongoing/approved');
      if (response.ok) {
        const data = await response.json();
        setApprovedDesigns(data);
        console.log('Fetched approved designs:', data);
      } else {
        console.error('Failed to fetch approved designs');
      }
    } catch (error) {
      console.error('Error fetching approved designs:', error);
    }
  };

  useEffect(() => {
    fetchDesigns();
    fetchApprovedDesigns();
  }, []);

  const handleViewImage = (design) => {
    setSelectedDesign(design);
    console.log('Selected design for viewing:', design);
  };

  const handleUpdateStatus = async (odesignId) => {
    console.log('Updating status for designId:', odesignId);

    const formData = new FormData();
    formData.append('oDesignId', odesignId);
    formData.append('status', 'approved');

    console.log('Form data:', formData);

    try {
      const response = await fetch('http://localhost:8081/api7/ongoing/upload', {
        method: 'PUT',
        body: formData,
      });

      console.log('Response:', response);

      if (response.ok) {
        fetchDesigns();
        fetchApprovedDesigns(); // Refresh both lists
        alert('Design status updated to approved!');
      } else {
        const errorText = await response.text();
        console.error('Failed to update status:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
      <h2>Manage Designs</h2>
      <h3>Designs for Approval</h3>
      <table>
        <thead>
          <tr>
            <th>Design Name</th>
            <th>Design Type</th>
           
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {designs.map((design) => (
            <tr key={design.odesignId}>
              <td>{design.designName}</td>
              <td>{design.designType}</td>
             
              <td>
                <button onClick={() => handleViewImage(design)}>View</button>
                <button onClick={() => handleUpdateStatus(design.odesignId)}>Approve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDesign && (
        <div>
          <h3>Selected Design: {selectedDesign.designName}</h3>
          {renderImage(selectedDesign)}
        </div>
      )}

      <h3>Approved Designs</h3>
      <table>
        <thead>
          <tr>
            <th>Design Name</th>
            <th>Design Type</th>
         
          </tr>
        </thead>
        <tbody>
          {approvedDesigns.map((design) => (
            <tr key={design.odesignId}>
              <td>{design.designName}</td>
              <td>{design.designType}</td>
            
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const renderImage = (selectedDesign) => {
  if (!selectedDesign || !selectedDesign.design) return null;

  const byteCharacters = atob(selectedDesign.design);
  const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' });
  const imageUrl = URL.createObjectURL(blob);

  return <img src={imageUrl} alt={selectedDesign.designName} />;
};

export default ManageDesigns;
