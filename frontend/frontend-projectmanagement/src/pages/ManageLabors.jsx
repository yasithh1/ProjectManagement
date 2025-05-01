import React, { useEffect, useState } from 'react';
import SmallTile from '../components/SmallTile';
import { FaEdit, FaTrashAlt, FaEye, FaPlus, FaTimes, FaArrowRight } from 'react-icons/fa'; // Import icons
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManageLabors() {
  const [labors, setLabors] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [laborToUpdate, setLaborToUpdate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: '',
    charge: '',
  });
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedLabor, setSelectedLabor] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [isLaborAssignable, setIsLaborAssignable] = useState(true);

  // Fetch labors data
  useEffect(() => {
    const fetchLabors = async () => {
      try {
        const response = await fetch('http://localhost:8081/api2/labor');
        const data = await response.json();
        if (Array.isArray(data)) {
          setLabors(data);
        } else {
          console.error('Expected an array of labors');
        }
      } catch (error) {
        console.error('Error fetching labors:', error);
        toast.error('Error fetching labors');
      }
    };
    fetchLabors();
  }, []);

  useEffect(() => {
    const checkLaborAssignable = async (laborId) => {
      try {
        const response = await fetch(`http://localhost:8081/api/labor-requests/check-assignable/${laborId}`);
        const data = await response.json();
        setIsLaborAssignable(data.isAssignable);
      } catch (error) {
        console.error('Error checking labor assignability:', error);
        setIsLaborAssignable(false);
      }
    };

    if (selectedLabor) {
      checkLaborAssignable(selectedLabor.laborId);
    }
  }, [selectedLabor]);

  // Fetch all requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/labor-requests/requests');
        const data = await response.json();
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          console.error('Expected an array of requests');
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Error fetching requests');
      }
    };

    if (selectedAction === 'assign') {
      fetchRequests();
    }
  }, [selectedAction]);

  const handleAddLabor = async () => {
    // Check empty
    let newId = 'LAB0001'; 
    if (labors.length > 0) {
      // Get the last labor and calculate the next ID
      const lastLabor = labors[labors.length - 1];
      newId = `LAB${(parseInt(lastLabor.laborId.replace('LAB', '')) + 1).toString().padStart(4, '0')}`;
    }

    const newLabor = {
      laborId: newId,
      name: formData.name,
      phone: formData.phone,
      type: formData.type,
      charge: formData.charge,
    };

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api2/labor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLabor),
      });

      const addedLabor = await response.json();
      setLabors((prevLabors) => [...prevLabors, addedLabor]);
      setFormData({ name: '', phone: '', type: '', charge: '' }); // Clear fields
      toast.success('Labor added successfully!');
    } catch (error) {
      console.error('Error adding labor:', error);
      toast.error('Error adding labor');
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Labor with confirmation
  const handleDeleteLabor = async (laborId) => {
    const confirmed = window.confirm('Are you sure you want to delete this labor?');
    if (confirmed) {
      try {
        await fetch(`http://localhost:8081/api2/${laborId}`, { method: 'DELETE' });
        setLabors(labors.filter((labor) => labor.laborId !== laborId));
        toast.success('Labor deleted successfully!');
      } catch (error) {
        console.error('Error deleting labor:', error);
        toast.error('Error deleting labor');
      }
    }
  };

  // Handle Update Labor
  const handleUpdateLabor = async () => {
    try {
      const updatedLabor = {
        laborId: laborToUpdate.laborId, 
        name: formData.name,
        phone: formData.phone,
        type: formData.type,
        charge: formData.charge,
      };

      const response = await fetch(`http://localhost:8081/api2/${laborToUpdate.laborId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLabor),
      });

      const updatedData = await response.json();
      setLabors(
        labors.map((labor) =>
          labor.laborId === laborToUpdate.laborId ? { ...labor, ...updatedData } : labor
        )
      );
      setLaborToUpdate(null);
      setFormData({ name: '', phone: '', type: '', charge: '' }); // Clear fields
      toast.success('Labor updated successfully!');
    } catch (error) {
      console.error('Error updating labor:', error);
      toast.error('Error updating labor');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // When a labor is selected for update auto fill the labor data to
  useEffect(() => {
    if (laborToUpdate) {
      setFormData({
        name: laborToUpdate.name,
        phone: laborToUpdate.phone,
        type: laborToUpdate.type,
        charge: laborToUpdate.charge,
      });
    }
  }, [laborToUpdate]);

  // Handle Assign Labor
  const handleAssignLabor = async () => {
    if (!selectedLabor || !selectedRequestId) {
      alert('Please select a labor and a request ID');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/labor-requests/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestedID: parseInt(selectedRequestId), laborId: selectedLabor.laborId, date: new Date().toISOString().split('T')[0] }),
      });
    
      if (response.ok) {
        toast.success('Labor assigned successfully!');
        setSelectedRequestId('');
      } else {
        toast.error('Failed to assign labor');
      }
    } catch (error) {
      console.error('Error assigning labor:', error);
      toast.error('Error assigning labor');
    } finally {
      setLoading(false);
    }
  };

  // Render the Labor Table
  const renderViewTable = () => (
    <table className="labor-table">
      <thead>
        <tr>
          <th>Labor ID</th>
          <th>Name</th>
          <th>Contact</th>
          <th>Type</th>
          <th>Charge</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {labors.map((labor) => (
          <tr key={labor.laborId} onClick={() => setSelectedLabor(labor)}>
            <td>{labor.laborId}</td>
            <td>{labor.name}</td>
            <td>{labor.phone}</td>
            <td>{labor.type}</td>
            <td>{labor.charge}</td>
            <td>
              <button onClick={() => setLaborToUpdate(labor)} className="update-button">
                <FaEdit /> Update
              </button>
              <button onClick={() => handleDeleteLabor(labor.laborId)} className="delete-button">
                <FaTimes /> Delete
              </button>
              <button 
                onClick={() => { setSelectedAction('assign'); setSelectedLabor(labor); }} 
                className="assign-button" 
                disabled={!isLaborAssignable || selectedAction === 'view'}
              >
                <FaArrowRight /> Assign
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Render the Register Form
  const renderRegisterForm = () => (
    <form
      className="register-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleAddLabor();
      }}
    >
      <h2>Register New Labor</h2>
      
      <label>
        Labor Name:
        <input
          type="text"
          name="name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </label>
      <label>
        Contact:
        <input
          type="text"
          name="phone"
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </label>
      <label>
        Type:
        <input
          type="text"
          name="type"
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        />
      </label>
      <label>
        Day Charge:
        <input
          type="text"
          name="charge"
          onChange={(e) => setFormData({ ...formData, charge: e.target.value })}
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        <FaPlus /> Register Labor
      </button>
    </form>
  );

  // Render the Update Form
  const renderUpdateForm = () => {
    if (!laborToUpdate) return null;

    return (
      <form
        className="update-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateLabor();
        }}
      >
        <h2>Update Labor</h2>
        <label>
          Labor Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Contact:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Day Charge:
          <input
            type="text"
            name="charge"
            value={formData.charge}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          <FaEdit /> Update Labor
        </button>
      </form>
    );
  };

  // Render the Assign Form
  const renderAssignForm = () => (
    <div className="assign-form">
      <h2>Assign Labor</h2>
      <label>
        Request ID:
        <select
          value={selectedRequestId}
          onChange={(e) => setSelectedRequestId(e.target.value)}
          required
        >
          <option value="">Select Request ID</option>
          {requests.map((request) => (
            <option key={request.requestId} value={request.requestId}>
              {request.requestId}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleAssignLabor} disabled={!isLaborAssignable || loading}>
        <FaArrowRight /> Assign Labor
      </button>
    </div>
  );

  // Tiles for actions
  const tiles = [
    { name: 'View', icon: <FaEye />, color: '#4CAF50', action: 'view' },
    { name: 'Register', icon: <FaPlus />, color: '#2196F3', action: 'register' },
  ];

  return (
    <div className="manage-labors">
      <div className="small-tiles-container">
        {tiles.map((tile, index) => (
          <SmallTile
            key={index}
            tile={tile}
            onClick={() => {
              setSelectedAction(tile.action);
              if (tile.action === 'register') {
                setLaborToUpdate(null); // Reset if switching to register
              }
            }}
          />
        ))}
      </div>

      {selectedAction === 'view' && renderViewTable()}
      {selectedAction === 'register' && renderRegisterForm()}
      {laborToUpdate && renderUpdateForm()}
      {selectedAction === 'assign' && selectedLabor && renderAssignForm()}

      <ToastContainer />
    </div>
  );
}

export default ManageLabors;
