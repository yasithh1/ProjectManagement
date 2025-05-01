import React, { useState, useEffect } from 'react';
import SmallTile from '../components/SmallTile';
import '../style/Location.css';  // CSS for layout and styling

function Locations() {
  const [selectedTile, setSelectedTile] = useState(null);
  const [selectedProposalStatus, setSelectedProposalStatus] = useState(null);
  const [data, setData] = useState([]);

  // Fetch data based on the selected tile
  useEffect(() => {
    if (selectedTile === 'proposal') {
      fetch('http://localhost:8081/api3/propose')
        .then((response) => response.json())
        .then((data) => {
          // Filter data based on proposal status (approve/reject)
          if (selectedProposalStatus) {
            setData(data.filter((item) => item.rejectApprove === selectedProposalStatus));
          } else {
            setData(data);
          }
        })
        .catch((error) => console.error('Error fetching proposals:', error));
    } else if (selectedTile === 'outlet') {
      fetch('http://localhost:8081/api3/outlet')
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.error('Error fetching outlets:', error));
    }
  }, [selectedTile, selectedProposalStatus]);  // Depend on tile selection

  // Handle delete button click
  const handleDelete = (id) => {
    // Define delete URL based on selected tile
    const deleteUrl = selectedTile === 'proposal'
      ? `http://localhost:8081/api3/locations/${id}` 
      : `http://localhost:8081/api3/locations/${id}`;

    fetch(deleteUrl, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          // Refresh the data after deletion
          setData((prevData) => prevData.filter((item) => item.proposeId !== id && item.outletid !== id));
        } else {
          console.error('Failed to delete record');
        }
      })
      .catch((error) => console.error('Error deleting record:', error));
  };

  return (
    <div className="locations-container">
      <div className="tile-container">
        <SmallTile tile={{ name: 'Outlets', color: '#4CAF50', icon: 'store' }} onClick={() => { setSelectedTile('outlet'); setSelectedProposalStatus(null); }} />
        <SmallTile tile={{ name: 'Proposals', color: '#2196F3', icon: 'assignment' }} onClick={() => setSelectedTile('proposal')} />
      </div>

      {selectedTile === 'proposal' && (
        <div className="sub-tile-container">
          <SmallTile tile={{ name: 'Approved', color: '#8BC34A', icon: 'check_circle' }} onClick={() => setSelectedProposalStatus('approve')} />
          <SmallTile tile={{ name: 'Rejected', color: '#F44336', icon: 'cancel' }} onClick={() => setSelectedProposalStatus('reject')} />
        </div>
      )}

      <hr /> {/* Divider */}

      <div className="table-container">
        {selectedTile && (
          <table>
            <thead>
              <tr>
                {selectedTile === 'proposal' ? (
                  <>
                    <th>Propose ID</th>
                    <th>Proposed By</th>
                    <th>Location ID</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Details</th>
                    <th>Status</th>
                    <th>Action</th>
                  </>
                ) : (
                  <>
                    <th>Outlet ID</th>
                    <th>Outlet Name</th>
                    <th>Location ID</th>
                    <th>Profit Status</th>
                    <th>Rent/Purchased</th>
                    <th>Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={selectedTile === 'proposal' ? item.proposeId : item.outletid}>
                  {selectedTile === 'proposal' ? (
                    <>
                      <td>{item.proposeId}</td>
                      <td>{item.proposedBy}</td>
                      <td>{item.location.locationId}</td>
                      <td>{item.date}</td>
                      <td>{item.type}</td>
                      <td>{item.details}</td>
                      <td>{item.rejectApprove}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDelete(item.proposeId)}>Delete</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.outletId}</td>
                      <td>{item.outletname}</td>
                      <td>{item.location.locationId}</td>
                      <td>{item.profitStatus}</td>
                      <td>{item.rentPurchased}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDelete(item.outletid)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Locations;
