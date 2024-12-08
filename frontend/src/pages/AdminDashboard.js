import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import logo from '../media/Logo_NOBG.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 

import Dashboard from '../components/Dashboard'; 
import Invoices from '../components/Invoices';
import Stock from '../components/Stock'; 
import Analytics from '../components/Analytics'; 
import Customers from '../components/Customers'; 
import Users from '../components/Users'; 


const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard'); // Default to 'dashboard'
  const [adminName, setAdminName] = useState('dashboard'); // Default to 'dashboard'
  const navigate = useNavigate(); // Initialize useNavigate

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedAdminName = localStorage.getItem('adminName');
    setAdminName(storedAdminName);
    if (!token) {
      toast.error('You need to be logged in to access this page.');
      navigate('/admin-login'); // Redirect to login page if not authenticated
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('adminName'); 
    console.log('Logout clicked');
    toast.success('Logged out successfully!', {
      autoClose: 2500,
      onClose: () => {
        navigate('/admin-login'); // Redirect to login page
      }
    });
  };

  const handleProfileClick = () => {
    setSelectedMenu('profile'); // Set the selected menu to 'profile'
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
        {selectedMenu === 'dashboard' && (
          <Dashboard />
        )}
        {selectedMenu === 'invoices' && (
          <Invoices /> // Render Inventory Component
        )}
        {selectedMenu === 'stock' && (
          <Stock />
        )}
        {selectedMenu === 'analytics' && (
          <Analytics />
        )}
        {selectedMenu === 'customers' && (
          <Customers />
        )}
        {selectedMenu === 'users' && (
          <Users/>
        )}
        
      </div>
      <ToastContainer /> {/* Add ToastContainer for toast notifications */}
    </div>
  );
}

export default AdminDashboard;
