const express=require('express');
const { check } = require('express-validator');
const router =express.Router();
const User=require('../models/User');
const usersController = require('../controllers/User_controllers');
const {authenticateToken}= require("./userAuth");


router.get('/', usersController.getUsers);
router.get('/:userId',usersController.getUserById);
router.get('/:userId/projects',usersController.getProject);
router.get('/:userId/tasks',usersController.getTask);

router.post('/signup',
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);


 router.post('/login',
    [
    check('email')
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check('password').isLength({ min: 6 })
  ]
  , usersController.login
);


router.patch(
    '/:userId',
    [
      check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
   
    ],
    usersController.updateUserById
  );

router.delete('/:userId', usersController.deleteUserById);


// Change Password Route
router.patch(
    '/change-password/:userId',
    [
        check('currentPassword').not().isEmpty(),
        check('newPassword').isLength({ min: 6 })
    ],
    usersController.changePassword
);

module.exports = router;


