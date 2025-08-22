import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import './MenuManagement.css';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  imageUrl?: string;
}

const MenuManagement: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  useEffect(() => {
    const q = query(collection(db, 'foodItems'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: FoodItem[] = [];
      const cats = new Set<string>();
      
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() } as FoodItem;
        items.push(data);
        cats.add(data.category);
      });
      
      setFoodItems(items);
      setCategories(Array.from(cats));
    });

    return () => unsubscribe();
  }, []);

  const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'foodItems', itemId), {
        available: !currentStatus
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update item availability');
    }
  };

  const startEditingPrice = (itemId: string, currentPrice: number) => {
    setEditingPrice(itemId);
    setTempPrice(currentPrice.toString());
  };

  const cancelEditingPrice = () => {
    setEditingPrice(null);
    setTempPrice('');
  };

  const savePrice = async (itemId: string) => {
    const newPrice = parseFloat(tempPrice);
    
    if (isNaN(newPrice) || newPrice <= 0) {
      alert('Please enter a valid price greater than 0');
      return;
    }

    try {
      await updateDoc(doc(db, 'foodItems', itemId), {
        price: newPrice
      });
      setEditingPrice(null);
      setTempPrice('');
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Failed to update item price');
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? foodItems 
    : foodItems.filter(item => item.category === selectedCategory);

  return (
    <div className="menu-management">
      <h2>Menu Management</h2>
      
      <div className="category-filter">
        <button 
          className={selectedCategory === 'all' ? 'active' : ''}
          onClick={() => setSelectedCategory('all')}
        >
          All Items
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            className={selectedCategory === cat ? 'active' : ''}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="menu-items-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="menu-item-card">
            <div className="item-header">
              <h3>{item.name}</h3>
              <label className="availability-switch">
                <input
                  type="checkbox"
                  checked={item.available}
                  onChange={() => toggleAvailability(item.id, item.available)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <p className="item-description">{item.description}</p>
            
            <div className="item-price-section">
              {editingPrice === item.id ? (
                <div className="price-edit-container">
                  <span>Rs </span>
                  <input
                    type="number"
                    value={tempPrice}
                    onChange={(e) => setTempPrice(e.target.value)}
                    className="price-input"
                    step="10"
                    min="0"
                  />
                  <div className="price-edit-buttons">
                    <button 
                      onClick={() => savePrice(item.id)}
                      className="save-btn"
                      title="Save"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={cancelEditingPrice}
                      className="cancel-btn"
                      title="Cancel"
                    >
                      ✗
                    </button>
                  </div>
                </div>
              ) : (
                <div className="item-price" onClick={() => startEditingPrice(item.id, item.price)}>
                  Rs {item.price.toFixed(2)}
                  <span className="edit-icon">✏️</span>
                </div>
              )}
            </div>
            
            <p className="item-category">{item.category}</p>
            
            <div className={`availability-status ${item.available ? 'available' : 'unavailable'}`}>
              {item.available ? 'Available' : 'Unavailable'}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="no-items">
          <p>No menu items found</p>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;