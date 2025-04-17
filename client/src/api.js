import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Issue API functions
export const fetchIssues = async () => {
  try {
    const response = await api.get('/issues');
    return response.data;
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw error;
  }
};

export const fetchIssue = async (id) => {
  try {
    const response = await api.get(`/issues/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching issue ${id}:`, error);
    throw error;
  }
};

export const createIssue = async (issueData) => {
  try {
    const response = await api.post('/issues', issueData);
    return response.data;
  } catch (error) {
    console.error('Error creating issue:', error);
    throw error;
  }
};

export const updateIssue = async (id, issueData) => {
  try {
    const response = await api.put(`/issues/${id}`, issueData);
    return response.data;
  } catch (error) {
    console.error(`Error updating issue ${id}:`, error);
    throw error;
  }
};

export const deleteIssue = async (id) => {
  try {
    const response = await api.delete(`/issues/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting issue ${id}:`, error);
    throw error;
  }
};

export default {
  fetchIssues,
  fetchIssue,
  createIssue,
  updateIssue,
  deleteIssue
};