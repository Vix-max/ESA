import React, { useState } from 'react';
import './AdminLogin.css';
import user from '../media/user.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing icons
import axios from 'axios';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // Added state for password visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/admin/login', {
        username,
        password,
      }, { withCredentials: true });
      const userRole = response.data.role;
      if (userRole === 'Admin') {
        navigate('/admin-dashboard/dashboard');
      } else if (userRole === 'staff') {
        navigate('/staffdashboard');
      }
    } catch (error) {
      toast.error('Invalid username or password. Please try again');
    }
  };

  return (
    <div>
      <div className='adminLogin-container'>
        <div className='adminLogin-content'>
          <img src={user} alt="user" className="adminLogin-user-image" />
          <h1 className='adminLogin-form-h1'>Admin Login</h1>
          <p className='adminLogin-form-p'>Please Enter your credentials below</p>
          <form className='adminLogin-form' onSubmit={handleLogin}>
            <div className="admininput-group">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="admininput-group">
              <input
                type={passwordVisible ? "text" : "password"} // Toggle password visibility
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle-icon"
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle the state
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit" className="adminLogin-login">Login</button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
