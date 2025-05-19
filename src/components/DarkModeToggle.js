// src/components/DarkModeToggle.js
import React, { useState, useEffect } from "react";
import "../styles/DarkModeToggle.css";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="dark-mode-toggle-container">
      <button 
        className={`dark-mode-toggle ${darkMode ? "dark" : "light"}`} 
        onClick={toggleDarkMode}
        aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <div className="toggle-icon">
          {darkMode ? "☀️" : "🌙"}
        </div>
      </button>
    </div>
  );
};

export default DarkModeToggle;
