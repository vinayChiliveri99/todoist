const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');

const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  // validate token.
  if (!token) {
    return res.status(403).send({
      message: 'No token provided',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }

    // Check if the user associated with the decoded ID exists
    User.findByPk(decoded.id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: 'User not found.' });
        }

        // console.log('User ID from token:', decoded.id);
        req.userId = decoded.id;
        next();
      })
      .catch((error) => {
        console.error('Error checking user existence:', error);
        res.status(500).send({
          message:
            'Internal server error while checking user existence.',
          error: error.message || 'Unknown error occurred.',
        });
      });
  });
};

const authJwt = {
  verifyToken: verifyToken,
};

module.exports = authJwt;
