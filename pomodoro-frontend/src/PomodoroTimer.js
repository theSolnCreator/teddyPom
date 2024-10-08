class PomodoroTimer {
  constructor(focusDuration = 25, shortBreakDuration = 5, longBreakDuration = 15) {
    this.focusDuration = focusDuration;
    this.shortBreakDuration = shortBreakDuration;
    this.longBreakDuration = longBreakDuration;
    this.currentMode = 'focus';
    this.timeRemaining = focusDuration * 60;
    this.isRunning = false;
    this.timer = null;
    this.activityName = '';
    this.activityTimeElapsed = 0;
    this.activities = [];
    this.onStageComplete = null;      
    this.sounds = {
      focus: "https://freesound.org/data/previews/411/411089_5121236-lq.mp3",
      shortBreak: "https://freesound.org/data/previews/411/411089_5121236-lq.mp3",
      longBreak: "https://freesound.org/data/previews/411/411089_5121236-lq.mp3"
    };
    this.focusTimeRemaining = focusDuration * 60;
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.timer = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
          if (this.currentMode === 'focus') {
            this.focusTimeRemaining = this.timeRemaining;
            this.activityTimeElapsed++;
          }
        } else {
          this.nextSession();
        }
      }, 1000);
    }
  }

  stop() {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.timer);
    }
  }

  reset() {
    this.stop();
    this.currentMode = 'focus';
    this.timeRemaining = this.focusDuration * 60;
    this.focusTimeRemaining = this.timeRemaining;
    this.activityTimeElapsed = 0;
    this.sessionCount = 0;
  }

  getTimeRemaining() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    return { minutes, seconds };
  }

  getCurrentMode() {
    return this.currentMode;
  }

  nextSession() {
    this.stop();
    if (this.currentMode === 'focus') {
      this.currentMode = this.sessionCount % 4 === 0 ? 'longBreak' : 'shortBreak';
      this.timeRemaining = this.currentMode === 'longBreak' ? this.longBreakDuration * 60 : this.shortBreakDuration * 60;
    } else {
      this.currentMode = 'focus';
      this.timeRemaining = this.focusTimeRemaining;
      this.sessionCount++;
    }
    if (this.onStageComplete) {
      this.onStageComplete(this.currentMode);
    }
    this.start();
  }

  setFocusDuration(duration) {
    this.focusDuration = duration;
    if (this.currentMode === 'focus') {
      this.timeRemaining = duration * 60;
    }
  }

  setShortBreakDuration(duration) {
    this.shortBreakDuration = duration;
    if (this.currentMode === 'shortBreak') {
      this.timeRemaining = duration * 60;
    }
  }

  setLongBreakDuration(duration) {
    this.longBreakDuration = duration;
    if (this.currentMode === 'longBreak') {
      this.timeRemaining = duration * 60;
    }
  }

  startActivity(name) {
    if (this.currentMode !== 'focus') {
      // Reset timer if not in focus mode
      this.timeRemaining = this.focusDuration * 60;
    }
    this.activityName = name;
    this.activities.push({
      name,
      date: new Date(),
      duration: 0
    });
  }

  stopActivity() {
    if (this.activityName) {
      const activity = this.activities[this.activities.length - 1];
      activity.duration = this.activityTimeElapsed;
      this.activityName = '';
      this.activityTimeElapsed = 0;
    }
  }

  getActivities(daysAgo = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    return this.activities.filter(activity => activity.date >= cutoffDate);
  }

  getActivityInfo() {
    return {
      name: this.activityName,
      timeElapsed: this.activityTimeElapsed
    };
  }

  setOnStageComplete(callback) {
    this.onStageComplete = callback;
  }

  setSound(stage, soundUrl) {
    if (this.sounds.hasOwnProperty(stage)) {
      this.sounds[stage] = soundUrl;
    }
  }

  getSound(stage) {
    return this.sounds[stage] || "";
  }
}

export default PomodoroTimer;
