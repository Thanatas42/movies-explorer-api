const { celebrate, Joi, errors } = require('celebrate');

const express = require('express');
const routers = require('express').Router();

const app = express();
const { auth } = require('../middlewares/auth');
const NotFoundErr = require('../errors/NotFoundErr');
const { createUser, login } = require('../controllers/users');
const routerUser = require('./users');
const routerMovies = require('./movies');

app.post('/signup', celebrate({
  body: Joi.object().options({ abortEarly: false }).keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),
    name: Joi.string().min(2).max(32).required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().options({ abortEarly: false }).keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(72).required(),
  }),
}), login);

app.use(auth);
app.use('/users', routerUser);
app.use('/movies', routerMovies);
app.use('*', () => { throw new NotFoundErr('Запрашиваемый ресурс не найден'); });

app.use(errors());
app.use((err, req, res) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: err.message });
  }
});

module.exports = routers;
// Не могу пока подключить роут в app
