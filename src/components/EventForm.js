import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/Form.css";

const EventForm = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");

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
      await addDoc(collection(db, "age-calculator"), { name, date, type });
      alert("Event saved successfully!");
      setName("");
      setDate("");
      setType("");
      setError(""); // Clear error message
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error("Error saving event: ", error);
      alert("Error saving event. Please try again.");
    }
  };
  

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Event</h2>
      <form className="event-form" onSubmit={handleSave}>
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter name"
          />
        </div>
        <div className="form-field">
          <label htmlFor="date">Event Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="type">Event Type:</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Event Type</option>
            {eventTypes.map((eventType, index) => (
              <option key={index} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-btn">Save Event</button>
      </form>
    </div>
  );
};

export default EventForm;
