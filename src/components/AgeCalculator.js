// src/components/AgeCalculator.js
import React, { useState } from "react";
import "../styles/AgeCalculator.css";

const AgeCalculator = ({ onClose }) => {
  const [date, setDate] = useState("");
  const [ageDetails, setAgeDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let ageInMilliseconds = today - birth;
    let ageInSeconds = Math.floor(ageInMilliseconds / 1000);
    let ageInMinutes = Math.floor(ageInSeconds / 60);
    let ageInHours = Math.floor(ageInMinutes / 60);
    let ageInDays = Math.floor(ageInHours / 24);
    let ageInWeeks = Math.floor(ageInDays / 7);
    let ageInMonths = Math.floor(ageInDays / 30.4369); // Average days in a month
    let ageInYears = Math.floor(ageInDays / 365.25); // Average days in a year

    return {
      years: ageInYears,
      months: ageInMonths,
      weeks: ageInWeeks,
      days: ageInDays,
      hours: ageInHours,
      minutes: ageInMinutes,
      seconds: ageInSeconds,
      milliseconds: ageInMilliseconds,
    };
  };

  const getNextBirthdays = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let nextBirthdays = [];
    for (let i = 1; i <= 10; i++) {
      let nextBirthday = new Date(birth);
      nextBirthday.setFullYear(today.getFullYear() + i);
      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + i + 1);
      }
      nextBirthdays.push(nextBirthday.toLocaleDateString());
    }
    return nextBirthdays;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const age = calculateAge(date);
      const birthdays = getNextBirthdays(date);
      setAgeDetails({ age, birthdays });
      setLoading(false);
    }, 1000); // Simulate a small delay for a better user experience
  };
  return (
    <div className="age-calculator">
      <h2>Precise Age Calculator</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span className="input-label">Enter Your Date of Birth</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="date-input"
          />
        </label>
        <button type="submit" disabled={loading} className="calc-button">
          {loading ? (
            <span className="loading-text">
              <span className="loading-icon">⏳</span> Calculating...
            </span>
          ) : (
            <span className="button-text">
              <span className="button-icon">🔍</span> Calculate Age
            </span>
          )}
        </button>
      </form>
      
      {loading && <div className="loader"></div>}
      
      {ageDetails && !loading && (
        <div className="results-container">
          <p className="results-title">Your Precise Age:</p>
          <ul className="age-metrics">
            <li className="metric-item years-metric">
              <span className="metric-value">{ageDetails.age.years}</span>
              <span className="metric-label">Years</span>
            </li>
            <li className="metric-item months-metric">
              <span className="metric-value">{ageDetails.age.months}</span>
              <span className="metric-label">Months</span>
            </li>
            <li className="metric-item weeks-metric">
              <span className="metric-value">{ageDetails.age.weeks}</span>
              <span className="metric-label">Weeks</span>
            </li>
            <li className="metric-item days-metric">
              <span className="metric-value">{ageDetails.age.days}</span>
              <span className="metric-label">Days</span>
            </li>
            <li className="metric-item hours-metric">
              <span className="metric-value">{ageDetails.age.hours}</span>
              <span className="metric-label">Hours</span>
            </li>
            <li className="metric-item minutes-metric">
              <span className="metric-value">{ageDetails.age.minutes}</span>
              <span className="metric-label">Minutes</span>
            </li>
            <li className="metric-item seconds-metric">
              <span className="metric-value">{ageDetails.age.seconds}</span>
              <span className="metric-label">Seconds</span>
            </li>
            <li className="metric-item milliseconds-metric">
              <span className="metric-value">{ageDetails.age.milliseconds}</span>
              <span className="metric-label">Milliseconds</span>
            </li>
          </ul>
          
          <p className="birthdays-title">Your Next 10 Birthdays:</p>
          <ul className="birthdays-list">
            {ageDetails.birthdays.map((birthday, index) => (
              <li key={index} className="birthday-item">
                <span className="birthday-number">#{index + 1}</span>
                <span className="birthday-date">{birthday}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AgeCalculator;
