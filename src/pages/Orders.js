import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUsername } from "../utils/auth";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getToken();
        const username = getUsername();

        const { data } = await axios.get(
          `http://localhost:8080/api/order/user/${username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrders([...data]);
      } catch (e) {
        console.error("Error fetching orders:", e);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>📦 Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div>
          {orders.map((order, index) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #ddd",
                margin: "15px 0",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                background: "white",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>Order #{index + 1}</h3>
              <p style={{ margin: "5px 0", color: "#666" }}>
                Date: {new Date(order.orderDate).toLocaleString()}
              </p>

              <h4 style={{ marginTop: "10px" }}>Items</h4>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {order.items?.map((item, i) => (
                  <li
                    key={`${item.productId}-${i}`}
                    style={{
                      margin: "5px 0",
                      padding: "6px 10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {item.name} — ₹{item.price} × {item.quantity} ={" "}
                    <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                  </li>
                ))}
              </ul>

              <p
                style={{ marginTop: "10px", fontWeight: "bold", fontSize: "16px" }}
              >
                Total: ₹{order.totalAmount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
