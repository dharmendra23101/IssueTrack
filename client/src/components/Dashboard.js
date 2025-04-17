import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchIssues } from '../api';

function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const getIssues = async () => {
      try {
        setLoading(true);
        const response = await fetchIssues();
        if (response.success) {
          setIssues(response.data);
        } else {
          setError('Failed to fetch issues');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getIssues();
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedIssues = [...issues].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredIssues = filterStatus === 'all' 
    ? sortedIssues 
    : sortedIssues.filter(issue => issue.status === filterStatus);

  const getPriorityBadgeColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-purple-100 text-purple-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading issues...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Issues</h1>
        <div className="flex gap-4">
          <select 
            className="border rounded px-3 py-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">No issues found. Create your first issue!</p>
          <Link 
            to="/issues/new" 
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Issue
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('priority')}
                >
                  Priority {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {issue.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/issues/${issue.id}`} 
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {issue.title}
                    </Link>
                    <p className="text-gray-500 text-sm truncate max-w-xs">
                      {issue.description.length > 50 
                        ? `${issue.description.substring(0, 50)}...` 
                        : issue.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeColor(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;