// Models
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');
const { User } = require('../models/user.model');

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: { status: 'active' },
      include: {
        model: Review,
        attributes: ['id', 'comment', 'rating', 'status'],
        include: {
          model: User,
          attributes: ['id', 'username'],
        },
      },
    });

    res.status(200).json({
      status: 'Success',
      data: { restaurants },
    });
  } catch (error) {
    console.log(error);
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const { restaurant } = req;

    res.status(200).json({
      status: 'Success',
      data: { restaurant },
    });
  } catch (error) {
    console.log(error);
  }
};

const createRestaurant = async (req, res) => {
  try {
    const { name, address, rating } = req.body;

    const newRestaurant = await Restaurant.create({
      name,
      address,
      rating,
    });

    res.status(201).json({
      status: 'success',
      data: { newRestaurant },
    });
  } catch (error) {
    console.log(error);
  }
};

const updateRestuarant = async (req, res) => {
  try {
    const { restaurant } = req;
    const { name, address } = req.body;

    await restaurant.update({
      name,
      address,
    });

    res.status(204).json({
      messague: 'the restaurant is Updated!!!',
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const { restaurant } = req;

    await restaurant.update({
      status: 'close',
    });

    res.status(204).json({
      messague: 'the restaurant is Deleted!!!',
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestuarant,
  deleteRestaurant,
};
