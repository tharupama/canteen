import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart from './Cart';
import { addDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

// Mock Firebase
jest.mock('../../config/firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(() => new Date())
}));

// Mock Auth Context
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

describe('Cart Component', () => {
  const mockOnClearCart = jest.fn();
  const mockOnRemoveItem = jest.fn();
  const mockOnOrderPlaced = jest.fn();
  
  const mockCartItems = [
    {
      foodItem: {
        id: '1',
        name: 'Chicken Rice',
        description: 'Delicious chicken curry with steamed rice',
        price: 320,
        category: 'Rice Dishes',
        available: true
      },
      quantity: 2
    },
    {
      foodItem: {
        id: '2',
        name: 'Coca Cola',
        description: 'Refreshing soft drink',
        price: 100,
        category: 'Beverages',
        available: true
      },
      quantity: 1
    }
  ];

  const mockUser = {
    uid: 'user123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: '0771234567'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: mockUser
    });
  });

  test('renders cart items correctly', () => {
    render(
      <Cart 
        cartItems={mockCartItems}
        onClearCart={mockOnClearCart}
        onRemoveItem={mockOnRemoveItem}
        onOrderPlaced={mockOnOrderPlaced}
      />
    );
    
    expect(screen.getByText('Chicken Rice')).toBeInTheDocument();
    expect(screen.getByText('Coca Cola')).toBeInTheDocument();
    expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
    expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
  });

  test('displays correct prices in LKR', () => {
    render(
      <Cart 
        cartItems={mockCartItems}
        onClearCart={mockOnClearCart}
        onRemoveItem={mockOnRemoveItem}
        onOrderPlaced={mockOnOrderPlaced}
      />
    );
    
    expect(screen.getByText('Rs 640.00')).toBeInTheDocument(); // Chicken Rice: 320 * 2
    expect(screen.getByText('Rs 100.00')).toBeInTheDocument(); // Coca Cola: 100 * 1
    expect(screen.getByText('Total: Rs 740.00')).toBeInTheDocument(); // Total
  });

  test('shows empty cart message when no items', () => {
    render(
      <Cart 
        cartItems={[]}
        onClearCart={mockOnClearCart}
        onRemoveItem={mockOnRemoveItem}
        onOrderPlaced={mockOnOrderPlaced}
      />
    );
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  test('removes item when remove button clicked', () => {
    render(
      <Cart 
        cartItems={mockCartItems}
        onClearCart={mockOnClearCart}
        onRemoveItem={mockOnRemoveItem}
        onOrderPlaced={mockOnOrderPlaced}
      />
    );
    
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);
    
    expect(mockOnRemoveItem).toHaveBeenCalledWith(0);
  });

  test('clears cart when clear button clicked', () => {
    render(
      <Cart 
        cartItems={mockCartItems}
        onClearCart={mockOnClearCart}
        onRemoveItem={mockOnRemoveItem}
        onOrderPlaced={mockOnOrderPlaced}
      />
    );
    
    const clearButton = screen.getByText('Clear Cart');
    fireEvent.click(clearButton);
    
    expect(mockOnClearCart).toHaveBeenCalled();
  });

  test('auto-fills user details for logged-in users', () => {
    render(
      <Cart 
        cartItems={mockCartItems}
        onClearCart={mockOnClearCart}
        onRemoveItem={mockOnRemoveItem}
        onOrderPlaced={mockOnOrderPlaced}
      />
    );
    
    const nameInput = screen.getByPlaceholderText('Your Name') as HTMLInputElement;
    const phoneInput = screen.getByPlaceholderText('Phone Number') as HTMLInputElement;
    
    expect(nameInput.value).toBe('Test User');
    expect(phoneInput.value).toBe('0771234567');
  });

  test('places order successfully', async () => {
    (addDoc as jest.Mock).mockResolvedValue({ id: 'order123' });
    
    render(
      <Cart 
        cartItems={mockCartItems}
        onClearCart={mockOnClearCart}
        onRemoveItem={mockOnRemoveItem}
        onOrderPlaced={mockOnOrderPlaced}
      />
    );
    
    const placeOrderButton = screen.getByText('Place Order');
    
    // Mock alert
    window.alert = jest.fn();
    
    fireEvent.click(placeOrderButton);
    
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalled();
      expect(mockOnOrderPlaced).toHaveBeenCalledWith('order123');
      expect(mockOnClearCart).toHaveBeenCalled();
    });
  });

  test('validates required fields before placing order', () => {
    render(
      <Cart 
        cartItems={mockCartItems}
        onClearCart={mockOnClearCart}
        onRemoveItem={mockOnRemoveItem}
        onOrderPlaced={mockOnOrderPlaced}
      />
    );
    
    const nameInput = screen.getByPlaceholderText('Your Name') as HTMLInputElement;
    const placeOrderButton = screen.getByText('Place Order');
    
    // Clear name field
    fireEvent.change(nameInput, { target: { value: '' } });
    
    // Mock alert
    window.alert = jest.fn();
    
    fireEvent.click(placeOrderButton);
    
    expect(window.alert).toHaveBeenCalledWith('Please enter your name and phone number');
    expect(addDoc).not.toHaveBeenCalled();
  });
});