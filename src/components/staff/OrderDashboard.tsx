import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import './OrderDashboard.css';

const OrderDashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    let q;
    if (filter === 'all') {
      q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    } else {
      // For filtered queries, we'll fetch all and filter client-side to avoid index requirements
      q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderData: any[] = [];
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() } as any;
        // Apply client-side filtering
        if (filter === 'all' || data.status === filter) {
          orderData.push(data);
        }
      });
      setOrders(orderData);
    }, (error) => {
      console.error('Error fetching orders:', error);
      // Fallback: try without orderBy if there's an index issue
      const fallbackQuery = filter === 'all' 
        ? query(collection(db, 'orders'))
        : query(collection(db, 'orders'), where('status', '==', filter));
      
      const fallbackUnsub = onSnapshot(fallbackQuery, (snapshot) => {
        const orderData: any[] = [];
        snapshot.forEach((doc) => {
          orderData.push({ id: doc.id, ...doc.data() });
        });
        // Sort client-side
        orderData.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(0);
          const bTime = b.createdAt?.toDate?.() || new Date(0);
          return bTime.getTime() - aTime.getTime();
        });
        setOrders(orderData);
      });
      
      return () => fallbackUnsub();
    });

    return () => unsubscribe();
  }, [filter]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
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

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="order-dashboard">
      <h1>Order Management Dashboard</h1>
      
      <div className="filter-buttons">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Orders
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={filter === 'in-progress' ? 'active' : ''}
          onClick={() => setFilter('in-progress')}
        >
          In Progress
        </button>
        <button 
          className={filter === 'ready' ? 'active' : ''}
          onClick={() => setFilter('ready')}
        >
          Ready
        </button>
        <button 
          className={filter === 'cancelled' ? 'active' : ''}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="orders-grid">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Order #{order.orderNumber}</h3>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status?.toUpperCase()}
              </span>
            </div>

            <div className="order-info">
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Phone:</strong> {order.customerPhone}</p>
              <p><strong>Time:</strong> {formatTime(order.createdAt)}</p>
              <p><strong>Total:</strong> Rs {order.totalAmount?.toFixed(2)}</p>
            </div>

            <div className="order-items">
              <h4>Items:</h4>
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="item-line">
                  <span>{item.foodItemName}</span>
                  <span className="quantity">x{item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="order-actions">
              {order.status === 'pending' && (
                <>
                  <button 
                    className="btn-progress"
                    onClick={() => updateOrderStatus(order.id, 'in-progress')}
                  >
                    Start Preparing
                  </button>
                  <button 
                    className="btn-cancel"
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  >
                    Cancel
                  </button>
                </>
              )}
              
              {order.status === 'in-progress' && (
                <>
                  <button 
                    className="btn-ready"
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                  >
                    Mark Ready
                  </button>
                  <button 
                    className="btn-cancel"
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  >
                    Cancel
                  </button>
                </>
              )}
              
              {order.status === 'ready' && (
                <button 
                  className="btn-complete"
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                >
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="no-orders">
          <p>No orders found</p>
        </div>
      )}
    </div>
  );
};

export default OrderDashboard;