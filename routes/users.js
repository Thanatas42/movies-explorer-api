const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const { getCurrentUser, editUser } = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), editUser);

module.exports = router;
