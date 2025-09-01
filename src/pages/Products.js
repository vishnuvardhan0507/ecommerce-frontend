// src/pages/Products.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUsername } from "../utils/auth";

function Products({ category }) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:8080/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // filter whenever category changes
  useEffect(() => {
    if (category) {
      setFiltered(products.filter((p) => p.category === category));
    } else {
      setFiltered(products);
    }
  }, [category, products]);

  const addToCart = async (productId) => {
    try {
      const token = getToken();
      const username = getUsername();
      await axios.post(
        "http://localhost:8080/api/cart/add",
        { username, productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Product added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>
        {category ? `${category} Products` : "All Products"}
      </h2>

      {/* ✅ Grid Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {filtered.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
              background: "white",
            }}
          >   
          <img 
              src={`/images/${p.name}.png`}
              alt={p.name}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
            <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>{p.name}</h3>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "8px" }}>
              {p.description}
            </p>
            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
              ₹{p.price}
            </p>
            <button
              onClick={() => addToCart(p.id)}
              style={{
                background: "#3498db",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
