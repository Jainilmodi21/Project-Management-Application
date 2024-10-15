const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Project = require('../models/Project');
const User = require('../models/User');
const { request } = require('express');
const Task = require('../models/Task');

// Get all projects
const getProjects = async (req, res, next) => {
    let projects;
    try {
        projects = await Project.find()
            .populate('created_by', '-password')
            .populate('teamMembers.user_id', '-password');
    } catch (err) {
        const error = new HttpError('Fetching projects failed, please try again later.', 500);
        return next(error);
    }
    res.json({ projects: projects.map(project => project.toObject({ getters: true })) });
};



// Fetch project details, tasks, and team members
const getProjectById= async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Fetch the project along with team members
    const project = await Project.findById(projectId).populate('tasks').populate('teamMembers');
    

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Fetch tasks related to the project
    // const tasks = await Task.find({ project_id: projectId }).populate('assignedTo', 'name');
    // const tasks = await Task.find({ project_id: projectId });
    // console.log('Raw tasks:', tasks); // Check if assignedTo has valid ObjectIds before population
    
    // const populatedTasks = await Task.find({ project_id: projectId }).populate('assignedTo', 'name');
    // console.log('Populated tasks:', populatedTasks); // Check populated result
    
    // Send project details along with tasks and team members
    res.json({
      project,
      tasks: project.tasks,
      teamMembers: project.teamMembers
    });
  } catch (err) {
    console.error('Error fetching project details:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//module.exports = router;


const getTask = async (req, res, next) => {
    const {projectId,user_id} = req.params;
    let tasks;
    try {
        tasks = await Task.find({project_id:projectId,user_id:user_id})
            .populate('project_id', 'name description') // Populate the project details
            .populate('assignedTo', 'name email'); // Populate assigned users
    } catch (err) {
        const error = new HttpError('Fetching tasks failed, please try again later.', 500);
        return next(error);
    }
    res.json({ tasks: tasks.map(task => task.toObject({ getters: true })) });
};
// Create a new project
const createProject = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, description, startDate, endDate, status, created_by ,teamMembers} = req.body;

    const createdProject = new Project({
        name,
        description,
        startDate,
        endDate,
        status,
        created_by,
        teamMembers,
    });

    try {
        await createdProject.save();

        // Add project ID to created_by user
        await User.findByIdAndUpdate(created_by, {
            $addToSet: { projects: createdProject._id }  // $addToSet ensures uniqueness
        });

        // Add project ID to all team members
        for (const member of teamMembers) {
            await User.findByIdAndUpdate(member.user_id, {
                $addToSet: { projects: createdProject._id }  // $addToSet ensures uniqueness
            });
        }

    } catch (err) {
        console.error('Error creating project:', err);  // Log the specific error
        const error = new HttpError('Creating project failed, please try again later.', 500);
        return next(error);
    }

    res.status(201).json({ project: createdProject.toObject({ getters: true }) });
};

// Update a project by ID
const updateProjectById = async (req, res, next) => {
    const projectId = req.params.projectId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, description, startDate, endDate, status } = req.body;

    let project;
    try {
        project = await Project.findById(projectId);
        if (!project) {
            return next(new HttpError('Project not found.', 404));
        }

        project.name = name;
        project.description = description;
        project.startDate = startDate;
        project.endDate = endDate;
        project.status = status;
      

        await project.save();
    } catch (err) {
        const error = new HttpError('Updating project failed, please try again later.', 500);
        return next(error);
    }

    res.status(200).json({ project: project.toObject({ getters: true }) });
};

// Delete a project by ID
const deleteProjectById = async (req, res, next) => {
    const projectId = req.params.projectId;

    try {
        // Find the project to ensure it exists
        const project = await Project.findById(projectId);
        if (!project) {
            return next(new HttpError('Project not found.', 404));
        }

        // Remove the project ID from the 'projects' array of all users
        await User.updateMany(
            { projects: projectId },
            { $pull: { projects: projectId } }  // $pull removes the projectId from the array
        );

        // Delete the project using deleteOne
        await Project.deleteOne({ _id: projectId });
    } catch (err) {
        const error = new HttpError('Deleting project failed, please try again later.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Project deleted successfully.' });
};

