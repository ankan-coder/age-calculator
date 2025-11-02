import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { getAuthToken, requireAuth } from "../utils/firebaseAuth";
import "../styles/Form.css";

const EventForm = ({ onClose }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const eventTypes = [
    "Birthday",
    "Anniversary",
    "Meeting",
    "Holiday",
    "Celebration",
    "Bought On"
  ];
  const handleSave = async (e) => {
    e.preventDefault();
  
    // Validate form fields
    if (!name || !date || !type) {
      setError("All fields are required.");
      return;
    }
  
    // Validate date format
    const isValidDate = !isNaN(Date.parse(date));
    if (!isValidDate) {
      setError("Please enter a valid date.");
      return;
    }
  
    try {
      setIsSubmitting(true);
      
      // Verify user is authenticated
      const userId = requireAuth();
      
      // Get auth token for secure operation
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Authentication required. Please sign in again.");
      }
      
      // Create event with user ID and token metadata
      const eventData = {
        name,
        date,
        type,
        userId, // Store user ID for filtering
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, "age-calculator"), eventData);
      
      setName("");
      setDate("");
      setType("");
      setError(""); // Clear error message
      
      // Instead of reloading the page, close the modal and refresh the list
      if (onClose) {
        onClose();
      }
      // Reload the page to refresh the event list
      window.location.reload();
    } catch (error) {
      console.error("Error saving event: ", error);
      if (error.message.includes("authenticated")) {
        setError("You must be signed in to create events. Please sign in again.");
      } else {
        setError("Error saving event. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="form-container">
      <h2 className="form-title">Add New Event</h2>
      <form className="event-form" onSubmit={handleSave}>
        <div className="form-field">
          <label htmlFor="name" className="field-label">Event Name:</label>
          <div className="input-wrapper">
            <span className="input-icon">📝</span>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter event name"
              className="form-input"
            />
          </div>
        </div>
        
        <div className="form-field">
          <label htmlFor="date" className="field-label">Event Date:</label>
          <div className="input-wrapper">
            <span className="input-icon">📅</span>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="form-input"
            />
          </div>
        </div>
        
        <div className="form-field">
          <label htmlFor="type" className="field-label">Event Type:</label>
          <div className="input-wrapper">
            <span className="input-icon">🏷️</span>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select Event Type</option>
              {eventTypes.map((eventType, index) => (
                <option key={index} value={eventType}>
                  {eventType}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {error && (
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
          </div>
        )}
          <button 
          type="submit" 
          className="submit-btn" 
          disabled={isSubmitting}
        >
          <span className="button-icon">💾</span>
          <span className="button-text">{isSubmitting ? 'Saving...' : 'Save Event'}</span>
        </button>
      </form>
    </div>
  );
};

export default EventForm;
