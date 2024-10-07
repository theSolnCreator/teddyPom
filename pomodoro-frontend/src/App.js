import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const apiUrl = 'http://localhost:3010';  // Replace with your backend's IP if testing on a real network

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Initial 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);

  // Fetch the current timer status from the backend
  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${apiUrl}/status`);
      setTimeLeft(res.data.timeLeft);
      setIsRunning(res.data.isRunning);
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  // Start the timer by calling the backend
  const startTimer = async () => {
    try {
      await axios.post(`${apiUrl}/start`);
      fetchStatus();  // Update the UI after starting
    } catch (error) {
      console.error("Error starting timer:", error);
    }
  };

  // Pause the timer by calling the backend
  const pauseTimer = async () => {
    try {
      await axios.post(`${apiUrl}/pause`);
      fetchStatus();  // Update the UI after pausing
    } catch (error) {
      console.error("Error pausing timer:", error);
    }
  };

  // Reset the timer by calling the backend
  const resetTimer = async () => {
    try {
      await axios.post(`${apiUrl}/reset`);
      fetchStatus();  // Update the UI after resetting
    } catch (error) {
      console.error("Error resetting timer:", error);
    }
  };

  // Format the time left into minutes and seconds (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Use `useEffect` to fetch status regularly
  useEffect(() => {
    fetchStatus();  // Initial fetch
    const interval = setInterval(fetchStatus, 1000);  // Poll the backend every second
    return () => clearInterval(interval);  // Cleanup on component unmount
  }, []);

  return (
    <div className="App">
      <h1>Pomodoro Timer</h1>
      <div className="timer">{formatTime(timeLeft)}</div>
      <div className="button-container">
        {!isRunning ? (
          <button className="start-button" onClick={startTimer}>Start</button>
        ) : (
          <button className="pause-button" onClick={pauseTimer}>Pause</button>
        )}
        <button className="reset-button" onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

export default App;