const getTeamMembers = async (req, res, next) => {
    const projectId = req.params.projectId;
    let project;
    try {
        // Find the project by ID and populate teamMembers user_id (without password)
        project = await Project.findById(projectId);
           
        
        // Check if the project exists
        if (!project) {
            const error = new HttpError('Could not find a project for the provided id.', 404);
            return next(error);
        }
        
        // Extract only the user_id and role for each team member
        const members = project.teamMembers.map(member => ({
            user_id: member._id,
            name:member.name,
            role: member.role
        }));

        res.json(project.teamMembers);
        
    } catch (err) {
        const error = new HttpError('Fetching members failed, please try again later.', 500);
        return next(error);
    }
};


// Add a team member to a project
const addTeamMember = async (req, res, next) => {
    const projectId = req.params.projectId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { user_id, role } = req.body;
    const user1=await User.findById(user_id);
    const name=user1.name;
    let project;
    try {
        project = await Project.findById(projectId);
        if (!project) {
            return next(new HttpError('Project not found.', 404));
        }

        project.teamMembers.push({ user_id, role ,name});
        await project.save();

        // Add project ID to the user's project array
        await User.findByIdAndUpdate(user_id, {
            $addToSet: { projects: projectId }  // $addToSet ensures uniqueness
        });

    } catch (err) {
        const error = new HttpError('Adding team member failed, please try again later.', 500);
        return next(error);
    }

    res.status(201).json({ project: project.toObject({ getters: true }) });
};


// Remove a team member from a project
// const removeTeamMember = async (req, res, next) => {
    
//     const { projectId,member_id } = req.params;

//     let project;
//     try {
//         project = await Project.findById(projectId);
//         if (!project) {
//             return next(new HttpError('Project not found.', 404));
//         }

//         // Check if the user is part of the project
//         const memberExists = project.teamMembers.some(member => member.user_id.toString() === member_id);
//         const u_id=memberExists.user_id;
//         if (!memberExists) {
//             return next(new HttpError('User is not a team member of this project.', 404));
//         }
//         cosole.log(memberExists);

//         // Remove the user from the teamMembers array in the Project document
//         project.teamMembers = project.teamMembers.filter(member => member.user_id.toString() !== member_id);
//         await project.save();

//         // Remove the project ID from the user's projects array
//         await User.findByIdAndUpdate(
//             member_id,
//             { $pull: { projects: projectId } }  // $pull removes the projectId from the array
//         );
//     } catch (err) {
//         const error = new HttpError('Removing team member failed, please try again later.', 500);
//         return next(error);
//     }

//     res.status(200).json({ project: project.toObject({ getters: true }) });
// };

const removeTeamMember=(async (req, res) => {
    const { projectId, member_id } = req.params;
    
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Remove team member
      project.teamMembers = project.teamMembers.filter(member => member.user_id.toString() !== member_id);
      await project.save();

      await User.findByIdAndUpdate(
                   member_id,
                     { $pull: { projects: projectId } }  
                 );
  
      res.status(200).json({ project: project.toObject({ getters: true }) });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  // Delete a task from the project
const removeTask = async (req, res) => {
    const { projectId, taskId } = req.params;
    try {
        // Find the project by projectId
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }


        // Remove the task from the project's task list
        project.tasks = project.tasks.filter((task) => task._id.toString() !== taskId);

        // Save the updated project
        await project.save();

        // Also remove the task from the Task collection (if you are keeping tasks in a separate collection)
        await Task.findByIdAndDelete(taskId);

        res.status(200).json({ message: 'Task removed successfully', tasks: project.tasks });
    } catch (err) {
        res.status(500).json({ message: 'Error removing task', error: err.message });
    }
};


exports.getProjects = getProjects;
exports.getProjectById = getProjectById;
exports.createProject = createProject;
exports.updateProjectById = updateProjectById;
exports.deleteProjectById = deleteProjectById;
exports.addTeamMember = addTeamMember;
exports.removeTeamMember = removeTeamMember;
exports.getTask=getTask;
exports.getTeamMembers=getTeamMembers;
exports.removeTask=removeTask;
