# Issue Tracker Application

A comprehensive web application for tracking and managing software issues/bugs. Built with React.js for the frontend and Node.js/Express for the backend.

## Project Overview

This Issue Tracker allows users to:
- Create new issues with title, description, status, and priority
- View all issues in a sortable and filterable dashboard
- View detailed information about specific issues
- Edit existing issues 
- Delete issues

## Screenshots

![Dashboard View](screenshots/dashboard.png)
![Issue Detail View](screenshots/detail.png)
![Issue Form](screenshots/form.png)

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Axios for API communication

### Backend
- Node.js
- Express.js
- JSON file-based storage

## Installation and Setup

### Prerequisites
- Node.js v16+ and npm installed

### Backend Setup
1. Navigate to the server directory:
   ```
   cd issue-tracker/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm run dev
   ```
   The server will run on http://localhost:5000

### Frontend Setup
1. Navigate to the client directory:
   ```
   cd issue-tracker/client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```
   The application will be available at http://localhost:3000

## API Endpoints

- `GET /api/issues` - Get all issues
- `GET /api/issues/:id` - Get a specific issue by ID
- `POST /api/issues` - Create a new issue
- `PUT /api/issues/:id` - Update an existing issue
- `DELETE /api/issues/:id` - Delete an issue

## Project Structure

```
issue-tracker/
├── client/                  # React frontend
│   ├── public/              # Public assets
│   └── src/                 # React source code
│       ├── components/      # React components
│       └── api.js           # API utilities
├── server/                  # Node/Express backend
│   ├── data/                # JSON data storage
│   ├── routes/              # API routes
│   └── index.js             # Server entry point
└── README.md                # This file
```

## Future Enhancements

- User authentication and authorization
- Comment system for issues
- File attachments
- Issue categories/labels
- Custom issue statuses
- Email notifications
- Dashboard statistics and reporting