const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  _id: {
    type: String,
    require: true,
    trim: true,
  },
  country: {
    type: String,
    require: true,
    trim: true,
  },
  director: {
    type: String,
    require: true,
    trim: true,
  },
  duration: {
    type: Number,
    require: true,
    trim: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
    trim: true,
  },
  image: {
    type: String,
    require: true,
    trim: true,
    validate: [(str) => validator.isURL(str), 'Некорректная ссылка'],
  },
  trailer: {
    type: String,
    require: true,
    trim: true,
    validate: [(str) => validator.isURL(str), 'Некорректная ссылка'],
  },
  thumbnail: {
    type: String,
    require: true,
    trim: true,
    validate: [(str) => validator.isURL(str), 'Некорректная ссылка'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    require: true,
  },
  nameRU: {
    type: String,
    require: true,
    trim: true,
  },
  nameEN: {
    type: String,
    require: true,
    trim: true,
  },
});

module.exports = mongoose.model('movies', movieSchema);
