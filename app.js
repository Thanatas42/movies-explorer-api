require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { auth } = require('./middlewares/auth');
const NotFoundErr = require('./errors/NotFoundErr');
const { createUser, login } = require('./controllers/users');
const routerUser = require('./routes/users');
const routerMovies = require('./routes/movies');

const { PORT } = process.env;
const { mongodbRoute, options } = require('./config');

mongoose.connect(mongodbRoute, {});
app.use(express.json());
app.use(helmet());

app.use('*', cors(options));
app.use(requestLogger);

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

app.use(errorLogger);

app.use(errors());
app.use((err, req, res) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(mongoose.connection.readyState, mongodbRoute);
});
