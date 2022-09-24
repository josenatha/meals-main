const { body, validationResult } = require('express-validator');

// Model
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

// middlewares
const { isUserAdmin } = require('./auth.middleware');

const mealExists = async (req, res, next) => {
  try {
    const { id } = req.params;

    const meal = await Meal.findOne({
      where: { id, status: 'active' },
    });

    if (!meal) {
      return res.status(404).json({
        status: 'error',
        messague: 'Meal not found',
      });
    }

    req.meal = meal;
    next();
  } catch (error) {
    console.log(error);
  }
};

const restaurantExists = async (req, res, next) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      where: {
        id,
        status: 'active',
      },
    });

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

const createMealValidator = [
  restaurantExists,
  body('name')
    .isString()
    .withMessage('Name must be a String')
    .notEmpty()
    .withMessage('Name can not be empty')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  body('price')
    .notEmpty()
    .withMessage('Rating can not be empty')
    .isInt()
    .withMessage('Rating must be a Integer'),
  checkValidations,
];

const updateMealValidator = [
  mealExists,
  isUserAdmin,
  body('name')
    .isString()
    .withMessage('Name must be a String')
    .notEmpty()
    .withMessage('Name can not be empty')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  body('price')
    .notEmpty()
    .withMessage('Rating can not be empty')
    .isInt()
    .withMessage('Rating must be a Integer'),
  checkValidations,
];

const deleteMealValidator = [mealExists, isUserAdmin];

const getMealvalidator = [mealExists];

module.exports = {
  getMealvalidator,
  createMealValidator,
  updateMealValidator,
  deleteMealValidator,
};
