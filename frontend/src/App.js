import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './components/Dashboard'; 
import Items from './components/Items'; 
import Stock from './components/Stock'; 
import Invoices from './components/Invoices'; 
import Analytics from './components/Analytics'; 
import Customers from './components/Customers'; 
import Users from './components/Users';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Route for admin login */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Route for admin dashboard */}
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            {/* Nested routes for sections within the dashboard */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="items" element={<Items />} />
            <Route path="stock" element={<Stock />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="customers" element={<Customers />} />
            <Route path="users" element={<Users />} />


          </Route>
          

        </Routes>
      </Router>
    </div>
  );
}

export default App;
