const express = require('express');

// Controllers
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  makeAdmin,
} = require('../controllers/user.controllers');
const {
  getAllOrders,
  getOrderById,
} = require('../controllers/order.controllers');

// Middlewares
const {
  createUserValidator,
  updateUserValidator,
  deleteUservalidator,
  makeAdminValidator,
} = require('../middlewares/user.middlewares');
const { userOrderValidator } = require('../middlewares/order.middleware');
const { protectSesion } = require('../middlewares/auth.middleware');

const usersRoutes = express.Router();

//* Routes
usersRoutes.get('/', getAllUsers);
usersRoutes.post('/signup', createUserValidator, createUser);
usersRoutes.post('/login', login);
//* Protected Routes
usersRoutes.use(protectSesion);
usersRoutes.patch('/admin/:id', makeAdminValidator, makeAdmin);
usersRoutes.patch('/:id', updateUserValidator, updateUser);
usersRoutes.delete('/:id', deleteUservalidator, deleteUser);
// Orders
usersRoutes.get('/orders', getAllOrders);
usersRoutes.get('/orders/:id', userOrderValidator, getOrderById);

module.exports = { usersRoutes };
