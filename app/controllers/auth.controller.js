const db = require('../models');
const config = require('../config/auth.config');

const User = db.user;
const Project = db.projects;

// Sequelize's "Op" object for SQL operations
const Op = db.Sequelize.Op;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 1. User registration endpoint
exports.signup = (req, res) => {
  // Destructure the request body.
  const { username, email, password } = req.body;

  // validate if user sending all fields are not.
  // if (!username || !email || !password) {
  //   return res
  //     .status(400)
  //     .send({ message: 'All fields are required' });
  // }

  // Save user to the database.
  User.create({
    username,
    email,
    password: bcrypt.hashSync(password, 8),
  })
    .then((user) => {
      Project.create({
        name: 'Inbox',
        is_inbox_project: 'true',
        userId: user.id,
      });
    })
    .then(() =>
      res
        .status(200)
        .send({ message: 'User registered successfully' })
    )
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// 2. User login endpoint
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }

      // Compare the provided password with the stored hashed password.
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid password!',
        });
      }

      // Generate a JWT token for the authenticated user.
      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400,
      });

      // Send the user details and token in the response.
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
