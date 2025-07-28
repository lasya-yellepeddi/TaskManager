const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.set('views', 'views');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/task-manager', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  priority: String,
  completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

// API endpoints
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render('index', { tasks });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/create', async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  const newTask = new Task({ title, description, dueDate, priority, completed: false });

  try {
    await newTask.save();
    res.redirect('/');
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
});

app.post('/delete/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    await Task.findByIdAndDelete(taskId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
