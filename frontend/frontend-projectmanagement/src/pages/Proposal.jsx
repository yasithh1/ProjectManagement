import React, { useState, useEffect } from 'react';
import '../style/Proposal.css';  // Import CSS for styling

function Proposal() {
  const [proposals, setProposals] = useState([]);

  // Fetch proposal data from API
  useEffect(() => {
    fetch('http://localhost:8081/api3/propose') // Ensure this URL is correct as per your backend
      .then((response) => response.json())
      .then((data) => setProposals(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Handle approve button click
  const handleApprove = (proposeId) => {
    console.log(`Proposal ${proposeId} approved`);

    // Send API request to update rejectApprove field to "approve"
    fetch(`http://localhost:8081/api3/propose/${proposeId}/status?rejectApprove=approve`, {
      method: 'PUT', // Use PUT method here
      headers: {
        'Content-Type': 'application/json',
        // Add authentication token or other headers if required
      },
    })
    .then((response) => {
      if (response.ok) {
        // Update the specific proposal status locally without affecting others
        setProposals((prevProposals) =>
          prevProposals.map((proposal) =>
            proposal.proposeId === proposeId
              ? { ...proposal, rejectApprove: 'approve' } // Update only the clicked proposal
              : proposal
          )
        );
      } else {
        console.error('Failed to approve proposal');
      }
    })
    .catch((error) => console.error('Error approving proposal:', error));
  };

  // Handle reject button click
  const handleReject = (proposeId) => {
    console.log(`Proposal ${proposeId} rejected`);

    // Send API request to update rejectApprove field to "reject"
    fetch(`http://localhost:8081/api3/propose/${proposeId}/status?rejectApprove=reject`, {
      method: 'PUT', // Use PUT method here
      headers: {
        'Content-Type': 'application/json',
        // Add authentication token or other headers if required
      },
    })
    .then((response) => {
      if (response.ok) {
        // Update the specific proposal status locally without affecting others
        setProposals((prevProposals) =>
          prevProposals.map((proposal) =>
            proposal.proposeId === proposeId
              ? { ...proposal, rejectApprove: 'reject' } // Update only the clicked proposal
              : proposal
          )
        );
      } else {
        console.error('Failed to reject proposal');
      }
    })
    .catch((error) => console.error('Error rejecting proposal:', error));
  };

  return (
    <div className="proposal-container">
      <h2>Proposal List</h2>
      <table className="proposal-table">
        <thead>
          <tr>
            <th>Propose ID</th>
            <th>Proposed By</th>
            <th>Location ID</th>
            <th>Date</th>
            <th>Type</th>
            <th>Details</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((proposal) => (
            <tr key={proposal.proposeId}>
              <td>{proposal.proposeId}</td>
              <td>{proposal.proposedBy}</td>
              <td>{proposal.location.locationId}</td>
              <td>{proposal.date}</td>
              <td>{proposal.type}</td>
              <td>{proposal.details}</td>
              <td>{proposal.rejectApprove}</td> {/* Display the rejectApprove status */}
              <td>
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(proposal.proposeId)}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(proposal.proposeId)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Proposal;
