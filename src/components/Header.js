// src/components/Header.js
import React from "react";
import "../styles/Header.css";

const Header = () => (
  <header className="header">
    <div className="header-content">
      <h1>Age Calculator <span className="highlight">Pro</span></h1>
      <p>
        <span className="tagline-highlight">Calculate your age with precision</span> | 
        <span className="tagline-feature"> Track important dates</span> | 
        <span className="tagline-feature"> Save memorable events</span>
      </p>
    </div>
  </header>
);

export default Header;
