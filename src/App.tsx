import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import UserApp from './pages/UserApp';
import StaffApp from './pages/StaffApp';
import Setup from './components/Setup';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<UserApp />} />
          <Route path="/staff" element={<StaffApp />} />
          <Route path="/setup" element={<Setup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <h1>University Canteen</h1>
      <p className="home-subtitle">Order your favorite food online</p>
      <div className="app-links">
        <Link to="/user" className="app-link user-link">
          <div className="link-card">
            <h2>Start Ordering</h2>
            <p>Browse menu and place your order</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default App;
