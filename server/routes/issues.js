const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const issuesFile = path.join(__dirname, '../data/issues.json');

// Helper function to read issues from file
const getIssues = () => {
  const data = fs.readFileSync(issuesFile);
  return JSON.parse(data);
};

// Helper function to write issues to file
const saveIssues = (issues) => {
  fs.writeFileSync(issuesFile, JSON.stringify(issues, null, 2));
};

// GET all issues
router.get('/', (req, res) => {
  try {
    const issues = getIssues();
    res.json({ success: true, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch issues', error: error.message });
  }
});

// GET single issue by ID
router.get('/:id', (req, res) => {
  try {
    const issues = getIssues();
    const issue = issues.find(issue => issue.id === req.params.id);
    
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    
    res.json({ success: true, data: issue });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch issue', error: error.message });
  }
});

// POST new issue
router.post('/', (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    
    // Validate required fields
    if (!title || !description || !status || !priority) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide title, description, status, and priority' 
      });
    }
    
    const issues = getIssues();
    
    // Create new issue
    const newIssue = {
      id: uuidv4(),
      title,
      description,
      status,
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    issues.push(newIssue);
    saveIssues(issues);
    
    res.status(201).json({ success: true, data: newIssue });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create issue', error: error.message });
  }
});

// PUT update issue
router.put('/:id', (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    const issues = getIssues();
    
    // Find issue index
    const issueIndex = issues.findIndex(issue => issue.id === req.params.id);
    
    if (issueIndex === -1) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    
    // Update issue
    issues[issueIndex] = {
      ...issues[issueIndex],
      title: title || issues[issueIndex].title,
      description: description || issues[issueIndex].description,
      status: status || issues[issueIndex].status,
      priority: priority || issues[issueIndex].priority,
      updatedAt: new Date().toISOString()
    };
    
    saveIssues(issues);
    
    res.json({ success: true, data: issues[issueIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update issue', error: error.message });
  }
});

// DELETE issue
router.delete('/:id', (req, res) => {
  try {
    const issues = getIssues();
    
    // Find issue
    const issueIndex = issues.findIndex(issue => issue.id === req.params.id);
    
    if (issueIndex === -1) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    
    // Remove issue
    const deletedIssue = issues[issueIndex];
    issues.splice(issueIndex, 1);
    
    saveIssues(issues);
    
    res.json({ success: true, data: deletedIssue, message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete issue', error: error.message });
  }
});

module.exports = router;