const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();  // If you're using environment variables

const app = express();
const port = process.env.PORT || 3010;

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.MONGODB_URI; // Store your connection string in an environment variable
console.log("uri: ", uri);
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.log('Connected successfully to MongoDB - State: ', mongoose.connection.readyState);
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1);
  }
}

connectToDatabase();

const SettingsSchema = new mongoose.Schema({
  userId: String,
  focusDuration: Number,
  shortBreakDuration: Number,
  longBreakDuration: Number,
  focusSound: String,
  shortBreakSound: String,
  longBreakSound: String,
});

const Settings = mongoose.model('Settings', SettingsSchema);

app.get('/api/settings/:userId', async (req, res) => {
  try {
    await client.connect();
    const settings = await Settings.findOne({ userId: req.params.userId });
    if (settings) {
      res.json(settings);
    } else {
      res.status(404).json({ message: 'Settings not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/settings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const settings = req.body;
    console.log('Received settings:', settings);
    console.log('User ID:', userId);
    console.log('Connected', mongoose.connection.readyState);
    const updatedSettings = await Settings.findOneAndUpdate(
      { userId },
      settings,
      { new: true, upsert: true }
    );

    console.log('Updated settings:', updatedSettings);
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});