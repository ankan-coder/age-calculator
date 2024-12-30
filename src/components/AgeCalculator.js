// src/components/AgeCalculator.js
import React, { useState } from "react";
import "../styles/AgeCalculator.css";

const AgeCalculator = () => {
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
      <h2>Age Calculator</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Date of Birth:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Calculating..." : "Calculate Age"}
        </button>
      </form>
      {loading && <div className="loader"></div>}
      {ageDetails && !loading && (
        <div>
          <p>Your age is:</p>
          <ul>
            <li>{ageDetails.age.years} years</li>
            <li>{ageDetails.age.months} months</li>
            <li>{ageDetails.age.weeks} weeks</li>
            <li>{ageDetails.age.days} days</li>
            <li>{ageDetails.age.hours} hours</li>
            <li>{ageDetails.age.minutes} minutes</li>
            <li>{ageDetails.age.seconds} seconds</li>
            <li>{ageDetails.age.milliseconds} milliseconds</li>
          </ul>
          <p>Next 10 Birthdays:</p>
          <ul>
            {ageDetails.birthdays.map((birthday, index) => (
              <li key={index}>{birthday}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AgeCalculator;
