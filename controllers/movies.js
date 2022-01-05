const modelMovie = require('../models/movie');

const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const ForbiddenErr = require('../errors/ForbiddenErr');

const getMovies = (req, res, next) => modelMovie.find({ owner: req.user._id })
  .then((movies) => {
    if (movies === null) {
      throw new NotFoundErr(`Фильмы пользователя ${req.user._id} не найдены`);
    } else {
      res.status(200).send({ data: movies });
    }
  })
  .catch((err) => {
    next(err);
  });

const createMovies = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;
  return modelMovie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movies) => res.send({ data: movies }))
    .catch((err) => {
      if (err.name === 'ValidationError' && res.status(400)) {
        next(new BadRequestErr('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => modelMovie.findById(req.params.movieId)
  .then((movie) => {
    if (movie === null) {
      throw new NotFoundErr(`Фильм c id ${req.params.movieId} не найден`);
    }
    if (movie.owner.toString() !== req.user._id) { throw new ForbiddenErr('Нельзя удалять карточку, принадлежащую другому пользователю'); }
    return modelMovie.findByIdAndRemove(req.params.movieId)
      .then((deletedMovie) => {
        if (deletedMovie === null) {
          next(new NotFoundErr(`Фильм c id ${req.params.movieId} не найден`));
        } else {
          res.status(200).send({ message: 'Фильм успешно удален' });
        }
      });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Переданы некорректные данные для удалении фильма.'));
    } else {
      next(err);
    }
  });

module.exports = {
  getMovies,
  createMovies,
  deleteMovie,
};
