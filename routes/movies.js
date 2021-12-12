const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const { getMovies, createMovies, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', createMovies);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({ movieId: Joi.string().hex().length(24).required() }),
}), deleteMovie);

module.exports = router;
