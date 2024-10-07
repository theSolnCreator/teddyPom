import React, { useState } from 'react';

function SettingsPage({ timer, onClose }) {
  const [focusDuration, setFocusDuration] = useState(timer.focusDuration);
  const [shortBreakDuration, setShortBreakDuration] = useState(timer.shortBreakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState(timer.longBreakDuration);
  const [focusSound, setFocusSound] = useState(timer.getSound('focus'));
  const [shortBreakSound, setShortBreakSound] = useState(timer.getSound('shortBreak'));
  const [longBreakSound, setLongBreakSound] = useState(timer.getSound('longBreak'));

  const handleSave = () => {
    timer.setFocusDuration(focusDuration);
    timer.setShortBreakDuration(shortBreakDuration);
    timer.setLongBreakDuration(longBreakDuration);
    timer.setSound('focus', focusSound);
    timer.setSound('shortBreak', shortBreakSound);
    timer.setSound('longBreak', longBreakSound);
    onClose();
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <div>
        <label>
          Focus Duration (minutes):
          <input
            type="number"
            value={focusDuration}
            onChange={(e) => setFocusDuration(Number(e.target.value))}
            min="1"
          />
        </label>
      </div>
      <div>
        <label>
          Short Break Duration (minutes):
          <input
            type="number"
            value={shortBreakDuration}
            onChange={(e) => setShortBreakDuration(Number(e.target.value))}
            min="1"
          />
        </label>
      </div>
      <div>
        <label>
          Long Break Duration (minutes):
          <input
            type="number"
            value={longBreakDuration}
            onChange={(e) => setLongBreakDuration(Number(e.target.value))}
            min="1"
          />
        </label>
      </div>
      <div>
        <label>
          Focus Sound URL:
          <input
            type="text"
            value={focusSound}
            onChange={(e) => setFocusSound(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Short Break Sound URL:
          <input
            type="text"
            value={shortBreakSound}
            onChange={(e) => setShortBreakSound(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Long Break Sound URL:
          <input
            type="text"
            value={longBreakSound}
            onChange={(e) => setLongBreakSound(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default SettingsPage;
