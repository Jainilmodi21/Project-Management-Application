const express=require('express');
const { check } = require('express-validator');
const router =express.Router();
const Project=require('../models/Project');
const projectController = require('../controllers/Project_controllers');


// Get all projects
router.get('/', projectController.getProjects);

// Get a project by ID
router.get('/:projectId', projectController.getProjectById);

router.get('/:projectId/task/:user_id', projectController.getTask);

router.get('/:projectId/team-members', projectController.getTeamMembers);

// Create a new project
router.post('/', projectController.createProject);

// Update a project by ID
router.patch('/:projectId', projectController.updateProjectById);

// Delete a project by ID
router.delete('/:projectId', projectController.deleteProjectById);

// Add a team member to a project
router.post('/:projectId/team-members', projectController.addTeamMember);

// Remove a team member from a project
router.delete('/:projectId/team-members/:member_id', projectController.removeTeamMember);

router.delete('/:projectId/:taskId',projectController.removeTask);



module.exports = router;
