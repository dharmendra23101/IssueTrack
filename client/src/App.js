import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import IssueDetail from './components/IssueDetail';
import IssueForm from './components/IssueForm';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/issues/new" element={<IssueForm />} />
            <Route path="/issues/:id" element={<IssueDetail />} />
            <Route path="/issues/:id/edit" element={<IssueForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;