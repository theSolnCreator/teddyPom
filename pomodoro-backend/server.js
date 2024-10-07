const express = require('express');
const cors = require('cors');

const app = express();
const port = 3010;

app.use(cors());
app.use(express.json());

let timerInterval;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;

app.get('/status', (req, res) => {
  res.json({ timeLeft, isRunning });
});

app.post('/start', (req, res) => {
  if (!isRunning) {
    isRunning = true;
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        timeLeft = 0;
      }
    }, 1000);
    res.json({ message: 'Timer started' });
  } else {
    res.json({ message: 'Timer is already running' });
  }
});

app.post('/pause', (req, res) => {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    res.json({ message: 'Timer paused' });
  } else {
    res.json({ message: 'Timer is not running' });
  }
});

app.post('/reset', (req, res) => {
  clearInterval(timerInterval);
  isRunning = false;
  timeLeft = 25 * 60;
  res.json({ message: 'Timer reset', timeLeft });
});

app.listen(port, () => {
  console.log(`Pomodoro timer server listening at http://localhost:${port}`);
});
