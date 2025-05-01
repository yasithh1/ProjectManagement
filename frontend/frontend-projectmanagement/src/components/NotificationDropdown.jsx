import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/NotificationDropdown.css';

const NotificationDropdown = ({ employeeId }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (employeeId) {
        console.log('Fetching notifications for employee:', employeeId); // Debug log
        try {
          const response = await axios.get(`http://localhost:8081/api/notifications/${employeeId}`);
          console.log('Notifications fetched:', response.data); // Debug log
          setNotifications(response.data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      } else {
        console.error('Employee ID is missing. Showing default message.'); // Debug log
      }
    };

    fetchNotifications();
  }, [employeeId]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8081/api/notifications/${id}/markAsRead`);
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="notification-dropdown">
      <button className="notification-btn" onClick={toggleDropdown}>
        <span className="material-icons notification-icon">notifications</span>
        {unreadCount > 0 && (
          <span className="unread-count">{unreadCount}</span>
        )}
      </button>
      {showDropdown && (
        <div className="dropdown-content">
          {employeeId ? (
            notifications.length === 0 ? (
              <p className="no-notifications">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? '' : 'unread'}`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  {notification.message}
                </div>
              ))
            )
          ) : (
            <p className="no-notifications">No employee ID available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
