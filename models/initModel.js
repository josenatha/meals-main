// Models
const { Restaurant } = require('../models/restaurant.model');
const { User } = require('../models/user.model');
const { Meal } = require('../models/meal.model');
const { Review } = require('../models/review.model');
const { Order } = require('../models/order.model');

const initModel = () => {
  // 1 Restaurant <-----> M Review
  Restaurant.hasMany(Review, { foreignKey: 'restaurantId' });
  Review.belongsTo(Restaurant);
  // 1 Restaurant <-----> M Meal
  Restaurant.hasMany(Meal, { foreignKey: 'restaurantId' });
  Meal.belongsTo(Restaurant);
  // 1 User <-----> M Review
  User.hasMany(Review, { foreignKey: 'userId' });
  Review.belongsTo(User);
  // 1 User <-----> M Order
  User.hasMany(Order, { foreignKey: 'userId' });
  Order.belongsTo(User);
  // 1 Order <-----> 1 Meal
  Meal.hasOne(Order);
  Order.belongsTo(Meal);
};

module.exports = { initModel };
