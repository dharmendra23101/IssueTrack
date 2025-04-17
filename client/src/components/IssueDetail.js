import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchIssue, deleteIssue } from '../api';
import ConfirmDialog from './ConfirmDialog';

function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const getIssue = async () => {
      try {
        setLoading(true);
        const response = await fetchIssue(id);
        if (response.success) {
          setIssue(response.data);
        } else {
          setError('Failed to fetch issue details');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getIssue();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteIssue(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete issue');
      console.error(err);
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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
        <div className="text-lg">Loading issue details...</div>
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

  if (!issue) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded" role="alert">
        <strong className="font-bold">Issue not found!</strong>
        <span className="block sm:inline"> The requested issue could not be found.</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 mr-2">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-bold">{issue.title}</h1>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/issues/${id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Issue ID: <span className="text-gray-500">{issue.id}</span>
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Created on {new Date(issue.createdAt).toLocaleString()}
              </p>
              {issue.createdAt !== issue.updatedAt && (
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Last updated on {new Date(issue.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(issue.status)}`}>
                {issue.status}
              </span>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeColor(issue.priority)}`}>
                {issue.priority} Priority
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
            <p className="whitespace-pre-wrap">{issue.description}</p>
          </div>
        </div>
      </div>

      {showDeleteConfirmation && (
        <ConfirmDialog
          title="Delete Issue"
          message="Are you sure you want to delete this issue? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
}

export default IssueDetail;