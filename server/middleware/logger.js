const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create a write stream for logs
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../logs/access.log'), 
  { flags: 'a' }
);

// Create custom token for request body
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

// Define format string
const logFormat = ':method :url :status :res[content-length] - :response-time ms :body';

// Export middleware
module.exports = {
  // Console logger
  consoleLogger: morgan(logFormat),
  
  // File logger
  fileLogger: morgan(logFormat, { stream: accessLogStream })
};