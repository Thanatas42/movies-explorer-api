const rateLimit = require('express-rate-limit');

const devSecret = 'dev';
const devPORT = 3001;

const options = {
  origin: [
    'http://localhost:3001',
    'http://localhost:3000',
    'https://api.movies-dmitry.nomoredomains.rocks',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const mongodbRoute = 'mongodb://localhost:27017/moviesdb';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = {
  devSecret,
  options,
  mongodbRoute,
  limiter,
  devPORT,
};
