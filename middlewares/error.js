// eslint-disable-next-line no-unused-vars
const errorCentralized = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: err.message });
  }
};

module.exports = { errorCentralized };
