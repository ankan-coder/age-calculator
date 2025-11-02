// src/App.js
import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./contexts/AuthContext";
import { clearLoginTimestamp } from "./utils/firebaseAuth";
import AgeCalculator from "./components/AgeCalculator";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import Auth from "./components/Auth";
import PrivateRoute from "./components/PrivateRoute";
import "./styles/App.css";

function Home() {
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [showEventFormModal, setShowEventFormModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const openCalculatorModal = () => setShowCalculatorModal(true);
  const closeCalculatorModal = () => setShowCalculatorModal(false);
  
  const openEventFormModal = () => setShowEventFormModal(true);
  const closeEventFormModal = () => setShowEventFormModal(false);

  const handleSignOut = async () => {
    try {
      // Clear login timestamp on sign out
      clearLoginTimestamp();
      await signOut(auth);
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <div className="App">
      <div className="minimal-header">
        <h1>Age Calculator</h1>
        {user && (
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button onClick={handleSignOut} className="sign-out-btn">
              Sign Out
            </button>
          </div>
        )}
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

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
