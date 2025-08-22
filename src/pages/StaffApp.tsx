import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import StaffLogin from '../components/staff/StaffLogin';
import OrderDashboard from '../components/staff/OrderDashboard';
import MenuManagement from '../components/staff/MenuManagement';
import './StaffApp.css';

const StaffApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <StaffLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="staff-app">
      <header className="staff-header">
        <h1>Canteen Staff Dashboard</h1>
        <div className="header-actions">
          <div className="tab-buttons">
            <button 
              className={activeTab === 'orders' ? 'active' : ''}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button 
              className={activeTab === 'menu' ? 'active' : ''}
              onClick={() => setActiveTab('menu')}
            >
              Menu Management
            </button>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      {activeTab === 'orders' ? <OrderDashboard /> : <MenuManagement />}
    </div>
  );
};

export default StaffApp;