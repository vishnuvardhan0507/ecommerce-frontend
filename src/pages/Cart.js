import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUsername } from "../utils/auth";
import { useNavigate } from "react-router-dom"; // ✅ for navigation

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // ✅ navigation hook

  useEffect(() => {
    fetchCart();
  }, []);

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

      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    }
  };

  const updateCartQuantity = async (cartId, delta) => {
    try {
      const token = getToken();

      await axios.put(
        `http://localhost:8080/api/cart/update/${cartId}?delta=${delta}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCart();
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      const token = getToken();

      await axios.delete(
        `http://localhost:8080/api/cart/remove/${cartId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCart();
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

  // ✅ Razorpay payment (single flow → verify → place order → clear cart → redirect)
  const handlePayment = async () => {
    try {
      const token = getToken();
      const username = getUsername();

      // 1️⃣ Create Razorpay order from backend
      const res = await axios.post(
        `http://localhost:8080/api/payment/create-order?appOrderId=${username}-${Date.now()}&amount=${calculateTotal()}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { razorpayOrderId, amount, currency } = res.data;

      // 2️⃣ Open Razorpay checkout
      const options = {
        key: "rzp_test_RC23KgjupY8UVf", // your test key
        amount: amount * 100,
        currency: currency,
        name: "My E-Commerce App",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // 3️⃣ Verify payment in backend
            await axios.post(
              "http://localhost:8080/api/payment/verify",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                username: username,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // 4️⃣ Place order in backend (move cart → orders)
            const orderDto = {
              username: username,
              productIds: cartItems.map((item) => item.productId || item.id),
              totalAmount: calculateTotal(),
            };

            await axios.post("http://localhost:8080/api/order/place", orderDto, {
              headers: { Authorization: `Bearer ${token}` },
            });

            // 5️⃣ Clear cart in backend
            await Promise.all(
              cartItems.map((item) =>
                axios.delete(`http://localhost:8080/api/cart/remove/${item.id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
              )
            );

            // 6️⃣ Clear frontend cart
            setCartItems([]);

            // ✅ Redirect to Orders page
            alert("🎉 Payment successful! Redirecting to Orders...");
            navigate("/orders");
          } catch (err) {
            console.error("Error finalizing order:", err);
            alert("Payment succeeded, but order placement failed!");
          }
        },
        prefill: {
          name: username,
          email: `${username}@example.com`,
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error starting payment:", err);
      alert("Payment initiation failed!");
    }
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

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px" }}>{item.productName}</h3>
                <p style={{ margin: "0 0 8px", color: "#555" }}>
                  Price: ₹{item.price}
                </p>

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

          {/* ✅ Only Razorpay button now */}
          <button
            onClick={handlePayment}
            style={{
              background: "#3498db",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Pay with Razorpay
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
