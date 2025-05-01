import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Signin.css';

function Signin() {
  const navigate = useNavigate();
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.go(1);  // Prevents backward navigation
  };
  
  const navigateSignin = (option) => {
    switch (option) {
      case 'staff':
        navigate('/sign-in/staff');
        break;
      case 'supplier':
        navigate('/sign-in/supplier');
        break;
      default:
        console.error("Invalid user type");
    }
  };

  return (
    <div className="sign-in-container">
      <h2>WELCOME</h2>
      <p>Select your account type</p>
      <div className="input-fields">
        <button onClick={() => navigateSignin('staff')}>STAFF</button>
        <button onClick={() => navigateSignin('supplier')}>SUPPLIER</button>
      </div>
    </div>
  );
}

export default Signin;
