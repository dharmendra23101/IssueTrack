const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const issuesRouter = require('./routes/issues');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Check if data directory exists, if not create it
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Check if issues.json exists, if not create it with empty array
const issuesFile = path.join(dataDir, 'issues.json');
if (!fs.existsSync(issuesFile)) {
  fs.writeFileSync(issuesFile, JSON.stringify([], null, 2));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Request logging

// Routes
app.use('/api/issues', issuesRouter);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});