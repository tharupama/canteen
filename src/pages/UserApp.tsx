import React, { useState, useEffect } from 'react';
import FoodList from '../components/user/FoodList';
import Cart from '../components/user/Cart';
import OrderStatus from '../components/user/OrderStatus';
import UserAuth from '../components/user/UserAuth';
import UserProfile from '../components/user/UserProfile';
import OrderHistory from '../components/user/OrderHistory';
import Contact from '../components/user/Contact';
import About from '../components/user/About';
import { OrderItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import './UserApp.css';

const UserApp: React.FC = () => {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'menu' | 'history' | 'about' | 'contact'>('menu');
  const { currentUser, isLoading } = useAuth();

  const handleAddToCart = (item: OrderItem) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        cartItem => cartItem.foodItem.id === item.foodItem.id
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      }

      return [...prev, item];
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleRemoveItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleOrderPlaced = (orderId: string) => {
    setCurrentOrderId(orderId);
  };

  const handleAuthSuccess = () => {
    // Auth success will be handled by Firebase auth state change
  };

  if (isLoading) {
    return (
      <div className="user-app">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="user-app">
        <UserAuth onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="user-app">
      <header className="app-header">
        <div className="header-content">
          <h1>University Canteen</h1>
          <nav className="header-nav">
            <button 
              className={activeSection === 'menu' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveSection('menu')}
            >
              Menu
            </button>
            <button 
              className={activeSection === 'history' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveSection('history')}
            >
              Order History
            </button>
            <button 
              className={activeSection === 'about' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveSection('about')}
            >
              About
            </button>
            <button 
              className={activeSection === 'contact' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveSection('contact')}
            >
              Contact
            </button>
          </nav>
        </div>
      </header>

      <div className="app-content">
        <div className="main-content">
          {activeSection === 'menu' && <FoodList onAddToCart={handleAddToCart} />}
          {activeSection === 'history' && <OrderHistory />}
          {activeSection === 'about' && <About />}
          {activeSection === 'contact' && <Contact />}
        </div>

        <div className="sidebar">
          <UserProfile onShowHistory={() => setActiveSection('history')} />
          {activeSection === 'menu' && (
            <Cart 
              cartItems={cartItems}
              onClearCart={handleClearCart}
              onRemoveItem={handleRemoveItem}
              onOrderPlaced={handleOrderPlaced}
            />
          )}
        </div>
      </div>

      <OrderStatus orderId={currentOrderId} />
    </div>
  );
};

export default UserApp;