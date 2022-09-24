const express = require('express');

// Controllers
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestuarant,
  deleteRestaurant,
} = require('../controllers/restaurant.controllers');
const {
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/review.controllers');
// Middlewares
const {
  getRestaurantByIdValidator,
  createRestaurantValidator,
  updateRestaurantValidator,
  deleteRestaurantValidator,
} = require('../middlewares/restaurant.middlewares');
const {
  createReviewValidator,
  updateReviewValidaotr,
  deleteReviewValidator,
} = require('../middlewares/review.middleware');
const { protectSesion } = require('../middlewares/auth.middleware');

const restaurantsRoutes = express.Router();

//* Routes
restaurantsRoutes.get('/', getAllRestaurants);
restaurantsRoutes.get('/:id', getRestaurantByIdValidator, getRestaurantById);
restaurantsRoutes.use(protectSesion);
restaurantsRoutes.post('/', createRestaurantValidator, createRestaurant);
restaurantsRoutes.patch('/:id', updateRestaurantValidator, updateRestuarant);
restaurantsRoutes.delete('/:id', deleteRestaurantValidator, deleteRestaurant);
// Reviews Routes
restaurantsRoutes.post(
  '/reviews/:idRestaurant',
  createReviewValidator,
  createReview
);
restaurantsRoutes.patch('/reviews/:id', updateReviewValidaotr, updateReview);
restaurantsRoutes.delete('/reviews/:id', deleteReviewValidator, deleteReview);

module.exports = { restaurantsRoutes };
