import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Navbar.css';

function Navbar({ setRole, handleSignOut }) {
  const navigate = useNavigate();
  
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    profilePic: '',
  });
  
  const [imageLoading, setImageLoading] = useState(true);  // Track loading state of the image

  useEffect(() => {
    const savedFirstName = localStorage.getItem('firstName');
    const savedLastName = localStorage.getItem('lastName');
    const savedProfilePic = localStorage.getItem('profilePic');

    // If profile picture is byte data, convert it to Base64
    let profilePicUrl = '';
    if (savedProfilePic) {
      // Assuming savedProfilePic is a base64-encoded byte string
      profilePicUrl = `data:image/jpeg;base64,${savedProfilePic}`; // You might need to adjust the format (jpeg, png, etc.)
    }
    
    if (savedFirstName && savedLastName) {
      setUserDetails({
        firstName: savedFirstName,
        lastName: savedLastName,
        profilePic: profilePicUrl || '',  // Set profile picture URL or fallback to empty string
      });
    }
  }, []);
  
  const profile = () => {
    navigate('/profile');
  };

  const signout = () => {
    handleSignOut();
    navigate('/'); // Redirect to Sign-In page
  };

  const handleImageLoad = () => {
    setImageLoading(false);  // Set image loading to false once the image is loaded
  };

  return (
    <div className="navbar">
      <div className="user-info">
        {/* Notification Material Icon */}
        <button className="notification-btn" onClick={() => console.log('Notifications clicked')}>
          <span className="material-icons notification-icon">notifications</span>
        </button>

        {/* User Name and Profile Picture */}
        <span className="user-name">{userDetails.firstName} {userDetails.lastName}</span>

        <img 
          src={userDetails.profilePic && userDetails.profilePic !== "null" ? userDetails.profilePic : 'defaultuser.png'}  
          alt="Profile" 
          className={`profile-pic ${imageLoading ? 'loading' : ''}`} 
          onClick={profile}
          onLoad={handleImageLoad}  // Handle the image load event
          onError={(e) => e.target.src = 'defaultuser.png'} // Fallback to default if image fails
        />
        <button className="signout" onClick={signout}>Sign Out</button>
      </div>
    </div>
  );
}

export default Navbar;
