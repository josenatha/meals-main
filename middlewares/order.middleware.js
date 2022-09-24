const { body, validationResult } = require('express-validator');

// Model
const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');

const orderExitts = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: { id, status: 'active' },
    });

    if (!order) {
      return res.status(404).json({
        status: 'error',
        messague: 'Order not found',
      });
    }

    req.order = order;
    next();
  } catch (error) {
    console.log(error);
  }
};

const mealExist = async (req, res, next) => {
  try {
    const { mealId } = req.body;

    const meal = await Meal.findOne({
      where: { id: mealId, status: 'active' },
    });

    if (!meal) {
      return res.status(404).json({
        status: 'Success',
        messague: 'Meal not Found',
      });
    }

    req.meal = meal;
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

const isOrderOwner = async (req, res, next) => {
  const { sessionUser, order } = req;

  if (order.userId !== sessionUser.id) {
    return res.status(403).json({
      status: 'Success',
      messague: 'That is not your order',
    });
  }

  next();
};

const createOrderValidators = [
  mealExist,
  body('quantity')
    .notEmpty()
    .withMessage('Rating can not be empty')
    .isInt()
    .withMessage('Rating must be a Integer'),
  checkValidations,
];

const orderValidator = [orderExitts];

const userOrderValidator = [orderExitts, isOrderOwner];

module.exports = {
  createOrderValidators,
  orderValidator,
  userOrderValidator,
};
