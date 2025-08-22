import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { OrderItem, Order } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import './Cart.css';

interface CartProps {
  cartItems: OrderItem[];
  onClearCart: () => void;
  onRemoveItem: (index: number) => void;
  onOrderPlaced: (orderId: string) => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, onClearCart, onRemoveItem, onOrderPlaced }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.displayName || '');
      setCustomerPhone(currentUser.photoURL || '');
    }
  }, [currentUser]);

  const totalAmount = cartItems.reduce((sum, item) => 
    sum + (item.foodItem.price * item.quantity), 0
  );

  const handlePlaceOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please enter your name and phone number');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = Math.floor(1000 + Math.random() * 9000);
      
      const orderData: any = {
        customerName,
        customerPhone,
        items: cartItems.map(item => ({
          foodItemId: item.foodItem.id,
          foodItemName: item.foodItem.name,
          price: item.foodItem.price,
          quantity: item.quantity
        })),
        totalAmount,
        status: 'pending',
        orderNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (currentUser) {
        orderData.userId = currentUser.uid;
        orderData.userEmail = currentUser.email;
      }

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      onOrderPlaced(docRef.id);
      onClearCart();
      setCustomerName('');
      setCustomerPhone('');
      alert(`Order placed successfully! Your order number is ${orderNumber}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="item-info">
                  <h4>{item.foodItem.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>Rs {(item.foodItem.price * item.quantity).toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => onRemoveItem(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <h3>Total: Rs {totalAmount.toFixed(2)}</h3>
          </div>

          <div className="customer-info">
            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>

          <div className="cart-actions">
            <button onClick={onClearCart} className="clear-btn">
              Clear Cart
            </button>
            <button 
              onClick={handlePlaceOrder} 
              className="order-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;