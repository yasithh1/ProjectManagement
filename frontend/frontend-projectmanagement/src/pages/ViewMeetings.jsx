import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/ViewMeetings.css";

const ViewMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMeetings = async () => {
      const empId = localStorage.getItem("empId");
      const position = localStorage.getItem("position");

      try {
        const response = await axios.get("http://localhost:8081/api5/meetings");
        if (response && response.status === 200) {
          const allMeetings = response.data;

          // Filter meetings based on the empId and position
          const filteredMeetings = allMeetings.filter(meeting => {
            const receiver = meeting.receiver;
            if (receiver === 'all') {
              return true; // Show meeting for all
            } else if (receiver === 'all designer' && position === 'designer') {
              return true; // Show meeting for all designers
            } else if (receiver === 'all engineer' && position === 'engineer') {
              return true; // Show meeting for all engineers
            } else if (receiver.split(',').includes(empId)) {
              return true; // Show meeting if the empId is explicitly listed
            }
            return false; // Otherwise, do not show meeting
          });

          setMeetings(filteredMeetings);
        } else {
          setErrorMessage("Failed to fetch meetings");
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Error fetching meetings data");
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div className="view-meetings">
      <h2>Meetings</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <table>
        <thead>
          <tr>
            <th>Meeting Type</th>
            <th>Date</th>
            <th>Venue</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((meeting) => (
            <tr key={meeting.meeting_id}>
              <td>{meeting.meetingType}</td>
              <td>{new Date(meeting.date).toLocaleDateString()}</td>
              <td>{meeting.venue}</td>
              <td>{meeting.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewMeetings;
