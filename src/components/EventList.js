import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { getAuthToken, requireAuth } from '../utils/firebaseAuth';
import '../styles/EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [sortCriterion, setSortCriterion] = useState('dateAsc'); // Default sorting: Date Ascending
  const [isEditing, setIsEditing] = useState(false); // To control whether we're in editing mode
  const [editEvent, setEditEvent] = useState(null); // To hold the event data for editing
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial data fetch
  const [error, setError] = useState(null); // Error handling
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // Delete confirmation modal
  const [eventToDelete, setEventToDelete] = useState(null); // Event to be deleted
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete operation
  const [isUpdating, setIsUpdating] = useState(false); // Loading state for update operation
  const [processingEventId, setProcessingEventId] = useState(null); // Track which event is being processed
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Verify user is authenticated
        const userId = requireAuth();
        
        // Get auth token for secure operation
        const token = await getAuthToken();
        if (!token) {
          throw new Error("Authentication required. Please sign in again.");
        }
        
        // Query events filtered by userId only (avoiding composite index requirement)
        // We'll sort in JavaScript instead
        const eventsQuery = query(
          collection(db, 'age-calculator'), 
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(eventsQuery);
        let eventsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        
        // Sort by date in JavaScript (ascending by default)
        eventsData.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        if (err.message.includes("authenticated")) {
          setError('You must be signed in to view events. Please sign in again.');
        } else {
          setError('Failed to load events. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch if user is authenticated
    if (user) {
      fetchEvents();
    } else {
      setIsLoading(false);
      setEvents([]);
    }
  }, [user]);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let ageYears = today.getFullYear() - birth.getFullYear();
    let ageMonths = today.getMonth() - birth.getMonth();
    let ageDays = today.getDate() - birth.getDate();

    if (ageMonths < 0 || (ageMonths === 0 && ageDays < 0)) {
      ageYears--;
      ageMonths += 12;
    }

    if (ageDays < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 0);
      ageDays += lastMonth.getDate();
    }

    return { ageYears, ageMonths, ageDays };
  };

  const getNextEventCountdown = (eventDate) => {
    const today = new Date();
    let nextEvent = new Date(eventDate);
    nextEvent.setFullYear(today.getFullYear());

    if (nextEvent < today) {
      nextEvent.setFullYear(today.getFullYear() + 1);
    }

    let countdownYears = nextEvent.getFullYear() - today.getFullYear();
    let countdownMonths = nextEvent.getMonth() - today.getMonth();
    let countdownDays = nextEvent.getDate() - today.getDate();

    if (countdownMonths < 0) {
      countdownYears--;
      countdownMonths += 12;
    }

    if (countdownDays < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      countdownDays += lastMonth.getDate();
    }

    return { countdownYears, countdownMonths, countdownDays };
  };

  const sortEvents = (criterion) => {
    let sortedEvents = [...events];
    switch (criterion) {
      case 'dateAsc':
        sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'dateDesc':
        sortedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'nextEventAsc':
        sortedEvents.sort((a, b) => {
          const nextEventA = getNextEventCountdown(a.date);
          const nextEventB = getNextEventCountdown(b.date);
          return (
            nextEventA.countdownYears - nextEventB.countdownYears ||
            nextEventA.countdownMonths - nextEventB.countdownMonths ||
            nextEventA.countdownDays - nextEventB.countdownDays
          );
        });
        break;
      case 'nextEventDesc':
        sortedEvents.sort((a, b) => {
          const nextEventA = getNextEventCountdown(a.date);
          const nextEventB = getNextEventCountdown(b.date);
          return (
            nextEventB.countdownYears - nextEventA.countdownYears ||
            nextEventB.countdownMonths - nextEventA.countdownMonths ||
            nextEventB.countdownDays - nextEventA.countdownDays
          );
        });
        break;
      default:
        break;
    }
    setEvents(sortedEvents);
  };
  // Helper function to get descriptive text for sort criterion
  const getSortDescription = (criterion) => {
    switch(criterion) {
      case 'dateAsc': 
        return 'Oldest first';
      case 'dateDesc': 
        return 'Newest first';
      case 'nextEventAsc': 
        return 'Upcoming soon';
      case 'nextEventDesc': 
        return 'Upcoming later';
      default:
        return 'Sort by date';
    }
  };

  const handleSortChange = () => {
    const nextCriterion = {
      dateAsc: 'dateDesc',
      dateDesc: 'nextEventAsc',
      nextEventAsc: 'nextEventDesc',
      nextEventDesc: 'dateAsc',
    }[sortCriterion];
    setSortCriterion(nextCriterion);
    sortEvents(nextCriterion);
  };

  const confirmDelete = (event) => {
    setEventToDelete(event);
    setShowDeleteConfirmation(true);
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setEventToDelete(null);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true); // Start loading state for delete
    try {
      // Verify user is authenticated
      const userId = requireAuth();
      
      // Verify ownership - ensure the event belongs to the current user
      if (eventToDelete.userId !== userId) {
        throw new Error("You don't have permission to delete this event.");
      }
      
      // Get auth token for secure operation
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Authentication required. Please sign in again.");
      }
      
      const eventRef = doc(db, 'age-calculator', eventToDelete.id);
      await deleteDoc(eventRef);
      setEvents(events.filter((event) => event.id !== eventToDelete.id));
      setShowDeleteConfirmation(false);
      setEventToDelete(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      setError(error.message || 'Failed to delete event. Please try again.');
    } finally {
      setIsDeleting(false); // End loading state for delete
    }
  };

  const handleEdit = (event) => {
    setEditEvent(event);
    setIsEditing(true); // Set editing mode to true
  };

  const handleUpdateEvent = async () => {
    setIsUpdating(true); // Start loading state for update
    try {
      // Verify user is authenticated
      const userId = requireAuth();
      
      // Find the original event to verify ownership
      const originalEvent = events.find(e => e.id === editEvent.id);
      if (!originalEvent) {
        throw new Error("Event not found.");
      }
      
      // Verify ownership - ensure the event belongs to the current user
      if (originalEvent.userId !== userId) {
        throw new Error("You don't have permission to edit this event.");
      }
      
      // Get auth token for secure operation
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Authentication required. Please sign in again.");
      }
      
      const eventRef = doc(db, 'age-calculator', editEvent.id);
      await updateDoc(eventRef, {
        name: editEvent.name,
        type: editEvent.type,
        date: editEvent.date,
        updatedAt: new Date().toISOString()
      });
      
      // Update the event in the local state, preserving userId
      const updatedEvent = { ...editEvent, userId: originalEvent.userId };
      setEvents(events.map((event) => (event.id === editEvent.id ? updatedEvent : event)));
      setIsEditing(false); // Close the edit modal
    } catch (error) {
      console.error('Error updating event:', error);
      setError(error.message || 'Failed to update event. Please try again.');
    } finally {
      setIsUpdating(false); // End loading state for update
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };  return (
    <div className="event-list-wrapper">
      <div className="event-list-header">
        <h2>Events</h2>
        {!isLoading && !error && events.length > 0 && (
          <div className="sort-control">
            <button className="sort-button" onClick={handleSortChange}>
              <span className="sort-icon">🔄</span>
              <span className="sort-text">{getSortDescription(sortCriterion)}</span>
            </button>
          </div>
        )}
      </div>
      
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className="events-grid">
          {events.map((event, index) => {
            const { ageYears, ageMonths, ageDays } = calculateAge(event.date);
            const { countdownYears, countdownMonths, countdownDays } = getNextEventCountdown(event.date);
            
            // Format the date in a more readable way
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });

            return (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <h3>{event.name}</h3>
                  <span className="event-type-badge">{event.type}</span>
                </div>
                <div className="event-info">
                  <div className="info-row">
                    <span className="info-label">Date:</span> 
                    <span className="info-value">{formattedDate}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Age:</span> 
                    <div className="age-display">
                      <div className="age-unit">
                        <span className="age-number">{ageYears}</span>
                        <span className="age-label">years</span>
                      </div>
                      <div className="age-unit">
                        <span className="age-number">{ageMonths}</span>
                        <span className="age-label">months</span>
                      </div>
                      <div className="age-unit">
                        <span className="age-number">{ageDays}</span>
                        <span className="age-label">days</span>
                      </div>
                    </div>
                  </div>
                  <div className="info-row countdown">
                    <span className="info-label">Next Event:</span>
                    <div className="countdown-display">
                      <div className="countdown-unit">
                        <span className="countdown-number">{countdownYears}</span>
                        <span className="countdown-label">years</span>
                      </div>
                      <div className="countdown-unit">
                        <span className="countdown-number">{countdownMonths}</span>
                        <span className="countdown-label">months</span>
                      </div>
                      <div className="countdown-unit">
                        <span className="countdown-number">{countdownDays}</span>
                        <span className="countdown-label">days</span>
                      </div>
                    </div>
                  </div>
                </div>                <div className="event-actions">
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEdit(event)} 
                    disabled={isUpdating && processingEventId === event.id}
                  >
                    <span className="btn-icon">✏️</span> Edit
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => confirmDelete(event)} 
                    disabled={isDeleting}
                  >
                    <span className="btn-icon">🗑️</span> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {!isLoading && !error && events.length === 0 && (
        <div className="no-events">
          <div className="no-events-icon">📅</div>
          <p>No events found. Add some events to see them here!</p>
        </div>
      )}{/* Edit Event Modal */}
      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Event</h2>
            <div className="form-group">
              <label htmlFor="name">Event Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={editEvent.name}
                onChange={handleChange}
                placeholder="Enter event name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="type">Event Type</label>
              <select
                id="type"
                name="type"
                value={editEvent.type}
                onChange={handleChange}
              >
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Wedding">Wedding</option>
                <option value="Graduation">Graduation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="date">Event Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={editEvent.date}
                onChange={handleChange}
              />
            </div>
            
            <div className="modal-actions">
              <button onClick={handleUpdateEvent} disabled={isUpdating}>
                <span className="btn-icon">💾</span> {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setIsEditing(false)}>
                <span className="btn-icon">❌</span> Cancel
              </button>
            </div>
          </div>
        </div>
      )}      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="modal">
          <div className="modal-content delete-confirmation-modal">
            <h2>Delete Event</h2>
            <p>Are you sure you want to delete <span className="highlight">{eventToDelete?.name}</span>?</p>
            <p className="warning-text">This action cannot be undone</p>
            
            <div className="modal-actions">
              <button className="delete-confirm-btn" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button className="delete-cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
