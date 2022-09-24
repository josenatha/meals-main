const express = require('express');

// Controllers
const {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
} = require('../controllers/meal.controllers');

// Middlewares
const {
  getMealvalidator,
  createMealValidator,
  updateMealValidator,
  deleteMealValidator,
} = require('../middlewares/meal.middleware');
const { protectSesion } = require('../middlewares/auth.middleware');

const mealRoutes = express.Router();

//* Routes
mealRoutes.get('/', getAllMeals);
mealRoutes.get('/:id', getMealvalidator, getMealById);

mealRoutes.use(protectSesion);
mealRoutes.post('/:id', createMealValidator, createMeal);
mealRoutes.patch('/:id', updateMealValidator, updateMeal);
mealRoutes.delete('/:id', deleteMealValidator, deleteMeal);

module.exports = { mealRoutes };
