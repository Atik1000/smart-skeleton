import { useEffect, useRef, useState } from 'react';
import Skeleton from 'smart-skeleton';

// Example 1: Product Card
export function ProductCard({ productId }) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      if (loading) {
        Skeleton.apply(cardRef.current, { 
          theme: 'light',
          randomize: true,
          deep: true,
          maxDepth: 5 
        });
      } else {
        Skeleton.remove(cardRef.current);
      }
    }
  }, [loading]);

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [productId]);

  return (
    <div ref={cardRef} className="card">
      {product && (
        <>
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <div className="price">${product.price}</div>
          <button>Add to Cart</button>
        </>
      )}
    </div>
  );
}

// Example 2: Nested Dashboard with Multiple Sections
export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const dashboardRef = useRef(null);

  useEffect(() => {
    if (dashboardRef.current) {
      if (loading) {
        // Deep mode handles all nested children automatically
        Skeleton.apply(dashboardRef.current, { 
          theme: 'light',
          deep: true,
          maxDepth: 8, // Handles deeply nested structures
          randomize: true
        });
      } else {
        Skeleton.remove(dashboardRef.current);
      }
    }
  }, [loading]);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/chart-data').then(r => r.json()),
      fetch('/api/recent-orders').then(r => r.json())
    ]).then(([stats, chartData, orders]) => {
      setData({ stats, chartData, orders });
      setLoading(false);
    });
  }, []);

  return (
    <div ref={dashboardRef} className="dashboard">
      {/* Stats Grid - Nested flex container */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">${data?.stats.revenue}</p>
            <span className="stat-change">+12% from last month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">{data?.stats.users}</p>
            <span className="stat-change">+5% from last month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Orders</h3>
            <p className="stat-value">{data?.stats.orders}</p>
            <span className="stat-change">+8% from last month</span>
          </div>
        </div>
      </div>

      {/* Chart Section - Complex nested structure */}
      <div className="chart-section">
        <div className="chart-header">
          <h2>Revenue Overview</h2>
          <div className="chart-controls">
            <button>Day</button>
            <button>Week</button>
            <button>Month</button>
          </div>
        </div>
        <div className="chart-container">
          {/* Chart would be rendered here */}
          <div className="chart-placeholder">Chart visualization</div>
        </div>
      </div>

      {/* Table Section - Deeply nested rows */}
      <div className="orders-section">
        <h2>Recent Orders</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  <div className="customer-cell">
                    <img src={order.customer.avatar} alt="" />
                    <span>{order.customer.name}</span>
                  </div>
                </td>
                <td>${order.amount}</td>
                <td>
                  <span className={`status status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
