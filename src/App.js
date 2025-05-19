// src/App.js
import React, { useState } from "react";
import AgeCalculator from "./components/AgeCalculator";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import "./styles/App.css";

function App() {
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [showEventFormModal, setShowEventFormModal] = useState(false);
  
  const openCalculatorModal = () => setShowCalculatorModal(true);
  const closeCalculatorModal = () => setShowCalculatorModal(false);
  
  const openEventFormModal = () => setShowEventFormModal(true);
  const closeEventFormModal = () => setShowEventFormModal(false);
  
  return (
    <div className="App">
      <div className="minimal-header">
        <h1>Age Calculator</h1>
      </div>
      
      <main className="main-content">
        <div className="action-buttons">
          <button className="action-button calculate-btn" onClick={openCalculatorModal}>
            <span className="btn-icon">📅</span> Calculate
          </button>
          <button className="action-button add-event-btn" onClick={openEventFormModal}>
            <span className="btn-icon">➕</span> Add
          </button>
        </div>
        
        <div className="content-container">
          <EventList />
          
          {/* Modals */}
          {showCalculatorModal && (
            <div className="modal-overlay">
              <div className="modal-wrapper-minimal">
                <button className="modal-close-minimal" onClick={closeCalculatorModal}>✕</button>
                <AgeCalculator onClose={closeCalculatorModal} />
              </div>
            </div>
          )}
          
          {showEventFormModal && (
            <div className="modal-overlay">
              <div className="modal-wrapper-minimal">
                <button className="modal-close-minimal" onClick={closeEventFormModal}>✕</button>
                <EventForm onClose={closeEventFormModal} />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <div className="minimal-footer">
        <p>© {new Date().getFullYear()} Age Calculator</p>
      </div>
    </div>
  );
}

export default App;
