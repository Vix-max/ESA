import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';


import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashoboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
