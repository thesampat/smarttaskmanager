const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const redis = require('redis');
const { analyzeTask } = require('./services/aiService');
require('dotenv').config({});


const app = express();
const PORT = process.env.PORT || 5000;

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});


redisClient.on('error', (err) => console.log('Redis Client Error', err));
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis connection failed, continuing without cache');
  }
})();


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const Task = require('./models/Task');

// analyzeTask is now handled by services/aiService.js

// Routes
app.post('/tasks', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const analysis = await analyzeTask(title, description, redisClient);

    const newTask = new Task({
      title,
      description,
      category: analysis.category,
      difficulty: analysis.difficulty,
      colorCode: analysis.colorCode
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

app.use('/', (req, res) => {
  res.send('welcome')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
