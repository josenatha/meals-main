const { body, validationResult } = require('express-validator');

// Model
const { Restaurant } = require('../models/restaurant.model');

//middlewares
const { isUserAdmin } = require('./auth.middleware');

const restaurantExists = async (req, res, next) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({ where: { id } });

    if (!restaurant) {
      return res.status(404).json({
        status: 'error',
        messague: 'Restaurant not found',
      });
    }

    req.restaurant = restaurant;
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

const createRestaurantValidator = [
  body('name')
    .isString()
    .withMessage('Name must be a String')
    .notEmpty()
    .withMessage('Name can not be empty')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  body('address')
    .isString()
    .withMessage('Address must be a String')
    .notEmpty()
    .withMessage('Address can not be empty')
    .isLength({ min: 3 })
    .withMessage('Address must be at least 3 characters'),
  body('rating')
    .notEmpty()
    .withMessage('Rating can not be empty')
    .isInt()
    .withMessage('Rating must be a Integer'),
  checkValidations,
];

const updateRestaurantValidator = [
  restaurantExists,
  isUserAdmin,
  body('name')
    .isString()
    .withMessage('Name must be a String')
    .notEmpty()
    .withMessage('Name can not be empty')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  body('address')
    .isString()
    .withMessage('Address must be a String')
    .notEmpty()
    .withMessage('Address can not be empty')
    .isLength({ min: 3 })
    .withMessage('Address must be at least 3 characters'),
  checkValidations,
];

const deleteRestaurantValidator = [restaurantExists, isUserAdmin];

const getRestaurantByIdValidator = [restaurantExists];

module.exports = {
  createRestaurantValidator,
  updateRestaurantValidator,
  deleteRestaurantValidator,
  getRestaurantByIdValidator,
};
