import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchIssue, createIssue, updateIssue } from '../api';

function IssueForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Open',
    priority: 'Medium'
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssueData = async () => {
      if (!isEditMode) return;
      
      try {
        const response = await fetchIssue(id);
        if (response.success) {
          const { title, description, status, priority } = response.data;
          setFormData({ title, description, status, priority });
        } else {
          setError('Failed to fetch issue data');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssueData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (isEditMode) {
        await updateIssue(id, formData);
        navigate(`/issues/${id}`);
      } else {
        const response = await createIssue(formData);
        navigate(`/issues/${response.data.id}`);
      }
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} issue`);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading issue data...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to={isEditMode ? `/issues/${id}` : '/'} className="text-blue-600 hover:text-blue-800 mr-2">
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Issue' : 'Create New Issue'}</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-gray-700 font-medium mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to={isEditMode ? `/issues/${id}` : '/'}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2 hover:bg-gray-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update Issue' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IssueForm;