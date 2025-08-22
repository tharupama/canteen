import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import './OrderHistory.css';

interface OrderHistoryItem {
  id: string;
  orderNumber: number;
  items: any[];
  totalAmount: number;
  status: string;
  createdAt: any;
  customerName: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderData: OrderHistoryItem[] = [];
      snapshot.forEach((doc) => {
        orderData.push({ id: doc.id, ...doc.data() } as OrderHistoryItem);
      });
      setOrders(orderData);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'in-progress': return '#17a2b8';
      case 'ready': return '#28a745';
      case 'cancelled': return '#dc3545';
      case 'completed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  if (isLoading) {
    return (
      <div className="order-history">
        <h2>Order History</h2>
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="order-history">
        <h2>Order History</h2>
        <div className="no-auth">
          <p>Sign in to view your order history</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-history">
        <h2>Order History</h2>
        <div className="no-orders">
          <p>You haven't placed any orders yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history">
      <h2>Order History</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="history-card">
            <div className="history-header">
              <div>
                <h3>Order #{order.orderNumber}</h3>
                <p className="order-date">{formatDate(order.createdAt)}</p>
              </div>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status?.toUpperCase()}
              </span>
            </div>
            
            <div className="history-items">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="history-item">
                  <span className="item-name">{item.foodItemName}</span>
                  <span className="item-qty">x{item.quantity}</span>
                  <span className="item-price">Rs {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="history-footer">
              <span className="total-label">Total:</span>
              <span className="total-amount">Rs {order.totalAmount?.toFixed(2)}</span>
            </div>

            {order.status === 'ready' && (
              <div className="ready-alert">
                Ready for pickup at the counter!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;