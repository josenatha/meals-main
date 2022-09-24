const express = require('express');

// Controllers
const {
  getAllOrders,
  createOrder,
  completOrder,
  cancellOrder,
} = require('../controllers/order.controllers');

// Middlewares
const {
  createOrderValidators,
  orderValidator,
} = require('../middlewares/order.middleware');
const { protectSesion } = require('../middlewares/auth.middleware');

const orderRoutes = express.Router();

//* Routes
orderRoutes.use(protectSesion);
orderRoutes.get('/me', getAllOrders);
orderRoutes.post('/', createOrderValidators, createOrder);
orderRoutes.patch('/:id', orderValidator, completOrder);
orderRoutes.delete('/:id', orderValidator, cancellOrder);

module.exports = { orderRoutes };
