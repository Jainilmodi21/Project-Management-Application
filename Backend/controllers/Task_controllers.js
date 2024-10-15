const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Project = require('../models/Project');
const User = require('../models/User');
const Task =  require('../models/Task');
const { request } = require('express');

const getTasks = async (req, res, next) => {
    let tasks;
    try {
        tasks = await Task.find()
            .populate('project_id', 'name description') // Populate the project details
            .populate('assignedTo', 'name email'); // Populate assigned users
    } catch (err) {
        const error = new HttpError('Fetching tasks failed, please try again later.', 500);
        return next(error);
    }
    res.json({ tasks: tasks.map(task => task.toObject({ getters: true })) });
};

const getTaskById = async (req, res, next) => {
    const taskId = req.params.taskId;

    let task;
    try {
        task = await Task.findById(taskId)
            .populate('project_id', 'name description') // Populate the project details
            .populate('assignedTo', 'name email'); // Populate assigned users
    } catch (err) {
        const error = new HttpError('Fetching task failed, please try again later.', 500);
        return next(error);
    }

    if (!task) {
        const error = new HttpError('Task not found.', 404);
        return next(error);
    }

    res.json({ task: task.toObject({ getters: true }) });
};

// const createTask = async (req, res, next) => {
//     const project_id=req.params.project_id;
//     const errors = validationResult(req);
//     console.log(req.body);
//     if (!errors.isEmpty()) {
//         return next(new HttpError('Invalid inputs passed, please check your data.', 422));
//     }

//     const {  name, description, due_date, status, assignedTo } = req.body;

//     // Create a new task
//     const createdTask = new Task({
//         project_id,
//         name,
//         description,
//         status,
//         due_date,
//         assignedTo,
//     });

//     try {
//         // Save the task
//         await createdTask.save();
//         console.log(createdTask);
//         //Add task ID to the tasks array of each user assigned to this task
//         for (const userId of createdTask.assignedTo) {
//             await User.findByIdAndUpdate(userId, {
//                 $addToSet: { tasks: createdTask._id } // $addToSet ensures uniqueness
//             },{new: true });
//         }
//         // const updatedUsers=await User.updateMany({_id:{ $in: assignedTo}},
//         //     {$addToSet:{tasks:createdTask,_id}}
//         // );

//         res.status(201).json({ task: createdTask.toObject({ getters: true }) });
//     } catch (err) {
//         const error = new HttpError('Creating task failed, please try again later.', 500);
//         return next(error);
//     }
// };
const createTask = async (req, res, next) => {
    const project_id = req.params.project_id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, description, due_date, status, assignedTo } = req.body;

    // Create a new task
    const createdTask = new Task({
        project_id,
        name,
        description,
        status,
        due_date,
        assignedTo,
    });

    try {
        // Save the task
        await createdTask.save();
        console.log("Task created successfully:", createdTask);

        try {
            const updatedProject = await Project.findByIdAndUpdate(
                project_id,
                { $addToSet: { tasks: createdTask._id } },
                { new: true }
            );
        }
        catch (err) {
            console.error("Error creating task:", err.message);
            const error = new HttpError('Creating task failed, please try again later.', 500);
            return next(error);
        }
        
        // Add task ID to the tasks array of each user assigned to this task
        for (const userId of createdTask.assignedTo) {
            try {
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { $addToSet: { tasks: createdTask._id } },
                    { new: true }
                );
                if (!updatedUser) {
                    throw new HttpError(`User with ID ${userId} not found.`, 404);
                }
                console.log(`Updated user ${userId} with new task ${createdTask._id}`);
            } catch (err) {
                console.error(`Error updating user ${userId}: ${err.message}`);
                return next(new HttpError('Updating user tasks failed.', 500));
            }
        }

        res.status(201).json({ task: createdTask.toObject({ getters: true }) });
    } catch (err) {
        console.error("Error creating task:", err.message);
        const error = new HttpError('Creating task failed, please try again later.', 500);
        return next(error);
    }
};


const updateTaskById = async (req, res, next) => {
    const taskId = req.params.taskId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const {  status } = req.body;

    let task;
    try {
        task = await Task.findById(taskId);
        if (!task) {
            return next(new HttpError('Task not found.', 404));
        }

        //task.name = name;
        // task.description = description;
        //task.due_date = due_date;
        task.status = status;
        //task.assignedTo = assignedTo;

        await task.save();
    } catch (err) {
        const error = new HttpError('Updating task failed, please try again later.', 500);
        return next(error);
    }

    res.status(200).json({ task: task.toObject({ getters: true }) });
};

const deleteTask = async (req, res, next) => {
    const taskId = req.params.taskId;
    const projectId= req.params.projectId;
    console.log(taskId);

    try {
        // Find the task to ensure it exists
        const task = await Task.findById(taskId);
        if (!task) {
            return next(new HttpError('Task not found.', 404));
        }

        await Project.findByIdAndUpdate(projectId, {
            $pull: { tasks: taskId } // $pull removes the taskId from the array
        });
        // Remove the task ID from the tasks array of each user assigned to this task
        for (const userId of task.assignedTo) {
            await User.findByIdAndUpdate(userId, {
                $pull: { tasks: taskId } // $pull removes the taskId from the array
            });
        }

        // Delete the task
        await Task.deleteOne({ _id: taskId });

        res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (err) {
        const error = new HttpError('Deleting task failed, please try again later.', 500);
        return next(error);
    }
};

const addMemberToTask = async (req, res, next) => {
    const taskId = req.params.taskId;
    const { userId } = req.body;

    try {
        // Find the task to ensure it exists
        const task = await Task.findById(taskId);
        if (!task) {
            return next(new HttpError('Task not found.', 404));
        }

        // Check if user is already assigned
        if (task.assignedTo.includes(userId)) {
            return next(new HttpError('User is already assigned to this task.', 400));
        }

        // Add the user ID to the assignedTo array of the task
        task.assignedTo.push(userId);
        await task.save();

        // Add the task ID to the tasks array of the user
        await User.findByIdAndUpdate(userId, {
            $addToSet: { tasks: taskId } // $addToSet ensures uniqueness
        });

        res.status(201).json({ task: task.toObject({ getters: true }) });
    } catch (err) {
        const error = new HttpError('Adding member failed, please try again later.', 500);
        return next(error);
    }
};

const removeMemberFromTask = async (req, res, next) => {
    const taskId = req.params.taskId;
    const { userId } = req.body;

    try {
        // Find the task to ensure it exists
        const task = await Task.findById(taskId);
        if (!task) {
            return next(new HttpError('Task not found.', 404));
        }

        // Check if the user is assigned
        if (!task.assignedTo.includes(userId)) {
            return next(new HttpError('User is not assigned to this task.', 400));
        }

        // Remove the user ID from the assignedTo array of the task
        task.assignedTo = task.assignedTo.filter(id => id.toString() !== userId);
        await task.save();

        // Remove the task ID from the tasks array of the user
        await User.findByIdAndUpdate(userId, {
            $pull: { tasks: taskId } // $pull removes the taskId from the array
        });

        res.status(200).json({ task: task.toObject({ getters: true }) });
    } catch (err) {
        const error = new HttpError('Removing member failed, please try again later.', 500);
        return next(error);
    }
};


exports.getTasks = getTasks;
exports.getTaskById=getTaskById;
exports.createTask = createTask;
exports.updateTaskById=updateTaskById;
exports.deleteTask= deleteTask;
exports.addMemberToTask=addMemberToTask;
exports.removeMemberFromTask=removeMemberFromTask;
