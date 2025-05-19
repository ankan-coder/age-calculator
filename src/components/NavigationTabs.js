// src/components/NavigationTabs.js
import React from 'react';
import '../styles/NavigationTabs.css';

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="nav-container">
      <nav className="main-nav">
        <ul className="nav-tabs">
          <li 
            className={activeTab === "calculator" ? "active" : ""} 
            onClick={() => setActiveTab("calculator")}
          >
            <span className="tab-icon">📅</span>
            <span className="tab-text">Age Calculator</span>
          </li>
          <li 
            className={activeTab === "events" ? "active" : ""} 
            onClick={() => setActiveTab("events")}
          >
            <span className="tab-icon">🎉</span>
            <span className="tab-text">Add Event</span>
          </li>
          <li 
            className={activeTab === "saved" ? "active" : ""} 
            onClick={() => setActiveTab("saved")}
          >
            <span className="tab-icon">🗓️</span>
            <span className="tab-text">Saved Events</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavigationTabs;
