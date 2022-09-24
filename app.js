const express = require('express');

//* Routers
const { usersRoutes } = require('./routes/user.routes');
const { restaurantsRoutes } = require('./routes/restaurant.routes');
const { mealRoutes } = require('./routes/meal.routes');
const { orderRoutes } = require('./routes/order.routes');

// init express server
const app = express();
app.use(express.json());

//* EndPoints
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/restaurants', restaurantsRoutes);
app.use('/api/v1/meals', mealRoutes);
app.use('/api/v1/orders', orderRoutes);

//* catch non-exitsing endpoints
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    messague: `${req.method} ${req.url} does not exists in our server`,
  });
});

module.exports = { app };
