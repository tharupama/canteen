import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock Firebase modules
jest.mock('./config/firebase', () => ({
  db: {},
  auth: {
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    })
  }
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
  serverTimestamp: jest.fn()
}));

// Import App after mocks
import App from './App';

describe('App Component', () => {
  test('renders landing page', () => {
    render(<App />);
    
    // Check for main heading
    const heading = screen.getByText(/University Canteen/i);
    expect(heading).toBeInTheDocument();
  });

  test('renders Start Ordering button', () => {
    render(<App />);
    
    const orderButton = screen.getByText(/Start Ordering/i);
    expect(orderButton).toBeInTheDocument();
  });
});