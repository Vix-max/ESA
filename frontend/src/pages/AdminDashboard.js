import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import Dashboard from '../components/Dashboard'; 
import Invoices from '../components/Invoices';
import Stock from '../components/Stock'; 
import Analytics from '../components/Analytics'; 
import Customers from '../components/Customers'; 
import Users from '../components/Users'; 
import Cookies from 'js-cookie'; // Import js-cookie
import axios from 'axios';

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const token = Cookies.get('auth_token'); // Get token from cookie
    console.log("Auth-dash-", token);
    const storedAdminName = Cookies.get('adminName'); // Get admin name from cookie
    console.log("Auth-name-", adminName);
    setAdminName(storedAdminName);

    if (!token) {
      toast.error('You need to be logged in to access this page.');
      console.log("You need to be logged in to access this page.");
      navigate('/admin-login'); // Redirect to login page if not authenticated
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = Cookies.get('auth_token'); // Get token from cookies
      await axios.post('http://localhost:8000/api/admin/logout', {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        }
      });
      // Remove cookies after logout
      Cookies.remove('auth_token');
      Cookies.remove('adminName');
      toast.success('Logged out successfully!', {
        autoClose: 2500,
        onClose: () => navigate('/admin-login'),
      });
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };
  
  

  const handleProfileClick = () => {
    setSelectedMenu('profile');
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className='adminDash-logo'>
          <h1>ESA Enterprises</h1>
        </div>
        <ul>
          <li 
            onClick={() => setSelectedMenu('dashboard')} 
            className={selectedMenu === 'dashboard' ? 'active' : ''}
          >
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </li>
          <li 
            onClick={() => setSelectedMenu('invoices')} 
            className={selectedMenu === 'invoices' ? 'active' : ''}
          >
            <i className="icon fas fa-file-invoice"></i> Invoices / Quotations
          </li>
          <li 
            onClick={() => setSelectedMenu('stock')} 
            className={selectedMenu === 'stock' ? 'active' : ''}
          >
            <i className="icon fas fa-warehouse"></i> Stock
          </li>
          <li 
            onClick={() => setSelectedMenu('analytics')} 
            className={selectedMenu === 'analytics' ? 'active' : ''}
          >
            <i className="fas fa-chart-line"></i> Analytics
          </li>
          <li 
            onClick={() => setSelectedMenu('customers')} 
            className={selectedMenu === 'customers' ? 'active' : ''}
          >
            <i className="icon fas fa-users"></i> Customers
          </li>
          <li 
            onClick={() => setSelectedMenu('users')} 
            className={selectedMenu === 'users' ? 'active' : ''}
          >
            <i className="icon fas fa-user-friends"></i> Users
          </li>
          <li onClick={handleLogout} className="logout-item">
            <i className="icon fas fa-sign-out-alt"></i> Logout
          </li>
        </ul>

      </div>

      {/* Top Bar */}
      <div className="admin-topbar">
        <div className="admin-profile" onClick={handleProfileClick}>
          <span className='admin-fullname'>{adminName}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {selectedMenu === 'dashboard' && <Dashboard />}
        {selectedMenu === 'invoices' && <Invoices />}
        {selectedMenu === 'stock' && <Stock />}
        {selectedMenu === 'analytics' && <Analytics />}
        {selectedMenu === 'customers' && <Customers />}
        {selectedMenu === 'users' && <Users />}
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminDashboard;
