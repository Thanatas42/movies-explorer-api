const { celebrate, Joi } = require('celebrate');

const express = require('express');

const router = express.Router();

const { auth } = require('../middlewares/auth');
const NotFoundErr = require('../errors/NotFoundErr');
const { createUser, login } = require('../controllers/users');
const routerUser = require('./users');
const routerMovies = require('./movies');

router.post('/signup', celebrate({
  body: Joi.object().options({ abortEarly: false }).keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),
    name: Joi.string().min(2).max(32).required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().options({ abortEarly: false }).keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(72).required(),
  }),
}), login);

router.use('/users', routerUser);
router.use('/movies', routerMovies);
router.use(auth);
router.use('*', () => { throw new NotFoundErr('Запрашиваемый ресурс не найден'); });

module.exports = router;
