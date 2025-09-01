// src/components/Navbar.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getUsername, getToken } from "../utils/auth";
import axios from "axios";

function Navbar({ onCategorySelect = () => {} }) {
  const navigate = useNavigate();
  const username = getUsername();
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const token = getToken();
      const username = getUsername();

      if (!token || !username) return;

      const res = await axios.get("http://localhost:8080/api/products/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  fetchCategories();
}, [username]);
  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "15px 40px",
        background: "#2c3e50",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Left side */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/"
          style={{
            marginRight: "20px",
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Home
        </Link>

        {username && (
          <>
            {/* Categories dropdown */}
            <div
              style={{ position: "relative", marginRight: "20px" }}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <span style={{ cursor: "pointer" }}>Categories ▾</span>
              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    background: "white",
                    color: "black",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    zIndex: 1000,
                  }}
                >
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      style={{
                        padding: "5px 10px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                      onClick={() =>onCategorySelect(cat)}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/products"
              style={{
                marginRight: "20px",
                textDecoration: "none",
                color: "white",
              }}
            >
              Products
            </Link>
            <Link
              to="/cart"
              style={{
                marginRight: "20px",
                textDecoration: "none",
                color: "white",
              }}
            >
              Cart
            </Link>
            <Link
              to="/orders"
              style={{
                marginRight: "20px",
                textDecoration: "none",
                color: "white",
              }}
            >
              Orders
            </Link>
          </>
        )}
      </div>

      {/* Right side */}
      <div>
        {username ? (
          <>
            <span style={{ marginRight: "15px", fontWeight: "bold" }}>
              Welcome, {username}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "#e74c3c",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                marginRight: "15px",
                textDecoration: "none",
                color: "white",
                padding: "8px 14px",
                background: "#3498db",
                borderRadius: "5px",
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                color: "white",
                padding: "8px 14px",
                background: "#2ecc71",
                borderRadius: "5px",
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
