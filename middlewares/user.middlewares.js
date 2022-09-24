const { body, validationResult } = require('express-validator');

// Model
const { User } = require('../models/user.model');

const { protectUserAccount, isUserAdmin } = require('./auth.middleware');

const userExists = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        messague: 'User not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // [{ ..., msg }] -> [msg, msg, ...] -> 'msg. msg. msg. msg'
    const errorMessages = errors.array().map((err) => err.msg);

    const message = errorMessages.join('. ');

    return res.status(404).json({
      status: 'error',
      message,
    });
  }

  next();
};

const makeAdminValidator = [userExists, isUserAdmin];

const createUserValidator = [
  body('username')
    .isString()
    .withMessage('Username must be a String')
    .notEmpty()
    .withMessage('Username can not be empty')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Must provide a valid email'),
  body('password')
    .isString()
    .withMessage('Password must be a String')
    .notEmpty()
    .withMessage('Password can not be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  checkValidations,
];

const updateUserValidator = [
  userExists,
  body('username')
    .isString()
    .withMessage('Username must be a String')
    .notEmpty()
    .withMessage('Username can not be empty')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Must provide a valid email'),
  protectUserAccount,
  checkValidations,
];

const deleteUservalidator = [userExists, protectUserAccount];

module.exports = {
  createUserValidator,
  updateUserValidator,
  deleteUservalidator,
  makeAdminValidator,
};
