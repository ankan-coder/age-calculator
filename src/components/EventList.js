import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [sortCriterion, setSortCriterion] = useState('dateAsc'); // Default sorting: Date Ascending
  const [isEditing, setIsEditing] = useState(false); // To control whether we're in editing mode
  const [editEvent, setEditEvent] = useState(null); // To hold the event data for editing

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsQuery = query(collection(db, 'age-calculator'), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(eventsQuery);
      const eventsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    };
    fetchEvents();
  }, []);

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

  const handleDelete = async (eventId) => {
    try {
      const eventRef = doc(db, 'age-calculator', eventId);
      await deleteDoc(eventRef);
      setEvents(events.filter((event) => event.id !== eventId)); // Update local state to reflect the deletion
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEdit = (event) => {
    setEditEvent(event);
    setIsEditing(true); // Set editing mode to true
  };

  const handleUpdateEvent = async () => {
    try {
      const eventRef = doc(db, 'age-calculator', editEvent.id);
      await updateDoc(eventRef, {
        name: editEvent.name,
        type: editEvent.type,
        date: editEvent.date,
      });
      // Update the event in the local state
      setEvents(events.map((event) => (event.id === editEvent.id ? editEvent : event)));
      setIsEditing(false); // Close the edit modal
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  return (
    <div className="event-list">
      <h2 style={{ marginTop: 10, marginBottom: 10, marginLeft: 5 }}>
        Saved Events
        <button onClick={handleSortChange} style={{ marginLeft: '10px' }}>
          Sort: {sortCriterion.replace(/([A-Z])/g, ' $1').toUpperCase()}
        </button>
      </h2>
      {events.map((event) => {
        const { ageYears, ageMonths, ageDays } = calculateAge(event.date);
        const { countdownYears, countdownMonths, countdownDays } = getNextEventCountdown(event.date);

        return (
          <div key={event.id} className="event-item">
            <h3>{event.name}</h3>
            <p>Date: {event.date}</p>
            <p>Type: {event.type}</p>
            <p>Age: {ageYears} years, {ageMonths} months, {ageDays} days</p>
            <p>Next Event in: {countdownYears} years, {countdownMonths} months, {countdownDays} days</p>
            <button onClick={() => handleEdit(event)} style={{ marginRight: '10px' }}>
              Edit
            </button>
            <button onClick={() => handleDelete(event.id)}>Delete</button>
          </div>
        );
      })}

      {/* Edit Event Modal */}
      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Event</h2>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={editEvent.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Type:
              <input
                type="text"
                name="type"
                value={editEvent.type}
                onChange={handleChange}
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={editEvent.date}
                onChange={handleChange}
              />
            </label>
            <button onClick={handleUpdateEvent}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
