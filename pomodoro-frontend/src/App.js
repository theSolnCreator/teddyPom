import React, { useState, useEffect, useRef } from 'react';
import { fetchSettings, saveSettings } from './utils/api';
import PomodoroTimer from './PomodoroTimer';
import SettingsPage from './SettingsPage';
import ActivityList from './ActivityList';

/**
 * Frontend for the Pomodoro Timer
 * @returns 
 */
function App() {
  /// User ID for the browser (user)
  const [userId] = useState('user123'); // @@@LOB: Save a UID on disk that persists across sessions and can be used to retrieve settings from MongoDB
  /// Timer for the Pomodoro
  const [timer, setTimer] = useState(null);
  /// State for the loading of settings
  const [isLoading, setIsLoading] = useState(true);
  /// State for the settings page
  const [showSettings, setShowSettings] = useState(false);
  /// State for the activity list
  const [showActivityList, setShowActivityList] = useState(false);
  /// State for the time remaining
  const [timeRemaining, setTimeRemaining] = useState({ minutes: 25, seconds: 0 });
  /// State for the current mode
  const [currentMode, setCurrentMode] = useState('focus');
  /// State for the activity name
  const [activityName, setActivityName] = useState('');
  /// State for the activity info
  const [activityInfo, setActivityInfo] = useState({ name: '', timeElapsed: 0 });
  /// Reference to the audio element
  const audioRef = useRef(null);

  /**
   * Load the settings from the backend API
   */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        console.log("Loading settings for usera: ", userId);
        const savedSettings = await fetchSettings(userId);
        const newTimer = new PomodoroTimer(
          savedSettings.focusDuration,
          savedSettings.shortBreakDuration,
          savedSettings.longBreakDuration
        );
        newTimer.setSound('focus', savedSettings.focusSound);
        newTimer.setSound('shortBreak', savedSettings.shortBreakSound);
        newTimer.setSound('longBreak', savedSettings.longBreakSound);
        setTimer(newTimer);
      } catch (error) {
        console.error('Failed to load settings:', error);
        setTimer(new PomodoroTimer(25, 5, 15)); // Default values
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [userId]);

  /**
   * Update the time remaining, current mode, and activity info for Pomodoro on every second
   */
  useEffect(() => {
    if (timer) {
      const interval = setInterval(() => {
        setTimeRemaining(timer.getTimeRemaining());
        setCurrentMode(timer.getCurrentMode());
        setActivityInfo(timer.getActivityInfo());
      }, 1000);

      //Play that funky music white boy (ding for end of focus or break)
      timer.setOnStageComplete((mode) => {
        if (audioRef.current) {
          audioRef.current.src = timer.getSound(mode);
          audioRef.current.play();
        }
      });

      return () => clearInterval(interval);
    }
  }, [timer]);

  /**
   * Save the settings to the backend API
   * @param {*} newSettings The new settings to save
   */
  const handleSaveSettings = async (newSettings) => {
    try {
      console.log('Saving settings:', newSettings);
      await saveSettings(userId, newSettings);
      console.log('Settings saved successfully');
      const newTimer = new PomodoroTimer(
        newSettings.focusDuration,
        newSettings.shortBreakDuration,
        newSettings.longBreakDuration
      );
      newTimer.setSound('focus', newSettings.focusSound);
      newTimer.setSound('shortBreak', newSettings.shortBreakSound);
      newTimer.setSound('longBreak', newSettings.longBreakSound);
      setTimer(newTimer);
      setShowSettings(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  //Reload the setting and state for the Pomodoro
  return (
    <div className="App">
      {showSettings ? (
        <SettingsPage 
          timer={timer} 
          onSave={handleSaveSettings} 
          onClose={() => setShowSettings(false)} 
        />
      ) : showActivityList ? (
        <ActivityList activities={timer.getActivities()} onClose={() => setShowActivityList(false)} />
      ) : (
        <>
          <h1>Pomodoro Timer - Welcome, {userId}</h1>
          <p>{`${timeRemaining.minutes}:${timeRemaining.seconds.toString().padStart(2, '0')}`}</p>
          <p>Current Mode: {currentMode}</p>
          <input
            type="text"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            placeholder="Enter activity name"
          />
          <p>Current Activity: {activityInfo.name}</p>
          <p>Time Elapsed: {Math.floor(activityInfo.timeElapsed / 60)}:{(activityInfo.timeElapsed % 60).toString().padStart(2, '0')}</p>
          <button onClick={() => timer.start()}>Start</button>
          <button onClick={() => timer.stop()}>Stop</button>
          <button onClick={() => {
            timer.reset();
            setTimeRemaining(timer.getTimeRemaining());
            setCurrentMode(timer.getCurrentMode());
            setActivityInfo(timer.getActivityInfo());
          }}>Reset</button>
          <button onClick={() => setShowSettings(true)}>Settings</button>
          <button onClick={() => setShowActivityList(true)}>Activity List</button>
        </>
      )}
      <audio ref={audioRef}>
        <source src={timer.getSound(currentMode)} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <p>Default sound effect obtained from <a href="https://freesound.org/people/InspectorJ/sounds/411089/" target="_blank" rel="noopener noreferrer">Freesound.org</a></p>
          </div>
  );
}

export default App;
