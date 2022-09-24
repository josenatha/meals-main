//models
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

const getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.findAll({
      where: { status: 'active' },
      include: {
        model: Restaurant,
        attributes: ['id', 'name'],
      },
    });

    res.status(200).json({
      status: 'Succes',
      data: { meals },
    });
  } catch (error) {
    console.log(error);
  }
};

const getMealById = async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await Meal.findOne({
      where: { id },
      include: {
        model: Restaurant,
        attributes: ['id', 'name'],
      },
    });

    res.status(200).json({
      status: 'Succes',
      data: { meal },
    });
  } catch (error) {
    console.log(error);
  }
};

const createMeal = async (req, res) => {
  try {
    const { restaurant } = req;
    const { name, price } = req.body;

    const newMeal = await Meal.create({
      restaurantId: restaurant.id,
      name,
      price,
    });

    res.status(201).json({
      status: 'Success',
      data: { newMeal },
    });
  } catch (error) {
    console.log(error);
  }
};

const updateMeal = async (req, res) => {
  try {
    const { meal } = req;
    const { name, price } = req.body;

    await meal.update({
      name,
      price,
    });

    res.status(204).json({
      messague: 'Your meal is Updated!!!',
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteMeal = async (req, res) => {
  try {
    const { meal } = req;

    await meal.update({
      status: 'deleted',
    });

    res.status(204).json({
      messague: 'Your meal is deleted!!!',
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
};
