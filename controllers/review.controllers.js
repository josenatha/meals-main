// model
const { Review } = require('../models/review.model');

const createReview = async (req, res) => {
  try {
    const { restaurant, sessionUser } = req;
    const { comment, rating } = req.body;

    const newReview = await Review.create({
      userId: sessionUser.id,
      restaurantId: restaurant.id,
      comment,
      rating,
    });

    res.status(201).json({
      status: 'Success',
      data: { newReview },
    });
  } catch (error) {
    console.log(error);
  }
};

const updateReview = async (req, res) => {
  try {
    const { review } = req;
    const { comment, rating } = req.body;

    await review.update({
      comment,
      rating,
    });

    res.status(204).json({
      messague: 'Your review is Updated!!!',
    });
    res.status();
  } catch (error) {
    console.log(error);
  }
};

const deleteReview = async (req, res) => {
  try {
    const { review } = req;

    await review.update({
      status: 'deleted',
    });

    res.status(204).json({
      messague: 'Your review is deleted!!!',
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
};
