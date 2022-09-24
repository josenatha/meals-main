// models
const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

const getAllOrders = async (req, res) => {
  try {
    const { sessionUser } = req;

    const orders = await Order.findAll({
      where: { userId: sessionUser.id },
      include: {
        model: Meal,
        attributes: ['name'],
        include: {
          model: Restaurant,
          attributes: ['id', 'name'],
        },
      },
    });

    res.status(200).json({
      status: 'Success',
      data: { orders },
    });
  } catch (error) {
    console.log(error);
  }
};

const getOrderById = async (req, res) => {
  try {
    const { order } = req;

    res.status(200).json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    console.log(error);
  }
};

const createOrder = async (req, res) => {
  try {
    const { sessionUser, meal } = req;
    const { quantity } = req.body;

    const totalPrice = quantity * meal.price;

    const newOrder = await Order.create({
      mealId: meal.id,
      userId: sessionUser.id,
      totalPrice,
      quantity,
    });

    res.status(201).json({
      status: 'Success',
      data: { newOrder },
    });
  } catch (error) {
    console.log(error);
  }
};

const completOrder = async (req, res) => {
  try {
    const { order } = req;

    await order.update({
      status: 'completed',
    });

    res.status(204).json({
      messague: 'Your order is completed!!!',
    });
  } catch (error) {
    console.log(error);
  }
};

const cancellOrder = async (req, res) => {
  try {
    const { order } = req;

    await order.update({
      status: 'cancelled',
    });

    res.status(204).json({
      messague: 'Your order is cancelled!!!',
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  completOrder,
  cancellOrder,
};
