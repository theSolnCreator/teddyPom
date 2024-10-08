import React, { useState, useEffect } from 'react';
import PomodoroTimer from '../PomodoroTimer';
import SettingsPage from './SettingsPage';

/**
 * The main PomodoroApp component
 * @returns 
 */
function PomodoroApp() {
  const [timer] = useState(new PomodoroTimer(25, 5, 15));
  const [timeRemaining, setTimeRemaining] = useState(timer.getTimeRemaining());
  const [currentMode, setCurrentMode] = useState(timer.getCurrentMode());
  const [activityInfo, setActivityInfo] = useState(timer.getActivityInfo());
  const [newActivityName, setNewActivityName] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(timer.getTimeRemaining());
      setCurrentMode(timer.getCurrentMode());
      setActivityInfo(timer.getActivityInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleOpenSettings = () => {
    setShowSettings(true);
    console.log('Settings opened'); // Add this line for debugging
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
    console.log('Settings closed'); // Add this line for debugging
  };

  return (
    <div>
      <h1>Pomodoro Timer</h1>
      <button onClick={handleOpenSettings}>Open Settings</button>
      
      {showSettings ? (
        <SettingsPage timer={timer} onClose={handleCloseSettings} />
      ) : (
        <div>
          <p>{`${timeRemaining.minutes}:${timeRemaining.seconds.toString().padStart(2, '0')}`}</p>
          <p>Current Mode: {currentMode}</p>
          {/* ... other timer controls ... */}
          
          <div>
            <h2>Current Activity</h2>
            <p>Name: {activityInfo.name || 'No activity set'}</p>
            <p>Time Elapsed: {formatTime(activityInfo.timeElapsed)}</p>
            {/* ... activity input form ... */}
          </div>
        </div>
      )}
    </div>
  );
}

export default PomodoroApp;
