const { body, validationResult } = require('express-validator');

// Model
const { Review } = require('../models/review.model');
const { Restaurant } = require('../models/restaurant.model');

const reviewExists = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      where: { id, status: 'active' },
    });

    if (!review) {
      return res.status(404).json({
        status: 'error',
        messague: 'Review not found',
      });
    }

    req.review = review;
    next();
  } catch (error) {
    console.log(error);
  }
};

const restaurantExists = async (req, res, next) => {
  try {
    const { idRestaurant } = req.params;

    const restaurant = await Restaurant.findOne({
      where: {
        id: idRestaurant,
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

const isAuthor = (req, res, next) => {
  const { sessionUser, review } = req;

  if (sessionUser.id !== review.userId) {
    return res.status(403).json({
      status: 'error',
      message: 'You are not the author',
    });
  }

  next();
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

const createReviewValidator = [
  restaurantExists,
  body('comment')
    .isString()
    .withMessage('Comment must be a string')
    .notEmpty()
    .withMessage('Comment can not be empty')
    .isLength({ min: 3 })
    .withMessage('Comment must be at least 3 characters'),
  body('rating')
    .notEmpty()
    .withMessage('Rating can not be empty')
    .isInt()
    .withMessage('Rating must be a Integer'),
  checkValidations,
];

const updateReviewValidaotr = [
  reviewExists,
  isAuthor,
  body('comment')
    .isString()
    .withMessage('Comment must be a string')
    .notEmpty()
    .withMessage('Comment can not be empty')
    .isLength({ min: 3 })
    .withMessage('Comment must be at least 3 characters'),
  body('rating')
    .notEmpty()
    .withMessage('Rating can not be empty')
    .isInt()
    .withMessage('Rating must be a Integer'),
  checkValidations,
];

const deleteReviewValidator = [reviewExists, isAuthor];

module.exports = {
  createReviewValidator,
  updateReviewValidaotr,
  deleteReviewValidator,
};
