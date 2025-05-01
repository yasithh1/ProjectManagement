import React, { useState, useEffect } from 'react';
import '../style/ArrangeMeeting.css';

function ArrangeMeeting() {

  const [meetingType, setMeetingType] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [venue, setVenue] = useState('');

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userSelectionType, setUserSelectionType] = useState('selection');

  const [positions] = useState(['all designer', 'all engineer']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8081/api/employee')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching user data:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const meetingData = {
      meetingType,
      date: meetingDate,
      time: meetingTime,
      venue,
      receiver: selectedUsers.join(','),
    };

    if (userSelectionType === 'all') {
      meetingData.receiver = 'all';
    } else if (userSelectionType === 'byPosition') {
      if (selectedUsers.length > 0) {
        meetingData.receiver = selectedUsers.includes('all designer') ? 'all designer' : 'all engineer';
      }
    }

    fetch('http://localhost:8081/api5/meeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingData),
    })
      .then((response) => {
        if (response.ok) {
          alert('Meeting arranged successfully');

          setMeetingType('');
          setMeetingDate('');
          setMeetingTime('');
          setVenue('');
          setSelectedUsers([]);
        } else {
          alert('Failed to arrange meeting');
        }
      })
      .catch((error) => {
        console.error('Error submitting meeting data:', error);
        alert('An error occurred while arranging the meeting');
      });
  };

  const handleUserSelection = (user) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(user.empId)) {
        return prevSelected.filter((u) => u !== user.empId);
      }
      return [...prevSelected, user.empId];
    });
  };

  const handlePositionSelection = (position) => {
    if (position === 'all designer') {
      setSelectedUsers(users.filter((user) => user.position === 'designer').map((user) => user.empId));
    } else if (position === 'all engineer') {
      setSelectedUsers(users.filter((user) => user.position === 'engineer').map((user) => user.empId));
    } else {
      setSelectedUsers([]);
    }
  };

  return (
    <div className="arrange-meeting-form">
      <h2>Arrange a Meeting</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Meeting Type</label>
          <select value={meetingType} onChange={(e) => setMeetingType(e.target.value)} required>
            <option value="">Select Meeting Type</option>
            <option value="Team Meeting">Team Meeting</option>
            <option value="Client Meeting">Client Meeting</option>
            <option value="Project Meeting">Project Meeting</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Time</label>
          <input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Venue</label>
          <select value={venue} onChange={(e) => setVenue(e.target.value)} required>
            <option value="">Select Venue</option>
            <option value="Conference Room 1">Conference Room 1</option>
            <option value="Conference Room 2">Conference Room 2</option>
            <option value="Online">Online</option>
          </select>
        </div>

        <div className="form-group">
          <label>To Whom</label>
          <select
            value={userSelectionType}
            onChange={(e) => {
              setUserSelectionType(e.target.value);
              setSelectedUsers([]);
            }}
          >
            <option value="selection">Select Option</option>
            <option value="select">Select User</option>
            <option value="byPosition">By Position</option>
            <option value="all">All Users</option>
          </select>

          {userSelectionType === 'byPosition' && (
            <div>
              <label>Position</label>
              <select onChange={(e) => handlePositionSelection(e.target.value)}>
                <option value="">Select Position</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          )}

          {userSelectionType === 'select' && (
            <div className="user-selection">
              {users.map((user) => (
                <label key={user.empId}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.empId)}
                    onChange={() => handleUserSelection(user)}
                  />
                  {user.firstName} {user.lastName}
                </label>
              ))}
            </div>
          )}
        </div>

        <button type="submit">Arrange Meeting</button>
      </form>
    </div>
  );
}

export default ArrangeMeeting;
