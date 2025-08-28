import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUsername } from "../utils/auth"; // ✅ same helpers as Products.js

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ fetch cart with Authorization header
  const fetchCart = async () => {
    try {
      const token = getToken();
      const username = getUsername();

      const response = await axios.get(
        `http://localhost:8080/api/cart/user/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Cart:", response.data);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    }
  };

  // ✅ update quantity with token
  const updateCartQuantity = async (cartId, delta) => {
    try {
      const token = getToken();

      const response = await axios.put(
        `http://localhost:8080/api/cart/update/${cartId}?delta=${delta}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Updated cart item:", response.data);
      fetchCart(); // refresh cart after update
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  // ✅ place order with token
  const placeOrder = async () => {
    try {
      const token = getToken();
      const username = getUsername();
      const orderDto = {
        username: username,
        productIds: cartItems.map((item) => item.productId || item.id), // adjust key as per your cart
        totalAmount: calculateTotal(),
      };
      const response = await axios.post(
        `http://localhost:8080/api/order/place`,
        orderDto,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Order placed successfully!");
      setCartItems([]); // Clear cart in UI
      console.log("Order details:", response.data);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order");
    }
  };

  // ✅ remove item with token
  const removeFromCart = async (cartId) => {
    try {
      const token = getToken();

      const response = await axios.delete(
        `http://localhost:8080/api/cart/remove/${cartId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data); // "Item removed from cart"
      fetchCart(); // refresh cart after removal
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ddd",
                margin: "15px 0",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                background: "white",
              }}
            >
              {/* ✅ Product image */}
              <img
                src={`/images/${item.productName}.png`}
                alt={item.productName}
                onError={(e) => (e.target.src = "/images/default-product.png")}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginRight: "15px",
                }}
              />

              {/* ✅ Product details */}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px" }}>{item.productName}</h3>
                <p style={{ margin: "0 0 8px", color: "#555" }}>
                  Price: ₹{item.price}
                </p>

                {/* Quantity control */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <button
                    onClick={() => updateCartQuantity(item.id, -1)}
                    style={{ padding: "5px 10px", borderRadius: "5px" }}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, 1)}
                    style={{ padding: "5px 10px", borderRadius: "5px" }}
                  >
                    +
                  </button>
                </div>

                <p style={{ marginTop: "10px" }}>
                  Subtotal: <strong>₹{item.price * item.quantity}</strong>
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    background: "#e74c3c",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <h3 style={{ marginTop: "20px" }}>Total: ₹{calculateTotal()}</h3>
          <button
            onClick={placeOrder}
            style={{
              background: "#27ae60",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
