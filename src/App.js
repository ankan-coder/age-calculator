// src/App.js
import React from "react";
import Header from "./components/Header";
import AgeCalculator from "./components/AgeCalculator";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import DarkModeToggle from "./components/DarkModeToggle";
import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <DarkModeToggle />
      <AgeCalculator />
      <EventForm />
      <EventList />
    </div>
  );
}

export default App;
