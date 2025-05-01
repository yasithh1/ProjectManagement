import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/AdminLogin.css";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:8081/api/login", {
        email,
        password,
      });

      if (response.status === 200 && response.data) {
        // Assuming response.data contains the employer details on successful login
        navigate("/admin-dashboard"); // Navigate to Admin Dashboard
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Error connecting to server.");
    }
  };

  return (
    <div id="login-form">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
