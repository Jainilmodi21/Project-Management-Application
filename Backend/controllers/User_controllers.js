const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

const User = require('../models/User');
const { request } = require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


// to get all the users
const getUsers = async (req, res, next) => {
    let user;
    try {
        users = await User.find({}, '-password');
    }
    catch (err) {
        console.log(err);
    }
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const getUserById = async (req, res, next) => {
    const userId = req.params.userId;

    let existingUser;
    try {
        existingUser = await User.findById(userId)
        .populate('projects')
        .populate({
            path: 'tasks',                // Path to populate
            select: 'name description status due_date project_id'    // Select specific fields from the Task model
        });
        console.log(existingUser);
    } catch (err) {
        const error = new HttpError(' cannot find, please try again later.', 500);
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError('invalid user ID', 422);
        return next(error);
    }

    res.status(201).json({ user: existingUser.toObject({ getters: true }) });

}

//create new user (signup)
const signup = async (req, res, next) => {

    const errors = validationResult(req); // using express validator
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    let { name, email, password } = req.body;

    //to check user already existed
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again later.', 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('User exists already, please login instead.', 422);
        return next(error);
    }

    // creating new user
    //hash password
    const hashPass= await bcrypt.hash(password,10);
    password=hashPass;
    const createdUser = new User({
        name,
        email,
        password,
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};


const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!existingUser ) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }
    await bcrypt.compare(password,existingUser.password,(err,data)=>{
        if(data){
            const authClaims=[
                {name:existingUser.name}
            ]
            const token=jwt.sign({authClaims},"projectmanagement123",{expiresIn: "60d"})
            res.status(200).json({ id: existingUser._id,name:existingUser.name,token:token,email:existingUser.email});
        }
        else{
            res.status(400).json({ message: 'Invalid Credential' });
        }
    })

    
};

const deleteUserById = async (req, res, next) => {
    const userId = req.params.userId;

    let existingUser;
    try {
        existingUser = await User.findById(userId);
    } catch (err) {
        const error = new HttpError(' cannot find, please try again later.', 500);
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError('invalid user ID', 422);
        return next(error);
    }
    let deletedUser;
    try {
        deletedUser = await User.deleteOne({ _id: userId });
    }
    catch (err) {
        const error = new HttpError('unable to delete, try again.', 500);
        return next(error);
    }
    res.status(201).json({ user: deletedUser.toObject({ getters: true }) });
}

const updateUserById = async (req, res, next) => {
    const userId = req.params.userId;

    // Validate request input using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, email } = req.body;

    // Fetch the user by ID
    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError('Fetching user failed, please try again later.', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('User not found.', 404);
        return next(error);
    }

    // Check if the email is already in use by another user
    let existingUserWithEmail;
    try {
        existingUserWithEmail = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Checking email failed, please try again later.', 500);
        return next(error);
    }

    if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
        const error = new HttpError('Email is already in use by another user.', 422);
        return next(error);
    }

    // Update the user with the new details
    user.name = name;
    user.email = email;
    // user.password=user.password;
    console.log(user);
    // user.password = password;

    try {
        await user.save();
    } catch (err) {
        console.error("Error during user.save():", err);
        const error = new HttpError('Updating user failed, please try again.', 500);
        return next(error);
    }

    // Send a successful response with the updated user details
    res.status(200).json({ message: 'User updated successfully', user: user.toObject({ getters: true }) });
}; 



const changePassword = async (req, res, next) => {
    const userId = req.params.userId;
    const { currentPassword, newPassword } = req.body;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError('Fetching user failed, please try again later.', 500);
        return next(error);
    }

    if (!user || user.password !== currentPassword) {
        const error = new HttpError('Current password is incorrect.', 401);
        return next(error);
    }

    user.password = newPassword;

    try {
        await user.save();
    } catch (err) {
        const error = new HttpError('Changing password failed, please try again later.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Password updated successfully.' });
};

// const getProject = async (req, res) => {
//     try {
//       const userId = req.params.userId;
  
//       // Find user by ID and populate the 'projects' field with full project objects
//       const user = await User.findById(userId).populate('projects'); // Assuming 'projects' contains ObjectIDs referencing the Project model
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Return the populated projects
//       res.json(user.projects);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   };

const getProject = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find user by ID and populate the 'projects' field, then populate 'tasks' field in each project
      const user = await User.findById(userId)
        .populate({
          path: 'projects', // Populate projects field
          populate: {
            path: 'tasks', // Populate tasks field inside each project
            model: 'Task',  // Assuming 'tasks' contains references to the Task model
          },
        });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the populated projects along with tasks
      res.json(user.projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  const getTask = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find user by ID and populate the 'projects' field with full project objects
      const user = await User.findById(userId).populate('tasks'); // Assuming 'projects' contains ObjectIDs referencing the Project model
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the populated projects
      res.json(user.tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  



exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.getTask=getTask;
exports.signup = signup;
exports.login = login;
exports.deleteUserById = deleteUserById;
exports.updateUserById = updateUserById;
exports.changePassword = changePassword;
exports.getProject= getProject;