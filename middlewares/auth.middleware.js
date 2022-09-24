const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

const { User } = require('../models/user.model');

dotEnv.config({ path: './config.env' });

const protectSesion = async (req, res, next) => {
  try {
    //get token
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      //extract Token
      token = req.headers.authorization.split(' ')[1];
    }

    // check if the token was send or not
    if (!token) {
      return res.status(403).json({
        status: 'error',
        messague: 'Invalid Sesion',
      });
    }

    const decoded = jwt.verify(token, process.env.ultraSecretKey);

    const user = await User.findOne({
      where: { id: decoded.id, status: 'active' },
    });

    if (!user) {
      return res.status(403).json({
        status: 'error',
        messague: 'The owner of the session is no longer active',
      });
    }

    req.sessionUser = user;

    // grant Access
    next();
  } catch (error) {
    console.log(error);
  }
};

const protectUserAccount = (req, res, next) => {
  const { sessionUser, user } = req;

  if (user.id !== sessionUser.id) {
    return res.status(403).json({
      status: 'error',
      messague: 'You are not the owner of this account',
    });
  }

  next();
};

const isUserAdmin = (req, res, next) => {
  const { sessionUser } = req;

  if (sessionUser.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      messague: 'You are not admin',
    });
  }

  next();
};

module.exports = {
  protectSesion,
  protectUserAccount,
  isUserAdmin,
};
