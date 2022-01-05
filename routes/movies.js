const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const { getMovies, createMovies, deleteMovie } = require('../controllers/movies');

const regex = (/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&/=[\]!$'()*,;]*)$/);

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(regex).required(),
    trailer: Joi.string().regex(regex).required(),
    thumbnail: Joi.string().regex(regex).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovies);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({ movieId: Joi.number().required() }),
}), deleteMovie);

module.exports = router;
