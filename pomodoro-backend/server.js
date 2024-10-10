const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // If you're using environment variables

//Enable Express
const app = express();
const port = process.env.PORT || 3010;

app.use(cors());
app.use(bodyParser.json());

//Enable MongoDB connection
const uri = process.env.MONGODB_URI; // Store  connection string in an environment variable
//console.log("uri: ", uri);

/**
 * Connect to MongoDB
 */
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

//Schemas
/**
 * Schema for the settings
 */
const SettingsSchema = new mongoose.Schema({
  userId: String,
  focusDuration: Number,
  shortBreakDuration: Number,
  longBreakDuration: Number,
  focusSound: String,
  shortBreakSound: String,
  longBreakSound: String,
});

//Enable the settings model in MongoDB
const Settings = mongoose.model('Settings', SettingsSchema);

//Set up the routes for the settings
app.get('/api/settings/:userId', async (req, res) => {
  try {
    //console.log("Getting settings for user: ", req.params.userId);
    const settings = await Settings.findOne({ userId: req.params.userId });
    if (settings) {
      res.json(settings);
    } else {
      res.status(404).json({ message: 'Settings not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.error('Error getting settings:', error);
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
//----End of Settings rounts---------------------------------------------------

//Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});