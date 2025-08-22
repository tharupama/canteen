import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FoodItem, OrderItem } from '../../types';
import './FoodList.css';

interface FoodListProps {
  onAddToCart: (item: OrderItem) => void;
}

const FoodList: React.FC<FoodListProps> = ({ onAddToCart }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Get all items, including unavailable ones
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

  const filteredItems = selectedCategory === 'all' 
    ? foodItems 
    : foodItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (foodItem: FoodItem, quantity: number) => {
    if (!foodItem.available) {
      alert('This item is currently unavailable');
      return;
    }
    if (quantity > 0) {
      onAddToCart({ foodItem, quantity });
    }
  };

  return (
    <div className="food-list">
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

      <div className="food-grid">
        {filteredItems.map(item => (
          <div key={item.id} className={`food-card ${!item.available ? 'unavailable' : ''}`}>
            {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
            <h3>{item.name}</h3>
            <p className="description">{item.description}</p>
            <p className="price">Rs {item.price.toFixed(2)}</p>
            {!item.available && (
              <p className="unavailable-badge">Currently Unavailable</p>
            )}
            <div className="quantity-selector">
              <input 
                type="number" 
                min="0" 
                defaultValue="1"
                id={`qty-${item.id}`}
                disabled={!item.available}
              />
              <button 
                onClick={() => {
                  const input = document.getElementById(`qty-${item.id}`) as HTMLInputElement;
                  handleAddToCart(item, parseInt(input.value));
                }}
                disabled={!item.available}
              >
                {item.available ? 'Add to Cart' : 'Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodList;