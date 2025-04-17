import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">Issue Tracker</Link>
          </div>
          <div>
            <Link 
              to="/issues/new" 
              className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              Create Issue
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;