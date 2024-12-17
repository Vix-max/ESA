
import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, NavLink, Route, Routes } from 'react-router-dom'; // Import necessary components
import Dashboard from '../components/Dashboard'; 
import StockBillEntry from './StockBillEntry';
import Invoices from '../components/Invoices';
import Stock from '../components/Stock'; 
import Items from '../components/Items'; 
import Analytics from '../components/Analytics'; 
import Customers from '../components/Customers'; 
import Users from '../components/Users'; 
import Cookies from 'js-cookie'; 
import axios from 'axios';

const AdminDashboard = () => {
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const token = Cookies.get('auth_token');
    const storedAdminName = Cookies.get('adminName');
    setAdminName(storedAdminName);

    if (!token) {
      toast.error('You need to be logged in to access this page.');
      navigate('/admin-login'); // Redirect to login page if not authenticated
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/admin/logout', {}, {
        withCredentials: true,
      });
  
      Cookies.remove('auth_token');
      Cookies.remove('adminName');
      toast.success('Logged out successfully!', { autoClose: 2500 });
    } catch (error) {
      toast.error('Logout failed. Please try again.', { autoClose: 2500 });
      console.error('Logout error:', error.response || error.message);
    }
  };
  

  const handleProfileClick = () => {
    // Logic for profile click (if needed)
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className='adminDash-logo'>
          <h1>ESA Enterprises</h1>
        </div>
        <ul>
  <li>
    <NavLink to="/admin-dashboard/dashboard" className="menu-item" activeClassName="active">
      <div className="menu-link">
        <i className="fas fa-tachometer-alt"></i> Dashboard
      </div>
    </NavLink>
  </li>
  <li>
    <NavLink to="/admin-dashboard/invoices" className="menu-item" activeClassName="active">
      <div className="menu-link">
        <i className="fas fa-file-invoice"></i> Invoices / Quotations
      </div>
    </NavLink>
  </li>
  <li>
  <NavLink
  to="/admin-dashboard/stock"
  className={({ isActive }) =>
    isActive || window.location.pathname.includes("stock-bill-entry")
      ? "menu-item active"
      : "menu-item"
  }
>
  <div className="menu-link">
    <i className="fas fa-warehouse"></i> Stock
  </div>
</NavLink>

  </li>
  <li>
    <NavLink to="/admin-dashboard/items" className="menu-item" activeClassName="active">
      <div className="menu-link">
        <i className="fas fa-pen"></i> Items
      </div>
    </NavLink>
  </li>
  <li>
    <NavLink to="/admin-dashboard/analytics" className="menu-item" activeClassName="active">
      <div className="menu-link">
        <i className="fas fa-chart-line"></i> Analytics
      </div>
    </NavLink>
  </li>
  <li>
    <NavLink to="/admin-dashboard/customers" className="menu-item" activeClassName="active">
      <div className="menu-link">
        <i className="fas fa-users"></i> Customers
      </div>
    </NavLink>
  </li>
  <li>
    <NavLink to="/admin-dashboard/users" className="menu-item" activeClassName="active">
      <div className="menu-link">
        <i className="fas fa-user-friends"></i> Users
      </div>
    </NavLink>
  </li>
  <li>
  <NavLink 
    to="/admin-login" 
    className="menu-item" 
    activeClassName="active" 
    onClick={handleLogout}  // Add the logout function here
  >
    <div className="menu-link">
      <i className="fas fa-sign-out-alt"></i> Logout
    </div>
  </NavLink>
</li>

 
</ul>

      </div>

      {/* Top Bar */}
      <div className="admin-topbar">
        <div className="admin-profile" onClick={handleProfileClick}>
          <span className="admin-fullname">{adminName}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="stock" element={<Stock />} />
          <Route path="items" element={<Items />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="customers" element={<Customers />} />
          <Route path="users" element={<Users />} />
           <Route path="stock-bill-entry" element={<StockBillEntry />} />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminDashboard;
