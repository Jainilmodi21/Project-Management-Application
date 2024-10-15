const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const Task = require('../models/Task');
const tasksController = require('../controllers/Task_controllers');

// Get all tasks
router.get('/', tasksController.getTasks);

// Get a task by ID
router.get('/:taskId', tasksController.getTaskById);

// Create a new task
router.post(
    '/:project_id',
    [
        check('project_id')
            .not()
            .isEmpty(),
        check('name')
            .not()
            .isEmpty(),
        check('due_date')
            .isISO8601()
            .toDate(),
        check('status')
            .not()
            .isEmpty(),
           
        check('assignedTo')
            .isArray()
           
    ],
    tasksController.createTask
);

// Update a task by ID
router.patch(
    '/:taskId',
    [
        check('name')
            .optional()
            .not()
            .isEmpty(),
        check('due_date')
            .optional()
            .isISO8601()
            .toDate(),
        check('status')
            .optional()
            .not()
            .isEmpty(),
        check('assignedTo')
            .optional()
            .isArray()
    ],
    tasksController.updateTaskById
);

// Delete a task by ID
router.delete('/:projectId/:taskId', tasksController.deleteTask);

router.patch(
    '/:taskId/add-member',
    [
        check('userId').not().isEmpty()
    ],
    tasksController.addMemberToTask
);

// Remove member from task
router.patch(
    '/:taskId/remove-member',
    [
        check('userId').not().isEmpty()
    ],
    tasksController.removeMemberFromTask
);

module.exports = router;
