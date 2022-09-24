const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config({ path: './config.env' });

// Models
const { User } = require('../models/user.model');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { status: 'active' },
      attributes: ['id', 'username', 'email', 'role'],
    });

    res.status(200).json({
      status: 'Success',
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //* encrypt password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    //* remove password from response
    newUser.password = undefined;

    res.status(201).json({
      status: 'Success',
      data: { newUser },
    });
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { user } = req;
    const { username, email } = req.body;

    await user.update({
      username,
      email,
    });

    res.status(204).json({
      messague: 'Your user is Updated!!!',
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user } = req;

    await user.update({ status: 'inactive' });

    res.status(204).json({
      messague: 'Your user is deleted!!!',
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email, status: 'active' },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(404).json({
        status: 'error',
        messague: 'wrong credentials',
      });
    }

    //* remove password from response
    user.password = undefined;

    //! node code to make a secure sign
    //* require('crypto').randomBytes(64).toString('hex')

    //* Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ultraSecretKey,
      {
        expiresIn: '1d',
      }
    );

    res.status(200).json({
      status: 'Success',
      messague: 'You are logged',
      data: { user, token },
    });
  } catch (error) {
    console.log(error);
  }
};

const makeAdmin = async (req, res) => {
  try {
    const { user } = req;

    await user.update({
      role: 'admin',
    });

    res.status(200).json({
      messague: 'Your are Admin!!!',
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  makeAdmin,
};
