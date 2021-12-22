const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const modelUser = require('../models/user');
const { devSecret } = require('../config');

const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/NotFoundErr');
const DoubleErr = require('../errors/DoubleErr');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

const salt = bcrypt.genSaltSync(10);

const getCurrentUser = (req, res, next) => modelUser.findById(req.user._id)
  .then((user) => {
    if (user === null) {
      throw new NotFoundErr(`Пользователь ${req.user._id} не найден`);
    } else {
      res.status(200).send({ data: user });
    }
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Переданы некорректные данные пользователя'));
    } else {
      next(err);
    }
  });

const editUser = (req, res, next) => modelUser.findByIdAndUpdate(
  req.user._id,
  { name: req.body.name, email: req.body.email },
  { new: true, runValidators: true },
)
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestErr('Переданы некорректные данные пользователя'));
    } else if (err.code === 11000) {
      next(new DoubleErr('Пользователь с такой электронной почтой уже зарегистрирован'));
    } else {
      next(err);
    }
  });

const createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;
  bcrypt.hash(req.body.password, salt)
    .then((hash) => modelUser.create({
      name, email, password: hash,
    }))
    .then((user) => res.send({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new DoubleErr('Пользователь с такой электронной почтой уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  modelUser.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : devSecret, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new UnauthorizedErr('Переданы некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCurrentUser,
  editUser,
  createUser,
  login,
};
