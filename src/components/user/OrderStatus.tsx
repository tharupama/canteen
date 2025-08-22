import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import './OrderStatus.css';

interface OrderStatusProps {
  orderId: string | null;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ orderId }) => {
  const [orderStatus, setOrderStatus] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return;

    const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (doc) => {
      if (doc.exists()) {
        setOrderStatus({ id: doc.id, ...doc.data() });
      }
    });

    return () => unsubscribe();
  }, [orderId]);

  if (!orderId || !orderStatus) {
    return null;
  }

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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending': return 'Your order has been received and is waiting to be prepared';
      case 'in-progress': return 'Your order is being prepared';
      case 'ready': return 'Your order is ready for pickup! Please proceed to the counter';
      case 'cancelled': return 'Your order has been cancelled';
      case 'completed': return 'Order completed. Thank you!';
      default: return '';
    }
  };

  return (
    <div className="order-status-container">
      <div className="order-status-card">
        <h2>Order #{orderStatus.orderNumber}</h2>
        <div 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(orderStatus.status) }}
        >
          {orderStatus.status.toUpperCase()}
        </div>
        <p className="status-message">{getStatusMessage(orderStatus.status)}</p>
        
        <div className="order-details">
          <h3>Order Details</h3>
          <p><strong>Customer:</strong> {orderStatus.customerName}</p>
          <p><strong>Phone:</strong> {orderStatus.customerPhone}</p>
          <p><strong>Total:</strong> Rs {orderStatus.totalAmount?.toFixed(2)}</p>
          
          <div className="order-items">
            <h4>Items:</h4>
            {orderStatus.items?.map((item: any, index: number) => (
              <div key={index} className="order-item">
                <span>{item.foodItemName}</span>
                <span>x{item.quantity}</span>
                <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {orderStatus.status === 'ready' && (
          <div className="pickup-alert">
            <strong>Ready for Pickup!</strong>
            <p>Please collect your order at the counter and complete payment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;