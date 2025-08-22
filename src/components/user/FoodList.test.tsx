import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodList from './FoodList';
import { collection, query, onSnapshot } from 'firebase/firestore';

// Mock Firebase
jest.mock('../../config/firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  onSnapshot: jest.fn(),
  where: jest.fn()
}));

describe('FoodList Component', () => {
  const mockOnAddToCart = jest.fn();
  
  const mockFoodItems = [
    {
      id: '1',
      name: 'Chicken Rice',
      description: 'Delicious chicken curry with steamed rice',
      price: 320,
      category: 'Rice Dishes',
      available: true,
      imageUrl: 'https://example.com/chicken.jpg'
    },
    {
      id: '2',
      name: 'Fish Rice',
      description: 'Fresh fish curry with steamed rice',
      price: 300,
      category: 'Rice Dishes',
      available: false,
      imageUrl: 'https://example.com/fish.jpg'
    },
    {
      id: '3',
      name: 'Coca Cola',
      description: 'Refreshing soft drink',
      price: 100,
      category: 'Beverages',
      available: true,
      imageUrl: 'https://example.com/cola.jpg'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Firestore onSnapshot
    (onSnapshot as jest.Mock).mockImplementation((query, callback) => {
      const snapshot = {
        forEach: (fn: any) => {
          mockFoodItems.forEach(item => {
            fn({
              id: item.id,
              data: () => item
            });
          });
        }
      };
      callback(snapshot);
      return jest.fn(); // Return unsubscribe function
    });
  });

  test('renders food items correctly', async () => {
    render(<FoodList onAddToCart={mockOnAddToCart} />);
    
    await waitFor(() => {
      expect(screen.getByText('Chicken Rice')).toBeInTheDocument();
      expect(screen.getByText('Fish Rice')).toBeInTheDocument();
      expect(screen.getByText('Coca Cola')).toBeInTheDocument();
    });
  });

  test('displays prices in LKR format', async () => {
    render(<FoodList onAddToCart={mockOnAddToCart} />);
    
    await waitFor(() => {
      expect(screen.getByText('Rs 320.00')).toBeInTheDocument();
      expect(screen.getByText('Rs 300.00')).toBeInTheDocument();
      expect(screen.getByText('Rs 100.00')).toBeInTheDocument();
    });
  });

  test('shows unavailable badge for unavailable items', async () => {
    render(<FoodList onAddToCart={mockOnAddToCart} />);
    
    await waitFor(() => {
      expect(screen.getByText('Currently Unavailable')).toBeInTheDocument();
    });
  });

  test('filters items by category', async () => {
    render(<FoodList onAddToCart={mockOnAddToCart} />);
    
    await waitFor(() => {
      const beveragesButton = screen.getByText('Beverages');
      fireEvent.click(beveragesButton);
    });
    
    expect(screen.getByText('Coca Cola')).toBeInTheDocument();
    expect(screen.queryByText('Chicken Rice')).not.toBeInTheDocument();
  });

  test('cannot add unavailable items to cart', async () => {
    render(<FoodList onAddToCart={mockOnAddToCart} />);
    
    await waitFor(() => {
      const unavailableButtons = screen.getAllByText('Unavailable');
      expect(unavailableButtons[0]).toBeDisabled();
    });
  });

  test('adds available items to cart with quantity', async () => {
    render(<FoodList onAddToCart={mockOnAddToCart} />);
    
    await waitFor(() => {
      const addButtons = screen.getAllByText('Add to Cart');
      const quantityInput = document.getElementById('qty-1') as HTMLInputElement;
      
      fireEvent.change(quantityInput, { target: { value: '2' } });
      fireEvent.click(addButtons[0]);
    });
    
    expect(mockOnAddToCart).toHaveBeenCalledWith({
      foodItem: expect.objectContaining({
        id: '1',
        name: 'Chicken Rice',
        price: 320
      }),
      quantity: 2
    });
  });

  test('shows all categories filter button', async () => {
    render(<FoodList onAddToCart={mockOnAddToCart} />);
    
    await waitFor(() => {
      expect(screen.getByText('All Items')).toBeInTheDocument();
      expect(screen.getByText('Rice Dishes')).toBeInTheDocument();
      expect(screen.getByText('Beverages')).toBeInTheDocument();
    });
  });
});