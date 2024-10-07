import React, { useState, useEffect, useRef } from 'react';
import PomodoroTimer from './PomodoroTimer';
import SettingsPage from './SettingsPage';
import ActivityList from './ActivityList';

function App() {
  const [timer] = useState(() => new PomodoroTimer(25, 5, 15));
  const [timeRemaining, setTimeRemaining] = useState(timer.getTimeRemaining());
  const [currentMode, setCurrentMode] = useState(timer.getCurrentMode());
  const [showSettings, setShowSettings] = useState(false);
  const [showActivityList, setShowActivityList] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [activityInfo, setActivityInfo] = useState(timer.getActivityInfo());
  const audioRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(timer.getTimeRemaining());
      setCurrentMode(timer.getCurrentMode());
      setActivityInfo(timer.getActivityInfo());
    }, 1000);

    timer.setOnStageComplete((mode) => {
      if (audioRef.current) {
        audioRef.current.src = timer.getSound(mode);
        audioRef.current.play();
      }
    });

    return () => clearInterval(interval);
  }, [timer]);

  const handleStart = () => {
    if (timer.getCurrentMode() !== 'focus' || !timer.isRunning) {
      timer.startActivity(activityName);
    }
    timer.start();
  };

  const handleStop = () => {
    timer.stop();
    timer.stopActivity();
  };

  const handleReset = () => {
    timer.reset();
    timer.stopActivity();
    setTimeRemaining(timer.getTimeRemaining());
    setCurrentMode(timer.getCurrentMode());
    setActivityInfo(timer.getActivityInfo());
    setActivityName('');
  };

  const handleActivityChange = (e) => {
    const newActivityName = e.target.value;
    setActivityName(newActivityName);
    if (timer.isRunning && timer.getCurrentMode() === 'focus') {
      timer.stopActivity();
      timer.startActivity(newActivityName);
    }
  };

  const handleOpenSettings = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);
  const handleOpenActivityList = () => setShowActivityList(true);
  const handleCloseActivityList = () => setShowActivityList(false);

  if (showSettings) {
    return <SettingsPage timer={timer} onClose={handleCloseSettings} />;
  }

  if (showActivityList) {
    return <ActivityList activities={timer.getActivities()} onClose={handleCloseActivityList} />;
  }

  return (
    <div className="App">
      <h1>Pomodoro Timer</h1>
      <p>{`${timeRemaining.minutes}:${timeRemaining.seconds.toString().padStart(2, '0')}`}</p>
      <p>Current Mode: {currentMode}</p>
      <input
        type="text"
        value={activityName}
        onChange={handleActivityChange}
        placeholder="Enter activity name"
      />
      <p>Current Activity: {activityInfo.name}</p>
      <p>Time Elapsed: {Math.floor(activityInfo.timeElapsed / 60)}:{(activityInfo.timeElapsed % 60).toString().padStart(2, '0')}</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleOpenSettings}>Settings</button>
      <button onClick={handleOpenActivityList}>Activity List</button>
      <audio ref={audioRef}>
        <source src={timer.getSound(currentMode)} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <p>Default sound effect obtained from <a href="https://freesound.org/people/InspectorJ/sounds/411089/" target="_blank" rel="noopener noreferrer">Freesound.org</a></p>
    </div>
  );
}

export default App;
