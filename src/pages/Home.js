// src/pages/Home.js
import React from "react";

function Home() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundImage: "url('/images/home_bg.png')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
        Welcome to E-Commerce App
      </h1>
    </div>
  );
}

export default Home;
