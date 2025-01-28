import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    // Check if fields are empty
    if (username === '' || password === '') {
      alert('Please fill in all fields.');
      return;
    }

    axios.post('http://localhost:5000/login', { username, password })
      .then((response) => {
        localStorage.setItem('token', response.data.token); // Store token
        alert('Login Successful!');
        navigate('/aptitude'); // Redirect to aptitude test page
      })
      .catch((error) => {
        console.error(error);
        alert('Invalid credentials');
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
