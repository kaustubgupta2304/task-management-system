const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/task.routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const taskService = require('./services/task.service');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

// Routes
app.use('/api/tasks', taskRoutes);

// 404 & Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Seed sample data on startup
taskService.seedSampleTasks();

module.exports = app;
