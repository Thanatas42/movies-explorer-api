require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorCentralized } = require('./middlewares/error');
const router = require('./routes/index');

const { PORT, MONGO, NODE_ENV } = process.env;
const {
  mongodbRoute,
  options,
  limiter,
  devPORT,
} = require('./config');

mongoose.connect(NODE_ENV === 'production' ? MONGO : mongodbRoute, {});
app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use('*', cors(options));
app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorCentralized);

app.listen(NODE_ENV === 'production' ? PORT : devPORT, () => {
  console.log(`App listening on port ${NODE_ENV === 'production' ? PORT : devPORT}`);
  console.log(mongoose.connection.readyState, NODE_ENV === 'production' ? MONGO : mongodbRoute);
});
